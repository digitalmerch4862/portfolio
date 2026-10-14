import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAdminClient } from '../server/testimonials';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from('client_testimonials')
      .select('id, client_name, client_role, company_name, avatar_url, service_type, testimonial_text, video_url, measurable_result, rating, created_at')
      .eq('status', 'approved').eq('is_featured', true).gte('rating', 4).order('created_at', { ascending: false });
    if (error) throw error;
    const media = supabase.storage.from('testimonial-media');
    const testimonials = await Promise.all((data || []).map(async (review) => {
      const [avatar, video] = await Promise.all([
        review.avatar_url ? media.createSignedUrl(review.avatar_url, 3600) : Promise.resolve({ data: null }),
        review.video_url ? media.createSignedUrl(review.video_url, 3600) : Promise.resolve({ data: null }),
      ]);
      return { ...review, avatar_url: avatar.data?.signedUrl || null, video_url: video.data?.signedUrl || null };
    }));
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=300');
    return res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    console.error('Could not load public testimonials:', error);
    return res.status(500).json({ success: false, error: 'Unable to load testimonials.' });
  }
}
