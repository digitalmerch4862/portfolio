import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
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
  Check
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

export const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeBooking, setActiveBooking] = useState<BookingRecord | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // 1. Check Auth Session
  useEffect(() => {
    if (!supabase) {
      setLoadingAuth(false);
      return;
    }

    // Get current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingAuth(false);
    });

    // Listen to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoadingAuth(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const currentUserEmail = session?.user?.email?.toLowerCase() || '';
  const isAuthorized = currentUserEmail === ALLOWED_ADMIN_EMAIL.toLowerCase();

  // 2. Fetch Bookings from Supabase
  const fetchBookings = async () => {
    if (!supabase) return;
    setLoadingData(true);
    try {
      const { data, error } = await supabase
        .from('consultation_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching bookings:', error.message);
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthorized) {
      fetchBookings();
    }
  }, [isAuthorized]);

  // 3. Handle Google Login
  const handleGoogleSignIn = async () => {
    if (!supabase) {
      alert('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment variables.');
      return;
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/admin',
      },
    });
  };

  // 4. Handle Sign Out
  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
  };

  // 5. Update Status
  const handleUpdateStatus = async (id: string, newStatus: BookingRecord['status']) => {
    if (!supabase) return;
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        alert('Failed to update status: ' + error.message);
      } else {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
        if (activeBooking?.id === id) {
          setActiveBooking(prev => prev ? { ...prev, status: newStatus } : null);
        }
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // 6. Save Admin Notes
  const handleSaveNotes = async () => {
    if (!supabase || !activeBooking) return;
    setSavingNotes(true);
    setSaveSuccess(false);
    try {
      const { error } = await supabase
        .from('consultation_bookings')
        .update({ notes: editingNotes })
        .eq('id', activeBooking.id);

      if (error) {
        alert('Failed to save notes: ' + error.message);
      } else {
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

  // 7. Export CSV
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

  // Calculate Stats
  const totalCount = bookings.length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
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
            Sign in with your authorized Google account (<strong className="text-cyber-blue">{ALLOWED_ADMIN_EMAIL}</strong>) to manage CRM bookings.
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

  // Signed In, But Unauthorized
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-center items-center p-4 relative font-sans">
        <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-40"></div>
        
        <div className="relative z-10 w-full max-w-md bg-[#0d0d0d] border border-rose-900/60 p-8 rounded-3xl shadow-2xl text-center shadow-[0_0_30px_rgba(244,63,94,0.15)]">
          <div className="w-16 h-16 rounded-2xl bg-rose-950/40 border border-rose-800 text-rose-400 flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Access Denied</h1>
          <p className="text-sm text-gray-400 mb-2">
            You are signed in as:
          </p>
          <p className="text-sm font-mono text-rose-400 bg-rose-950/30 py-1.5 px-3 rounded-lg border border-rose-900/50 mb-6 inline-block">
            {currentUserEmail}
          </p>
          <p className="text-xs text-gray-500 mb-8 leading-relaxed">
            Only the hardcoded admin address (<strong className="text-cyber-blue">{ALLOWED_ADMIN_EMAIL}</strong>) is permitted to access this management console.
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold text-sm transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Switch / Sign Out</span>
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

  // Authorized Admin Dashboard
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans relative selection:bg-cyber-blue selection:text-cyber-dark">
      <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-40"></div>

      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-40 bg-[#0c0c0c]/90 backdrop-blur-md border-b border-cyber-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyber-blue/10 border border-cyber-blue/40 text-cyber-blue flex items-center justify-center neon-border">
                <Sparkles size={20} />
              </div>
              <div>
                <h1 className="font-bold text-lg text-white flex items-center gap-2">
                  <span>CRM Admin Console</span>
                  <span className="text-[10px] bg-cyber-blue/10 text-cyber-blue border border-cyber-blue/30 px-2 py-0.5 rounded-full uppercase font-mono">
                    Hardcoded Admin
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-8">
        
        {/* KPI Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-[#0e0e0e] border border-cyber-gray p-5 sm:p-6 rounded-2xl">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Bookings</span>
            <div className="text-3xl sm:text-4xl font-black text-white mt-2 font-mono">{totalCount}</div>
          </div>

          <div className="bg-[#0e0e0e] border border-amber-500/30 p-5 sm:p-6 rounded-2xl shadow-[0_0_15px_rgba(245,158,11,0.05)]">
            <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Pending Review</span>
            <div className="text-3xl sm:text-4xl font-black text-amber-400 mt-2 font-mono">{pendingCount}</div>
          </div>

          <div className="bg-[#0e0e0e] border border-emerald-500/30 p-5 sm:p-6 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <span className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">Confirmed Sessions</span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-2 font-mono">{confirmedCount}</div>
          </div>

          <div className="bg-[#0e0e0e] border border-cyber-blue/30 p-5 sm:p-6 rounded-2xl shadow-[0_0_15px_rgba(0,242,255,0.05)]">
            <span className="text-xs text-cyber-blue uppercase tracking-wider font-semibold">Completed Projects</span>
            <div className="text-3xl sm:text-4xl font-black text-cyber-blue mt-2 font-mono">{completedCount}</div>
          </div>
        </div>

        {/* Toolbar: Search, Filters & Export */}
        <div className="bg-[#0e0e0e] border border-cyber-gray p-4 sm:p-6 rounded-2xl flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: `All (${totalCount})` },
              { id: 'pending', label: `Pending (${pendingCount})` },
              { id: 'confirmed', label: `Confirmed (${confirmedCount})` },
              { id: 'completed', label: `Completed (${completedCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedStatus === tab.id
                    ? 'bg-cyber-blue text-cyber-dark shadow-[0_0_12px_rgba(0,242,255,0.3)]'
                    : 'bg-[#141414] text-gray-400 hover:text-white border border-cyber-gray'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search leads, email, company..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-[#141414] border border-cyber-gray text-white text-xs rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:border-cyber-blue transition-colors"
              />
            </div>

            <button
              onClick={fetchBookings}
              disabled={loadingData}
              title="Refresh Data"
              className="p-2.5 rounded-xl bg-[#141414] border border-cyber-gray text-gray-300 hover:text-cyber-blue hover:border-cyber-blue/50 transition-colors cursor-pointer"
            >
              <RefreshCw size={16} className={loadingData ? 'animate-spin text-cyber-blue' : ''} />
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 bg-[#141414] hover:bg-cyber-gray border border-cyber-gray text-gray-300 hover:text-white px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
          </div>
        </div>

        {/* Bookings List */}
        <div className="bg-[#0e0e0e] border border-cyber-gray rounded-2xl overflow-hidden">
          {loadingData ? (
            <div className="py-20 text-center text-gray-500 font-mono text-xs">
              <RefreshCw className="animate-spin mx-auto mb-2 text-cyber-blue" size={24} />
              <span>Fetching bookings from Supabase...</span>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-20 text-center text-gray-500 space-y-2">
              <FileText size={36} className="mx-auto text-gray-600 mb-2" />
              <p className="text-sm font-bold text-gray-300">No consultation bookings found</p>
              <p className="text-xs text-gray-500">New client bookings from your portfolio will appear here instantly.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141414] border-b border-cyber-gray text-gray-400 uppercase tracking-wider font-mono text-[10px]">
                  <tr>
                    <th className="py-4 px-6">Client / Company</th>
                    <th className="py-4 px-6">System Solution</th>
                    <th className="py-4 px-6">Preferred Schedule</th>
                    <th className="py-4 px-6">Platform</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyber-gray/50">
                  {filteredBookings.map(b => (
                    <tr key={b.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Client */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-white text-sm">{b.name}</div>
                        <div className="text-gray-400 flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} className="text-cyber-blue" />
                          <a href={`mailto:${b.email}`} className="hover:underline">{b.email}</a>
                        </div>
                        {b.company && (
                          <div className="text-gray-500 flex items-center gap-1 mt-0.5">
                            <Building2 size={12} />
                            <span>{b.company}</span>
                          </div>
                        )}
                      </td>

                      {/* Solution */}
                      <td className="py-4 px-6">
                        <span className="font-medium text-gray-200 block">{b.service_type}</span>
                        {b.bottleneck && (
                          <p className="text-gray-500 line-clamp-1 max-w-xs mt-0.5 text-[11px]">{b.bottleneck}</p>
                        )}
                      </td>

                      {/* Schedule */}
                      <td className="py-4 px-6">
                        <div className="font-medium text-emerald-400 flex items-center gap-1.5">
                          <Calendar size={13} />
                          <span>{b.preferred_date || 'Flexible Date'}</span>
                        </div>
                        <div className="text-gray-500 text-[11px] flex items-center gap-1.5 mt-0.5">
                          <Clock size={12} />
                          <span>{b.preferred_time_slot}</span>
                        </div>
                      </td>

                      {/* Platform */}
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 rounded-lg bg-[#141414] border border-cyber-gray text-gray-300 font-mono text-[11px]">
                          {b.meeting_platform || 'Google Meet'}
                        </span>
                      </td>

                      {/* Status Selector */}
                      <td className="py-4 px-6">
                        <select
                          value={b.status}
                          onChange={e => handleUpdateStatus(b.id, e.target.value as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-400'
                              : b.status === 'completed'
                              ? 'bg-cyber-blue/10 border-cyber-blue/40 text-cyber-blue'
                              : b.status === 'cancelled'
                              ? 'bg-rose-950/40 border-rose-800 text-rose-400'
                              : 'bg-amber-950/40 border-amber-700/60 text-amber-400'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {b.phone && (
                            <a
                              href={`https://wa.me/${b.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              title="Chat on WhatsApp"
                              className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-800 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                            >
                              <MessageSquare size={14} />
                            </a>
                          )}
                          <a
                            href={`mailto:${b.email}?subject=${encodeURIComponent(`Follow-up: Consultation Request for ${b.service_type}`)}`}
                            title="Send Email"
                            className="p-2 rounded-lg bg-[#141414] border border-cyber-gray text-gray-300 hover:text-cyber-blue hover:border-cyber-blue transition-colors"
                          >
                            <Mail size={14} />
                          </a>
                          <button
                            onClick={() => {
                              setActiveBooking(b);
                              setEditingNotes(b.notes || '');
                            }}
                            className="inline-flex items-center gap-1 bg-cyber-blue/10 hover:bg-cyber-blue hover:text-cyber-dark text-cyber-blue border border-cyber-blue/40 px-3 py-1.5 rounded-lg font-bold text-[11px] transition-all cursor-pointer"
                          >
                            <span>View Details</span>
                            <ChevronRight size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Detail & Notes Drawer Modal */}
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
              {/* Service & Problem */}
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
                {activeBooking.current_tools && (
                  <div>
                    <span className="text-gray-500 uppercase tracking-wider font-semibold text-[10px]">Current Tools Used</span>
                    <p className="text-gray-300 mt-0.5">{activeBooking.current_tools}</p>
                  </div>
                )}
              </div>

              {/* Schedule Details */}
              <div className="grid sm:grid-cols-3 gap-3">
                <div className="bg-[#141414] p-3 rounded-xl border border-cyber-gray">
                  <span className="text-gray-500 text-[10px]">Preferred Date</span>
                  <p className="text-emerald-400 font-bold mt-1">{activeBooking.preferred_date || 'Flexible'}</p>
                </div>
                <div className="bg-[#141414] p-3 rounded-xl border border-cyber-gray">
                  <span className="text-gray-500 text-[10px]">Time Window</span>
                  <p className="text-gray-200 font-medium mt-1">{activeBooking.preferred_time_slot}</p>
                </div>
                <div className="bg-[#141414] p-3 rounded-xl border border-cyber-gray">
                  <span className="text-gray-500 text-[10px]">Platform</span>
                  <p className="text-cyber-blue font-bold mt-1">{activeBooking.meeting_platform}</p>
                </div>
              </div>

              {/* Private Admin Notes */}
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Edit3 size={14} className="text-cyber-blue" />
                    <span>Private Admin Notes (Internal Only)</span>
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
                  placeholder="Record internal consultation notes, next steps, quote amount, or meeting link..."
                  className="w-full bg-[#141414] border border-cyber-gray text-white rounded-xl p-3.5 text-xs focus:outline-none focus:border-cyber-blue transition-colors"
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="bg-cyber-blue text-cyber-dark font-bold px-4 py-2 rounded-lg text-xs hover:bg-white transition-all cursor-pointer disabled:opacity-50 shadow-sm"
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
