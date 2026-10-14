import React, { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle, Loader2, Mic, Square, Star, Trash2, UploadCloud } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Invitation = { client_name: string; company_name: string | null; service_type: string; status: string };

export const ReviewPage: React.FC = () => {
  const [token, setToken] = useState('');
  const [invitation, setInvitation] = useState<Invitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [published, setPublished] = useState(false);
  const [error, setError] = useState('');
  const [rating, setRating] = useState(5);
  const [answers, setAnswers] = useState({ communication: '', quality: '', fit: '', result: '' });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [recording, setRecording] = useState(false);
  const [recordingError, setRecordingError] = useState('');
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('');
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const reviewToken = new URLSearchParams(window.location.search).get('token') || '';
    setToken(reviewToken);
    if (!/^[a-f0-9]{32}$/i.test(reviewToken)) {
      setLoading(false);
      return;
    }
    fetch(`/api/testimonial?token=${encodeURIComponent(reviewToken)}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error('This invitation link is invalid or has already expired.');
        setInvitation(result.data);
      })
      .catch((requestError) => setError(requestError.message || 'Unable to load this invitation.'))
      .finally(() => setLoading(false));
  }, []);

  const uploadFile = async (file: File, kind: 'avatar' | 'video') => {
    const response = await fetch('/api/testimonial-upload', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, kind, content_type: file.type, size: file.size }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.error || 'Could not prepare file upload.');
    const { error: uploadError } = await supabase.storage.from('testimonial-media')
      .uploadToSignedUrl(result.path, result.uploadToken, file, { contentType: file.type });
    if (uploadError) throw uploadError;
    return result.path as string;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!consent) { setError('Please choose whether you give permission for your feedback to be shown publicly.'); return; }
    setSubmitting(true); setError('');
    try {
      const [avatarUrl, videoUrl] = await Promise.all([
        photoFile ? uploadFile(photoFile, 'avatar') : Promise.resolve(null),
        videoFile ? uploadFile(videoFile, 'video') : Promise.resolve(null),
      ]);
      const response = await fetch('/api/submit-testimonial', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, rating, public_consent: consent, testimonial_type: videoUrl ? 'video' : 'text', video_url: videoUrl, avatar_url: avatarUrl, survey_answers: answers }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || 'Could not submit your feedback.');
      setPublished(Boolean(result.public));
      setSubmitted(true);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Could not submit your feedback. Please try again.');
    } finally { setSubmitting(false); }
  };

  const updateAnswer = (key: keyof typeof answers, value: string) => setAnswers((current) => ({ ...current, [key]: value }));
  const clearVideo = () => {
    if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl);
    setVideoPreviewUrl('');
    setVideoFile(null);
    setRecordingError('');
  };
  const startRecording = async () => {
    setRecordingError('');
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        setRecordingError('Recording is not supported in this browser. Upload a video instead.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      setRecordingStream(stream);
      const mimeType = ['video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm'].find((candidate) => MediaRecorder.isTypeSupported(candidate));
      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecordingStream(null);
        const blob = new Blob(chunks, { type: mediaRecorder.mimeType || 'video/webm' });
        if (blob.size > 50 * 1024 * 1024) {
          setRecordingError('This recording is over 50 MB. Please make a shorter video.');
          setRecording(false);
          setRecorder(null);
          return;
        }
        const extension = blob.type.includes('mp4') ? 'mp4' : 'webm';
        setVideoFile(new File([blob], `testimonial.${extension}`, { type: blob.type }));
        setVideoPreviewUrl(URL.createObjectURL(blob));
        setRecording(false);
        setRecorder(null);
      };
      mediaRecorder.start();
      setRecorder(mediaRecorder);
      setRecording(true);
    } catch {
      setRecordingError('Camera and microphone access is needed to record. You can upload a video instead.');
    }
  };
  const stopRecording = () => { if (recorder && recorder.state !== 'inactive') recorder.stop(); };
  useEffect(() => () => { if (videoPreviewUrl) URL.revokeObjectURL(videoPreviewUrl); }, [videoPreviewUrl]);
  const sampleAnswers = {
    communication: ['Clear and responsive throughout the project', 'Good overall, with room to improve response time', 'Communication was inconsistent'],
    quality: ['The work was reliable and well put together', 'The main needs were met', 'The quality did not meet my expectations'],
    fit: ['It fit our needs very well', 'It covered most of what we needed', 'It did not fit our needs'],
    result: ['It made this part of our work easier to manage', 'It helped us organize the process more clearly', 'We have not seen a clear improvement yet'],
  };

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#080b10] text-slate-900 dark:text-white px-4 py-12 sm:py-16">
      <div className="max-w-2xl mx-auto">
        <a href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400 hover:text-brand-600 mb-8"><ArrowLeft size={16} /> Robert Rich Garcia</a>
        <header className="mb-8">
          <p className="text-sm font-semibold text-brand-600 dark:text-cyber-blue mb-2">Client feedback</p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">How was your experience?</h1>
          <p className="mt-3 text-slate-600 dark:text-gray-400">Your feedback helps me improve my services. This should take about two minutes.</p>
        </header>

        <section className="bg-white dark:bg-[#10151d] rounded-2xl border border-slate-200 dark:border-cyber-gray p-6 sm:p-8 shadow-sm">
          {loading ? <div className="flex items-center gap-3 py-10"><Loader2 className="animate-spin" /> Loading your invitation…</div> : submitted ? (
            <div className="text-center py-12"><CheckCircle size={44} className="mx-auto text-emerald-500 mb-4" /><h2 className="text-2xl font-semibold">Thank you for your feedback.</h2><p className="text-slate-600 dark:text-gray-400 mt-2">{published ? 'Your feedback will appear on Robert’s portfolio shortly.' : 'Your feedback was saved privately so Robert can use it to improve his service.'}</p></div>
          ) : !invitation ? (
            <div className="py-8"><h2 className="text-xl font-semibold">Invitation unavailable</h2><p className="mt-2 text-slate-600 dark:text-gray-400">{error || 'This invitation link is invalid or has already been used.'}</p></div>
          ) : invitation.status !== 'requested' ? (
            <div className="py-8"><h2 className="text-xl font-semibold">Feedback already submitted</h2><p className="mt-2 text-slate-600 dark:text-gray-400">Thanks for taking the time to share your experience.</p></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="rounded-xl bg-slate-50 dark:bg-[#0b1017] p-4 text-sm"><p><span className="text-slate-500 dark:text-gray-400">For </span><strong>{invitation.client_name}</strong>{invitation.company_name ? ` · ${invitation.company_name}` : ''}</p><p className="mt-1 text-slate-600 dark:text-gray-400">Service: {invitation.service_type}</p></div>

              <p className="text-sm font-medium text-slate-500 dark:text-gray-400">Five quick questions</p>
              <fieldset>
                <legend className="font-semibold mb-3">1. How would you rate this service overall?</legend>
                <div className="flex gap-2" role="radiogroup" aria-label="Overall service rating">
                  {[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onClick={() => setRating(value)} aria-label={`${value} out of 5 stars`} aria-pressed={rating === value} className="p-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-500"><Star size={30} className={value <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-gray-600'} /></button>)}
                </div>
                <p className="text-xs text-slate-500 dark:text-gray-400 mt-2">{rating} out of 5</p>
              </fieldset>

              {([
                { key: 'communication', title: '2. How was communication during the project?', options: sampleAnswers.communication },
                { key: 'quality', title: '3. How would you describe the quality of the work?', options: sampleAnswers.quality },
                { key: 'fit', title: '4. How well did the service fit your needs?', options: sampleAnswers.fit },
                { key: 'result', title: '5. What changed for your team after the work?', options: sampleAnswers.result },
              ] as const).map(({ key, title, options }) => (
                <fieldset key={key}>
                  <legend className="font-semibold mb-3">{title}</legend>
                  <div className="space-y-2">
                    {options.map((option) => <label key={option} className={`flex items-start gap-3 rounded-xl border p-3.5 cursor-pointer ${answers[key] === option ? 'border-brand-500 bg-brand-50/50 dark:border-cyber-blue dark:bg-cyber-blue/5' : 'border-slate-200 dark:border-cyber-gray'}`}><input type="radio" name={key} value={option} checked={answers[key] === option} onChange={() => updateAnswer(key, option)} className="mt-1 accent-brand-600" /><span className="text-sm">{option}</span></label>)}
                  </div>
                </fieldset>
              ))}

              <div>
                <label htmlFor="video" className="block font-semibold mb-2">Optional video</label>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">Record a quick video here or upload one you already have. Skip this if you prefer.</p>
                <div className="flex flex-wrap gap-3">
                  {!recording ? <button type="button" onClick={() => void startRecording()} disabled={Boolean(videoFile)} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 dark:bg-cyber-blue px-4 py-2.5 text-sm font-medium text-white dark:text-cyber-dark disabled:opacity-50"><Mic size={16} /> Record video</button> : <button type="button" onClick={stopRecording} className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-medium text-white"><Square size={15} /> Stop recording</button>}
                  <label htmlFor="video" className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-cyber-gray px-4 py-2.5 text-sm font-medium cursor-pointer ${videoFile || recording ? 'opacity-50 pointer-events-none' : ''}`}><UploadCloud size={16} /> Upload video</label>
                  {videoFile && <button type="button" onClick={clearVideo} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 dark:border-cyber-gray px-4 py-2.5 text-sm"><Trash2 size={15} /> Remove video</button>}
                </div>
                {recording && <p className="mt-3 text-sm text-rose-600">Recording… select Stop recording when finished.</p>}
                {recording && <video autoPlay muted playsInline ref={(element) => { if (element && recordingStream && element.srcObject !== recordingStream) element.srcObject = recordingStream; }} className="mt-4 w-full max-h-80 rounded-xl bg-black" />}
                {recordingError && <p role="alert" className="mt-3 text-sm text-rose-600">{recordingError}</p>}
                <input id="video" type="file" accept="video/mp4,video/webm,video/quicktime" onChange={(event) => { const file = event.target.files?.[0] || null; if (file && file.size > 50 * 1024 * 1024) { setRecordingError('Video must be under 50 MB.'); return; } clearVideo(); setVideoFile(file); setVideoPreviewUrl(file ? URL.createObjectURL(file) : ''); event.currentTarget.value = ''; }} className="sr-only" />
                {videoPreviewUrl && <video controls playsInline src={videoPreviewUrl} className="mt-4 w-full max-h-80 rounded-xl bg-black" />}
              </div>

              <div>
                <label htmlFor="photo" className="block font-semibold mb-2">Add a profile photo <span className="font-normal text-slate-500">(optional)</span></label>
                <p className="text-sm text-slate-500 dark:text-gray-400 mb-3">You can skip this. Robert can add a photo later if you prefer.</p>
                <input id="photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setPhotoFile(event.target.files?.[0] || null)} className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 dark:file:bg-[#1b2430] file:px-4 file:py-2.5 file:text-sm file:font-medium" />
                {photoFile && <p className="mt-2 text-xs text-slate-500">Selected: {photoFile.name}</p>}
              </div>

              <label className="flex items-start gap-3 rounded-xl bg-slate-50 dark:bg-[#0b1017] p-4 text-sm"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} className="mt-1 accent-brand-600" /><span>I give permission for this feedback, my name, and my company name (if provided) to appear on Robert’s public portfolio. I understand it may be shown publicly.</span></label>
              {error && <p role="alert" className="text-sm text-rose-600">{error}</p>}
              <button type="submit" disabled={submitting} className="w-full rounded-xl bg-slate-900 dark:bg-cyber-blue px-5 py-3.5 font-semibold text-white dark:text-cyber-dark disabled:opacity-60">{submitting ? 'Sending…' : 'Submit feedback'}</button>
              <p className="text-xs text-slate-500 dark:text-gray-400 text-center">Your survey answers and optional video are only published when you give permission. Ratings below 4 stars remain private.</p>
            </form>
          )}
        </section>
      </div>
    </main>
  );
};
