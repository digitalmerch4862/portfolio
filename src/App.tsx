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
  Quote,
  Sparkles
} from 'lucide-react';
import { BookingModal } from './components/BookingModal';
import { AdminDashboard, TestimonialRecord } from './components/AdminDashboard';
import { ReviewPage } from './components/ReviewPage';
import { supabase } from './lib/supabase';

const WhatsAppIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.818-.981zm10.741-7.466c-.07-.117-.26-.187-.544-.328-.285-.141-1.688-.832-1.949-.927-.261-.094-.452-.141-.643.141-.191.282-.741.927-.909 1.115-.168.188-.337.212-.621.071-.284-.141-1.2-.442-2.285-1.409-.844-.752-1.414-1.681-1.58-1.963-.166-.282-.018-.435.123-.575.127-.126.284-.329.426-.493.142-.165.19-.282.285-.47.095-.188.047-.353-.024-.494-.071-.141-.643-1.551-.881-2.124-.231-.557-.468-.481-.643-.49-.166-.008-.356-.01-.545-.01-.19 0-.498.071-.759.353-.261.282-1.002.979-1.002 2.388 0 1.41 1.026 2.771 1.168 2.96.143.188 2.019 3.084 4.891 4.325.683.295 1.217.471 1.633.603.687.218 1.312.187 1.807.114.551-.082 1.688-.69 1.926-1.356.237-.666.237-1.237.166-1.356z"/>
  </svg>
);

const ViberIcon = ({ size = 20, className = "" }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.78 3.52C17.65 1.54 14.73.57 11.75.57c-6.19 0-11.2 4.7-11.2 10.5 0 3.23 1.53 6.13 3.99 8.08v3.52l3.41-1.87c1.19.33 2.45.51 3.75.51 6.19 0 11.2-4.7 11.2-10.5 0-2.82-1.12-5.46-3.12-7.27zm-1.07 13.1c-.24.71-1.39 1.34-1.95 1.38-.52.04-1.17.06-3.74-.99-3.1-1.26-5.1-4.42-5.26-4.63-.15-.2-1.26-1.68-1.26-3.21 0-1.53.8-2.28 1.09-2.59.29-.31.63-.39.84-.39.21 0 .42 0 .61.01.2.01.47-.08.73.56.27.65.91 2.23.99 2.4.08.17.13.37.03.58-.11.21-.16.34-.32.53-.16.19-.34.42-.48.56-.16.16-.33.34-.14.67.19.33.85 1.4 1.82 2.27 1.25 1.11 2.3 1.46 2.63 1.62.33.17.52.14.72-.08.19-.23.82-.96 1.04-1.29.22-.33.44-.27.74-.16.3.11 1.91.9 2.24 1.06.33.17.55.25.63.39.08.14.08.82-.16 1.53z"/>
  </svg>
);

