import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Send, CheckCircle2, AlertCircle, Truck, Package, Calendar, MapPin, User, Phone } from 'lucide-react';
import { api } from '../services/api';

export default function QuoteModal({ isOpen, onClose, selectedItem }) {
  const isTransportation = selectedItem && (
    selectedItem.service_type || 
    (selectedItem.name && selectedItem.name.toLowerCase().includes('transport')) ||
    (selectedItem.name && selectedItem.name.toLowerCase().includes('haulage')) ||
    (selectedItem.name && selectedItem.name.toLowerCase().includes('rental'))
  );

  const [formData, setFormData] = useState({
    customer_name: '',
    phone: '',
    product_or_service: '',
    category_type: '',
    quantity: '',
    unit: 'Tonne / Truck Load',
    pickup_location: '',
    delivery_location: '',
    material_type: '',
    vehicle_required: '',
    required_date: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (selectedItem) {
      setFormData({
        customer_name: '',
        phone: '',
        product_or_service: selectedItem.name || 'General Supply Quote',
        category_type: isTransportation ? 'Transportation' : 'Material & Equipment',
        quantity: '',
        unit: selectedItem.unit || 'Tonne / Truck Load',
        pickup_location: '',
        delivery_location: '',
        material_type: isTransportation ? 'River Sand / Cement / Rebars / Soil' : '',
        vehicle_required: selectedItem.name || 'Tipper / Truck / Tractor',
        required_date: '',
        message: ''
      });
      setErrors({});
      setSubmittedSuccess(false);
    }
  }, [selectedItem, isTransportation]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customer_name.trim()) newErrors.customer_name = 'Full Name is required';
    if (!formData.phone.trim()) {
      newErrors.phone = 'Contact Phone Number is required';
    } else if (formData.phone.trim().length < 7) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    if (!formData.delivery_location.trim()) newErrors.delivery_location = 'Delivery site location is required';

    if (isTransportation) {
      if (!formData.pickup_location.trim()) newErrors.pickup_location = 'Pickup location is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const result = await api.submitQuote(formData);
      if (result.success) {
        setSubmittedSuccess(true);
      } else {
        setErrors({ submit: result.error || 'Failed to submit quote request' });
      }
    } catch (err) {
      setErrors({ submit: 'Network error. Please try again or call sales directly.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
                {isTransportation ? <Truck className="w-5 h-5 stroke-[2.5]" /> : <FileText className="w-5 h-5 stroke-[2.5]" />}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  {isTransportation ? 'Transportation & Logistics Quote' : 'Request Material & Equipment Quote'}
                </h3>
                <p className="text-xs text-amber-400 font-medium">
                  {selectedItem?.name ? `Item: ${selectedItem.name}` : 'RSY Supplier Direct Rates'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {submittedSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="text-xl font-bold text-white">Quote Request Received!</h4>
                <p className="text-sm text-slate-300 max-w-md mx-auto">
                  Thank you <strong className="text-amber-400">{formData.customer_name}</strong>. Our logistics manager will review your specs and contact you at <strong className="text-white">{formData.phone}</strong> within 30 minutes with official plant pricing.
                </p>
                <button
                  onClick={onClose}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">

                {errors.submit && (
                  <div className="bg-red-500/10 border border-red-500/40 p-3 rounded-xl text-red-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Personal Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Customer Name <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="customer_name"
                        value={formData.customer_name}
                        onChange={handleChange}
                        placeholder="e.g. Ramesh Shrestha / ABC Builders"
                        className={`w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border ${
                          errors.customer_name ? 'border-red-500' : 'border-slate-800'
                        } focus:outline-none focus:border-amber-500`}
                      />
                    </div>
                    {errors.customer_name && <p className="text-red-400 text-[11px] mt-1">{errors.customer_name}</p>}
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Phone Number <span className="text-amber-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. 9841234567"
                        className={`w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border ${
                          errors.phone ? 'border-red-500' : 'border-slate-800'
                        } focus:outline-none focus:border-amber-500`}
                      />
                    </div>
                    {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Target Item Name */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Selected Product / Service
                  </label>
                  <input
                    type="text"
                    name="product_or_service"
                    value={formData.product_or_service}
                    onChange={handleChange}
                    className="w-full bg-slate-950/80 text-amber-400 font-bold px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none"
                    readOnly
                  />
                </div>

                {/* DYNAMIC FIELDS: Transportation vs Materials */}
                {isTransportation ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Pickup Location <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            name="pickup_location"
                            value={formData.pickup_location}
                            onChange={handleChange}
                            placeholder="Quarry / Plant / Kathmandu Yard"
                            className={`w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border ${
                              errors.pickup_location ? 'border-red-500' : 'border-slate-800'
                            } focus:outline-none focus:border-amber-500`}
                          />
                        </div>
                        {errors.pickup_location && <p className="text-red-400 text-[11px] mt-1">{errors.pickup_location}</p>}
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Delivery Site Location <span className="text-amber-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="text"
                            name="delivery_location"
                            value={formData.delivery_location}
                            onChange={handleChange}
                            placeholder="Construction Site Location"
                            className={`w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border ${
                              errors.delivery_location ? 'border-red-500' : 'border-slate-800'
                            } focus:outline-none focus:border-amber-500`}
                          />
                        </div>
                        {errors.delivery_location && <p className="text-red-400 text-[11px] mt-1">{errors.delivery_location}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Material Type</label>
                        <input
                          type="text"
                          name="material_type"
                          value={formData.material_type}
                          onChange={handleChange}
                          placeholder="e.g. River Sand, Steel, Cement"
                          className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Approx. Quantity</label>
                        <input
                          type="text"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="e.g. 50 Tonnes / 5 Trips"
                          className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Vehicle Required</label>
                        <select
                          name="vehicle_required"
                          value={formData.vehicle_required}
                          onChange={handleChange}
                          className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                        >
                          <option value="10-Wheeler Tipper">10-Wheeler Tipper</option>
                          <option value="6-Wheeler Tipper">6-Wheeler Tipper</option>
                          <option value="Heavy Flatbed Truck">Heavy Flatbed Truck</option>
                          <option value="Tractor Trailer">Tractor Trailer</option>
                          <option value="Pickup Truck (Bolero)">Pickup Truck (Bolero)</option>
                          <option value="Loading/Unloading Labor">Loading/Unloading Labor</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Quantity</label>
                        <input
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          placeholder="e.g. 500"
                          className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Unit</label>
                        <input
                          type="text"
                          name="unit"
                          value={formData.unit}
                          onChange={handleChange}
                          placeholder="Bags, Tonne, Cu.ft, Pcs"
                          className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">
                          Required Date
                        </label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                          <input
                            type="date"
                            name="required_date"
                            value={formData.required_date}
                            onChange={handleChange}
                            className="w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Delivery Site Location <span className="text-amber-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          name="delivery_location"
                          value={formData.delivery_location}
                          onChange={handleChange}
                          placeholder="e.g. Lalitpur Ward 4 / Pokhara Highway Site"
                          className={`w-full bg-slate-950 text-white pl-9 pr-3 py-2.5 rounded-xl border ${
                            errors.delivery_location ? 'border-red-500' : 'border-slate-800'
                          } focus:outline-none focus:border-amber-500`}
                        />
                      </div>
                      {errors.delivery_location && <p className="text-red-400 text-[11px] mt-1">{errors.delivery_location}</p>}
                    </div>
                  </>
                )}

                {/* Additional Message */}
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Additional Project Specifications / Message</label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Specific brand requirements (e.g., Shivam / Jagdamba), grade, or access road details..."
                    className="w-full bg-slate-950 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 font-semibold"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={submitting}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50"
                  >
                    {submitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 stroke-[2.5]" />
                        <span>Submit Quote Request</span>
                      </>
                    )}
                  </motion.button>
                </div>

              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
