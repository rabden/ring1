import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/supabase';
import { useSupabaseAuth } from '@/integrations/supabase/auth';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [globalNotifications, setGlobalNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { session } = useSupabaseAuth();

  useEffect(() => {
    if (!session?.user?.id) return;

    const fetchNotifications = async () => {
      // Fetch user-specific notifications
      const { data: userNotifications, error: userError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (userError) {
        console.error('Error fetching notifications:', userError);
        return;
      }

      // Fetch global notifications
      const { data: allGlobalNotifications, error: globalError } = await supabase
        .from('global_notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (globalError) {
        console.error('Error fetching global notifications:', globalError);
        return;
      }

      // Fetch hidden notifications for the current user
      const { data: hiddenNotifications } = await supabase
        .from('hidden_global_notifications')
        .select('notification_id')
        .eq('user_id', session.user.id);

      const hiddenIds = new Set(hiddenNotifications?.map(n => n.notification_id) || []);
      const visibleGlobalNotifications = allGlobalNotifications.filter(n => !hiddenIds.has(n.id));

      setNotifications(userNotifications || []);
      setGlobalNotifications(visibleGlobalNotifications || []);
      
      // Update unread count to include both user notifications and global notifications
      const unreadUserNotifications = (userNotifications || []).filter(n => !n.is_read).length;
      const unreadGlobalNotifications = visibleGlobalNotifications.length;
      setUnreadCount(unreadUserNotifications + unreadGlobalNotifications);
    };

    fetchNotifications();

    // Subscribe to notifications changes
    const notificationsChannel = supabase
      .channel('notifications_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${session.user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setNotifications(prev => [payload.new, ...prev]);
            setUnreadCount(prev => prev + 1);
          } else if (payload.eventType === 'DELETE') {
            setNotifications(prev => prev.filter(n => n.id !== payload.old.id));
            if (!payload.old.is_read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          } else if (payload.eventType === 'UPDATE') {
            setNotifications(prev =>
              prev.map(n => n.id === payload.new.id ? payload.new : n)
            );
            if (!payload.old.is_read && payload.new.is_read) {
              setUnreadCount(prev => Math.max(0, prev - 1));
            }
          }
        }
      )
      .subscribe();

    // Subscribe to global notifications changes
    const globalNotificationsChannel = supabase
      .channel('global_notifications_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'global_notifications' },
        () => {
          fetchNotifications(); // Refetch all notifications when global ones change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationsChannel);
      supabase.removeChannel(globalNotificationsChannel);
    };
  }, [session?.user?.id]);

  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;

      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const hideGlobalNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('hidden_global_notifications')
        .insert([{
          user_id: session.user.id,
          notification_id: notificationId
        }]);

      if (error) throw error;

      setGlobalNotifications(prev => 
        prev.filter(n => n.id !== notificationId)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error hiding global notification:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{
      notifications: [...notifications, ...globalNotifications],
      unreadCount,
      markAsRead,
      deleteNotification,
      hideGlobalNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};