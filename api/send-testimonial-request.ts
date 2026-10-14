import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import crypto from 'crypto';
import { createAdminClient, escapeHtml, isPortfolioAdmin, PORTFOLIO_URL } from '../server/testimonials.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  if (!(await isPortfolioAdmin(req))) return res.status(401).json({ success: false, error: 'Admin sign-in required.' });
  const { client_name: clientName, client_email: clientEmail, company_name: companyName, service_type: serviceType, booking_id: bookingId, notes } = req.body || {};
  if (typeof clientName !== 'string' || !clientName.trim() || typeof clientEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail) || typeof serviceType !== 'string' || !serviceType.trim()) {
    return res.status(400).json({ success: false, error: 'Enter a client name, valid email, and service.' });
  }

  const token = crypto.randomBytes(16).toString('hex');
  const reviewUrl = `${PORTFOLIO_URL}/review?token=${token}`;
  try {
    const supabase = createAdminClient();
    const { data: record, error } = await supabase.from('client_testimonials').insert({
      client_name: clientName.trim().slice(0, 160),
      client_email: clientEmail.trim().toLowerCase(),
      company_name: typeof companyName === 'string' && companyName.trim() ? companyName.trim().slice(0, 160) : null,
      service_type: serviceType.trim().slice(0, 160),
      booking_id: bookingId || null,
      status: 'requested', token,
      notes: typeof notes === 'string' && notes.trim() ? notes.trim().slice(0, 1000) : null,
    }).select('id').single();
    if (error) throw error;

    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const safeName = escapeHtml(clientName.trim());
      const safeCompany = escapeHtml(typeof companyName === 'string' ? companyName.trim() : 'your team');
      const safeService = escapeHtml(serviceType.trim());
      const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;color:#172033;line-height:1.6"><h2>How was your experience?</h2><p>Hi ${safeName},</p><p>Thank you for working with me on ${safeService}. I’d appreciate your honest feedback in a short five-question survey. It covers overall satisfaction, communication, work quality, fit for your needs, and results for ${safeCompany}.</p><p>You can add an optional comment or video, and choose whether you want your feedback shared publicly. Ratings below 4 stars stay private.</p><p style="margin:28px 0"><a href="${reviewUrl}" style="background:#172033;color:#fff;padding:13px 20px;border-radius:8px;text-decoration:none">Start the feedback survey</a></p><p>It takes about two minutes. No account is needed.</p><p>Thank you,<br>Robert Rich Garcia<br><a href="${PORTFOLIO_URL}">Portfolio</a></p></div>`;
      const result = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'Robert Rich Garcia <consultations@dmerch.store>',
        to: clientEmail.trim(),
        subject: `Quick feedback about our ${serviceType.trim()} project`,
        html,
      });
      emailSent = !result.error;
    }
    return res.status(200).json({ success: true, id: record.id, token, reviewUrl, emailSent });
  } catch (error) {
    console.error('Could not create testimonial invitation:', error);
    return res.status(500).json({ success: false, error: 'Could not create the invitation. Please try again.' });
  }
}
