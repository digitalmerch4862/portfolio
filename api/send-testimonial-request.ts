import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';
import crypto from 'crypto';
import { createRequestClient, escapeHtml, isPortfolioAdmin, PORTFOLIO_URL } from '../server/testimonials.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed.' });
  if (!(await isPortfolioAdmin(req))) return res.status(401).json({ success: false, error: 'Admin sign-in required.' });
  if (!process.env.RESEND_API_KEY) {
    return res.status(503).json({ success: false, error: 'Resend is not configured. Add RESEND_API_KEY to the Vercel project.' });
  }
  const { client_name: clientName, client_email: clientEmail, company_name: companyName, service_type: serviceType, booking_id: bookingId, notes } = req.body || {};
  if (typeof clientName !== 'string' || !clientName.trim() || typeof clientEmail !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail) || typeof serviceType !== 'string' || !serviceType.trim()) {
    return res.status(400).json({ success: false, error: 'Enter a client name, valid email, and service.' });
  }

  const token = crypto.randomBytes(16).toString('hex');
  const reviewUrl = `${PORTFOLIO_URL}/review?token=${token}`;
  try {
    const supabase = createRequestClient(req);
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

    const resend = new Resend(process.env.RESEND_API_KEY);
    const safeName = escapeHtml(clientName.trim());
    const safeCompany = escapeHtml(typeof companyName === 'string' && companyName.trim() ? companyName.trim() : 'your project');
    const safeService = escapeHtml(serviceType.trim());
    const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <title>Share your feedback</title>
  </head>
  <body style="margin:0;padding:0;background:#f3f6f8;font-family:Arial,Helvetica,sans-serif;color:#172b3a;-webkit-text-size-adjust:100%;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">A short survey about your ${safeService} project experience.</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f6f8;width:100%;">
      <tr><td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid #e3e9ed;border-radius:14px;overflow:hidden;">
          <tr><td style="padding:24px 32px;background:#092c35;">
            <div style="font-size:20px;line-height:26px;font-weight:700;letter-spacing:.3px;color:#ffffff;">DMerch</div>
            <div style="margin-top:5px;font-size:12px;line-height:18px;color:#b9d4d7;">Client feedback</div>
          </td></tr>
          <tr><td style="padding:34px 32px 12px;">
            <div style="font-size:13px;line-height:20px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#087f8c;">Your experience matters</div>
            <h1 style="margin:10px 0 18px;font-size:27px;line-height:34px;font-weight:700;color:#142b38;">How did the project go?</h1>
            <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#405563;">Hi ${safeName},</p>
            <p style="margin:0 0 16px;font-size:16px;line-height:26px;color:#405563;">Thank you for trusting me with <strong style="color:#203744;">${safeService}</strong>${safeCompany !== 'your project' ? ` for <strong style="color:#203744;">${safeCompany}</strong>` : ''}. I’d appreciate your honest feedback in a quick five-question survey.</p>
            <p style="margin:0 0 22px;font-size:15px;line-height:24px;color:#526673;">It takes about two minutes. You can optionally add a written comment or video and choose whether your feedback may appear on my portfolio. Responses rated below 4 stars stay private.</p>
          </td></tr>
          <tr><td align="left" style="padding:4px 32px 24px;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td align="center" style="border-radius:8px;background:#087f8c;">
              <a href="${reviewUrl}" style="display:inline-block;padding:15px 24px;border:1px solid #087f8c;border-radius:8px;font-size:15px;line-height:20px;font-weight:700;color:#ffffff;text-decoration:none;">Share your feedback&nbsp; &rarr;</a>
            </td></tr></table>
          </td></tr>
          <tr><td style="padding:0 32px 28px;">
            <p style="margin:0;font-size:13px;line-height:21px;color:#71818a;">No account is needed. If the button doesn’t work, copy and paste this link into your browser:<br><a href="${reviewUrl}" style="color:#087f8c;word-break:break-all;">${reviewUrl}</a></p>
          </td></tr>
          <tr><td style="padding:22px 32px;background:#f7f9fa;border-top:1px solid #e8edef;">
            <p style="margin:0 0 6px;font-size:14px;line-height:22px;color:#405563;">Thank you,<br><strong style="color:#203744;">Robert Rich Garcia</strong></p>
            <a href="${PORTFOLIO_URL}" style="font-size:13px;line-height:20px;color:#087f8c;text-decoration:none;">View portfolio</a>
            <p style="margin:14px 0 0;font-size:11px;line-height:17px;color:#89969c;">You received this personal request because we worked together on a project.</p>
          </td></tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;line-height:17px;color:#89969c;">&copy; ${new Date().getFullYear()} DMerch</p>
      </td></tr>
    </table>
  </body>
</html>`;
    const text = `Hi ${clientName.trim()},\n\nThank you for trusting me with ${serviceType.trim()}${typeof companyName === 'string' && companyName.trim() ? ` for ${companyName.trim()}` : ''}. I’d appreciate your honest feedback in a quick five-question survey. It takes about two minutes. You can optionally add a comment or video and choose whether your feedback may appear on my portfolio. Responses rated below 4 stars stay private.\n\nShare your feedback: ${reviewUrl}\n\nThank you,\nRobert Rich Garcia\n${PORTFOLIO_URL}\n\nYou received this personal request because we worked together on a project.`;
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'DMerch <consultations@dmerch.store>',
      to: clientEmail.trim(),
      subject: `A quick favor: share feedback on our ${serviceType.trim()} project`,
      html,
      text,
    });
    if (result.error) throw result.error;
    const emailSent = true;
    return res.status(200).json({ success: true, id: record.id, token, reviewUrl, emailSent });
  } catch (error) {
    console.error('Could not create testimonial invitation:', error);
    return res.status(500).json({ success: false, error: 'Could not create the invitation. Please try again.' });
  }
}
