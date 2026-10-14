import { createClient } from 'npm:@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SECRET_KEYS = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}')
const SUPABASE_PUBLISHABLE_KEYS = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}')
const SECRET_KEY = SUPABASE_SECRET_KEYS.default || Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const PUBLISHABLE_KEY = SUPABASE_PUBLISHABLE_KEYS.default || Deno.env.get('SUPABASE_ANON_KEY')
const ADMIN_EMAIL = 'garciarobertrich@gmail.com'
const BUCKET = 'testimonial-media'
const TOKEN_PATTERN = /^[a-f0-9]{32}$/i
const FILES: Record<string, { extension: string; kind: 'avatar' | 'video'; maxSize: number }> = {
  'image/jpeg': { extension: 'jpg', kind: 'avatar', maxSize: 5 * 1024 * 1024 },
  'image/png': { extension: 'png', kind: 'avatar', maxSize: 5 * 1024 * 1024 },
  'image/webp': { extension: 'webp', kind: 'avatar', maxSize: 5 * 1024 * 1024 },
  'video/mp4': { extension: 'mp4', kind: 'video', maxSize: 50 * 1024 * 1024 },
  'video/webm': { extension: 'webm', kind: 'video', maxSize: 50 * 1024 * 1024 },
  'video/quicktime': { extension: 'mov', kind: 'video', maxSize: 50 * 1024 * 1024 },
}

const json = (body: Record<string, unknown>, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
})

const admin = () => {
  if (!SECRET_KEY) throw new Error('Supabase secret key is unavailable in the Edge Function.')
  return createClient(SUPABASE_URL, SECRET_KEY, { auth: { persistSession: false, autoRefreshToken: false } })
}

