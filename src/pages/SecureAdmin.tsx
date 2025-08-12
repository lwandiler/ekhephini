import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminDashboard from '@/components/AdminDashboard';
import RadioNavigation from '@/components/RadioNavigation';
import NewsletterFooter from '@/components/NewsletterFooter';
import { useInlineEdit } from '@/contexts/InlineEditContext';

const SecureAdmin = () => {
  const { user } = useAuth();
  const { isAdmin } = useInlineEdit();

  // Redirect non-admin users
  // if (user && !isAdmin) {
  //   return <Navigate to="/" replace />;
  // }

  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen bg-white font-asap">
        <RadioNavigation />
        
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold">Radio Station Admin</h1>
            </div>
            <AdminDashboard />
          </div>
        </main>
        
        <NewsletterFooter />
      </div>
    </ProtectedRoute>
  );
};

export default SecureAdmin;