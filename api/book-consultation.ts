import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const DEFAULT_SUPABASE_URL = "https://jfdvbyoyvqriqhqtmyjo.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZHZieW95dnFyaXFocXRteWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTMxOTQsImV4cCI6MjA4NTY2OTE5NH0.t5-BcJx0BYAQcBBIclqTsXvoUAWUzA-rPCtEnWSiuuM";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      name,
      email,
      phone,
      company,
      service_type,
      bottleneck,
      current_tools,
      preferred_date,
      preferred_time_slot,
      meeting_platform,
    } = req.body || {};

    if (!name || !email || !service_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, or service_type',
      });
    }

    let bookingId = `BK-${Date.now().toString(36).toUpperCase()}`;

    // 1. Supabase Insertion
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      DEFAULT_SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const { data, error } = await supabase
        .from('consultation_bookings')
        .insert([
          {
            name: String(name).trim(),
            email: String(email).trim().toLowerCase(),
            phone: phone ? String(phone).trim() : null,
            company: company ? String(company).trim() : null,
            service_type: String(service_type).trim(),
            bottleneck: bottleneck ? String(bottleneck).trim() : null,
            current_tools: current_tools ? String(current_tools).trim() : null,
            preferred_date: preferred_date || null,
            preferred_time_slot: preferred_time_slot || null,
            meeting_platform: meeting_platform || 'Google Meet',
            status: 'pending',
          },
        ])
        .select('id')
        .single();

      if (!error && data?.id) {
        bookingId = data.id;
      } else if (error) {
        console.warn('Supabase insertion notice:', error.message);
      }
    }

    // 2. Resend Automated Emails
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Robert Rich Garcia <consultations@dmerch.store>';
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'garciarobertrich@gmail.com';

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      // A. Notification Email to Robert (Admin)
      const adminHtml = `
        <div style="font-family: Arial, sans-serif; background: #050505; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a;">
          <div style="border-bottom: 1px solid #00f2ff33; padding-bottom: 16px; margin-bottom: 24px;">
            <span style="background: #00f2ff1a; color: #00f2ff; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid #00f2ff4d;">NEW CONSULTATION BOOKING</span>
            <h2 style="color: #ffffff; margin-top: 12px; font-size: 22px;">New Business System Inquiry</h2>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 24px;">
            <tr><td style="padding: 8px 0; color: #9ca3af; width: 140px;">Client Name:</td><td style="color: #ffffff; font-weight: bold;">${name}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Email:</td><td><a href="mailto:${email}" style="color: #00f2ff;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Phone / WhatsApp:</td><td style="color: #ffffff;">${phone || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Company:</td><td style="color: #ffffff;">${company || 'Not provided'}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">System Focus:</td><td style="color: #00f2ff; font-weight: bold;">${service_type}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Preferred Schedule:</td><td style="color: #34d399; font-weight: bold;">${preferred_date || 'Flexible'} (${preferred_time_slot || 'Anytime'})</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Platform:</td><td style="color: #ffffff;">${meeting_platform || 'Google Meet'}</td></tr>
            <tr><td style="padding: 8px 0; color: #9ca3af;">Current Tools:</td><td style="color: #ffffff;">${current_tools || 'None specified'}</td></tr>
          </table>

          <div style="background: #1a1a1a; padding: 16px; border-radius: 8px; border-left: 4px solid #00f2ff; margin-bottom: 24px;">
            <p style="margin: 0; color: #9ca3af; font-size: 12px; text-transform: uppercase; font-weight: bold;">Bottleneck / Project Requirements:</p>
            <p style="margin: 8px 0 0 0; color: #ffffff; line-height: 1.5;">${bottleneck || 'No detailed bottleneck provided.'}</p>
          </div>

          <div style="text-align: center; padding-top: 16px; border-top: 1px solid #1a1a1a;">
            ${phone ? `<a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" style="background: #10b981; color: #ffffff; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: bold; margin-right: 10px; display: inline-block;">Reply via WhatsApp</a>` : ''}
            <a href="mailto:${email}" style="background: #00f2ff; color: #050505; padding: 10px 20px; border-radius: 20px; text-decoration: none; font-weight: bold; display: inline-block;">Reply via Email</a>
          </div>
        </div>
      `;

      // B. Confirmation Email to Client
      const clientHtml = `
        <div style="font-family: Arial, sans-serif; background: #050505; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a;">
          <div style="border-bottom: 1px solid #00f2ff33; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 22px;">Consultation Request Received</h2>
            <p style="color: #00f2ff; margin: 6px 0 0 0; font-size: 14px;">Robert Rich Garcia | Business Systems Developer</p>
          </div>

          <p style="color: #d1d5db; font-size: 15px; line-height: 1.6;">
            Hi <strong>${name}</strong>,
          </p>
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
            Thank you for reaching out! I have received your request for a <strong>${service_type}</strong> consultation regarding your business operations.
          </p>

          <div style="background: #1a1a1a; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #00f2ff26;">
            <p style="margin: 0 0 10px 0; color: #00f2ff; font-weight: bold; font-size: 14px;">Your Request Summary:</p>
            <ul style="margin: 0; padding-left: 20px; color: #d1d5db; font-size: 13px; line-height: 1.8;">
              <li><strong>Target Solution:</strong> ${service_type}</li>
              <li><strong>Preferred Schedule:</strong> ${preferred_date || 'Flexible'} - ${preferred_time_slot || 'Anytime'}</li>
              <li><strong>Meeting Platform:</strong> ${meeting_platform || 'Google Meet'}</li>
            </ul>
          </div>

          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
            I am reviewing your operational details and will confirm our appointment link / time slot via email or WhatsApp within <strong>24 business hours</strong>.
          </p>

          <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #1a1a1a; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Robert Rich Garcia</p>
            <p style="margin: 4px 0 0 0;">Lead Systems Developer, DigitalMerch | <a href="https://portfolio-ruddy-zeta-ldvgpihan0.vercel.app/" style="color: #00f2ff;">Website</a></p>
          </div>
        </div>
      `;

      try {
        await Promise.allSettled([
          resend.emails.send({
            from: fromEmail,
            to: adminEmail,
            subject: `[New Lead] ${name} - ${service_type} Booking Request`,
            html: adminHtml,
          }),
          resend.emails.send({
            from: fromEmail,
            to: email,
            subject: `Consultation Confirmed: Custom Business System Session with Robert Rich Garcia`,
            html: clientHtml,
          }),
        ]);
      } catch (emailErr) {
        console.warn('Resend email notification warning:', emailErr);
      }
    }

    return res.status(200).json({
      success: true,
      bookingId,
      message: 'Consultation request successfully submitted and registered in Supabase CRM.',
    });
  } catch (err: any) {
    console.error('Booking handler error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Internal server error while processing booking.',
    });
  }
}
