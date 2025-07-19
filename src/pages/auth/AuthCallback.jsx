import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from '../../lib/axios';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const verificationToken = searchParams.get('token');

  useEffect(() => {
    const verifyAndLogin = async () => {
      if (!verificationToken) {
        navigate('/login', { state: { error: 'Invalid authentication flow' } });
        return;
      }

      try {
        // Verify the token with backend
        const verifyResponse = await axios.post('/api/v1/auth/verify-callback', { 
          token: verificationToken 
        });

        // Get user data only after verification
        const userResponse = await axios.get('/api/v1/users/me');
        
        localStorage.setItem('user', JSON.stringify(userResponse.data.data.user));
        const redirectPath = localStorage.getItem('preAuthRoute') || '/';
        localStorage.removeItem('preAuthRoute');
        navigate(redirectPath, { replace: true });
      } catch (err) {
        console.error('Authentication error:', err);
        navigate('/login', { 
          state: { error: err.response?.data?.message || 'Authentication failed' } 
        });
      }
    };

    verifyAndLogin();
  }, [navigate, verificationToken]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Processing login...</h2>
        <p>Please wait while we authenticate your account...</p>
      </div>
    </div>
  );
};

export default AuthCallback;