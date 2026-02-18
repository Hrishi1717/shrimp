import React, { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import { toast } from 'sonner';

function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasProcessed = useRef(false);

  useEffect(() => {
    // Prevent double execution in React StrictMode
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const processAuth = async () => {
      try {
        // Extract session_id from URL fragment
        const hash = location.hash;
        const params = new URLSearchParams(hash.substring(1));
        const sessionId = params.get('session_id');

        if (!sessionId) {
          toast.error('Invalid authentication response');
          navigate('/login');
          return;
        }

        // Exchange session_id for session_token
        const userData = await authAPI.createSession(sessionId);

        // Redirect based on role
        if (userData.role === 'farmer') {
          navigate('/farmer', { replace: true, state: { user: userData } });
        } else if (userData.role === 'admin') {
          navigate('/admin', { replace: true, state: { user: userData } });
        } else {
          navigate('/staff', { replace: true, state: { user: userData } });
        }
      } catch (error) {
        console.error('Authentication error:', error);
        toast.error('Authentication failed. Please try again.');
        navigate('/login');
      }
    };

    processAuth();
  }, [navigate, location]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mb-4"></div>
        <p className="text-slate-600 font-body">Authenticating...</p>
      </div>
    </div>
  );
}

export default AuthCallback;
