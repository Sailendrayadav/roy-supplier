import React from 'react';
import { Truck, Phone, Mail, MapPin, ShieldCheck, HardHat, FileText, ChevronRight } from 'lucide-react';

export default function Footer({ onOpenQuote, setActiveCategory }) {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
                <Truck className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-2xl text-white font-display">
                RSY <span className="text-amber-500">SUPPLIER</span>
              </span>
            </div>

            <p className="text-slate-300 leading-relaxed text-xs max-w-sm">
              Nepal's premier heavy building materials supplier and site logistics haulage company. Certified Cement, TMT Steel Rebars, River Sand, Aggregate, Tipper Transportation, and Heavy Excavator Rentals.
            </p>

            <div className="flex items-center gap-3 pt-2 text-slate-300">
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-white text-[11px]">NS & ISO Certified Materials</span>
              </div>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Offerings
            </h4>
            <ul className="space-y-2">
              {[
                { name: 'Construction Materials', id: 'construction-materials' },
                { name: 'Transportation & Logistics', id: 'transportation' },
                { name: 'Bulk & Road Supplies', id: 'bulk-road-materials' },
                { name: 'Heavy Equipment Rental', id: 'equipment' }
              ].map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setActiveCategory(cat.id);
                      const catSection = document.getElementById('catalog-section');
                      if (catSection) catSection.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-amber-400 transition-colors flex items-center gap-1.5"
                  >
                    <ChevronRight className="w-3 h-3 text-amber-500" />
                    <span>{cat.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Key Materials */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              Popular Materials
            </h4>
            <ul className="space-y-2">
              {['OPC & PPC Cement', 'TMT Steel Rods (Fe 500D)', 'Washed River Sand (बालुवा)', 'Basalt Aggregate (गिट्टी)', 'Corrugated GI Sheets (जस्तापाता)', 'JCB & Excavator Hire'].map(item => (
                <li key={item} className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              24/7 Sales Hotline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 text-amber-400 font-bold">
                <Phone className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex flex-col space-y-0.5">
                  <a href="tel:+9779827492554" className="hover:underline">+977 9827492554</a>
                  <a href="tel:+9779804436138" className="hover:underline">+977 9804436138</a>
                  <a href="tel:+9779803721355" className="hover:underline">+977 9803721355</a>
                  <a href="tel:+9779816419975" className="hover:underline">+977 9816419975</a>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:ysailendra225@gmail.com" className="hover:text-amber-400 hover:underline">
                  ysailendra225@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Mayadevi 5, Budwa, Rupandehi, Nepal</span>
              </div>
            </div>

            <button
              onClick={() => onOpenQuote({ name: 'General Supply Quote' })}
              className="mt-2 w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Get Immediate Quote</span>
            </button>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} RSY Supplier. All Rights Reserved. Built for Heavy Duty Performance.
          </div>
          <div className="flex items-center gap-4">
            <a href="#about-section" className="hover:text-amber-400">About Us</a>
            <span>•</span>
            <a href="#catalog-section" className="hover:text-amber-400">Product Catalog</a>
            <span>•</span>
            <a href="#contact-section" className="hover:text-amber-400">Contact Support</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
