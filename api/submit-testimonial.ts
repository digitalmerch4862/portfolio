import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import { escapeHtml, invokeTestimonialPortal } from '../server/testimonials.js';

const TOKEN_PATTERN = /^[a-f0-9]{32}$/i;
const mediaPathIsValid = (value: unknown, token: string, kind: 'avatar' | 'video') => {
  if (typeof value !== 'string') return false;
  const extension = kind === 'avatar' ? '(jpg|png|webp)' : '(mp4|webm|mov)';
  return new RegExp(`^${token}/${kind}-[a-f0-9-]+\\.${extension}$`, 'i').test(value);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  const { token, rating, public_consent: publicConsent, testimonial_type: type, avatar_url: avatarUrl, video_url: videoUrl, survey_answers: answers } = req.body || {};
  const score = Number(rating);
  const validAnswers = answers && ['communication', 'quality', 'fit', 'result'].every((key) => typeof answers[key] === 'string' && answers[key].trim().length > 0 && answers[key].length <= 300);
  if (!TOKEN_PATTERN.test(String(token || '')) || publicConsent !== true || !Number.isInteger(score) || score < 1 || score > 5 || !['text', 'video'].includes(type) || !validAnswers) {
    return res.status(400).json({ success: false, error: 'Please complete all four service questions and provide a valid rating.' });
  }
  if (type === 'video' && !mediaPathIsValid(videoUrl, String(token), 'video')) return res.status(400).json({ success: false, error: 'Please upload a video using this form.' });
  if ((type === 'video') !== Boolean(videoUrl)) return res.status(400).json({ success: false, error: 'Please add the optional video again or submit without it.' });
  if (avatarUrl && !mediaPathIsValid(avatarUrl, String(token), 'avatar')) return res.status(400).json({ success: false, error: 'Please upload a profile photo using this form.' });

  try {
    const { status, result } = await invokeTestimonialPortal('submit', {
      token,
      rating: score,
      public_consent: publicConsent,
      testimonial_type: type,
      avatar_url: avatarUrl,
      video_url: videoUrl,
      survey_answers: answers,
    });
    if (status !== 200 || !result.success) return res.status(status).json(result);
    const isPublic = Boolean(result.public);
    const invitation = result.invitation;

    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'DMerch <consultations@dmerch.store>',
          to: process.env.ADMIN_NOTIFICATION_EMAIL || 'garciarobertrich@gmail.com',
          subject: `Client survey received: ${invitation.client_name} (${score}/5)`,
          html: `<h2>Client feedback received</h2><p><strong>${escapeHtml(invitation.client_name)}</strong> · ${escapeHtml(invitation.service_type)} · ${score}/5</p><ul><li>Communication: ${escapeHtml(answers.communication)}</li><li>Work quality: ${escapeHtml(answers.quality)}</li><li>Fit: ${escapeHtml(answers.fit)}</li><li>Result: ${escapeHtml(answers.result)}</li></ul><p>${type === 'video' ? 'Video testimonial attached to the admin record.' : 'Written survey response'}</p><p>${isPublic ? 'Client permitted publication and this 4–5 star response is live.' : 'Private feedback only (rating below 4 stars).'}</p><p><a href="https://rrdgarcia.vercel.app/admin2">Open testimonial dashboard</a></p>`,
        });
      } catch (emailError) { console.error('Could not send survey notification:', emailError); }
    }
    return res.status(200).json({ success: true, public: isPublic });
  } catch (error) {
    console.error('Could not submit client survey:', error);
    return res.status(500).json({ success: false, error: 'Could not submit your feedback. Please try again.' });
  }
}