function App() {
  const currentPath = window.location.pathname;
  const [isAdminRoute, setIsAdminRoute] = useState(currentPath.startsWith('/admin'));
  const [isReviewRoute, setIsReviewRoute] = useState(currentPath.startsWith('/review'));
  
  const [isDark, setIsDark] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedService, setSelectedService] = useState('Custom Business Management System');
  const [featuredTestimonials, setFeaturedTestimonials] = useState<TestimonialRecord[]>([]);

  useEffect(() => {
    const handleLocationCheck = () => {
      const path = window.location.pathname;
      setIsAdminRoute(path.startsWith('/admin'));
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
        const { data, error } = await supabase
          .from('client_testimonials')
          .select('*')
          .eq('is_featured', true)
          .eq('status', 'approved')
          .gte('rating', 4)
          .order('created_at', { ascending: false });

        if (!error && data) {
          setFeaturedTestimonials(data);
        }
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
      value: "Reduces manual workload, ensures audit compliance, and creates scalable standard operating procedures."
    },
    {
      title: "Business Process & Workflow Automation",
      icon: <Workflow size={24} />,
      problem: "Repetitive manual data entry, document routing, and delayed stakeholder follow-ups eat up valuable team hours.",
      solution: "Automated pipelines that handle document verification, status notifications, and cross-platform data syncing.",
      value: "Cuts processing turnaround times and minimizes human error in day-to-day administrative tasks."
    },
    {
      title: "Operations Dashboards & Reporting Systems",
      icon: <BarChart3 size={24} />,
      problem: "Business owners lack clear, immediate insight into bottlenecks, pending deliverables, and team throughput.",
      solution: "Interactive dashboards that collate multi-source data into clear KPIs, turnaround metrics, and status monitors.",
      value: "Empowers leadership with actionable data to make informed operational decisions and improve sales conversions."
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
              <a href="#testimonials" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">Client Impact</a>
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
                Business Systems & Automation Developer
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight transition-colors">
                Building custom systems that <span className="text-brand-600 dark:text-cyber-blue dark:neon-text block mt-2">streamline operations & scale businesses.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-colors">
                I design and build tailored business systems that eliminate repetitive manual tasks, organize complex data, and solve core operational bottlenecks using modern web technologies.
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
              
              <div className="absolute -bottom-6 -left-6 sm:bottom-12 sm:-left-12 bg-white dark:bg-cyber-gray p-6 rounded-2xl max-w-xs border border-slate-100 dark:border-cyber-blue/30 hidden sm:block animate-bounce shadow-xl dark:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-100 dark:bg-cyber-blue/10 text-brand-600 dark:text-cyber-blue rounded-full flex items-center justify-center flex-shrink-0 neon-border transition-colors">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold text-lg transition-colors">15+ Years</p>
                    <p className="text-slate-500 dark:text-cyber-blue text-sm transition-colors">Operations & System Experience</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
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
              I don’t just write code—I analyze how your business functions and develop practical digital systems that solve real operational bottlenecks.
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

      {/* Testimonials / Client Impact Section */}
      <section id="testimonials" className="py-24 relative z-10 bg-slate-100/40 dark:bg-cyber-dark/40 border-b border-slate-100 dark:border-cyber-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono mb-3">
              <Star size={12} className="fill-amber-400" />
              <span>Real Client Impact & Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
              What Business Owners Say
            </h2>
            <p className="text-slate-600 dark:text-gray-400 text-base sm:text-lg">
              Practical software and automation solutions that solve actual bottlenecks and deliver measurable results.
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
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={16}
                          className={s <= review.rating ? "text-amber-400 fill-amber-400" : "text-gray-300 dark:text-gray-700"}
                        />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-slate-700 dark:text-gray-200 text-sm leading-relaxed mb-6 italic">
                      "{review.testimonial_text}"
                    </p>

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
            /* Graceful Placeholder when building portfolio testimonials */
            <div className="bg-white dark:bg-[#0e0e0e] rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-cyber-gray shadow-sm max-w-3xl mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-cyber-blue/10 border border-brand-200 dark:border-cyber-blue/30 text-brand-600 dark:text-cyber-blue flex items-center justify-center mx-auto mb-4 neon-border">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Proven Track Record in Operations & Systems
              </h3>
              <p className="text-sm text-slate-600 dark:text-gray-400 mb-6 max-w-xl mx-auto leading-relaxed">
                With over 15+ years managing data integrity, operational processes, and compliance, I help founders and teams build digital tools that replace manual chaos with reliable workflows.
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
                    <a href="https://wa.me/639175291018" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-600 dark:text-emerald-400 hover:scale-110 transition-transform shadow-sm" title="WhatsApp Message">
                      <WhatsAppIcon size={16} />
                    </a>
                    <a href="viber://chat?number=%2B639175291018" className="p-2 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform shadow-sm" title="Viber Chat">
                      <ViberIcon size={16} />
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
                  Business Systems Developer with over <strong>15+ years of background in operational data management, documentation, and compliance</strong>, specializing in designing custom web systems and automated workflows that solve real business bottlenecks. I bridge the gap between business operations and modern software—turning manual spreadsheets, paper trails, and fragmented processes into centralized, scalable digital tools. Proven expertise in building intuitive dashboards, internal management platforms, and automated tracking systems that eliminate repetitive tasks, improve data integrity, and accelerate turnaround times.
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
                href="https://wa.me/639175291018" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 bg-emerald-600/10 border border-emerald-500/30 text-emerald-400 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-emerald-600 hover:text-white transition-all hover:scale-105 shadow-sm"
              >
                <WhatsAppIcon size={18} />
                WhatsApp
              </a>
              <a 
                href="viber://chat?number=%2B639175291018" 
                className="inline-flex items-center gap-2 bg-purple-600/10 border border-purple-500/30 text-purple-400 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-purple-600 hover:text-white transition-all hover:scale-105 shadow-sm"
              >
                <ViberIcon size={18} />
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
          <a href="/admin" className="text-gray-600 hover:text-cyber-blue transition-colors font-mono">
            Admin Console →
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
