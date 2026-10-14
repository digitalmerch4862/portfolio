import type { VercelRequest } from '@vercel/node';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://jfdvbyoyvqriqhqtmyjo.supabase.co';
const ADMIN_EMAIL = 'digitalmerch4862@gmail.com';

export function createAdminClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!key) throw new Error('Server Supabase credentials are not configured.');
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export async function isPortfolioAdmin(req: VercelRequest): Promise<boolean> {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return false;

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.getUser(authorization.slice('Bearer '.length));
    return !error && data.user?.email?.toLowerCase() === ADMIN_EMAIL;
  } catch {
    return false;
  }
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!);
}

export const PORTFOLIO_URL = 'https://rrdgarcia.vercel.app';
