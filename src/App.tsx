import React, { useState, useEffect } from 'react';
import { ArrowRight, BarChart3, Settings, TrendingUp, CheckCircle, ExternalLink, Mail, Phone, MapPin, Moon, Sun } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useState(true); // Default to agency dark theme

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const coreSkills = [
    "Data Collation & Validation", "Data Encoding", "Records Management", 
    "Scheduling & Coordination", "Document Preparation", "Compliance Monitoring", 
    "Turnaround-Time Tracking", "Report Preparation", "Follow-Up Management", 
    "Customer Communication", "Confidential Records Handling", "Data Privacy Awareness"
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
              <a href="#services" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">Services</a>
              <a href="#about" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">About</a>
              <a href="#resume" className="text-slate-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-cyber-blue font-medium transition-colors">Resume</a>
              
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
                15+ Years of Professional Experience
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white leading-[1.1] mb-6 tracking-tight transition-colors">
                Empowering businesses to <span className="text-brand-600 dark:text-cyber-blue dark:neon-text block mt-2">scale and succeed.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed transition-colors">
                Hi, I'm Robert Rich Garcia. I help businesses navigate their journey by improving sales, creating rock-solid operational systems, and driving more targeted traffic through industry best practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-cyber-blue text-white dark:text-cyber-dark px-8 py-4 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-white transition-all shadow-lg dark:shadow-[0_0_15px_rgba(0,242,255,0.4)] dark:hover:shadow-[0_0_25px_rgba(0,242,255,0.6)]">
                  Start Your Journey
                  <ArrowRight size={20} />
                </a>
                <a href="https://my.dmerch.store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white dark:bg-cyber-gray/50 text-slate-700 dark:text-white border border-slate-200 dark:border-cyber-gray px-8 py-4 rounded-full font-semibold hover:bg-slate-50 hover:border-brand-300 dark:hover:border-cyber-blue dark:hover:text-cyber-blue transition-all">
                  Visit My Agency
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-video lg:aspect-[4/5] xl:aspect-square neon-border bg-slate-200 dark:bg-cyber-gray transition-colors">
                {/* Hero Image */}
                <img 
                  src="/hero-image.jpg" 
                  alt="Robert Rich Garcia" 
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-100 dark:opacity-80 mix-blend-normal dark:mix-blend-luminosity dark:hover:mix-blend-normal transition-all duration-500"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 dark:from-cyber-dark via-transparent to-transparent opacity-80"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-12 sm:-left-12 bg-white dark:bg-cyber-gray p-6 rounded-2xl max-w-xs border border-slate-100 dark:border-cyber-blue/30 hidden sm:block animate-bounce shadow-xl dark:shadow-[0_0_20px_rgba(0,242,255,0.15)] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-100 dark:bg-cyber-blue/10 text-brand-600 dark:text-cyber-blue rounded-full flex items-center justify-center flex-shrink-0 neon-border transition-colors">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-slate-900 dark:text-white font-bold text-lg transition-colors">Proven Results</p>
                    <p className="text-slate-500 dark:text-cyber-blue text-sm transition-colors">Driving revenue & growth</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Proposition / Services */}
      <section id="services" className="py-24 border-y border-slate-100 dark:border-cyber-gray relative z-10 bg-white dark:bg-cyber-dark/50 backdrop-blur-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight transition-colors">How I can transform your business</h2>
            <p className="text-lg text-slate-600 dark:text-gray-400 transition-colors">Implementing the best practices to turn your bottlenecks into breakthroughs.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-cyber-gray border border-slate-100 dark:border-cyber-gray hover:border-brand-300 dark:hover:border-cyber-blue/50 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all group">
              <div className="w-14 h-14 bg-white dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-brand-600 dark:text-cyber-blue rounded-xl flex items-center justify-center mb-6 group-hover:neon-border group-hover:scale-110 transition-all">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Improve Sales</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed transition-colors">
                Optimize your sales funnels and conversion rates. I analyze your current processes and implement strategies that directly impact your bottom line.
              </p>
            </div>

            {/* Service 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-cyber-gray border border-slate-100 dark:border-cyber-gray hover:border-brand-300 dark:hover:border-cyber-blue/50 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all group">
              <div className="w-14 h-14 bg-white dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-brand-600 dark:text-cyber-blue rounded-xl flex items-center justify-center mb-6 group-hover:neon-border group-hover:scale-110 transition-all">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Create Systems</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed transition-colors">
                Build scalable, repeatable processes. Backed by 15+ years of admin and compliance experience, I establish systems that let your business run like a well-oiled machine.
              </p>
            </div>

            {/* Service 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 dark:bg-cyber-gray border border-slate-100 dark:border-cyber-gray hover:border-brand-300 dark:hover:border-cyber-blue/50 hover:shadow-lg dark:hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all group">
              <div className="w-14 h-14 bg-white dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray text-brand-600 dark:text-cyber-blue rounded-xl flex items-center justify-center mb-6 group-hover:neon-border group-hover:scale-110 transition-all">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Drive Traffic</h3>
              <p className="text-slate-600 dark:text-gray-400 leading-relaxed transition-colors">
                Get more eyes on your products. I utilize proven marketing methodologies and traffic-generation tactics to attract your ideal target audience.
              </p>
            </div>
          </div>

          {/* Agency Banner */}
          <div className="mt-16 bg-brand-900 dark:bg-cyber-gray rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden dark:neon-border transition-colors duration-300">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-800 dark:bg-cyber-blue rounded-full blur-[100px] opacity-50 dark:opacity-20 transition-opacity"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500 dark:bg-cyber-blue rounded-full blur-[100px] opacity-20 dark:opacity-10 transition-opacity"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Looking for full-scale agency services?</h3>
              <p className="text-brand-100 dark:text-gray-300 mb-8 max-w-2xl mx-auto text-lg transition-colors">
                Through my agency, <strong className="text-white dark:text-cyber-blue transition-colors">DigitalMerch</strong>, we provide comprehensive solutions to elevate your digital presence, build custom business systems, and scale your growth.
              </p>
              <a href="https://my.dmerch.store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white dark:bg-cyber-blue text-brand-900 dark:text-cyber-dark px-8 py-4 rounded-full font-bold hover:bg-brand-50 dark:hover:bg-white transition-all hover:scale-105 shadow-xl dark:shadow-[0_0_20px_rgba(0,242,255,0.3)]">
                Visit DigitalMerch
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="py-24 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-cyber-gray rounded-3xl p-8 sm:p-12 border border-slate-100 dark:border-cyber-gray hover:border-brand-200 dark:hover:border-cyber-blue/30 transition-colors duration-300 relative overflow-hidden shadow-2xl">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-100 dark:bg-cyber-blue rounded-full blur-[120px] opacity-40 dark:opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 pb-10 border-b border-slate-100 dark:border-cyber-dark transition-colors duration-300">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight transition-colors">Robert Rich Garcia</h2>
                  <p className="text-xl text-brand-600 dark:text-cyber-blue font-medium dark:neon-text transition-colors">Administrative, Compliance & Systems Professional</p>
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
              
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-cyber-dark border border-brand-200 dark:border-cyber-blue/50 text-brand-600 dark:text-cyber-blue flex items-center justify-center transition-colors">
                    <span className="font-bold">1</span>
                  </div>
                  Professional Summary
                </h3>
                <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed transition-colors">
                  Highly organized administrative and compliance professional with <strong className="text-brand-700 dark:text-cyber-blue transition-colors">15+ years of experience</strong> in documentation, data management, scheduling, records validation, reporting, government processing, client coordination, and confidential information handling. Experienced in reviewing documents for completeness and accuracy, maintaining trackers and databases, coordinating schedules and requirements with internal and external stakeholders, monitoring pending items against turnaround times, preparing summary reports, and ensuring compliance with established procedures.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-cyber-dark border border-brand-200 dark:border-cyber-blue/50 text-brand-600 dark:text-cyber-blue flex items-center justify-center transition-colors">
                    <span className="font-bold">2</span>
                  </div>
                  Core Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {coreSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-50 dark:bg-cyber-dark border border-slate-200 dark:border-cyber-gray px-4 py-2.5 rounded-full text-slate-700 dark:text-gray-300 font-medium text-sm hover:border-brand-400 dark:hover:border-cyber-blue hover:text-brand-700 dark:hover:text-cyber-blue transition-all hover:shadow-md dark:hover:shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                      <CheckCircle size={16} className="text-brand-500 dark:text-cyber-blue transition-colors" />
                      {skill}
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
          
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight">Ready to transform your business?</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto transition-colors">
            Let's discuss how we can improve your sales, build reliable systems, and scale your product traffic together.
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