async function isAdmin(authorization: string | null) {
  const token = authorization?.match(/^Bearer\s+(.+)$/i)?.[1]
  if (!token || !PUBLISHABLE_KEY) return false
  const client = createClient(SUPABASE_URL, PUBLISHABLE_KEY, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await client.auth.getUser(token)
  return !error && data.user?.email?.toLowerCase() === ADMIN_EMAIL
}

function validMediaPath(path: unknown, token: string, kind: 'avatar' | 'video') {
  if (typeof path !== 'string') return false
  const extensions = kind === 'avatar' ? '(jpg|png|webp)' : '(mp4|webm|mov)'
  return new RegExp(`^${token}/${kind}-[a-f0-9-]+\\.${extensions}$`, 'i').test(path)
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ success: false, error: 'Method not allowed.' }, 405)

  try {
    const body = await req.json()
    const db = admin()

    if (body.action === 'lookup') {
      const token = String(body.token || '')
      if (!TOKEN_PATTERN.test(token)) return json({ success: false, error: 'Invitation not found.' }, 404)
      const { data, error } = await db.from('client_testimonials')
        .select('client_name, company_name, service_type, status')
        .eq('token', token).eq('status', 'requested').maybeSingle()
      if (error) throw error
      if (!data) return json({ success: false, error: 'This invitation is invalid or has already been used.' }, 404)
      return json({ success: true, data })
    }

    if (body.action === 'prepare-upload') {
      const token = String(body.token || '')
      const kind = body.kind === 'adminAvatar' ? 'adminAvatar' : body.kind
      const file = FILES[String(body.content_type)]
      const isAdminUpload = kind === 'adminAvatar'
      if (!file || (isAdminUpload ? file.kind !== 'avatar' : file.kind !== kind) ||
        !Number.isSafeInteger(body.size) || body.size <= 0 || body.size > file.maxSize) {
        return json({ success: false, error: 'This file type or size is not allowed.' }, 400)
      }

      if (isAdminUpload) {
        if (file.kind !== 'avatar' || !(await isAdmin(req.headers.get('authorization')))) {
          return json({ success: false, error: 'Not authorized.' }, 403)
        }
      } else {
        if (!TOKEN_PATTERN.test(token)) return json({ success: false, error: 'Invitation not found.' }, 404)
        const { data, error } = await db.from('client_testimonials').select('id')
          .eq('token', token).eq('status', 'requested').maybeSingle()
        if (error) throw error
        if (!data) return json({ success: false, error: 'Invitation not found.' }, 404)
      }

      const path = isAdminUpload
        ? `admin/${crypto.randomUUID()}.${file.extension}`
        : `${token}/${kind}-${crypto.randomUUID()}.${file.extension}`
      const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path)
      if (error || !data) throw error || new Error('Could not create upload link.')
      return json({ success: true, path, uploadToken: data.token })
    }

    if (body.action === 'submit') {
      const token = String(body.token || '')
      const score = Number(body.rating)
      const answers = body.survey_answers
      const type = body.testimonial_type
      const validAnswers = answers && ['communication', 'quality', 'fit', 'result'].every((key) =>
        typeof answers[key] === 'string' && answers[key].trim().length > 0 && answers[key].length <= 300)
      if (!TOKEN_PATTERN.test(token) || body.public_consent !== true || !Number.isInteger(score) || score < 1 || score > 5 ||
        !['text', 'video'].includes(type) || !validAnswers) {
        return json({ success: false, error: 'Please complete all four service questions and provide a valid rating.' }, 400)
      }
      if (type === 'video' && !validMediaPath(body.video_url, token, 'video')) {
        return json({ success: false, error: 'Please upload a video using this form.' }, 400)
      }
      if ((type === 'video') !== Boolean(body.video_url)) {
        return json({ success: false, error: 'Please add the optional video again or submit without it.' }, 400)
      }
      if (body.avatar_url && !validMediaPath(body.avatar_url, token, 'avatar')) {
        return json({ success: false, error: 'Please upload a profile photo using this form.' }, 400)
      }

      const { data: invitation, error: lookupError } = await db.from('client_testimonials')
        .select('id, client_name, client_role, company_name, client_email, service_type, status, token')
        .eq('token', token).eq('status', 'requested').maybeSingle()
      if (lookupError) throw lookupError
      if (!invitation) return json({ success: false, error: 'This invitation is invalid or has already been used.' }, 404)

      const isPublic = score >= 4
      const submittedAt = new Date().toISOString()
      const { data, error } = await db.from('client_testimonials').update({
        rating: score,
        testimonial_type: type,
        testimonial_text: `Communication: ${answers.communication.trim()}\nWork quality: ${answers.quality.trim()}\nFit for our needs: ${answers.fit.trim()}\nResult: ${answers.result.trim()}`,
        video_url: type === 'video' ? body.video_url : null,
        avatar_url: body.avatar_url || null,
        problem_solved: answers.fit.trim(),
        measurable_result: answers.result.trim(),
        status: isPublic ? 'approved' : 'submitted',
        is_featured: isPublic,
        consent_at: submittedAt,
        submitted_at: submittedAt,
        client_role: invitation.client_role,
        company_name: invitation.company_name,
      }).eq('id', invitation.id).eq('status', 'requested').select('id').maybeSingle()
      if (error) throw error
      if (!data) return json({ success: false, error: 'This invitation has already been submitted.' }, 409)
      return json({ success: true, public: isPublic, invitation: { client_name: invitation.client_name, client_email: invitation.client_email, service_type: invitation.service_type } })
    }

    if (body.action === 'public-testimonials') {
      const { data, error } = await db.from('client_testimonials')
        .select('id, client_name, client_role, company_name, avatar_url, service_type, testimonial_text, video_url, measurable_result, rating, created_at')
        .eq('status', 'approved').eq('is_featured', true).gte('rating', 4).order('created_at', { ascending: false })
      if (error) throw error
      const media = db.storage.from(BUCKET)
      const testimonials = await Promise.all((data || []).map(async (review) => {
        const [avatar, video] = await Promise.all([
          review.avatar_url ? media.createSignedUrl(review.avatar_url, 3600) : Promise.resolve({ data: null }),
          review.video_url ? media.createSignedUrl(review.video_url, 3600) : Promise.resolve({ data: null }),
        ])
        return { ...review, avatar_url: avatar.data?.signedUrl || null, video_url: video.data?.signedUrl || null }
      }))
      return json({ success: true, data: testimonials })
    }

    if (body.action === 'admin-media') {
      if (!(await isAdmin(req.headers.get('authorization')))) return json({ success: false, error: 'Admin sign-in required.' }, 401)
      const paths = body.paths
      if (!Array.isArray(paths) || paths.length > 100 || paths.some((path) => typeof path !== 'string' || path.length > 300)) {
        return json({ success: false, error: 'Invalid media paths.' }, 400)
      }
      const media = db.storage.from(BUCKET)
      const urls = await Promise.all(paths.map(async (path: string) => {
        const { data, error } = await media.createSignedUrl(path, 3600)
        return [path, error ? null : data.signedUrl] as const
      }))
      return json({ success: true, urls: Object.fromEntries(urls) })
    }

    return json({ success: false, error: 'Unknown testimonial operation.' }, 400)
  } catch (error) {
    console.error('Testimonial portal operation failed:', error)
    return json({ success: false, error: 'Testimonial service is temporarily unavailable.' }, 500)
  }
})
