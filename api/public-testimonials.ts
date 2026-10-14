import type { VercelRequest, VercelResponse } from '@vercel/node';
import { invokeTestimonialPortal } from '../server/testimonials.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  try {
    const { status, result } = await invokeTestimonialPortal('public-testimonials');
    if (status !== 200 || !result.success) return res.status(status).json(result);
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    return res.status(200).json(result);
  } catch (error) {
    console.error('Could not load public testimonials:', error);
    return res.status(500).json({ success: false, error: 'Unable to load testimonials.' });
  }
}
