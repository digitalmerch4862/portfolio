import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAdminClient, isPortfolioAdmin } from '../server/testimonials';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  if (!(await isPortfolioAdmin(req))) return res.status(401).json({ success: false, error: 'Admin sign-in required.' });
  const paths = req.body?.paths;
  if (!Array.isArray(paths) || paths.length > 100 || paths.some((path) => typeof path !== 'string' || path.length > 300)) {
    return res.status(400).json({ success: false, error: 'Invalid media paths.' });
  }
  try {
    const media = createAdminClient().storage.from('testimonial-media');
    const urls = await Promise.all(paths.map(async (path: string) => {
      const { data, error } = await media.createSignedUrl(path, 3600);
      return [path, error ? null : data.signedUrl] as const;
    }));
    return res.status(200).json({ success: true, urls: Object.fromEntries(urls) });
  } catch (error) {
    console.error('Could not sign admin testimonial media:', error);
    return res.status(500).json({ success: false, error: 'Unable to load testimonial media.' });
  }
}
