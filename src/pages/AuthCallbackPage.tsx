import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    console.log('🔧 AuthCallback - Received params:', { token: !!token, code: !!code, error });

    if (error) {
      console.error('OAuth error:', error);
      navigate('/?error=oauth_failed');
      return;
    }

    // If we have a token (from API callback), use it directly
    if (token) {
      console.log('🎉 Got token from API, storing and redirecting...');
      localStorage.setItem('github_token', token);
      navigate('/repositories');
      return;
    }

    // If we have a code (old flow), exchange it
    if (code) {
      exchangeCodeForToken(code);
    } else {
      console.error('No token or code received');
      navigate('/?error=no_code');
    }
  }, [searchParams, navigate]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      // In a real app, you'd send the code to your backend
      // For now, we'll simulate getting a token
      const response = await fetch('/api/auth/github/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        const { access_token } = await response.json();
        localStorage.setItem('github_token', access_token);
        navigate('/repositories');
      } else {
        throw new Error('Failed to exchange code for token');
      }
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      navigate('/?error=token_exchange_failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
      </div>
    </div>
  );
}
