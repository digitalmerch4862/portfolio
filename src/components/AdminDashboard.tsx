import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { 
  ShieldCheck, 
  ShieldAlert, 
  LogOut, 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  Calendar, 
  Clock, 
  Building2, 
  Mail, 
  Phone, 
  Video, 
  MessageSquare, 
  FileText, 
  Download, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  Sparkles,
  ExternalLink,
  PhoneCall,
  Edit3,
  Check,
  Star,
  Send,
  Plus,
  Copy,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const ALLOWED_ADMIN_EMAIL = 'digitalmerch4862@gmail.com';

export interface BookingRecord {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  service_type: string;
  bottleneck: string | null;
  current_tools: string | null;
  preferred_date: string | null;
  preferred_time_slot: string | null;
  meeting_platform: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
}

export interface TestimonialRecord {
  id: string;
  created_at: string;
  submitted_at: string | null;
  booking_id: string | null;
  client_name: string;
  client_role: string | null;
  company_name: string | null;
  client_email: string;
  avatar_url: string | null;
  service_type: string;
  problem_solved: string | null;
  measurable_result: string | null;
  testimonial_text: string | null;
  rating: number;
  status: 'requested' | 'submitted' | 'approved' | 'rejected';
  is_featured: boolean;
  token: string;
  notes: string | null;
}

export const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'testimonials'>('bookings');
  
  // Bookings Data
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Testimonials Data
  const [testimonials, setTestimonials] = useState<TestimonialRecord[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [sendingRequest, setSendingRequest] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  
  // Testimonial Request Form State
  const [reqForm, setReqForm] = useState({
    client_name: '',
    client_email: '',
    company_name: '',
    service_type: 'Custom Business Management System',
    booking_id: '',
    notes: '',
  });

  // 1. Auth Check
  useEffect(() => {
    if (!supabase) {
      setLoadingAuth(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const currentUserEmail = session?.user?.email?.toLowerCase() || '';
  const isAuthorized = currentUserEmail === ALLOWED_ADMIN_EMAIL.toLowerCase();

  // 2. Fetch Data
  const fetchBookings = async () => {
    if (!supabase) return;
    setLoadingBookings(true);
    try {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching bookings:', error.message);
      else setBookings(data || []);
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchTestimonials = async () => {
    if (!supabase) return;
    setLoadingTestimonials(true);
    try {
      const { data, error } = await supabase
        .from('client_testimonials')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error('Error fetching testimonials:', error.message);
      else setTestimonials(data || []);
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchBookings();
      fetchTestimonials();
    }
  }, [isAuthorized]);

  // Google Login / Logout
  const handleGoogleSignIn = async () => {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin',
      },
    });
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  };

  // Update Booking Status
  const handleUpdateBookingStatus = async (id: string, newStatus: BookingRecord['status']) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (!error) {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        if (activeBooking?.id === id) {
          setActiveBooking(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // Save Booking Notes
  const handleSaveNotes = async () => {
    if (!supabase || !activeBooking) return;
    setSavingNotes(true);
    setSaveSuccess(false);
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({ notes: editingNotes })
        .eq('id', activeBooking.id);

      if (!error) {
        setBookings(prev => prev.map(b => b.id === activeBooking.id ? { ...b, notes: editingNotes } : b));
        setActiveBooking(prev => prev ? { ...prev, notes: editingNotes } : null);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Notes save error:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  // Pre-fill Testimonial Request Modal from Booking
  const openRequestFromBooking = (booking: BookingRecord) => {
    setReqForm({
      client_name: booking.name,
      client_email: booking.email,
      company_name: booking.company || '',
      service_type: booking.service_type,
      booking_id: booking.id,
      notes: `Requested for client ${booking.name}`,
    });
    setIsRequestModalOpen(true);
  };

  // Send Testimonial Request
  const handleSendTestimonialRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqForm.client_name || !reqForm.client_email) return;

    setSendingRequest(true);
    try {
      const res = await fetch('/api/send-testimonial-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqForm),
      });
      const data = await res.json();
      if (data.success) {
        alert(`Testimonial request successfully dispatched to ${reqForm.client_email}!`);
        setIsRequestModalOpen(false);
        fetchTestimonials();
        setReqForm({
          client_name: '',
          client_email: '',
          company_name: '',
          service_type: 'Custom Business Management System',
          booking_id: '',
          notes: '',
        });
      } else {
        alert('Notice: ' + (data.error || 'Failed to dispatch request.'));
      }
    } catch (err: any) {
      console.error('Error sending testimonial request:', err);
      alert('Error sending request: ' + err.message);
    } finally {
      setSendingRequest(false);
    }
  };

  // Toggle Feature on Portfolio
  const handleToggleFeatured = async (item: TestimonialRecord) => {
    if (!supabase) return;
    if (item.rating < 4) {
      alert("🔒 1 to 3-star reviews are strictly for your internal eyes only and cannot be featured publicly on your portfolio.");
      return;
    }
    const newFeatured = !item.is_featured;
    const newStatus = newFeatured ? 'approved' : item.status;

    try {
      const { error } = await supabase
        .from('client_testimonials')
        .update({ is_featured: newFeatured, status: newStatus })
        .eq('id', item.id);

      if (!error) {
        setTestimonials(prev => prev.map(t => t.id === item.id ? { ...t, is_featured: newFeatured, status: newStatus as any } : t));
      }
    } catch (err) {
      console.error('Error toggling featured status:', err);
    }
  };

  // Delete Testimonial
  const handleDeleteTestimonial = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial record?')) return;
    if (!supabase) return;
    try {
      const { error } = await supabase.from('client_testimonials').delete().eq('id', id);
      if (!error) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Error deleting testimonial:', err);
    }
  };

  // Copy Magic Link
  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/review?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Export CSV for Bookings
  const handleExportCSV = () => {
    if (bookings.length === 0) return;
    const headers = ['ID', 'Date Submitted', 'Client Name', 'Email', 'Phone', 'Company', 'Service', 'Preferred Date', 'Time Window', 'Platform', 'Status', 'Bottleneck', 'Notes'];
    const rows = bookings.map(b => [
      b.id,
      new Date(b.created_at).toLocaleString(),
      `"${b.name.replace(/"/g, '""')}"`,
      b.email,
      b.phone || '',
      `"${(b.company || '').replace(/"/g, '""')}"`,
      `"${b.service_type.replace(/"/g, '""')}"`,
      b.preferred_date || '',
      `"${(b.preferred_time_slot || '').replace(/"/g, '""')}"`,
      b.meeting_platform || '',
      b.status,
      `"${(b.bottleneck || '').replace(/"/g, '""')}"`,
      `"${(b.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter Bookings
  const filteredBookings = bookings.filter(b => {
    const matchesStatus = selectedStatus === 'all' || b.status === selectedStatus;
    const matchesSearch = 
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.company && b.company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.service_type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="animate-spin text-cyber-blue" size={32} />
          <p className="text-xs uppercase tracking-widest text-gray-400 font-mono">Authenticating CRM Protocol...</p>
        </div>
      </div>
    );
  }

  // Not Signed In Screen
  if (!session) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center p-4 relative font-sans">
        <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-40"></div>
        <div className="relative z-10 w-full max-w-md bg-[#0d0d0d] border border-cyber-gray p-8 rounded-3xl shadow-2xl text-center neon-border">
          <div className="w-16 h-16 rounded-2xl bg-cyber-blue/10 border border-cyber-blue/30 text-cyber-blue flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(0,242,255,0.2)]">
            <ShieldCheck size={32} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Admin Portal</h1>
          <p className="text-sm text-gray-400 mb-8">
            Sign in with authorized Google account (<strong className="text-cyber-blue">{ALLOWED_ADMIN_EMAIL}</strong>) to manage CRM & Testimonials.
          </p>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-slate-900 py-3.5 px-6 rounded-xl font-bold text-sm transition-all hover:scale-102 shadow-lg cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z" />
              <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
              <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3 0-.8.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z" />
              <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.8-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.2L1.9 16.5C3.7 20.2 7.5 23.5 12 23.5z" />
            </svg>
            <span>Sign In with Google</span>
          </button>

          <div className="mt-8 pt-6 border-t border-cyber-gray/60">
            <a href="/" className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyber-blue transition-colors">
              <ArrowLeft size={14} />
              <span>Return to Portfolio</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Unauthorized Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center p-4 relative font-sans">
        <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-40"></div>
        <div className="relative z-10 w-full max-w-md bg-[#0d0d0d] border border-rose-900/60 p-8 rounded-3xl shadow-2xl text-center shadow-[0_0_30px_rgba(244,63,94,0.15)]">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Access Denied</h1>
          <p className="text-sm text-gray-400 mb-2">You are signed in as:</p>
          <p className="text-sm font-mono text-rose-400 bg-rose-950/30 py-1.5 px-3 rounded-lg border border-rose-900/50 mb-6 inline-block">
            {currentUserEmail}
          </p>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            Only the hardcoded admin address (<strong className="text-cyber-blue">{ALLOWED_ADMIN_EMAIL}</strong>) is permitted to access this console.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Switch Account / Sign Out</span>
            </button>
            <a href="/" className="inline-flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-white pt-2">
              <ArrowLeft size={14} />
              <span>Back to Public Website</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Main Authorized Admin Interface
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative selection:bg-cyber-blue selection:text-cyber-dark">
      <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-40"></div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-cyber-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue flex items-center justify-center neon-border">
                <Sparkles size={20} />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white flex items-center gap-2">
                  <span>Robert's CRM & Testimonial Hub</span>
                  <span className="text-[10px] bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 px-2 py-0.5 rounded-full uppercase font-mono">
                    Admin
                  </span>
                </h1>
                <p className="text-xs text-gray-400">{currentUserEmail}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="/"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-cyber-blue transition-colors px-3 py-2 rounded-lg border border-transparent hover:border-cyber-gray"
              >
                <ArrowLeft size={14} />
                <span>View Live Site</span>
              </a>

              <button
                onClick={handleSignOut}
                className="inline-flex items-center gap-2 bg-cyber-gray hover:bg-rose-950/40 border border-cyber-gray hover:border-rose-800 text-gray-300 hover:text-rose-400 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <LogOut size={14} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Switcher Tabs */}
      <div className="border-b border-cyber-gray bg-[#0e0e0e]/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex gap-8">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`py-4 text-xs uppercase font-bold tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'bookings'
                ? 'border-cyber-blue text-cyber-blue drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Calendar size={16} />
            <span>Consultation Bookings ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('testimonials')}
            className={`py-4 text-xs uppercase font-bold tracking-wider border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'testimonials'
                ? 'border-cyber-blue text-cyber-blue drop-shadow-[0_0_8px_rgba(0,242,255,0.4)]'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Star size={16} className="text-amber-400" />
            <span>Testimonials & Reviews ({testimonials.length})</span>
          </button>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        
        {/* ================= TAB 1: CONSULTATION BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#0e0e0e] border border-cyber-gray p-5 rounded-2xl">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Inquiries</span>
                <div className="text-3xl font-black text-white mt-1 font-mono">{bookings.length}</div>
              </div>
              <div className="bg-[#0e0e0e] border border-amber-500/30 p-5 rounded-2xl">
                <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Pending Review</span>
                <div className="text-3xl font-black text-amber-400 mt-1 font-mono">{bookings.filter(b => b.status === 'pending').length}</div>
              </div>
              <div className="bg-[#0e0e0e] border border-emerald-500/30 p-5 rounded-2xl">
                <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Confirmed</span>
                <div className="text-3xl font-black text-emerald-400 mt-1 font-mono">{bookings.filter(b => b.status === 'confirmed').length}</div>
              </div>
              <div className="bg-[#0e0e0e] border border-cyber-blue/30 p-5 rounded-2xl">
                <span className="text-xs text-cyber-blue uppercase tracking-wider font-semibold">Completed</span>
                <div className="text-3xl font-black text-cyber-blue mt-1 font-mono">{bookings.filter(b => b.status === 'completed').length}</div>
              </div>
            </div>

            {/* Bookings Toolbar */}
            <div className="bg-[#0e0e0e] border border-cyber-gray p-4 rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'confirmed', 'completed'].map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedStatus(st)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
                      selectedStatus === st
                        ? 'bg-cyber-blue text-cyber-dark shadow-[0_0_12px_rgba(0,242,255,0.3)]'
                        : 'bg-[#141414] text-gray-400 hover:text-white border border-cyber-gray'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1 sm:w-64">
                  <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full bg-[#141414] border border-cyber-gray text-white text-xs rounded-xl pl-9 pr-4 py-2 focus:outline-none focus:border-cyber-blue transition-colors"
                  />
                </div>
                <button
                  onClick={fetchBookings}
                  className="p-2 rounded-xl bg-[#141414] border border-cyber-gray text-gray-300 hover:text-cyber-blue transition-colors"
                >
                  <RefreshCw size={14} className={loadingBookings ? 'animate-spin text-cyber-blue' : ''} />
                </button>
                <button
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 bg-[#141414] hover:bg-cyber-gray border border-cyber-gray text-gray-300 hover:text-white px-3 py-2 rounded-xl text-xs font-bold transition-colors"
                >
                  <Download size={13} />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-[#0e0e0e] border border-cyber-gray rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#141414] border-b border-cyber-gray text-gray-400 uppercase tracking-wider font-mono text-[10px]">
                    <tr>
                      <th className="py-4 px-6">Client / Company</th>
                      <th className="py-4 px-6">Solution</th>
                      <th className="py-4 px-6">Schedule</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyber-gray/50">
                    {filteredBookings.map(b => (
                      <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white text-sm">{b.name}</div>
                          <div className="text-gray-400 text-[11px]">{b.email} • {b.company || 'Direct Client'}</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-medium text-gray-200">{b.service_type}</span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-emerald-400 font-medium">{b.preferred_date || 'Flexible'}</div>
                          <div className="text-gray-500 text-[11px]">{b.preferred_time_slot}</div>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={b.status}
                            onChange={e => handleUpdateBookingStatus(b.id, e.target.value as any)}
                            className="bg-[#141414] border border-cyber-gray rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none focus:border-cyber-blue"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Request Testimonial Quick Button */}
                            <button
                              onClick={() => openRequestFromBooking(b)}
                              title="Send Testimonial Request Email to Client"
                              className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500 hover:text-black border border-amber-500/30 text-amber-400 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer"
                            >
                              <Star size={12} />
                              <span>Request Review</span>
                            </button>

                            <button
                              onClick={() => {
                                setActiveBooking(b);
                                setEditingNotes(b.notes || '');
                              }}
                              className="p-1.5 rounded-lg bg-[#141414] border border-cyber-gray text-gray-300 hover:text-cyber-blue transition-colors"
                            >
                              <ChevronRight size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ================= TAB 2: TESTIMONIALS & REVIEWS ================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#0e0e0e] border border-cyber-gray p-4 sm:p-6 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Star className="text-amber-400 fill-amber-400" size={18} />
                  <span>Client Testimonials & Feedback Hub</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Request reviews via Resend, moderate submitted responses, and feature approved testimonials on your portfolio.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchTestimonials}
                  className="p-2.5 rounded-xl bg-[#141414] border border-cyber-gray text-gray-300 hover:text-cyber-blue transition-colors cursor-pointer"
                >
                  <RefreshCw size={16} className={loadingTestimonials ? 'animate-spin text-cyber-blue' : ''} />
                </button>
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-cyber-blue text-cyber-dark px-5 py-2.5 rounded-xl font-extrabold text-xs hover:bg-white transition-all shadow-[0_0_15px_rgba(0,242,255,0.4)] cursor-pointer"
                >
                  <Send size={14} />
                  <span>Request New Testimonial</span>
                </button>
              </div>
            </div>

            {/* Testimonials List */}
            {loadingTestimonials ? (
              <div className="py-20 text-center text-gray-500 font-mono text-xs">
                <RefreshCw className="animate-spin mx-auto mb-2 text-cyber-blue" size={24} />
                <span>Loading testimonials...</span>
              </div>
            ) : testimonials.length === 0 ? (
              <div className="bg-[#0e0e0e] border border-cyber-gray rounded-2xl p-12 text-center text-gray-400 space-y-3">
                <Star size={40} className="mx-auto text-gray-600 mb-2" />
                <h3 className="text-base font-bold text-white">No Testimonials Yet</h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto">
                  Click <strong>"Request New Testimonial"</strong> or click <strong>"Request Review"</strong> from a completed booking to dispatch an automated feedback email via Resend.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                {testimonials.map(t => (
                  <div
                    key={t.id}
                    className={`bg-[#0d0d0d] border p-5 sm:p-6 rounded-2xl flex flex-col justify-between transition-all ${
                      t.is_featured
                        ? 'border-cyber-blue/60 shadow-[0_0_20px_rgba(0,242,255,0.15)] bg-gradient-to-br from-[#0d0d0d] to-[#00f2ff]/5'
                        : 'border-cyber-gray'
                    }`}
                  >
                    <div>
                      {/* Top Row: Status & Feature Badge */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold border ${
                            t.status === 'approved'
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                              : t.status === 'submitted'
                              ? 'bg-amber-950/40 border-amber-500/50 text-amber-400'
                              : 'bg-slate-800 border-slate-700 text-gray-400'
                          }`}>
                            {t.status}
                          </span>

                          {t.rating <= 3 && t.status === 'submitted' && (
                            <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold bg-rose-950/40 border border-rose-800 text-rose-400 flex items-center gap-1">
                              🔒 Private Internal (Eyes Only)
                            </span>
                          )}

                          {t.is_featured && t.rating >= 4 && (
                            <span className="text-[10px] uppercase font-mono px-2.5 py-0.5 rounded-full font-bold bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue flex items-center gap-1">
                              <Sparkles size={10} />
                              Live on Portfolio
                            </span>
                          )}
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star
                              key={s}
                              size={14}
                              className={s <= t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-700'}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Client Info */}
                      <div className="mb-3">
                        <h4 className="text-base font-bold text-white">{t.client_name}</h4>
                        <p className="text-xs text-gray-400">
                          {t.client_role ? `${t.client_role} • ` : ''}{t.company_name || 'Individual'}
                        </p>
                        <span className="text-[11px] text-cyber-blue font-mono mt-0.5 block">{t.service_type}</span>
                      </div>

                      {/* Testimonial Quote */}
                      {t.testimonial_text ? (
                        <div className="bg-[#141414] p-3.5 rounded-xl border border-cyber-gray/80 text-xs text-gray-200 italic mb-3 leading-relaxed">
                          "{t.testimonial_text}"
                        </div>
                      ) : (
                        <div className="bg-[#141414] p-3 rounded-xl border border-cyber-gray/40 text-xs text-gray-500 mb-3 font-mono">
                          Feedback link dispatched. Awaiting client submission.
                        </div>
                      )}

                      {/* Measurable Result / Problem */}
                      {t.measurable_result && (
                        <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2 rounded-lg border border-emerald-900/50 mb-3">
                          <strong>Measurable Result:</strong> {t.measurable_result}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Buttons */}
                    <div className="pt-4 border-t border-cyber-gray/60 flex flex-wrap items-center justify-between gap-2 text-xs">
                      {/* Feature on Portfolio Toggle */}
                      <button
                        onClick={() => handleToggleFeatured(t)}
                        disabled={!t.testimonial_text}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          t.is_featured
                            ? 'bg-cyber-blue text-cyber-dark hover:bg-white shadow-[0_0_10px_rgba(0,242,255,0.4)]'
                            : 'bg-[#141414] text-gray-300 hover:text-cyber-blue border border-cyber-gray disabled:opacity-40'
                        }`}
                      >
                        {t.is_featured ? <EyeOff size={13} /> : <Eye size={13} />}
                        <span>{t.is_featured ? 'Unfeature from Site' : 'Feature on Portfolio'}</span>
                      </button>

                      <div className="flex items-center gap-2">
                        {/* Copy Magic Link */}
                        <button
                          onClick={() => handleCopyLink(t.token)}
                          className="inline-flex items-center gap-1 bg-[#141414] hover:bg-cyber-gray border border-cyber-gray text-gray-300 px-2.5 py-1.5 rounded-lg font-mono text-[11px] cursor-pointer"
                          title="Copy Feedback Magic Link"
                        >
                          {copiedToken === t.token ? (
                            <>
                              <Check size={12} className="text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-1.5 text-gray-500 hover:text-rose-400 rounded-lg hover:bg-rose-950/30 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </div>
        )}

      </main>

      {/* ================= REQUEST TESTIMONIAL MODAL ================= */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0d0d0d] border border-cyber-gray w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative neon-border">
            <div className="flex justify-between items-start pb-4 border-b border-cyber-gray mb-6">
              <div>
                <span className="text-[10px] font-mono text-cyber-blue uppercase tracking-widest">Feedback Loop</span>
                <h3 className="text-xl font-bold text-white mt-1">Request Testimonial</h3>
                <p className="text-xs text-gray-400">Dispatches an automated email to client with magic feedback link.</p>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-cyber-gray cursor-pointer"
              >
                <XCircle size={20} />
              </button>
            </div>

            <form onSubmit={handleSendTestimonialRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  value={reqForm.client_name}
                  onChange={e => setReqForm(prev => ({ ...prev, client_name: e.target.value }))}
                  placeholder="e.g. John Smith"
                  className="w-full bg-[#141414] border border-cyber-gray text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyber-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">Client Email Address *</label>
                <input
                  type="email"
                  required
                  value={reqForm.client_email}
                  onChange={e => setReqForm(prev => ({ ...prev, client_email: e.target.value }))}
                  placeholder="client@company.com"
                  className="w-full bg-[#141414] border border-cyber-gray text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyber-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={reqForm.company_name}
                  onChange={e => setReqForm(prev => ({ ...prev, company_name: e.target.value }))}
                  placeholder="e.g. Apex Logistics Corp."
                  className="w-full bg-[#141414] border border-cyber-gray text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyber-blue"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 uppercase tracking-wider mb-1">System Solution Delivered *</label>
                <select
                  value={reqForm.service_type}
                  onChange={e => setReqForm(prev => ({ ...prev, service_type: e.target.value }))}
                  className="w-full bg-[#141414] border border-cyber-gray text-white rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-cyber-blue"
                >
                  <option value="Custom Business Management System">Custom Business Management System</option>
                  <option value="Business Process & Workflow Automation">Business Process & Workflow Automation</option>
                  <option value="Operations Dashboard & Reporting System">Operations Dashboard & Reporting System</option>
                  <option value="CRM & Lead Management Pipeline">CRM & Lead Management Pipeline</option>
                  <option value="Full-Stack Web App Development">Full-Stack Web App Development</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsRequestModalOpen(false)}
                  className="px-4 py-2.5 bg-[#141414] border border-cyber-gray text-gray-300 rounded-xl font-bold hover:bg-cyber-gray"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingRequest}
                  className="inline-flex items-center gap-2 bg-cyber-blue text-cyber-dark px-6 py-2.5 rounded-xl font-extrabold hover:bg-white transition-all shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {sendingRequest ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Sending Email...</span>
                    </>
                  ) : (
                    <>
                      <Send size={14} />
                      <span>Send Request via Resend</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking Detail Modal */}
      {activeBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#0d0d0d] border border-cyber-gray w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative neon-border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-4 border-b border-cyber-gray mb-6">
              <div>
                <span className="text-[10px] font-mono text-cyber-blue uppercase tracking-widest">Inquiry Details</span>
                <h3 className="text-xl font-bold text-white mt-1">{activeBooking.name}</h3>
                <p className="text-xs text-gray-400">{activeBooking.email} • {activeBooking.phone || 'No phone'}</p>
              </div>
              <button
                onClick={() => setActiveBooking(null)}
                className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-cyber-gray"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="space-y-6 text-xs">
              <div className="bg-[#141414] p-4 rounded-xl border border-cyber-gray space-y-3">
                <div>
                  <span className="text-gray-500 uppercase tracking-wider font-semibold text-[10px]">Target Solution</span>
                  <p className="text-sm font-bold text-white mt-0.5">{activeBooking.service_type}</p>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider font-semibold text-[10px]">Operational Bottleneck / Problem</span>
                  <p className="text-gray-200 mt-1 leading-relaxed bg-[#0a0a0a] p-3 rounded-lg border border-cyber-gray/60 whitespace-pre-wrap">
                    {activeBooking.bottleneck || 'No detailed bottleneck provided.'}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Edit3 size={14} className="text-cyber-blue" />
                    <span>Private Admin Notes</span>
                  </span>
                  {saveSuccess && (
                    <span className="text-emerald-400 text-xs flex items-center gap-1 font-normal">
                      <Check size={14} /> Saved!
                    </span>
                  )}
                </label>
                <textarea
                  rows={4}
                  value={editingNotes}
                  onChange={e => setEditingNotes(e.target.value)}
                  placeholder="Record internal consultation notes, next steps, quote amount..."
                  className="w-full bg-[#141414] border border-cyber-gray text-white rounded-xl p-3.5 text-xs focus:outline-none focus:border-cyber-blue transition-colors"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="bg-cyber-blue text-cyber-dark font-bold px-4 py-2 rounded-lg text-xs hover:bg-white transition-all cursor-pointer disabled:opacity-50"
                  >
                    {savingNotes ? 'Saving...' : 'Save Notes'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
