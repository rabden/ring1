import React from 'react'
import { useSupabaseAuth } from '@/integrations/supabase/auth'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UsersList from '@/components/admin/UsersList'
import ImagesList from '@/components/admin/ImagesList'
import { Navigate } from 'react-router-dom'
import { toast } from 'sonner'

// Replace this with your actual admin email
const ADMIN_EMAILS = [
  'admin@example.com',
  // Add your email here to test the admin dashboard
]

const AdminDashboard = () => {
  const { session } = useSupabaseAuth()
  
  if (!session) {
    toast.error("Please sign in to access the admin dashboard")
    return <Navigate to="/" replace />
  }
  
  const isAdmin = session?.user && ADMIN_EMAILS.includes(session.user.email)
  
  if (!isAdmin) {
    toast.error("You don't have permission to access this page")
    return <Navigate to="/" replace />
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Logged in as: {session.user.email}
        </p>
      </div>
      
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="mt-4">
          <UsersList />
        </TabsContent>
        
        <TabsContent value="images" className="mt-4">
          <ImagesList />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default AdminDashboard