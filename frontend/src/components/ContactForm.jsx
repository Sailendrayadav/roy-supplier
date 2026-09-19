import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, Clock, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export default function ContactForm() {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(prev => ({ ...prev, [e.target.name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.message.trim()) newErrors.message = 'Message content is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitContact(formData);
      if (res.success) {
        setSuccess(true);
        setFormData({ name: '', phone: '', email: '', message: '' });
      }
    } catch (err) {
      setErrors({ submit: 'Failed to send message. Please call us directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="py-16 bg-slate-950 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="text-xs font-extrabold text-amber-500 uppercase tracking-widest mb-1">
                Direct Inquiry & Support
              </div>
              <h2 className="text-3xl font-extrabold font-display text-white">
                Contact RSY Supplier
              </h2>
              <p className="text-slate-300 text-sm mt-2 leading-relaxed">
                Have questions regarding material pricing, volume discounts, tipper availability, or long-term machinery contracts? Reach out to our dedicated site sales managers.
              </p>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Sales & Dispatch Hotline</h4>
                  <div className="text-slate-300 space-y-0.5">
                    <div>
                      <a href="tel:+9779827492554" className="hover:text-amber-400 hover:underline">+977 9827492554</a>,{' '}
                      <a href="tel:+9779804436138" className="hover:text-amber-400 hover:underline">+977 9804436138</a>
                    </div>
                    <div>
                      <a href="tel:+9779803721355" className="hover:text-amber-400 hover:underline">+977 9803721355</a>,{' '}
                      <a href="tel:+9779816419975" className="hover:text-amber-400 hover:underline">+977 9816419975</a>
                    </div>
                  </div>
                  <span className="text-[11px] text-amber-400 font-semibold">Available 24/7 for Express Orders</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Official Email</h4>
                  <p className="text-slate-300">
                    <a href="mailto:ysailendra225@gmail.com" className="hover:text-amber-400 hover:underline">
                      ysailendra225@gmail.com
                    </a>
                  </p>
                  <span className="text-[11px] text-slate-400">Response within 1 business hour</span>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white">Head Office & Yard</h4>
                  <p className="text-slate-300">Mayadevi 5, Budwa, Rupandehi, Nepal</p>
                  <span className="text-[11px] text-slate-400">Direct Quarry & Plant Distribution</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center gap-3 text-xs text-slate-300">
              <ShieldCheck className="w-6 h-6 text-amber-500 shrink-0" />
              <span>We guarantee genuine factory test reports (MTC) with every steel and cement consignment.</span>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">Send Us a Quick Message</h3>
            
            {success ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 rounded-xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-lg font-bold text-white">Message Sent Successfully!</h4>
                <p className="text-xs text-slate-300">
                  Thank you for reaching out. An RSY Supplier representative will contact you immediately.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errors.submit && (
                  <div className="p-3 bg-red-500/10 border border-red-500/40 text-red-400 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.submit}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Bishal Thapa"
                      className={`w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border ${
                        errors.name ? 'border-red-500' : 'border-slate-800'
                      } focus:outline-none focus:border-amber-500`}
                    />
                    {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. 9801234567"
                      className={`w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border ${
                        errors.phone ? 'border-red-500' : 'border-slate-800'
                      } focus:outline-none focus:border-amber-500`}
                    />
                    {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Address (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. bishal@construction.com"
                    className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Message / Requirements *</label>
                  <textarea
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Please specify materials needed, required quantities, site location, or transport dates..."
                    className={`w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border ${
                      errors.message ? 'border-red-500' : 'border-slate-800'
                    } focus:outline-none focus:border-amber-500`}
                  />
                  {errors.message && <p className="text-red-400 text-[11px] mt-1">{errors.message}</p>}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3 px-6 rounded-xl flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" />
                  <span>{submitting ? 'Sending...' : 'Send Inquiry Now'}</span>
                </motion.button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
