import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  FileText, 
  Mail, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  AlertCircle, 
  Package, 
  Filter, 
  Phone, 
  MapPin, 
  User,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminSection({ onClose }) {
  const [activeTab, setActiveTab] = useState('quotes');
  const [quotes, setQuotes] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [updateMsg, setUpdateMsg] = useState(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  async function loadAdminData() {
    setLoading(true);
    try {
      const quotesData = await api.getQuotes();
      setQuotes(quotesData || []);
    } catch (err) {
      console.error('Error loading admin quotes:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await api.updateQuoteStatus(id, newStatus);
      if (res.success) {
        setUpdateMsg(`Quote #${id} updated to ${newStatus}`);
        setQuotes(prev => prev.map(q => q.id === id ? { ...q, status: newStatus } : q));
        setTimeout(() => setUpdateMsg(null), 3000);
      }
    } catch (err) {
      console.error('Failed status update:', err);
    }
  };

  const filteredQuotes = quotes.filter(q => statusFilter === 'all' || q.status === statusFilter);

  return (
    <section className="py-12 bg-slate-950 text-white min-h-[600px] border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-slate-900 p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-md">
              <Settings className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-display text-white">RSY Supplier Admin Portal</h2>
              <p className="text-xs text-slate-400">
                Manage live customer quote requests, delivery status, and inventory availability
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-2 rounded-xl text-xs font-semibold"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Data</span>
            </button>
            <button
              onClick={onClose}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
            >
              Back to Storefront
            </button>
          </div>
        </div>

        {updateMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-bold rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{updateMsg}</span>
          </div>
        )}

        {/* Admin Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('quotes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quotes'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Quote Requests ({quotes.length})</span>
          </button>
        </div>

        {/* Filter bar for quotes */}
        <div className="flex items-center justify-between gap-4 mb-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-amber-500" />
            <span>Filter Status:</span>
            {['all', 'pending', 'in_review', 'quoted', 'completed'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg capitalize font-semibold ${
                  statusFilter === st ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-slate-900 text-slate-400'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <span>Showing {filteredQuotes.length} record(s)</span>
        </div>

        {/* Quotes Table / Cards */}
        {loading ? (
          <div className="py-12 text-center text-slate-400 text-sm">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-amber-500 mb-2" />
            Loading quote inquiries...
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="py-12 text-center bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm">
            <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            No quote requests found for the selected filter.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuotes.map((q) => (
              <div 
                key={q.id}
                className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-amber-500 font-bold text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      QUOTE #{q.id}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full font-extrabold uppercase text-[10px] ${
                      q.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                      q.status === 'quoted' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      q.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {q.status ? q.status.replace('_', ' ') : 'pending'}
                    </span>
                    <span className="text-slate-500 text-[11px] flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {new Date(q.created_at || Date.now()).toLocaleString()}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                    <div>
                      <div className="text-slate-400 font-medium">Customer:</div>
                      <div className="font-bold text-white flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-amber-500" /> {q.customer_name}
                      </div>
                      <div className="text-slate-300 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" /> {q.phone}
                      </div>
                    </div>

                    <div>
                      <div className="text-slate-400 font-medium">Item / Service:</div>
                      <div className="font-bold text-amber-400">{q.product_or_service}</div>
                      {q.quantity && (
                        <div className="text-slate-300">
                          Qty: <strong>{q.quantity} {q.unit}</strong>
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="text-slate-400 font-medium">Logistics Details:</div>
                      {q.pickup_location && (
                        <div className="text-slate-300 text-[11px]">
                          Pickup: <strong>{q.pickup_location}</strong>
                        </div>
                      )}
                      <div className="text-slate-300 text-[11px] flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-amber-500 shrink-0" /> Delivery: <strong>{q.delivery_location || 'Not Specified'}</strong>
                      </div>
                    </div>
                  </div>

                  {q.message && (
                    <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 text-slate-300 text-xs italic">
                      "{q.message}"
                    </div>
                  )}
                </div>

                {/* Status Selector */}
                <div className="flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-slate-800 pt-3 lg:pt-0 lg:pl-4 shrink-0">
                  <span className="text-xs text-slate-400 font-semibold">Set Status:</span>
                  <select
                    value={q.status || 'pending'}
                    onChange={(e) => handleStatusChange(q.id, e.target.value)}
                    className="bg-slate-950 text-amber-400 font-bold px-3 py-1.5 rounded-xl border border-slate-800 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_review">In Review</option>
                    <option value="quoted">Quoted</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
