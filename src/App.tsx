import { ArrowRight, BarChart3, Settings, TrendingUp, CheckCircle, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

function App() {
  const coreSkills = [
    "Data Collation & Validation", "Data Encoding", "Records Management", 
    "Scheduling & Coordination", "Document Preparation", "Compliance Monitoring", 
    "Turnaround-Time Tracking", "Report Preparation", "Follow-Up Management", 
    "Customer Communication", "Confidential Records Handling", "Data Privacy Awareness"
  ];

  return (
    <div className="min-h-screen bg-cyber-dark selection:bg-cyber-blue selection:text-cyber-dark font-sans text-white relative">
      <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-50"></div>
      
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-cyber-dark/80 backdrop-blur-md border-b border-cyber-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight text-white">Robert<span className="text-cyber-blue neon-text">.</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-300 hover:text-cyber-blue font-medium transition-colors">Services</a>
              <a href="#about" className="text-gray-300 hover:text-cyber-blue font-medium transition-colors">About</a>
              <a href="#resume" className="text-gray-300 hover:text-cyber-blue font-medium transition-colors">Resume</a>
              <a href="#contact" className="bg-cyber-blue/10 border border-cyber-blue text-cyber-blue px-6 py-2.5 rounded-full font-medium hover:bg-cyber-blue hover:text-cyber-dark transition-all neon-border hover:shadow-[0_0_20px_#00f2ff]">
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyber-blue/5 text-cyber-blue font-medium text-sm mb-6 border border-cyber-blue/30 shadow-[0_0_15px_rgba(0,242,255,0.15)]">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-blue opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyber-blue"></span>
                </span>
                15+ Years of Professional Experience
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
                Empowering businesses to <span className="text-cyber-blue neon-text block mt-2">scale and succeed.</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Hi, I'm Robert Rich Garcia. I help businesses navigate their journey by improving sales, creating rock-solid operational systems, and driving more targeted traffic through industry best practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-cyber-blue text-cyber-dark px-8 py-4 rounded-full font-bold hover:bg-white transition-all shadow-[0_0_15px_rgba(0,242,255,0.4)] hover:shadow-[0_0_25px_rgba(0,242,255,0.6)]">
                  Start Your Journey
                  <ArrowRight size={20} />
                </a>
                <a href="https://my.dmerch.store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-cyber-gray/50 text-white border border-cyber-gray px-8 py-4 rounded-full font-semibold hover:border-cyber-blue hover:text-cyber-blue transition-all">
                  Visit My Agency
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5] sm:aspect-video lg:aspect-[4/5] xl:aspect-square neon-border bg-cyber-gray">
                {/* Hero Image */}
                <img 
                  src="/hero-image.jpg" 
                  alt="Robert Rich Garcia" 
                  className="absolute inset-0 w-full h-full object-cover object-center opacity-80 mix-blend-luminosity hover:mix-blend-normal transition-all duration-500"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-cyber-dark via-transparent to-transparent opacity-80"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-12 sm:-left-12 bg-cyber-gray p-6 rounded-2xl max-w-xs border border-cyber-blue/30 hidden sm:block animate-pulse shadow-[0_0_20px_rgba(0,242,255,0.15)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-cyber-blue/10 text-cyber-blue rounded-full flex items-center justify-center flex-shrink-0 neon-border">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-white font-bold text-lg">Proven Results</p>
                    <p className="text-cyber-blue text-sm">Driving revenue & growth</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Proposition / Services */}
      <section id="services" className="py-24 border-y border-cyber-gray relative z-10 bg-cyber-dark/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6 tracking-tight">How I can transform your business</h2>
            <p className="text-lg text-gray-400">Implementing the best practices to turn your bottlenecks into breakthroughs.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="p-8 rounded-2xl bg-cyber-gray border border-cyber-gray hover:border-cyber-blue/50 hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all group">
              <div className="w-14 h-14 bg-cyber-dark border border-cyber-gray text-cyber-blue rounded-xl flex items-center justify-center mb-6 group-hover:neon-border group-hover:scale-110 transition-all">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Improve Sales</h3>
              <p className="text-gray-400 leading-relaxed">
                Optimize your sales funnels and conversion rates. I analyze your current processes and implement strategies that directly impact your bottom line.
              </p>
            </div>

            {/* Service 2 */}
            <div className="p-8 rounded-2xl bg-cyber-gray border border-cyber-gray hover:border-cyber-blue/50 hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all group">
              <div className="w-14 h-14 bg-cyber-dark border border-cyber-gray text-cyber-blue rounded-xl flex items-center justify-center mb-6 group-hover:neon-border group-hover:scale-110 transition-all">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Create Systems</h3>
              <p className="text-gray-400 leading-relaxed">
                Build scalable, repeatable processes. Backed by 15+ years of admin and compliance experience, I establish systems that let your business run like a well-oiled machine.
              </p>
            </div>

            {/* Service 3 */}
            <div className="p-8 rounded-2xl bg-cyber-gray border border-cyber-gray hover:border-cyber-blue/50 hover:shadow-[0_0_30px_rgba(0,242,255,0.1)] transition-all group">
              <div className="w-14 h-14 bg-cyber-dark border border-cyber-gray text-cyber-blue rounded-xl flex items-center justify-center mb-6 group-hover:neon-border group-hover:scale-110 transition-all">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Drive Traffic</h3>
              <p className="text-gray-400 leading-relaxed">
                Get more eyes on your products. I utilize proven marketing methodologies and traffic-generation tactics to attract your ideal target audience.
              </p>
            </div>
          </div>

          {/* Agency Banner */}
          <div className="mt-16 bg-cyber-gray rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden neon-border">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyber-blue rounded-full blur-[100px] opacity-20"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyber-blue rounded-full blur-[100px] opacity-10"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Looking for full-scale agency services?</h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Through my agency, <strong className="text-cyber-blue">DigitalMerch</strong>, we provide comprehensive solutions to elevate your digital presence, build custom business systems, and scale your growth.
              </p>
              <a href="https://my.dmerch.store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-cyber-blue text-cyber-dark px-8 py-4 rounded-full font-bold hover:bg-white transition-all hover:scale-105 shadow-[0_0_20px_rgba(0,242,255,0.3)]">
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
          <div className="bg-cyber-gray rounded-3xl p-8 sm:p-12 border border-cyber-gray hover:border-cyber-blue/30 transition-colors relative overflow-hidden shadow-2xl">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-cyber-blue rounded-full blur-[120px] opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 pb-10 border-b border-cyber-dark">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight">Robert Rich Garcia</h2>
                  <p className="text-xl text-cyber-blue font-medium neon-text">Administrative, Compliance & Systems Professional</p>
                </div>
                <div className="mt-6 md:mt-0 space-y-2 text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-cyber-blue" />
                    <span>Cabuyao, Laguna, Philippines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-cyber-blue" />
                    <a href="mailto:garciarobertrich@gmail.com" className="hover:text-white transition-colors">garciarobertrich@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-cyber-blue" />
                    <span>09175291018</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyber-dark border border-cyber-blue/50 text-cyber-blue flex items-center justify-center">
                    <span className="font-bold">1</span>
                  </div>
                  Professional Summary
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed">
                  Highly organized administrative and compliance professional with <strong className="text-cyber-blue">15+ years of experience</strong> in documentation, data management, scheduling, records validation, reporting, government processing, client coordination, and confidential information handling. Experienced in reviewing documents for completeness and accuracy, maintaining trackers and databases, coordinating schedules and requirements with internal and external stakeholders, monitoring pending items against turnaround times, preparing summary reports, and ensuring compliance with established procedures.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-cyber-dark border border-cyber-blue/50 text-cyber-blue flex items-center justify-center">
                    <span className="font-bold">2</span>
                  </div>
                  Core Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {coreSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 bg-cyber-dark border border-cyber-gray px-4 py-2.5 rounded-full text-gray-300 font-medium text-sm hover:border-cyber-blue hover:text-cyber-blue transition-all hover:shadow-[0_0_10px_rgba(0,242,255,0.2)]">
                      <CheckCircle size={16} className="text-cyber-blue" />
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
      <section id="contact" className="py-24 bg-cyber-dark text-white text-center relative z-10 border-t border-cyber-gray">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyber-blue blur-[150px] opacity-10 rounded-full pointer-events-none"></div>
          
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight">Ready to transform your business?</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Let's discuss how we can improve your sales, build reliable systems, and scale your product traffic together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
            <a href="mailto:garciarobertrich@gmail.com" className="inline-flex items-center gap-2 bg-cyber-blue text-cyber-dark px-8 py-4 rounded-full font-bold text-lg hover:bg-white transition-all shadow-[0_0_20px_rgba(0,242,255,0.4)]">
              <Mail size={20} />
              garciarobertrich@gmail.com
            </a>
            <a href="tel:09175291018" className="inline-flex items-center gap-2 bg-cyber-gray text-white border border-cyber-gray px-8 py-4 rounded-full font-bold text-lg hover:border-cyber-blue hover:text-cyber-blue transition-all">
              <Phone size={20} />
              09175291018
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-cyber-dark text-gray-500 text-center border-t border-cyber-gray relative z-10">
        <p>© {new Date().getFullYear()} Robert Rich Garcia. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
