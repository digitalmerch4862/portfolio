import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://jfdvbyoyvqriqhqtmyjo.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_SwyxDRF6_y_pBGtoBeKh7A_9RZX-Mv0';
const ADMIN_EMAIL = 'garciarobertrich@gmail.com';

export function createRequestClient(req) {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;
  return createClient(url, key, {
    global: { headers: { Authorization: req.headers.authorization || '' } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function createAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error('Server Supabase credentials are not configured.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function invokeTestimonialPortal(action, values = {}, authorization = '') {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;
  const response = await fetch(`${url}/functions/v1/testimonial-portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      ...(authorization ? { Authorization: authorization } : {}),
    },
    body: JSON.stringify({ action, ...values }),
  });
  const result = await response.json().catch(() => ({ success: false, error: 'Invalid response from testimonial service.' }));
  return { status: response.status, result };
}

export async function isPortfolioAdmin(req) {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return false;

  try {
    const supabase = createRequestClient(req);
    const { data, error } = await supabase.auth.getUser(authorization.slice('Bearer '.length));
    return !error && data.user?.email?.toLowerCase() === ADMIN_EMAIL;
  } catch {
    return false;
  }
}

export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]);
}

export const PORTFOLIO_URL = 'https://rrdgarcia.vercel.app';
