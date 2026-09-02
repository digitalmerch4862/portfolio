import { ArrowRight, BarChart3, Settings, TrendingUp, CheckCircle, ExternalLink, Mail, Phone, MapPin } from 'lucide-react';

function App() {
  const coreSkills = [
    "Data Collation & Validation", "Data Encoding", "Records Management", 
    "Scheduling & Coordination", "Document Preparation", "Compliance Monitoring", 
    "Turnaround-Time Tracking", "Report Preparation", "Follow-Up Management", 
    "Customer Communication", "Confidential Records Handling", "Data Privacy Awareness"
  ];

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-brand-500 selection:text-white font-sans text-slate-800">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center gap-2">
              <span className="font-bold text-2xl tracking-tight text-slate-900">Robert<span className="text-brand-600">.</span></span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Services</a>
              <a href="#about" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">About</a>
              <a href="#resume" className="text-slate-600 hover:text-brand-600 font-medium transition-colors">Resume</a>
              <a href="#contact" className="bg-brand-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-700 transition-colors">
                Let's Talk
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
            
            <div className="lg:col-span-6 text-center lg:text-left mb-16 lg:mb-0">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 text-brand-600 font-medium text-sm mb-6 border border-brand-100">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
                </span>
                15+ Years of Professional Experience
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Empowering businesses to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-400">scale and succeed.</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Hi, I'm Robert Rich Garcia. I help businesses navigate their journey by improving sales, creating rock-solid operational systems, and driving more targeted traffic through industry best practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a href="#contact" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-semibold hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5">
                  Start Your Journey
                  <ArrowRight size={20} />
                </a>
                <a href="https://my.dmerch.store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold hover:bg-slate-50 transition-all">
                  Visit My Agency
                  <ExternalLink size={18} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/5] sm:aspect-video lg:aspect-[4/5] xl:aspect-square bg-slate-200">
                {/* Fallback pattern in case image is missing */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>
                
                {/* Hero Image */}
                <img 
                  src="/hero-image.jpg" 
                  alt="Robert Rich Garcia" 
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 sm:bottom-12 sm:-left-12 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-slate-100 hidden sm:block animate-bounce" style={{animationDuration: '3s'}}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-slate-900 font-bold text-lg">Proven Results</p>
                    <p className="text-slate-500 text-sm">Driving revenue & growth</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Value Proposition / Services */}
      <section id="services" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 tracking-tight">How I can transform your business</h2>
            <p className="text-lg text-slate-600">Implementing the best practices to turn your bottlenecks into breakthroughs.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow hover:border-brand-200 group">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 text-brand-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Improve Sales</h3>
              <p className="text-slate-600 leading-relaxed">
                Optimize your sales funnels and conversion rates. I analyze your current processes and implement strategies that directly impact your bottom line.
              </p>
            </div>

            {/* Service 2 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow hover:border-brand-200 group">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 text-brand-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Settings size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Create Systems</h3>
              <p className="text-slate-600 leading-relaxed">
                Build scalable, repeatable processes. Backed by 15+ years of admin and compliance experience, I establish systems that let your business run like a well-oiled machine.
              </p>
            </div>

            {/* Service 3 */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow hover:border-brand-200 group">
              <div className="w-14 h-14 bg-white shadow-sm border border-slate-100 text-brand-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Drive Traffic</h3>
              <p className="text-slate-600 leading-relaxed">
                Get more eyes on your products. I utilize proven marketing methodologies and traffic-generation tactics to attract your ideal target audience.
              </p>
            </div>
          </div>

          {/* Agency Banner */}
          <div className="mt-16 bg-brand-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-800 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-teal-500 rounded-full blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">Looking for full-scale agency services?</h3>
              <p className="text-brand-100 mb-8 max-w-2xl mx-auto text-lg">
                Through my agency, <strong>DigitalMerch</strong>, we provide comprehensive solutions to elevate your digital presence, build custom business systems, and scale your growth.
              </p>
              <a href="https://my.dmerch.store/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white text-brand-900 px-8 py-4 rounded-full font-bold hover:bg-brand-50 transition-all hover:scale-105 shadow-lg">
                Visit DigitalMerch
                <ExternalLink size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Resume Section */}
      <section id="resume" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-100 relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-50 rounded-full blur-3xl opacity-50"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-10 pb-10 border-b border-slate-100">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 tracking-tight">Robert Rich Garcia</h2>
                  <p className="text-xl text-brand-600 font-medium">Administrative, Compliance & Systems Professional</p>
                </div>
                <div className="mt-6 md:mt-0 space-y-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-slate-400" />
                    <span>Cabuyao, Laguna, Philippines</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail size={18} className="text-slate-400" />
                    <a href="mailto:garciarobertrich@gmail.com" className="hover:text-brand-600">garciarobertrich@gmail.com</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={18} className="text-slate-400" />
                    <span>09175291018</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                    <span className="font-bold">1</span>
                  </div>
                  Professional Summary
                </h3>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Highly organized administrative and compliance professional with <strong>15+ years of experience</strong> in documentation, data management, scheduling, records validation, reporting, government processing, client coordination, and confidential information handling. Experienced in reviewing documents for completeness and accuracy, maintaining trackers and databases, coordinating schedules and requirements with internal and external stakeholders, monitoring pending items against turnaround times, preparing summary reports, and ensuring compliance with established procedures.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center">
                    <span className="font-bold">2</span>
                  </div>
                  Core Skills
                </h3>
                <div className="flex flex-wrap gap-3">
                  {coreSkills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-full text-slate-700 font-medium text-sm hover:border-brand-300 hover:bg-brand-50 transition-colors">
                      <CheckCircle size={16} className="text-brand-500" />
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
      <section id="contact" className="py-24 bg-slate-900 text-white text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 tracking-tight">Ready to transform your business?</h2>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Let's discuss how we can improve your sales, build reliable systems, and scale your product traffic together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <a href="mailto:garciarobertrich@gmail.com" className="inline-flex items-center gap-2 bg-brand-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-brand-400 transition-all hover:shadow-[0_0_20px_rgba(20,184,166,0.4)]">
              <Mail size={20} />
              garciarobertrich@gmail.com
            </a>
            <a href="tel:09175291018" className="inline-flex items-center gap-2 bg-slate-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-700 transition-all">
              <Phone size={20} />
              09175291018
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-950 text-slate-500 text-center border-t border-slate-800">
        <p>© {new Date().getFullYear()} Robert Rich Garcia. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
