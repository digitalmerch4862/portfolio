import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string;
        callback: (token: string) => void;
        'expired-callback': () => void;
        'error-callback': () => void;
        theme: 'dark';
      }) => string;
      remove: (widgetId: string) => void;
    };
  }
}

interface TurnstileCaptchaProps {
  siteKey: string;
  onToken: (token: string) => void;
}

let turnstileScript: Promise<void> | undefined;

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (!turnstileScript) {
    turnstileScript = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Could not load CAPTCHA')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.turnstile = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Could not load CAPTCHA'));
      document.head.appendChild(script);
    });
  }
  return turnstileScript;
}

export function TurnstileCaptcha({ siteKey, onToken }: TurnstileCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return;
    let widgetId: string | undefined;
    let cancelled = false;

    loadTurnstile()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: 'dark',
          callback: onToken,
          'expired-callback': () => onToken(''),
          'error-callback': () => onToken(''),
        });
      })
      .catch(() => onToken(''));

    return () => {
      cancelled = true;
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, onToken]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="flex justify-center" aria-label="CAPTCHA verification" />;
}
