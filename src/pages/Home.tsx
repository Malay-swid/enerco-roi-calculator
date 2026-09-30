import React from 'react';
import EnergyROICalculator from '../components/EnergyROICalculator';
import { Shield, Zap, Leaf, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-[#0A192F] text-white py-4 px-6 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <div className="text-2xl font-bold tracking-tighter flex items-center">
          <Zap className="text-emerald-400 mr-2" fill="currentColor" />
          ENERCO
        </div>
        <div className="hidden md:flex space-x-8 text-sm font-medium text-slate-300">
          <a href="#services" className="hover:text-emerald-400 transition-colors">Services</a>
          <a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a>
          <a href="#roi" className="hover:text-emerald-400 transition-colors">ROI Calculator</a>
        </div>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all">
          Contact Us
        </button>
      </nav>

      {/* Hero Section */}
      <header className="relative bg-[#0A192F] text-white pt-24 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-emerald-500 opacity-10 blur-3xl rounded-full translate-x-1/4 -translate-y-1/4"></div>
        <div className="max-w-6xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
              Industrial Energy <span className="text-emerald-400">Optimization</span> for the Modern Enterprise.
            </h1>
            <p className="text-xl text-slate-400 leading-relaxed">
              We help B2B industrial firms transition to renewable energy, slashing operational costs and achieving carbon neutrality with data-driven financial projections.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a href="#roi" className="flex items-center justify-center px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all transform hover:scale-105 text-center">
                Calculate Your Savings <ArrowRight className="ml-2" size={20} />
              </a>
              <a href="#services" className="flex items-center justify-center px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all text-center">
                Explore Solutions
              </a>
            </div>
          </div>
          <div className="hidden lg:block relative">
            <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl rotate-3">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl">E</div>
                <div>
                  <p className="font-bold">Enterprise ROI</p>
                  <p className="text-xs text-slate-400">Projected Annual Savings</p>
                </div>
              </div>
              <div className="text-4xl font-bold text-emerald-400 mb-2">$142,000</div>
              <div className="w-full bg-slate-700 h-4 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-3/4"></div>
              </div>
              <p className="text-xs text-slate-400 mt-4">Payback Period: 3.4 Years</p>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#0A192F] mb-4">Our Industrial Solutions</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">We deploy high-efficiency renewable technology tailored for heavy-duty industrial power requirements.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Solar PV Arrays',
                desc: 'Utility-scale photovoltaic installations with smart grid integration for massive energy offsets.',
                icon: <Zap className="text-emerald-500" />,
                color: 'bg-emerald-50'
              },
              {
                title: 'Wind-Solar Hybrid',
                desc: 'Diversified energy generation combining the best of both worlds to ensure consistent 24/7 power.',
                icon: <Leaf className="text-emerald-500" />,
                color: 'bg-emerald-50'
              },
              {
                title: 'BESS (Battery Storage)',
                desc: 'Industrial-grade energy storage to manage peak loads and eliminate costly demand charges.',
                icon: <Shield className="text-emerald-500" />,
                color: 'bg-emerald-50'
              }
            ].map((service, idx) => (
              <div key={idx} className="p-8 bg-white rounded-2xl border border-slate-200 hover:border-emerald-500 transition-all hover:shadow-xl group">
                <div className={`w-14 h-14 ${service.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#0A192F] mb-3">{service.title}</h3>
                <p className="text-slate-500 leading-relaxed mb-6">{service.desc}</p>
                <a href="#" className="text-emerald-600 font-bold text-sm flex items-center hover:underline">
                  Learn More <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section id="roi" className="py-24 px-6 bg-slate-100">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0A192F] mb-4">Financial Projection Tool</h2>
            <p className="text-slate-500">Stop guessing. Get a precise estimate of your potential energy savings and payback period.</p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
            <EnergyROICalculator />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="bg-[#0A192F] aspect-square rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center text-emerald-400 opacity-20">
                <Zap size={200} />
              </div>
              <div className="absolute bottom-8 left-8 p-6 bg-white rounded-2xl shadow-xl max-w-xs">
                <p className="text-[#0A192F] font-bold">"Enerco transformed our logistics hub's energy cost structure."</p>
                <p className="text-slate-400 text-xs mt-2">— Global Logistics Inc.</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-[#0A192F]">Engineering a Sustainable Industrial Future</h2>
            <p className="text-slate-500 leading-relaxed">
              Enerco is not just a consulting firm; we are engineering partners. We specialize in high-capacity renewable energy transitions for warehouses, factories, and data centers.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 border-l-4 border-emerald-500 bg-slate-50">
                <p className="text-2xl font-bold text-[#0A192F]">500MW+</p>
                <p className="text-xs text-slate-500">Deployed Capacity</p>
              </div>
              <div className="p-4 border-l-4 border-emerald-500 bg-slate-50">
                <p className="text-2xl font-bold text-[#0A192F]">$120M+</p>
                <p className="text-xs text-slate-500">Client Savings</p>
              </div>
            </div>
            <button className="px-8 py-3 bg-[#0A192F] text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
              Read Case Studies
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A192F] text-white py-16 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="text-2xl font-bold tracking-tighter flex items-center">
              <Zap className="text-emerald-400 mr-2" fill="currentColor" />
              ENERCO
            </div>
            <p className="text-slate-400 max-w-sm">
              Pioneering the shift to industrial renewable energy. Data-driven projections, professional engineering, and sustainable growth.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-white transition-colors">Services</a></li>
              <li><a href="#about" className="hover:text-emerald-400 transition-colors">ROI Calculator</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>info@enerco.industrial</li>
              <li>+1 (555) 012-3456</li>
              <li>123 Energy Plaza, Industrial Way, NY</li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-xs text-slate-500">
          © 2026 Enerco Industrial Energy Consulting. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Home;
