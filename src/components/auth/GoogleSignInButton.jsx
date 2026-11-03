import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

/**
 * Modern Google Sign-In button with Google Identity Services (GIS)
 * Supports:
 * - Official Google rendered iframe button (with text: 'continue_with')
 * - Branded fallback button matching SwiftCart aesthetic
 * - Helpful prompt & quick dev login if VITE_GOOGLE_CLIENT_ID is not configured yet
 */
export default function GoogleSignInButton({ onSuccess, onError, disabled = false }) {
  const containerRef = useRef(null);
  const [gisLoaded, setGisLoaded] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    // Check if Google Identity Services script is available
    const checkGsi = () => {
      if (window.google?.accounts?.id) {
        setGisLoaded(true);
        return true;
      }
      return false;
    };

    if (checkGsi()) return;

    // Retry checking every 300ms for up to 3s if script is still loading
    const interval = setInterval(() => {
      if (checkGsi()) clearInterval(interval);
    }, 300);

    const timeout = setTimeout(() => clearInterval(interval), 4000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (!gisLoaded || !clientId || !containerRef.current) return;

    try {
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onSuccess(response.credential);
          } else {
            onError?.(new Error('No Google credential returned'));
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render official Google "Continue with Google" button
      window.google.accounts.id.renderButton(containerRef.current, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 390,
      });
    } catch (err) {
      console.warn('Google Identity Services render error:', err);
    }
  }, [gisLoaded, clientId, onSuccess, onError]);

  const handleCustomClick = () => {
    if (disabled) return;

    if (!clientId) {
      toast.info('Google Client ID not set yet', {
        description: 'Set VITE_GOOGLE_CLIENT_ID in your .env or Vercel settings to connect live Google OAuth.',
        action: {
          label: 'Dev Demo Login',
          onClick: () => {
            onSuccess('demo-google-token-google.shopper@gmail.com');
          },
        },
        duration: 6000,
      });
      return;
    }

    if (window.google?.accounts?.id) {
      window.google.accounts.id.prompt();
    } else {
      toast.error('Google Sign-In is still loading. Please check your network.');
    }
  };

  // If Client ID is set and Google GIS rendered the button, GIS mounts into containerRef
  return (
    <div className="google-auth-wrapper">
      {clientId ? (
        <div ref={containerRef} className="google-gis-container" />
      ) : null}

      {/* Branded native SwiftCart "Continue with Google" button */}
      {!clientId && (
        <button
          type="button"
          onClick={handleCustomClick}
          disabled={disabled}
          className="google-custom-btn"
          title="Sign in with your Google account"
        >
          <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>
      )}
    </div>
  );
}
