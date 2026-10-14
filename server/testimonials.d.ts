import type { VercelRequest } from '@vercel/node';
import type { SupabaseClient } from '@supabase/supabase-js';

export function createAdminClient(): SupabaseClient;
export function isPortfolioAdmin(req: VercelRequest): Promise<boolean>;
export function escapeHtml(value: unknown): string;
export const PORTFOLIO_URL: string;
