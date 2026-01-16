
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function AdminRoute({ children }) {
  const { isAuthenticated, loading, currentUser } = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && isAuthenticated && currentUser && currentUser.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Admin privileges required to access this area.",
        variant: "destructive",
      });
    }
  }, [loading, isAuthenticated, currentUser, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login but save the attempted location
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated but role is not admin, redirect to dashboard
  if (currentUser && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // If we are here, user is authenticated and is admin
  return children;
}

export default AdminRoute;
