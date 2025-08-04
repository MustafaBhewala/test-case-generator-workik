import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      navigate('/?error=oauth_failed');
      return;
    }

    if (code) {
      // Exchange code for access token
      exchangeCodeForToken(code);
    } else {
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
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing GitHub authentication...</p>
      </div>
    </div>
  );
}
