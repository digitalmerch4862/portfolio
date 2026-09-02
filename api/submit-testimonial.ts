import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const DEFAULT_SUPABASE_URL = "https://jfdvbyoyvqriqhqtmyjo.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZHZieW95dnFyaXFocXRteWpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTMxOTQsImV4cCI6MjA4NTY2OTE5NH0.t5-BcJx0BYAQcBBIclqTsXvoUAWUzA-rPCtEnWSiuuM";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      token,
      client_name,
      client_role,
      company_name,
      rating,
      problem_solved,
      measurable_result,
      testimonial_text,
      avatar_url,
    } = req.body || {};

    if (!token || !testimonial_text) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: token and testimonial_text',
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      DEFAULT_SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return res.status(500).json({ success: false, error: 'Supabase configuration missing' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    // 1. Update testimonial by token
    const { data, error } = await supabase
      .from('client_testimonials')
      .update({
        client_name: client_name ? String(client_name).trim() : undefined,
        client_role: client_role ? String(client_role).trim() : null,
        company_name: company_name ? String(company_name).trim() : null,
        rating: Number(rating) || 5,
        problem_solved: problem_solved ? String(problem_solved).trim() : null,
        measurable_result: measurable_result ? String(measurable_result).trim() : null,
        testimonial_text: String(testimonial_text).trim(),
        avatar_url: avatar_url || null,
        status: 'submitted',
        submitted_at: new Date().toISOString(),
      })
      .eq('token', token)
      .select('*')
      .single();

    if (error) {
      console.error('Supabase error submitting testimonial:', error);
      return res.status(400).json({ success: false, error: error.message });
    }

    // 2. Send Admin Notification via Resend
    const resendApiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'Robert Rich Garcia <consultations@dmerch.store>';
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'garciarobertrich@gmail.com';

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      const adminNoticeHtml = `
        <div style="font-family: Arial, sans-serif; background: #050505; color: #ffffff; padding: 30px; border-radius: 12px; max-width: 600px; margin: 0 auto; border: 1px solid #1a1a1a;">
          <div style="border-bottom: 1px solid #00f2ff33; padding-bottom: 16px; margin-bottom: 24px;">
            <span style="background: #10b9811a; color: #34d399; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; border: 1px solid #10b9814d;">NEW TESTIMONIAL SUBMITTED</span>
            <h2 style="color: #ffffff; margin-top: 12px; font-size: 22px;">★ ${'⭐'.repeat(data.rating || 5)} Review Received!</h2>
          </div>

          <p style="color: #d1d5db; font-size: 14px;"><strong>Client:</strong> ${data.client_name} (${data.client_role || 'No title'} @ ${data.company_name || 'Individual'})</p>
          <p style="color: #9ca3af; font-size: 14px;"><strong>System:</strong> ${data.service_type}</p>

          <div style="background: #141414; padding: 16px; border-radius: 8px; border-left: 4px solid #00f2ff; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; color: #00f2ff; font-size: 11px; text-transform: uppercase; font-weight: bold;">Testimonial Quote:</p>
            <p style="margin: 0; color: #ffffff; font-style: italic; line-height: 1.5;">"${data.testimonial_text}"</p>
          </div>

          ${data.measurable_result ? `
            <div style="background: #064e3b22; border: 1px solid #05966944; padding: 12px; border-radius: 8px; margin-bottom: 20px;">
              <span style="color: #34d399; font-weight: bold; font-size: 12px;">Measurable Result:</span>
              <p style="color: #e5e7eb; margin: 4px 0 0 0; font-size: 13px;">${data.measurable_result}</p>
            </div>
          ` : ''}

          <div style="text-align: center; margin-top: 24px;">
            <a href="https://portfolio-ruddy-zeta-ldvgpihan0.vercel.app/admin" style="background: #00f2ff; color: #050505; padding: 10px 24px; border-radius: 20px; text-decoration: none; font-weight: bold; font-size: 13px; display: inline-block;">
              Open Admin Console to Feature on Homepage →
            </a>
          </div>
        </div>
      `;

      try {
        await resend.emails.send({
          from: fromEmail,
          to: adminEmail,
          subject: `[New Testimonial] ${data.client_name} submitted a ${data.rating}-Star Review!`,
          html: adminNoticeHtml,
        });
      } catch (err) {
        console.warn('Resend notification warning:', err);
      }
    }

    return res.status(200).json({
      success: true,
      data,
      message: 'Testimonial submitted successfully.',
    });
  } catch (err: any) {
    console.error('Submit testimonial error:', err);
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to submit testimonial.',
    });
  }
}
