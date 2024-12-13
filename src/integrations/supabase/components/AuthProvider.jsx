import React, { createContext, useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const clearAuthData = (shouldClearStorage = false) => {
    setSession(null);
    queryClient.invalidateQueries('user');
    // Only clear localStorage when explicitly requested (like during logout)
    if (shouldClearStorage) {
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('supabase.auth.')) {
          localStorage.removeItem(key);
        }
      });
    }
  };

  const handleAuthSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Auth session error:', error);
        clearAuthData(false);
        return;
      }

      if (!currentSession) {
        clearAuthData(false);
        return;
      }

      // Verify the session is still valid
      const { data: user, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('User verification error:', userError);
        // If we get a 403 or session_not_found error, clear the session
        if (userError.status === 403 || userError.message?.includes('session_not_found')) {
          await supabase.auth.signOut();
          clearAuthData(true);
        }
        return;
      }

      setSession(currentSession);
    } catch (error) {
      console.error('Auth error:', error);
      clearAuthData(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    let authSubscription = null;

    // Initialize auth state
    const initializeAuth = async () => {
      if (!mounted) return;
      
      try {
        // Get initial session
        const { data: { session: initialSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          if (mounted) {
            clearAuthData(false);
            setLoading(false);
          }
          return;
        }

        if (!initialSession) {
          if (mounted) {
            clearAuthData(false);
            setLoading(false);
          }
          return;
        }

        // Verify the session is valid
        const { data: user, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('User verification error:', userError);
          if (mounted) {
            if (userError.status === 403 || userError.message?.includes('session_not_found')) {
              await supabase.auth.signOut();
              clearAuthData(true);
            } else {
              clearAuthData(false);
            }
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setSession(initialSession);
          queryClient.invalidateQueries('user');
          
          // Only set up auth listener after confirming valid session
          const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event);
            
            if (!mounted) return;

            switch (event) {
              case 'SIGNED_IN':
                setSession(session);
                queryClient.invalidateQueries('user');
                break;
              case 'SIGNED_OUT':
                clearAuthData(false);
                break;
              case 'TOKEN_REFRESHED':
                setSession(session);
                queryClient.invalidateQueries('user');
                break;
              case 'USER_UPDATED':
                setSession(session);
                queryClient.invalidateQueries('user');
                break;
              case 'USER_DELETED':
                clearAuthData(true);
                break;
            }
          });
          
          authSubscription = subscription;
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          clearAuthData(false);
          setLoading(false);
        }
      }
    };

    // Handle auth code in URL
    const params = new URLSearchParams(location.search);
    const authCode = params.get('code');
    
    if (authCode) {
      // Remove the code from URL without reloading the page
      const newUrl = window.location.pathname;
      navigate(newUrl, { replace: true });
      
      // Exchange the code for a session
      supabase.auth.exchangeCodeForSession(authCode)
        .then(({ data: { session: newSession }, error }) => {
          if (error) {
            console.error('Error exchanging code for session:', error);
            if (mounted) setLoading(false);
            return;
          }
          if (newSession && mounted) {
            setSession(newSession);
            queryClient.invalidateQueries('user');
            setLoading(false);
          }
        })
        .catch(error => {
          console.error('Error in code exchange:', error);
          if (mounted) setLoading(false);
        });
    } else {
      initializeAuth();
    }

    return () => {
      mounted = false;
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [queryClient, location, navigate]);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      clearAuthData(true); // Clear storage during explicit logout
    } catch (error) {
      console.error('Error signing out:', error);
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ session, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};