import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAdminClient } from './_lib/testimonials';

const TOKEN_PATTERN = /^[a-f0-9]{32}$/i;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  const token = String(req.query.token || '');
  if (!TOKEN_PATTERN.test(token)) return res.status(404).json({ success: false, error: 'Invitation not found.' });

  try {
    const { data, error } = await createAdminClient()
      .from('client_testimonials')
      .select('client_name, company_name, service_type, status')
      .eq('token', token)
      .maybeSingle();

    if (error || !data) return res.status(404).json({ success: false, error: 'Invitation not found.' });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Could not load testimonial invitation:', error);
    return res.status(500).json({ success: false, error: 'Unable to load this invitation right now.' });
  }
}
