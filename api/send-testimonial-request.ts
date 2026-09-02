import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

const DEFAULT_SUPABASE_URL = "https://jfdvbyoyvqriqhqtmyjo.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZHZieW95dnFyaXFocXRteWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTMxOTQsImV4cCI6MjA4NTY2OTE5NH0.t5-BcJx0BYAQcBBIclqTsXvoUAWUzA-rPCtEnWSiuuM";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      client_name,
      client_email,
      company_name,
      service_type,
      booking_id,
      notes,
    } = req.body || {};

    if (!client_name || !client_email || !service_type) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: client_name, client_email, service_type',
      });
    }

    const token = crypto.randomBytes(16).toString('hex');
    const appBaseUrl = process.env.APP_URL || 'https://portfolio-ruddy-zeta-ldvgpihan0.vercel.app';
    const reviewUrl = `${appBaseUrl}/review?token=${token}`;

    // 1. Supabase insert
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      DEFAULT_SUPABASE_KEY;

    let recordId = '';
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const { data, error } = await supabase
        .from('client_testimonials')
        .insert([
          {
            client_name: String(client_name).trim(),
            client_email: String(client_email).trim().toLowerCase(),
            company_name: company_name ? String(company_name).trim() : null,
            service_type: String(service_type).trim(),
            booking_id: booking_id || null,
            status: 'requested',
            token,
            notes: notes || null,
          }
        ])
        .select('id')
        .single();

      if (error) {
        console.error('Supabase error inserting testimonial request:', error);
      } else if (data?.id) {
        recordId = data.id;
      }
    }

    // 2. Send email via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Robert Rich Garcia <consultations@dmerch.store>';

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; background: #050505; color: #ffffff; padding: 32px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a;">
          <div style="border-bottom: 1px solid #00f2ff33; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="color: #ffffff; margin: 0; font-size: 22px;">How has your new system impacted ${company_name || 'your operations'}?</h2>
            <p style="color: #00f2ff; margin: 6px 0 0 0; font-size: 14px;">Robert Rich Garcia | Business Systems Developer</p>
          </div>

          <p style="color: #d1d5db; font-size: 15px; line-height: 1.6;">
            Hi <strong>${client_name}</strong>,
          </p>
          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
            Thank you for working together on your <strong>${service_type}</strong>! I would love to hear your honest feedback and the real impact it brought to your team's workflow and operations.
          </p>

          <p style="color: #9ca3af; font-size: 14px; line-height: 1.6;">
            Would you mind sharing a quick 2-minute review? Your feedback helps me continually refine our business systems and solutions.
          </p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${reviewUrl}" style="background: #00f2ff; color: #050505; padding: 14px 28px; border-radius: 30px; text-decoration: none; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 0 20px rgba(0, 242, 255, 0.4);">
              ★ Leave a 2-Minute Review →
            </a>
          </div>

          <div style="background: #141414; padding: 16px; border-radius: 8px; border-left: 3px solid #00f2ff; font-size: 12px; color: #9ca3af; line-height: 1.5;">
            <strong>Frictionless link:</strong> No password or account setup required. Your project details are pre-loaded.
          </div>

          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #1a1a1a; font-size: 12px; color: #6b7280;">
            <p style="margin: 0;">Robert Rich Garcia</p>
            <p style="margin: 4px 0 0 0;">Lead Systems Developer | <a href="https://portfolio-ruddy-zeta-ldvgpihan0.vercel.app/" style="color: #00f2ff;">Portfolio</a></p>
          </div>
        </div>
      `;

      await resend.emails.send({
        from: fromEmail,
        to: client_email,
        subject: `Quick favor: How did our ${service_type} impact ${company_name || 'your workflow'}?`,
        html: emailHtml,
      });
    }

    return res.status(200).json({
      success: true,
      id: recordId,
      token,
      reviewUrl,
      message: `Testimonial request email dispatched to ${client_email}.`,
    });
  } catch (err: any) {
    console.error('Send testimonial request error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to dispatch testimonial request.',
    });
  }
}
