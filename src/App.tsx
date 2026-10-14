import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  BarChart3,
  Settings,
  TrendingUp,
  CheckCircle,
  ExternalLink,
  Mail,
  MapPin,
  Moon,
  Sun,
  Layers,
  Workflow,
  MessageSquare,
  PhoneCall,
  CalendarCheck,
  Star,
} from 'lucide-react';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard } from './components/AdminDashboard';
import { ReviewPage } from './components/ReviewPage';

type PublicTestimonial = {
  id: string;
  client_name: string;
  client_role: string | null;
  company_name: string | null;
  avatar_url: string | null;
  service_type: string;
  testimonial_text: string | null;
  video_url: string | null;
  measurable_result: string | null;
  rating: number;
  created_at: string;
};

function App() {
  const currentPath = window.location.pathname;
  const [isAdminRoute, setIsAdminRoute] = useState(currentPath === '/admin2' || currentPath.startsWith('/admin2/'));
  const [isReviewRoute, setIsReviewRoute] = useState(currentPath.startsWith('/review'));

  const [isDark, setIsDark] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Custom Business Management System');
  const [featuredTestimonials, setFeaturedTestimonials] = useState<PublicTestimonial[]>([]);

  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path === '/admin2' || path.startsWith('/admin2/'));
      setIsReviewRoute(path.startsWith('/review'));
    };

    window.addEventListener('popstate', handleLocationCheck);
    return () => window.removeEventListener('popstate', handleLocationCheck);
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Fetch Featured Testimonials
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch('/api/public-testimonials');
        const result = await response.json();
        if (response.ok && result.success) setFeaturedTestimonials(result.data);
      } catch (err) {
        console.warn('Testimonial query notice:', err);
      }
    };
    fetchFeatured();
  }, []);

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  if (isReviewRoute) {
    return <ReviewPage />;
  }

  const toggleTheme = () => setIsDark(!isDark);

  const openBookingWithService = (serviceName?: string) => {
    if (serviceName) setSelectedService(serviceName);
    setIsBookingOpen(true);
  };

  const directEmailLink = "mailto:garciarobertrich@gmail.com";

  const skillCategories = [
    {
      category: "Business Systems & Operations",
      skills: ["Custom Business Systems", "Workflow Automation", "Process Optimization", "Records & Data Management", "Compliance & Data Privacy"]
    },
    {
      category: "Frontend & Full-Stack",
      skills: ["React", "TypeScript", "JavaScript", "Tailwind CSS", "Modern Web Architecture", "Responsive UI/UX"]
    },
    {
      category: "Data & Architecture",
      skills: ["Data Collation & Validation", "Database Structuring", "Tracking & Audit Trails", "Turnaround-Time Optimization"]
    },
    {
      category: "Automation & Integrations",
      skills: ["CRM & API Integrations", "Automated Reporting", "Document Generation", "Git & CI/CD Deployment"]
    }
  ];

  const featuredSolutions = [
    {
      title: "Custom Business Management Systems",
      icon: <Layers size={24} />,
      problem: "Fragmented spreadsheets and paper-based tracking lead to errors, missing records, and slow operations.",
      solution: "Centralized web-based platforms that digitize workflows, enforce data validation, and provide real-time operational visibility.",
      value: "Less manual work and clearer, more consistent processes."
    },
    {
      title: "Business Process & Workflow Automation",
      icon: <Workflow size={24} />,
      problem: "Repetitive manual data entry, document routing, and delayed stakeholder follow-ups eat up valuable team hours.",
      solution: "Automated pipelines that handle document verification, status notifications, and cross-platform data syncing.",
      value: "Fewer repetitive tasks and fewer opportunities for errors."
    },
    {
      title: "Operations Dashboards & Reporting Systems",
      icon: <BarChart3 size={24} />,
      problem: "Business owners lack clear, immediate insight into bottlenecks, pending deliverables, and team throughput.",
      solution: "Interactive dashboards that collate multi-source data into clear KPIs, turnaround metrics, and status monitors.",
      value: "A clearer view of current work, delays, and results."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-cyber-dark selection:bg-brand-500 dark:selection:bg-cyber-blue selection:text-white dark:selection:text-cyber-dark font-sans text-slate-900 dark:text-white relative transition-colors duration-300">
      <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-50"></div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        defaultService={selectedService}
      />

      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-cyber-dark/80 backdrop-blur-md border-b border-slate-200 dark:border-cyber-gray transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight text-slate-900 dark:text-white">
                Robert<span className="text-brand-600 dark:text-cyber-blue dark:neon-text">.</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">Solutions</a>
              <a href="#testimonials" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">Testimonials</a>
              <a href="#about" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">About</a>
              <a href="#skills" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">Skills</a>
              <a href="#resume" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">Background</a>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-slate-100 dark:bg-cyber-gray text-slate-600 dark:text-cyber-blue hover:bg-slate-200 dark:hover:bg-cyber-blue/20 transition-all dark:neon-border cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => openBookingWithService()}
                className="bg-brand-600 dark:bg-cyber-blue/10 border border-transparent dark:border-cyber-blue text-white dark:text-cyber-blue px-6 py-2.5 rounded-full font-medium hover:bg-brand-700 dark:hover:bg-cyber-blue dark:hover:text-cyber-dark transition-all dark:neon-border hover:shadow-lg dark:hover:shadow-[0_0_20px_#00f2ff] cursor-pointer"
              >
                Let's Talk
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">

            <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 dark:bg-cyber-blue/5 text-brand-600 dark:text-cyber-blue font-medium text-sm mb-6 border border-brand-100 dark:border-cyber-blue/30 dark:shadow-[0_0_15px_rgba(0,242,255,0.15)] transition-colors">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 dark:bg-cyber-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500 dark:bg-cyber-blue"></span>
                </span>
                Business systems developer
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight transition-colors">
                Practical software for <span className="text-brand-600 dark:text-cyber-blue dark:neon-text block mt-2">the way your business works.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-colors">
                I build straightforward web apps and automations that replace repetitive admin, organize information, and make everyday work easier to manage.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => openBookingWithService()}
                  className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-cyber-blue text-white dark:text-cyber-dark px-8 py-4 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg dark:shadow-[0_0_15px_rgba(0,242,255,0.4)] dark:hover:shadow-[0_0_25px_rgba(0,242,255,0.6)] cursor-pointer"
                >
                  <CalendarCheck size={20} />
                  <span>Consult On A System</span>
                  <ArrowRight size={18} />
                </button>
                <a href="https://my.dmerch.store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-cyber-gray/50 text-slate-700 dark:text-white border border-slate-200 dark:border-cyber-gray px-8 py-4 rounded-full font-semibold hover:bg-slate-50 hover:border-brand-300 dark:hover:border-cyber-blue dark:hover:text-cyber-blue transition-all">
                  Visit DigitalMerch Agency
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-video lg:aspect-[4/5] xl:aspect-square neon-border bg-slate-200 dark:bg-cyber-gray transition-colors cursor-pointer">
                <img
                  src="/hero-image.jpg"
                  alt="Robert Rich Garcia"
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-100 dark:opacity-60 dark:grayscale dark:group-hover:grayscale-0 dark:group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-cyber-dark via-transparent to-transparent opacity-80 pointer-events-none transition-opacity duration-700 group-hover:opacity-30"></div>
              </div>

              <div className="absolute -bottom-6 -left-6 sm:bottom-12 sm:-left-12 bg-white dark:bg-cyber-gray p-6 rounded-2xl max-w-xs border border-slate-100 dark:border-cyber-blue/30 hidden sm:block shadow-xl dark:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-100 dark:bg-cyber-blue/10 text-brand-600 dark:text-cyber-blue rounded-full flex items-center justify-center flex-shrink-0 neon-border transition-colors">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold text-lg transition-colors">Built for your workflow</p>
                    <p className="text-slate-500 dark:text-cyber-blue text-sm transition-colors">Useful, maintainable business software</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Testimonials / Client Impact Section */}
      <section id="testimonials" className="py-20 relative z-10 bg-slate-100/40 dark:bg-cyber-dark/40 border-y border-slate-100 dark:border-cyber-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-50 dark:bg-cyber-blue/5 border border-brand-100 dark:border-cyber-blue/30 text-brand-700 dark:text-cyber-blue text-xs font-medium mb-3">
              <MessageSquare size={12} />
              <span>Client testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Feedback from clients
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg">
              Shared with permission from the people I’ve worked with.
            </p>
          </div>

          {featuredTestimonials.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTestimonials.map((review) => (
                <div
                  key={review.id}
                  className="bg-white dark:bg-[#0d0d0d] border border-slate-200 dark:border-cyber-gray p-6 sm:p-8 rounded-3xl shadow-sm hover:shadow-xl dark:hover:border-cyber-blue/50 dark:hover:shadow-[0_0_25px_rgba(0,242,255,0.15)] transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Stars */}
                    {review.video_url && <video controls preload="metadata" className="w-full rounded-xl mb-4 bg-black" src={review.video_url} aria-label={`Video testimonial from ${review.client_name}`} />}
                    {review.testimonial_text && <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-700"}
                        />
                      ))}
                    </div>}

                    {/* Quote */}
                    {review.testimonial_text && <p className="text-slate-700 dark:text-gray-200 text-sm leading-relaxed mb-6 whitespace-pre-line">{review.testimonial_text}</p>}

                    {/* Measurable impact tag */}
                    {review.measurable_result && (
                      <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
                        <span className="font-bold block text-[10px] uppercase tracking-wider mb-0.5">Impact:</span>
                        {review.measurable_result}
                      </div>
                    )}
                  </div>

                  {/* Author Footer */}
                  <div className="pt-4 border-t border-slate-100 dark:border-cyber-gray/60 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-cyber-blue/10 border border-brand-200 dark:border-cyber-blue/30 text-brand-600 dark:text-cyber-blue flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {review.avatar_url ? (
                        <img src={review.avatar_url} alt={review.client_name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        review.client_name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.client_name}</h4>
                      <p className="text-xs text-slate-500 dark:text-gray-400">
                        {review.client_role ? `${review.client_role}, ` : ''}{review.company_name || 'Business Partner'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Empty state while the first testimonial is being collected */
            <div className="bg-white dark:bg-[#0e0e0e] rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-cyber-gray shadow-sm max-w-3xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-cyber-blue/10 border border-brand-200 dark:border-cyber-blue/30 text-brand-600 dark:text-cyber-blue flex items-center justify-center mx-auto mb-4 neon-border">
                <MessageSquare size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Client feedback will appear here.
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 max-w-xl mx-auto leading-relaxed">
                This section updates automatically when a client submits a testimonial and gives permission to share it.
              </p>
              <button
                onClick={() => openBookingWithService()}
                className="inline-flex items-center gap-2 bg-brand-600 dark:bg-cyber-blue text-white dark:text-cyber-dark px-7 py-3 rounded-full font-bold text-sm hover:bg-brand-700 dark:hover:bg-white transition-all shadow-md cursor-pointer"
              >
                <CalendarCheck size={16} />
                <span>Book Your System Consultation</span>
              </button>
            </div>
          )}
        </div>
      </section>


      {/* Solutions / Value Proposition */}
      <section id="services" className="py-24 border-y border-slate-100 dark:border-cyber-gray relative z-10 bg-white dark:bg-cyber-dark/50 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors">
              Business Systems & Solutions
            </h2>
            <p className="text-lg text-slate-600 dark:text-gray-400 transition-colors">
              I learn how your team works, then build software around the tasks and information that matter.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredSolutions.map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-slate-50 dark:bg-cyber-gray border border-slate-100 dark:border-cyber-gray hover:border-brand-300 dark:hover:border-cyber-blue/50 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all flex flex-col justify-between group">
                <div>
                  <div className="w-14 h-14 bg-white dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-brand-600 dark:text-cyber-blue rounded-xl flex items-center justify-center mb-6 group-hover:neon-border group-hover:scale-110 transition-all">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">{item.title}</h3>
                  <div className="space-y-3 mb-6">
                    <div>
                      <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">Business Problem</span>
                      <p className="text-sm text-slate-600 dark:text-gray-400 mt-0.5">{item.problem}</p>
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-brand-600 dark:text-cyber-blue uppercase tracking-wider">System Solution</span>
                      <p className="text-sm text-slate-700 dark:text-gray-300 mt-0.5">{item.solution}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 dark:border-cyber-gray/60 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Business Impact</span>
                    <p className="text-xs text-slate-600 dark:text-gray-400 mt-0.5">{item.value}</p>
                  </div>
                </div>
                <button
                  onClick={() => openBookingWithService(item.title)}
                  className="mt-4 w-full py-2.5 px-4 bg-slate-100 dark:bg-cyber-dark hover:bg-brand-600 hover:text-white dark:hover:bg-cyber-blue dark:hover:text-cyber-dark border border-slate-200 dark:border-cyber-gray text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck size={14} />
                  <span>Request This System</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Matrix */}
      <section id="skills" className="py-24 relative z-10 bg-slate-100/50 dark:bg-cyber-dark/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              Technical & Operational Capabilities
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-lg">
              Structured to bridge the gap between business operations and technical development.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            {skillCategories.map((group, i) => (
              <div key={i} className="bg-white dark:bg-cyber-gray p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-cyber-gray/80 shadow-sm hover:border-brand-300 dark:hover:border-cyber-blue/30 transition-all">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-brand-500 dark:bg-cyber-blue"></div>
                  {group.category}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="bg-slate-50 dark:bg-cyber-dark border border-slate-200/80 dark:border-cyber-gray text-slate-700 dark:text-gray-300 px-3.5 py-1.5 rounded-lg text-sm font-medium hover:border-brand-400 dark:hover:border-cyber-blue transition-colors">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Background & Summary Section */}
      <section id="resume" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-cyber-gray rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-cyber-gray hover:border-brand-200 dark:hover:border-cyber-blue/30 transition-colors duration-300 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-100 dark:bg-cyber-blue rounded-full blur-[120px] opacity-40 dark:opacity-20"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 pb-10 border-b border-slate-100 dark:border-cyber-dark transition-colors duration-300">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors">Robert Rich Garcia</h2>
                  <p className="text-xl text-brand-600 dark:text-cyber-blue font-medium dark:neon-text transition-colors">
                    Business Systems & Automation Developer
                  </p>
                </div>
                <div className="mt-6 md:mt-0 space-y-3 text-slate-500 dark:text-gray-400 transition-colors">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-brand-500 dark:text-cyber-blue" />
                    <span>Cabuyao, Laguna, Philippines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-brand-500 dark:text-cyber-blue" />
                    <a href={directEmailLink} className="hover:text-brand-600 dark:hover:text-cyber-blue transition-colors font-medium">
                      garciarobertrich@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-gray-400 mr-1">Direct Channels:</span>
                    <a href="https://www.facebook.com/robert.rich.garcia/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform shadow-sm" title="Message me on Facebook">
                      <span className="font-extrabold text-base leading-none">f</span>
                    </a>
                    <a href="viber://chat?number=%2B639175291018" className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform shadow-sm" title="Viber Chat">
                      <MessageSquare size={16} />
                    </a>
                    <a href="sms:+639175291018" className="p-2 rounded-lg bg-slate-100 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-brand-600 dark:text-cyber-blue hover:scale-110 transition-transform shadow-sm" title="Send SMS">
                      <MessageSquare size={16} />
                    </a>
                    <a href="tel:+639175291018" className="p-2 rounded-lg bg-slate-100 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-slate-700 dark:text-gray-300 hover:scale-110 transition-transform shadow-sm" title="Instant Direct Call">
                      <PhoneCall size={16} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="mb-10">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-cyber-dark border border-brand-200 dark:border-cyber-blue/50 text-brand-600 dark:text-cyber-blue flex items-center justify-center transition-colors">
                    <span className="font-bold">1</span>
                  </div>
                  Professional Summary
                </h3>
                <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed transition-colors">
                  I build business software and automations that help teams manage information and everyday processes. My work includes custom web apps, workflow improvements, dashboards, and integrations, shaped around each client's needs.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-cyber-dark border border-brand-200 dark:border-cyber-blue/50 text-brand-600 dark:text-cyber-blue flex items-center justify-center transition-colors">
                    <span className="font-bold">2</span>
                  </div>
                  Core Operational & System Strengths
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    "Transforming complex, manual requirements into intuitive web applications",
                    "Designing databases and trackers with strict data validation & privacy standards",
                    "Minimizing processing turnaround times through automated status & follow-up pipelines",
                    "Building clean, actionable dashboards that provide leadership with real-time operational insights"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3 bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray p-4 rounded-xl text-slate-700 dark:text-gray-300 text-sm">
                      <CheckCircle size={18} className="text-brand-500 dark:text-cyber-blue flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* CTA / Contact */}
      <section id="contact" className="py-24 bg-slate-900 dark:bg-cyber-dark text-white text-center relative z-10 border-t border-transparent dark:border-cyber-gray transition-colors duration-300">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-500 dark:bg-cyber-blue blur-[150px] opacity-10 rounded-full pointer-events-none transition-colors duration-300"></div>

          <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight">Ready to optimize your business operations?</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto transition-colors">
            Let's discuss how we can build custom digital systems, automate your manual workflows, and scale your operations together.
          </p>

          <div className="flex flex-col items-center gap-6">
            <button
              onClick={() => openBookingWithService()}
              className="inline-flex items-center gap-3 bg-brand-500 dark:bg-cyber-blue text-white dark:text-cyber-dark px-9 py-4 rounded-full font-bold text-lg hover:bg-brand-400 dark:hover:bg-white transition-all shadow-[0_0_25px_rgba(20,184,166,0.3)] dark:shadow-[0_0_25px_rgba(0,242,255,0.45)] hover:scale-105 cursor-pointer"
            >
              <CalendarCheck size={22} />
              <span>Book A System Consultation</span>
            </button>

            <div className="flex flex-wrap justify-center items-center gap-3 mt-2">
              <a
                href={directEmailLink}
                className="inline-flex items-center gap-2 bg-slate-800 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:border-brand-500 dark:hover:border-cyber-blue hover:text-white transition-all hover:scale-105 shadow-sm"
              >
                <Mail size={16} />
                Email Me Directly
              </a>
              <a
                href="https://www.facebook.com/robert.rich.garcia/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 text-blue-400 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-blue-600 hover:text-white transition-all hover:scale-105 shadow-sm"
              >
                <span className="font-extrabold text-lg leading-none">f</span>
                Message me on Facebook
              </a>
              <a
                href="viber://chat?number=%2B639175291018"
                className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 text-purple-400 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-purple-600 hover:text-white transition-all hover:scale-105 shadow-sm"
              >
                <MessageSquare size={18} />
                Viber Chat
              </a>
              <a
                href="sms:+639175291018"
                className="inline-flex items-center gap-2 bg-slate-800 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:border-cyber-blue hover:text-cyber-blue transition-all hover:scale-105 shadow-sm"
              >
                <MessageSquare size={18} />
                Send SMS
              </a>
              <a
                href="tel:+639175291018"
                className="inline-flex items-center gap-2 bg-slate-800 text-slate-200 border border-slate-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:border-cyber-blue hover:text-cyber-blue transition-all hover:scale-105 shadow-sm"
              >
                <PhoneCall size={18} />
                Direct Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 dark:bg-cyber-dark text-slate-500 text-center border-t border-slate-800 dark:border-cyber-gray relative z-10 transition-colors duration-300">
        <div className="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs gap-4">
          <p>© {new Date().getFullYear()} Robert Rich Garcia. All rights reserved.</p>
          <a href="/admin2" className="text-gray-600 hover:text-cyber-blue transition-colors font-mono">
            Admin Console →
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
