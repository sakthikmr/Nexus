import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Receipt, CreditCard, Clock, Filter, 
  Search, ArrowUpRight, AlertCircle, CheckCircle2,
  MoreVertical, FileText, Download, Building2,
  Calendar, TrendingUp, BarChart3, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Invoice } from '../types.ts';
import { cn } from '../lib/utils.ts';
import { MOCK_INVOICES } from '../services/mockData.ts';

import { db } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const FinanceView = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [activeTab, setActiveTab] = useState<'ALL' | 'OVERDUE' | 'DISPUTED' | 'PAID' | 'REVENUE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'invoices'), orderBy('dueDate', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
        setInvoices(data);
      }
    }, (error) => {
      console.error("Finance Firebase Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const filtered = invoices.filter(inv => {
    const matchesSearch = inv.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'ALL') return matchesSearch;
    if (activeTab === 'OVERDUE') return inv.status === 'Overdue' && matchesSearch;
    if (activeTab === 'DISPUTED') return inv.status === 'Disputed' && matchesSearch;
    if (activeTab === 'PAID') return inv.status === 'Paid' && matchesSearch;
    return matchesSearch;
  });

  const getStatusStyle = (status: Invoice['status']) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Overdue': return 'bg-red-50 text-red-700 border-red-100';
      case 'Disputed': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Under Review': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl shadow-sm border border-emerald-200">
               <DollarSign size={22} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight text-stroke-thin">Finance Desktop</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Invoicing, Payment Tracking & Fiscal Governance.</p>
        </div>
        
        <div className="flex gap-4">
           <button className="px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
             <Download size={18} />
             Export Aging Report
           </button>
           <button className="px-6 py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-2xl">
             <Receipt size={18} />
             New Invoice Entry
           </button>
        </div>
      </div>

      {/* Financial Health KPIs */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Pending Payments', value: '$1.42M', delta: '+12%', icon: Clock, color: 'text-amber-600' },
          { label: 'Disputed Claims', value: '$42.5K', delta: '-5%', icon: AlertCircle, color: 'text-red-500' },
          { label: 'Avg Payment Cycle', value: '18 Days', delta: '-2 Days', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Revenue In-Flow', value: '$4.8M', delta: '+8.4%', icon: BarChart3, color: 'text-indigo-600' }
        ].map(kpi => (
          <div key={kpi.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <kpi.icon className={cn("absolute -right-2 -bottom-2 text-slate-50 scale-[2.5] transition-transform group-hover:rotate-12", kpi.color.replace('text', 'text-opacity-10 text'))} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">{kpi.label}</p>
            <div className="text-2xl font-black text-slate-900 mb-1 relative z-10">{kpi.value}</div>
            <p className={cn("text-[10px] font-bold relative z-10", kpi.delta.startsWith('+') ? 'text-emerald-500' : 'text-red-500')}>
              {kpi.delta} vs Last Month
            </p>
          </div>
        ))}
      </div>

      {/* Navigation & Controls */}
      <div className="flex justify-between items-center bg-white p-2 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex gap-1">
            {[
              { id: 'ALL', label: 'All Invoices' },
              { id: 'OVERDUE', label: 'Overdue' },
              { id: 'DISPUTED', label: 'Disputes' },
              { id: 'PAID', label: 'Recently Paid' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-4 pr-4">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Search Reference..."
                 className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs focus:ring-2 focus:ring-emerald-100 outline-none w-64"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-900"><Filter size={20} /></button>
         </div>
      </div>

      {/* Invoice Table Grid */}
      <div className="space-y-4">
         <div className="grid grid-cols-12 px-8 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div className="col-span-3">Vendor / Invoice #</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Due Date</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Submission</div>
            <div className="col-span-1 text-right">Action</div>
         </div>

         {filtered.map((inv) => (
           <motion.div
             layout
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             key={inv.id}
             className="bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-emerald-300 transition-all group shadow-sm hover:shadow-xl hover:shadow-emerald-500/5"
           >
             <div className="grid grid-cols-12 items-center">
                <div className="col-span-3 flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                      <Receipt size={20} />
                   </div>
                   <div>
                      <h4 className="font-black text-slate-900 text-sm group-hover:text-emerald-700 transition-colors">{inv.vendorName}</h4>
                      <p className="text-[10px] font-mono font-bold text-slate-400 uppercase">{inv.invoiceNumber}</p>
                   </div>
                </div>

                <div className="col-span-2">
                   <div className="flex items-center gap-1 font-black text-slate-900">
                      <span className="text-[10px] text-slate-400 font-bold">{inv.currency}</span>
                      {inv.amount.toLocaleString()}
                   </div>
                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">Base Multiplier Check: Pass</p>
                </div>

                <div className="col-span-2">
                   <div className="flex items-center gap-2 text-[11px] font-bold text-slate-700">
                      <Calendar size={14} className="text-slate-300" />
                      {inv.dueDate}
                   </div>
                   {inv.status === 'Overdue' && (
                     <p className="text-[9px] font-black text-red-500 uppercase mt-1">Exceeds 30-Day Cycle</p>
                   )}
                </div>

                <div className="col-span-2">
                   <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border", getStatusStyle(inv.status))}>
                      {inv.status === 'Paid' && <CheckCircle2 size={10} />}
                      {inv.status === 'Under Review' && <Clock size={10} />}
                      {inv.status}
                   </span>
                </div>

                <div className="col-span-2 text-[11px] font-bold text-slate-500">
                   {inv.submissionDate}
                </div>

                <div className="col-span-1 flex justify-end gap-2">
                   <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                      <FileText size={16} />
                   </button>
                   <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                      <ArrowUpRight size={16} />
                   </button>
                </div>
             </div>

             {inv.status === 'Disputed' && inv.disputeNote && (
               <div className="mt-4 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                     <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest mb-1">Dispute Note</p>
                     <p className="text-xs font-medium text-amber-800 italic">"{inv.disputeNote}"</p>
                  </div>
                  <button className="ml-auto text-[10px] font-black text-amber-600 uppercase hover:underline">Resolve Dispute</button>
               </div>
             )}
           </motion.div>
         ))}
      </div>

      {/* Payment Tracker Widget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="bg-slate-900 p-8 rounded-[3rem] text-white relative overflow-hidden">
            <Wallet className="absolute -right-8 -bottom-8 text-white/5 scale-[3] -rotate-12" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8 flex items-center gap-2">
               <CreditCard size={14} className="text-emerald-400" />
               Current Cash Cycle
            </h4>
            <div className="grid grid-cols-2 gap-10 relative z-10">
               <div>
                  <p className="text-3xl font-black mb-2">$840,200</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cleared This Week</p>
               </div>
               <div>
                  <p className="text-3xl font-black mb-2">$212,500</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Capture</p>
               </div>
            </div>
            <div className="mt-10 pt-8 border-t border-white/10 flex justify-between items-center relative z-10">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                     <TrendingUp size={20} />
                  </div>
                  <div>
                     <p className="text-xs font-bold leading-none mb-1">Treasury Positive</p>
                     <p className="text-[10px] text-slate-500">Auto-funding triggers active</p>
                  </div>
               </div>
               <button className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
                  Process Batch
               </button>
            </div>
         </div>

         <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative group overflow-hidden">
            <Building2 className="absolute -right-4 -bottom-4 text-slate-50 scale-[2.5] -rotate-12" />
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 font-mono">Top Vendor Aging</h4>
            <div className="space-y-6 relative z-10">
               {[
                 { vendor: 'Global Talent Solutions', amount: '$420k', health: '85%' },
                 { vendor: 'TalentHive Inc', amount: '$115k', health: '98%' },
                 { vendor: 'Quantum Cloud', amount: '$42k', health: '62%' }
               ].map(item => (
                 <div key={item.vendor}>
                    <div className="flex justify-between text-xs font-black mb-2 uppercase tracking-tighter">
                       <span>{item.vendor}</span>
                       <span className="text-slate-500">{item.amount}</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className={cn("h-full rounded-full transition-all duration-1000", 
                         parseInt(item.health) > 90 ? 'bg-emerald-500' : parseInt(item.health) > 70 ? 'bg-indigo-500' : 'bg-red-500'
                       )} style={{ width: item.health }} />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
