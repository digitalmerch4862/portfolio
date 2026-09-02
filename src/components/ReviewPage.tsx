import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Star, CheckCircle, Sparkles, Building2, User, Briefcase, TrendingUp, HelpCircle, ArrowLeft, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';

export const ReviewPage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [alreadySubmitted, setAlreadySubmitted] = useState(false);
  
  // Form State
  const [clientName, setClientName] = useState('');
  const [clientRole, setClientRole] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [serviceType, setServiceType] = useState('Custom Business System');
  const [rating, setRating] = useState(5);
  const [problemSolved, setProblemSolved] = useState('');
  const [measurableResult, setMeasurableResult] = useState('');
  const [testimonialText, setTestimonialText] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [consent, setConsent] = useState(true);
  
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get('token');
    setToken(t);

    if (!t) {
      setLoadingInitial(false);
      setNotFound(true);
      return;
    }

    const fetchRequestData = async () => {
      try {
        const { data, error } = await supabase
          .from('client_testimonials')
          .select('*')
          .eq('token', t)
          .single();

        if (error || !data) {
          setNotFound(true);
        } else {
          setClientName(data.client_name || '');
          setCompanyName(data.company_name || '');
          setServiceType(data.service_type || 'Custom Business System');
          if (data.status === 'submitted' || data.status === 'approved') {
            setAlreadySubmitted(true);
          }
        }
      } catch (err) {
        console.error('Error fetching review token data:', err);
        setNotFound(true);
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchRequestData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!testimonialText.trim()) {
      setErrorMessage('Please provide your testimonial feedback quote.');
      return;
    }
    if (!consent) {
      setErrorMessage('Please consent to featuring your review on the portfolio.');
      return;
    }

    setSubmitting(true);
    setErrorMessage('');

    try {
      // 1. Try via API
      let success = false;
      try {
        const res = await fetch('/api/submit-testimonial', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            client_name: clientName,
            client_role: clientRole,
            company_name: companyName,
            rating,
            problem_solved: problemSolved,
            measurable_result: measurableResult,
            testimonial_text: testimonialText,
            avatar_url: avatarUrl,
          }),
        });
        const result = await res.json();
        if (result.success) {
          success = true;
        }
      } catch (apiErr) {
        console.warn('API fallback to direct Supabase:', apiErr);
      }

      // 2. Direct Supabase fallback
      if (!success) {
        const { error } = await supabase
          .from('client_testimonials')
          .update({
            client_name: clientName,
            client_role: clientRole,
            company_name: companyName,
            rating,
            problem_solved: problemSolved,
            measurable_result: measurableResult,
            testimonial_text: testimonialText,
            avatar_url: avatarUrl || null,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
          })
          .eq('token', token);

        if (error) throw error;
      }

      setSubmittedSuccess(true);
    } catch (err: any) {
      console.error('Submission failed:', err);
      setErrorMessage(err.message || 'Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-cyber-blue" size={32} />
          <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">Loading feedback portal...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4 relative font-sans">
        <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-40"></div>
        <div className="relative z-10 max-w-md w-full bg-[#0d0d0d] border border-cyber-gray p-8 rounded-3xl text-center shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Invalid or Expired Link</h2>
          <p className="text-sm text-gray-400 mb-6 leading-relaxed">
            This review invitation link is invalid or has expired. If you worked with Robert, you can reach out directly.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-cyber-blue text-cyber-dark px-6 py-3 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-md"
          >
            <ArrowLeft size={16} />
            <span>Return to Portfolio</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative py-12 px-4 sm:px-6 lg:px-8 selection:bg-cyber-blue selection:text-cyber-dark">
      <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-40"></div>

      <div className="max-w-2xl mx-auto relative z-10">
        
        {/* Top Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-cyber-blue transition-colors mb-4">
            <ArrowLeft size={14} />
            <span>Robert Rich Garcia | Systems Developer</span>
          </a>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Client Experience & Feedback
          </h1>
          <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
            Your feedback on <strong className="text-cyber-blue">{serviceType}</strong> helps showcase the real business impact of our collaboration.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-[#0d0d0d] border border-cyber-gray rounded-3xl p-6 sm:p-10 shadow-2xl relative neon-border">
          
          {submittedSuccess || alreadySubmitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-950/50 border border-emerald-500/50 text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.3)] animate-bounce" style={{ animationDuration: '2s' }}>
                <CheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white">Thank You for Your Review!</h3>
              <p className="text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                Your testimonial has been recorded and will be featured on Robert's developer portfolio after quick review.
              </p>
              <div className="pt-6">
                <a
                  href="/"
                  className="inline-flex items-center gap-2 bg-cyber-blue text-cyber-dark px-7 py-3 rounded-full font-bold text-sm hover:bg-white transition-all shadow-lg"
                >
                  <ArrowLeft size={16} />
                  <span>View Public Portfolio</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 text-xs">
              
              {errorMessage && (
                <div className="p-3.5 bg-rose-950/40 border border-rose-800 text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Star Rating */}
              <div className="text-center pb-4 border-b border-cyber-gray">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
                  Overall Experience & Satisfaction
                </label>
                <div className="flex justify-center items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1.5 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      <Star
                        size={32}
                        className={
                          star <= rating
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                            : 'text-gray-600'
                        }
                      />
                    </button>
                  ))}
                </div>
                <span className="text-[11px] font-mono text-gray-400 mt-1 block">
                  {rating === 5 ? '⭐⭐⭐⭐⭐ Exceptional (5/5)' : `${rating} out of 5 Stars`}
                </span>
              </div>

              {/* Client Info */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full bg-[#141414] border border-cyber-gray text-white text-xs rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-cyber-blue transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                    Your Role / Job Title
                  </label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={clientRole}
                      onChange={e => setClientRole(e.target.value)}
                      placeholder="e.g. Founder, Operations Head, CEO"
                      className="w-full bg-[#141414] border border-cyber-gray text-white text-xs rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-cyber-blue transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Logistics, Digital Agency, etc."
                    className="w-full bg-[#141414] border border-cyber-gray text-white text-xs rounded-xl pl-9 pr-4 py-3 focus:outline-none focus:border-cyber-blue transition-colors"
                  />
                </div>
              </div>

              {/* Problem Solved */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <HelpCircle size={14} className="text-rose-400" />
                  <span>Before: What manual bottleneck or problem did we solve?</span>
                </label>
                <textarea
                  rows={2}
                  value={problemSolved}
                  onChange={e => setProblemSolved(e.target.value)}
                  placeholder="e.g. We were spending 4 hours a day manually reconciling orders across spreadsheets, which led to missing deliverables..."
                  className="w-full bg-[#141414] border border-cyber-gray text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-cyber-blue transition-colors"
                ></textarea>
              </div>

              {/* Measurable Results */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <TrendingUp size={14} className="text-emerald-400" />
                  <span>After: Measurable Impact or Business Result (Optional)</span>
                </label>
                <input
                  type="text"
                  value={measurableResult}
                  onChange={e => setMeasurableResult(e.target.value)}
                  placeholder="e.g. Saved 15 hours/week, 100% data accuracy, 2x faster order processing"
                  className="w-full bg-[#141414] border border-cyber-gray text-white text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-cyber-blue transition-colors"
                />
              </div>

              {/* Testimonial Quote */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Your Overall Review & Recommendation *
                </label>
                <textarea
                  rows={4}
                  required
                  value={testimonialText}
                  onChange={e => setTestimonialText(e.target.value)}
                  placeholder="Share your thoughts on working with Robert, his technical expertise, communication, and the quality of the system..."
                  className="w-full bg-[#141414] border border-cyber-gray text-white text-xs rounded-xl p-3.5 focus:outline-none focus:border-cyber-blue transition-colors"
                ></textarea>
              </div>

              {/* Optional Photo/Avatar URL */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-1.5">
                  Avatar / Profile Photo URL (Optional)
                </label>
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={e => setAvatarUrl(e.target.value)}
                  placeholder="https://... (e.g. LinkedIn or Google profile picture URL)"
                  className="w-full bg-[#141414] border border-cyber-gray text-white text-xs rounded-xl px-3.5 py-3 focus:outline-none focus:border-cyber-blue transition-colors"
                />
              </div>

              {/* Consent Toggle */}
              <div className="pt-2">
                <label className="flex items-start gap-3 cursor-pointer bg-[#141414] p-3.5 rounded-xl border border-cyber-gray">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-0.5 rounded text-cyber-blue focus:ring-0 focus:ring-offset-0 bg-[#0d0d0d] border-cyber-gray"
                  />
                  <span className="text-[11px] text-gray-300 leading-relaxed">
                    I grant permission to feature this review, my name, company, and feedback on Robert Rich Garcia's portfolio and professional profiles.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-cyber-blue hover:bg-white text-cyber-dark font-extrabold py-4 px-6 rounded-2xl text-sm transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)] hover:shadow-[0_0_30px_rgba(0,242,255,0.6)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Submitting Your Review...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      <span>Submit Testimonial & Review</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
