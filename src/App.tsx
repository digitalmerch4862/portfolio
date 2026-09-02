import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, Settings, TrendingUp, CheckCircle, ExternalLink, Mail, Phone, MapPin, Moon, Sun, Database, Cpu, Layers, ShieldCheck, Terminal, Code2, Workflow } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

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
              <a href="#about" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">About</a>
              <a href="#skills" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">Skills</a>
              <a href="#resume" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">Background</a>
              
              <button 
                onClick={toggleTheme} 
                className="p-2 rounded-full bg-slate-100 dark:bg-cyber-gray text-slate-600 dark:text-cyber-blue hover:bg-slate-200 dark:hover:bg-cyber-blue/20 transition-all dark:neon-border"
                aria-label="Toggle dark mode"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <a href="#contact" className="bg-brand-600 dark:bg-cyber-blue/10 border border-transparent dark:border-cyber-blue text-white dark:text-cyber-blue px-6 py-2.5 rounded-full font-medium hover:bg-brand-700 dark:hover:bg-cyber-blue dark:hover:text-cyber-dark transition-all dark:neon-border hover:shadow-lg dark:hover:shadow-[0_0_20px_#00f2ff]">
                Let's Talk
              </a>
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
                <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-cyber-blue text-white dark:text-cyber-dark px-8 py-4 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg dark:shadow-[0_0_15px_rgba(0,242,255,0.4)] dark:hover:shadow-[0_0_25px_rgba(0,242,255,0.6)]">
                  Consult On A System
                  <ArrowRight size={20} />
                </a>
                <a href="https://my.dmerch.store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-cyber-gray/50 text-slate-700 dark:text-white border border-slate-200 dark:border-cyber-gray px-8 py-4 rounded-full font-semibold hover:bg-slate-50 hover:border-brand-300 dark:hover:border-cyber-blue dark:hover:text-cyber-blue transition-all">
                  Visit DigitalMerch Agency
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="group relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-video lg:aspect-[4/5] xl:aspect-square neon-border bg-slate-200 dark:bg-cyber-gray transition-colors cursor-pointer">
                {/* Hero Image */}
                <img 
                  src="/hero-image.jpg" 
                  alt="Robert Rich Garcia" 
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-100 dark:opacity-60 dark:grayscale dark:group-hover:grayscale-0 dark:group-hover:opacity-100 transition-all duration-700 ease-in-out transform group-hover:scale-105"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-cyber-dark via-transparent to-transparent opacity-80 pointer-events-none transition-opacity duration-700 group-hover:opacity-30"></div>
              </div>
              
              {/* Floating Badge */}
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
                <div className="pt-4 border-t border-slate-200 dark:border-cyber-gray/60">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Business Impact</span>
                  <p className="text-xs text-slate-600 dark:text-gray-400 mt-1">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Agency Banner */}
          <div className="mt-16 bg-brand-900 dark:bg-cyber-gray rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden dark:neon-border transition-colors duration-300">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-800 dark:bg-cyber-blue rounded-full blur-[100px] opacity-50 dark:opacity-20 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500 dark:bg-cyber-blue rounded-full blur-[100px] opacity-20 dark:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Looking for full-scale agency deployment?</h3>
              <p className="text-brand-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg transition-colors">
                Through my agency, <strong className="text-white dark:text-cyber-blue transition-colors">DigitalMerch</strong>, we engineer tailored business automation, custom software, and digital infrastructure to scale your operations.
              </p>
              <a href="https://my.dmerch.store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white dark:bg-cyber-blue text-brand-900 dark:text-cyber-dark px-8 py-4 rounded-full font-bold hover:bg-brand-50 dark:hover:bg-white transition-all hover:scale-105 shadow-xl dark:shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                Explore DigitalMerch Services
                <ExternalLink size={20} />
              </a>
            </div>
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
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-100 dark:bg-cyber-blue rounded-full blur-[120px] opacity-40 dark:opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 pb-10 border-b border-slate-100 dark:border-cyber-dark transition-colors duration-300">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors">Robert Rich Garcia</h2>
                  <p className="text-xl text-brand-600 dark:text-cyber-blue font-medium dark:neon-text transition-colors">
                    Business Systems & Automation Developer
                  </p>
                </div>
                <div className="mt-6 md:mt-0 space-y-2 text-slate-500 dark:text-gray-400 transition-colors">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-brand-500 dark:text-cyber-blue" />
                    <span>Cabuyao, Laguna, Philippines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-brand-500 dark:text-cyber-blue" />
                    <a href="mailto:garciarobertrich@gmail.com" className="hover:text-slate-800 dark:hover:text-white transition-colors">garciarobertrich@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-brand-500 dark:text-cyber-blue" />
                    <span>09175291018</span>
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
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a href="mailto:garciarobertrich@gmail.com" className="inline-flex items-center gap-2 bg-brand-500 dark:bg-cyber-blue text-white dark:text-cyber-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-400 dark:hover:bg-white transition-all shadow-[0_0_20px_rgba(20,184,166,0.2)] dark:shadow-[0_0_20px_rgba(0,242,255,0.4)]">
              <Mail size={20} />
              garciarobertrich@gmail.com
            </a>
            <a href="tel:09175291018" className="inline-flex items-center gap-2 bg-slate-800 dark:bg-cyber-gray text-white border border-slate-700 dark:border-cyber-gray px-8 py-4 rounded-full font-bold text-lg hover:border-brand-500 dark:hover:border-cyber-blue hover:text-brand-400 dark:hover:text-cyber-blue transition-all">
              <Phone size={20} />
              09175291018
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 dark:bg-cyber-dark text-slate-500 text-center border-t border-slate-800 dark:border-cyber-gray relative z-10 transition-colors duration-300">
        <p>© {new Date().getFullYear()} Robert Rich Garcia. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
