// app/admin/layout.js
'use client';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import ErrorBoundary from '@/components/ErrorBoundary';

export default function AdminLayout({ children }) {

   const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
     <div className="admin-layout">
      <ErrorBoundary>
      <nav className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>Welcome, {user.name}</span>
            <button 
              onClick={() => {
                localStorage.removeItem('adminToken');
                router.push('/admin/login');
              }}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      
         {children}
      </ErrorBoundary>
     
    </div>
  );
}
