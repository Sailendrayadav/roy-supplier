import React from 'react';
import { motion } from 'framer-motion';
import { Award, ShieldCheck, Truck, Users, CheckCircle2, Building2 } from 'lucide-react';

export default function AboutSection() {
  const features = [
    { title: 'Direct Plant & Crusher Rates', desc: 'No middlemen markup. Get true factory price list on OPC/PPC cement and rebar steel.' },
    { title: 'Heavy Fleet Reliability', desc: 'Dedicated 6-wheeler to 14-wheeler tippers and flatbed trucks on standby 24/7.' },
    { title: 'Certified Material Testing', desc: 'Every batch of sand, aggregate, and steel comes with quality compliance certificates.' },
    { title: 'Turnkey Project Logistics', desc: 'From site clearance with JCB/Excavator to final brick and tile delivery.' }
  ];

  return (
    <section id="about-section" className="py-16 bg-slate-900/40 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Collage */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80"
                alt="RSY Supplier Heavy Duty Operation"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Badge overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur-md p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span>15+ Years Industry Experience</span>
                </div>
                <p className="text-xs text-slate-300">
                  Trusted partner for major commercial complexes, hydel projects, and residential housing.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="text-xs font-extrabold text-amber-500 uppercase tracking-widest mb-1">
                Why RSY Supplier?
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                Nepal's Reliable Infrastructure Supply Chain
              </h2>
              <p className="text-slate-300 text-sm mt-3 leading-relaxed">
                Founded with a mission to streamline raw material procurement and heavy transport, <strong>RSY Supplier</strong> bridges the gap between manufacturing plants, stone quarries, and construction sites. We manage end-to-end material delivery and heavy machinery hire.
              </p>
            </div>

            {/* Grid Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{f.title}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick stats strip */}
            <div className="pt-2 flex flex-wrap items-center gap-6 text-xs text-slate-300 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-500" />
                <span>Commercial & Residential</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>50+ Multi-Axle Vehicles</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <span>1,200+ Satisfied Clients</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
