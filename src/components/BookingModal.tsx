import React, { useState, useMemo } from 'react';
import { X, Calendar, Clock, CheckCircle, ArrowRight, ArrowLeft, Loader2, Sparkles, Building2, User, Mail, Phone, Video, MessageSquare } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

const AVAILABLE_TIME_SLOTS = [
  '6:00 PM - 7:00 PM',
  '7:00 PM - 8:00 PM',
  '8:00 PM - 9:00 PM',
  '9:00 PM - 10:00 PM',
];

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  defaultService = 'Custom Business Management System'
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [adminNotificationSent, setAdminNotificationSent] = useState(false);
  const [clientConfirmationSent, setClientConfirmationSent] = useState(false);

  // Generate 2 business weeks (10 weekdays: Monday - Friday)
  const availableDates = useMemo(() => {
    const dates: Array<{ dateStr: string; displayDay: string; displayDate: string; fullDateLabel: string }> = [];
    const current = new Date();
    // If past 8 PM, start from tomorrow
    if (current.getHours() >= 20) {
      current.setDate(current.getDate() + 1);
    }

    while (dates.length < 10) {
      const dayOfWeek = current.getDay(); // 0 = Sun, 6 = Sat
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const dateStr = current.toISOString().split('T')[0];
        const displayDay = current.toLocaleDateString('en-US', { weekday: 'short' });
        const displayDate = current.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const fullDateLabel = current.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        dates.push({ dateStr, displayDay, displayDate, fullDateLabel });
      }
      current.setDate(current.getDate() + 1);
    }
    return dates;
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_type: defaultService,
    bottleneck: '',
    current_tools: '',
    preferred_date: availableDates[0]?.dateStr || '',
    preferred_time_slot: AVAILABLE_TIME_SLOTS[0],
    meeting_platform: 'Google Meet',
  });

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (step === 1) {
      if (!formData.name.trim() || !formData.email.trim()) {
        setErrorMessage('Please provide your name and email address.');
        return;
      }
    }
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setErrorMessage('');
    setStep(prev => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/book-consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok || !result?.success) throw new Error(result?.error || 'Unable to submit this booking. Please try again.');
      setReferenceId(result.bookingId || `BK-${Date.now().toString(36).toUpperCase()}`);
      setAdminNotificationSent(Boolean(result.adminNotificationSent));
      setClientConfirmationSent(Boolean(result.clientConfirmationSent));
      setSubmitted(true);
    } catch (err: any) {
      console.error('Booking submission error:', err);
      setErrorMessage(err instanceof Error ? `${err.message} You can also contact me on Facebook.` : 'Something went wrong submitting your booking. Please try again or contact me on Facebook.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSubmitted(false);
    setReferenceId('');
    setAdminNotificationSent(false);
    setClientConfirmationSent(false);
    setErrorMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleResetAndClose}
      ></div>

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-[#0c0c0c] border border-slate-200 dark:border-cyber-gray w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 my-8 transition-all dark:neon-border">
        
        {/* Header */}
        <div className="relative px-6 py-5 sm:px-8 border-b border-slate-100 dark:border-cyber-gray bg-slate-50/50 dark:bg-[#141414] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-cyber-blue/10 border border-brand-200 dark:border-cyber-blue/30 text-brand-600 dark:text-cyber-blue flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Book System Consultation</h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">Monday to Friday • 6:00 PM – 10:00 PM PHT</p>
            </div>
          </div>
          <button 
            onClick={handleResetAndClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-cyber-gray transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {!submitted ? (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8 max-w-md mx-auto">
                {[
                  { num: 1, label: 'Contact' },
                  { num: 2, label: 'System Needs' },
                  { num: 3, label: 'Schedule' },
                ].map((s, idx) => (
                  <React.Fragment key={s.num}>
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        step === s.num
                          ? 'bg-brand-600 dark:bg-cyber-blue text-white dark:text-cyber-dark shadow-md dark:shadow-[0_0_12px_#00f2ff]'
                          : step > s.num
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-cyber-gray text-slate-500 dark:text-gray-400'
                      }`}>
                        {step > s.num ? <CheckCircle size={14} /> : s.num}
                      </div>
                      <span className="text-[11px] font-medium text-slate-600 dark:text-gray-400 mt-1">{s.label}</span>
                    </div>
                    {idx < 2 && (
                      <div className={`flex-1 h-[2px] mx-2 -mt-4 transition-all ${
                        step > s.num ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-cyber-gray'
                      }`} />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {errorMessage && (
                <div className="mb-6 p-3.5 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
                  <X size={16} />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Step 1: Contact Details */}
              {step === 1 && (
                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. John Doe"
                        className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-cyber-blue transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@company.com"
                          className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-cyber-blue transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+63 9XX XXX XXXX"
                          className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-cyber-blue transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Company / Organization Name
                    </label>
                    <div className="relative">
                      <Building2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Acme Logistics or Startup Inc."
                        className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-cyber-blue transition-colors"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-brand-600 dark:bg-cyber-blue text-white dark:text-cyber-dark px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-700 dark:hover:bg-white transition-all shadow-md dark:shadow-[0_0_15px_rgba(0,242,255,0.3)] cursor-pointer"
                    >
                      <span>Next: System Needs</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: System Assessment */}
              {step === 2 && (
                <form onSubmit={handleNext} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Target System or Solution *
                    </label>
                    <select
                      name="service_type"
                      value={formData.service_type}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-cyber-blue transition-colors"
                    >
                      <option value="Custom Business Management System">Custom Business Management System</option>
                      <option value="Business Process & Workflow Automation">Business Process & Workflow Automation</option>
                      <option value="Operations Dashboard & Reporting System">Operations Dashboard & Reporting System</option>
                      <option value="CRM & Lead Management Pipeline">CRM & Lead Management Pipeline</option>
                      <option value="Full-Stack Web App Development">Full-Stack Web App Development</option>
                      <option value="Other Operational Optimization">Other Operational Optimization</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      What is your current bottleneck or problem to solve?
                    </label>
                    <textarea
                      name="bottleneck"
                      rows={3}
                      value={formData.bottleneck}
                      onChange={handleChange}
                      placeholder="e.g. We rely on manual spreadsheets to track order fulfillments and turnaround times, resulting in delays and errors..."
                      className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-slate-900 dark:text-white rounded-xl p-3.5 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-cyber-blue transition-colors"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      Current Tools / Software Used (Optional)
                    </label>
                    <input
                      type="text"
                      name="current_tools"
                      value={formData.current_tools}
                      onChange={handleChange}
                      placeholder="e.g. Google Sheets, Excel, Notion, Shopify"
                      className="w-full bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-slate-900 dark:text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-cyber-blue transition-colors"
                    />
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleBack}
                      className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 bg-brand-600 dark:bg-cyber-blue text-white dark:text-cyber-dark px-6 py-3 rounded-xl font-bold text-sm hover:bg-brand-700 dark:hover:bg-white transition-all shadow-md dark:shadow-[0_0_15px_rgba(0,242,255,0.3)] cursor-pointer"
                    >
                      <span>Next: Select Date & Time</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: 2-Week Calendar (Monday-Friday) & Evening Time Slots (6PM-10PM) */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Calendar Date Picker: 2-Week Window (10 Weekdays) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                        1. Select Available Date (Next 2 Weeks • Mon - Fri)
                      </label>
                      <span className="text-[10px] text-brand-600 dark:text-cyber-blue font-mono font-semibold">
                        Weekdays Only
                      </span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {availableDates.map(item => {
                        const isSelected = formData.preferred_date === item.dateStr;
                        return (
                          <button
                            key={item.dateStr}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, preferred_date: item.dateStr }))}
                            className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                              isSelected
                                ? 'border-brand-500 dark:border-cyber-blue bg-brand-600 dark:bg-cyber-blue text-white dark:text-cyber-dark font-bold shadow-md dark:shadow-[0_0_15px_rgba(0,242,255,0.4)] scale-102'
                                : 'border-slate-200 dark:border-cyber-gray bg-slate-50 dark:bg-[#141414] text-slate-700 dark:text-gray-300 hover:border-brand-300 dark:hover:border-cyber-blue/50'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">{item.displayDay}</span>
                            <span className="text-xs font-extrabold mt-0.5">{item.displayDate}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Evening Time Slots (6:00 PM - 10:00 PM) */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider">
                        2. Select Evening Time Slot (6:00 PM – 10:00 PM PHT)
                      </label>
                      <span className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 font-semibold">
                        <Clock size={12} />
                        1-Hour Sessions
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {AVAILABLE_TIME_SLOTS.map(slot => {
                        const isSelected = formData.preferred_time_slot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, preferred_time_slot: slot }))}
                            className={`py-3 px-2 rounded-xl border text-center text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'border-brand-500 dark:border-cyber-blue bg-brand-50 dark:bg-cyber-blue/15 text-brand-600 dark:text-cyber-blue dark:neon-border scale-102 shadow-sm'
                                : 'border-slate-200 dark:border-cyber-gray bg-slate-50 dark:bg-[#141414] text-slate-700 dark:text-gray-300 hover:border-slate-300 dark:hover:border-cyber-blue/40'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Meeting Platform */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      3. Preferred Meeting Platform
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['Google Meet', 'Zoom', 'Direct Phone'].map(platform => (
                        <button
                          key={platform}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, meeting_platform: platform }))}
                          className={`p-2.5 rounded-xl border text-xs font-medium transition-all text-center cursor-pointer ${
                            formData.meeting_platform === platform
                              ? 'border-brand-500 dark:border-cyber-blue bg-brand-50 dark:bg-cyber-blue/10 text-brand-600 dark:text-cyber-blue font-bold shadow-sm'
                              : 'border-slate-200 dark:border-cyber-gray text-slate-600 dark:text-gray-400 hover:border-slate-300'
                          }`}
                        >
                          {platform}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selected Summary Banner */}
                  <div className="p-3 bg-brand-50/60 dark:bg-cyber-blue/5 border border-brand-100 dark:border-cyber-blue/20 rounded-xl text-xs text-slate-600 dark:text-gray-300 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-brand-600 dark:text-cyber-blue uppercase font-bold block">Selected Slot:</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {availableDates.find(d => d.dateStr === formData.preferred_date)?.fullDateLabel || formData.preferred_date} • {formData.preferred_time_slot}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800">
                      Confirmed Open
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={handleBack}
                      disabled={loading}
                      className="inline-flex items-center gap-1.5 text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white text-sm font-medium cursor-pointer"
                    >
                      <ArrowLeft size={16} />
                      <span>Back</span>
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 bg-brand-600 dark:bg-cyber-blue text-white dark:text-cyber-dark px-7 py-3 rounded-xl font-bold text-sm hover:bg-brand-700 dark:hover:bg-white transition-all shadow-lg dark:shadow-[0_0_20px_rgba(0,242,255,0.4)] disabled:opacity-50 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Registering Booking...</span>
                        </>
                      ) : (
                        <>
                          <span>Confirm & Book Appointment</span>
                          <CheckCircle size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            /* Success Confirmation Screen */
            <div className="text-center py-6 sm:py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-700/60 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                <CheckCircle size={32} />
              </div>

              <div className="space-y-1">
                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Consultation Booked!</h4>
                <p className="text-sm text-slate-600 dark:text-gray-300 max-w-md mx-auto">
                  Thank you, <strong className="text-slate-900 dark:text-white">{formData.name}</strong>. Your session has been registered in our CRM.
                </p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-cyber-gray border border-slate-200 dark:border-cyber-gray/80 rounded-2xl max-w-md mx-auto text-left text-xs space-y-2">
                <div className="flex justify-between border-b border-slate-200 dark:border-cyber-dark pb-2">
                  <span className="text-slate-500 dark:text-gray-400">Reference Code:</span>
                  <span className="font-mono font-bold text-brand-600 dark:text-cyber-blue">{referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-gray-400">Target System:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formData.service_type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-gray-400">Confirmed Schedule:</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">
                    {availableDates.find(d => d.dateStr === formData.preferred_date)?.fullDateLabel || formData.preferred_date} ({formData.preferred_time_slot})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-gray-400">Platform:</span>
                  <span className="font-medium text-slate-900 dark:text-white">{formData.meeting_platform}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-gray-400 max-w-sm mx-auto">
                Your booking has been received. {clientConfirmationSent ? <>A confirmation email was sent to <strong>{formData.email}</strong>.</> : <>We could not confirm delivery of the confirmation email.</>} {adminNotificationSent ? 'Robert was notified by email.' : 'Please also message Robert on Facebook to confirm the request.'}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href="https://www.facebook.com/robert.rich.garcia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <MessageSquare size={16} />
                  <span>Message Robert on Facebook</span>
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="bg-slate-100 dark:bg-cyber-gray border border-slate-200 dark:border-cyber-gray text-slate-700 dark:text-white px-5 py-2.5 rounded-xl font-semibold text-xs hover:bg-slate-200 dark:hover:bg-cyber-blue/20 transition-colors cursor-pointer"
                >
                  Done & Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
