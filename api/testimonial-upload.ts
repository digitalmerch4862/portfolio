import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createAdminClient, isPortfolioAdmin } from './_lib/testimonials';

const TOKEN_PATTERN = /^[a-f0-9]{32}$/i;
const FILE_TYPES: Record<string, { extension: string; kind: 'avatar' | 'video'; maxSize: number }> = {
  'image/jpeg': { extension: 'jpg', kind: 'avatar', maxSize: 5 * 1024 * 1024 },
  'image/png': { extension: 'png', kind: 'avatar', maxSize: 5 * 1024 * 1024 },
  'image/webp': { extension: 'webp', kind: 'avatar', maxSize: 5 * 1024 * 1024 },
  'video/mp4': { extension: 'mp4', kind: 'video', maxSize: 50 * 1024 * 1024 },
  'video/webm': { extension: 'webm', kind: 'video', maxSize: 50 * 1024 * 1024 },
  'video/quicktime': { extension: 'mov', kind: 'video', maxSize: 50 * 1024 * 1024 },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });

  const { token, kind, content_type: contentType, size } = req.body || {};
  const normalizedKind = kind === 'adminAvatar' ? 'avatar' : kind;
  const type = FILE_TYPES[String(contentType)];
  if (!type || type.kind !== normalizedKind || !Number.isSafeInteger(size) || size <= 0 || size > type.maxSize) {
    return res.status(400).json({ success: false, error: 'This file type or size is not allowed.' });
  }

  const adminUpload = kind === 'adminAvatar';
  if (adminUpload) {
    if (type.kind !== 'avatar' || !(await isPortfolioAdmin(req))) {
      return res.status(403).json({ success: false, error: 'Not authorized.' });
    }
  } else if (!TOKEN_PATTERN.test(String(token || ''))) {
    return res.status(404).json({ success: false, error: 'Invitation not found.' });
  }

  try {
    const supabase = createAdminClient();
    if (!adminUpload) {
      const { data: invitation, error } = await supabase
        .from('client_testimonials')
        .select('id')
        .eq('token', token)
        .eq('status', 'requested')
        .maybeSingle();
      if (error || !invitation) return res.status(404).json({ success: false, error: 'Invitation not found.' });
    }

    const path = adminUpload
      ? `admin/${crypto.randomUUID()}.${type.extension}`
      : `${token}/${kind}-${crypto.randomUUID()}.${type.extension}`;
    const { data, error } = await supabase.storage.from('testimonial-media').createSignedUploadUrl(path);
    if (error || !data) throw error || new Error('Could not create an upload link.');

    return res.status(200).json({ success: true, path, uploadToken: data.token });
  } catch (error) {
    console.error('Could not create testimonial upload link:', error);
    return res.status(500).json({ success: false, error: 'Unable to prepare this upload.' });
  }
}
