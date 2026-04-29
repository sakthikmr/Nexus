import React, { useState, useEffect } from 'react';
import { 
  DollarSign, Receipt, CreditCard, Clock, Filter, 
  Search, ArrowUpRight, AlertCircle, CheckCircle2,
  MoreVertical, FileText, Download, Building2,
  Calendar, TrendingUp, BarChart3, Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Invoice } from '../types.ts';
import { NewInvoiceModal } from './NewInvoiceModal.tsx';
import { cn } from '../lib/utils.ts';
import { MOCK_INVOICES } from '../services/mockData.ts';

import { db, auth } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const FinanceView = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [activeTab, setActiveTab] = useState<'ALL' | 'OVERDUE' | 'DISPUTED' | 'PAID' | 'REVENUE'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let unsubscribeSnap: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnap) unsubscribeSnap();

      if (!user) {
        setInvoices(MOCK_INVOICES);
        return;
      }

      const q = query(collection(db, 'invoices'), orderBy('dueDate', 'desc'));
      unsubscribeSnap = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
          setInvoices(data);
        } else {
          setInvoices(MOCK_INVOICES);
        }
      }, (error) => {
        console.error("Finance Firebase Error:", error);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
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
    <div className="space-y-10 text-left">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl shadow-sm border border-emerald-200">
               <DollarSign size={22} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Finance Desktop</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Invoicing, Payment Tracking & Fiscal Governance.</p>
        </div>
        
        <div className="flex gap-4">
           <button className="px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm font-mono tracking-tighter">
             <Download size={18} /> Aging Report
           </button>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-8 py-4 bg-slate-900 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-2xl"
           >
             <Receipt size={18} /> New Entry
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
          <div key={kpi.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group text-left">
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
      <div className="flex justify-between items-center bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex gap-1.5">
            {[
              { id: 'ALL', label: 'Global Ledger' },
              { id: 'OVERDUE', label: 'Overdue' },
              { id: 'DISPUTED', label: 'Disputes' },
              { id: 'PAID', label: 'Paid Flow' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </button>
            ))}
         </div>
         <div className="flex items-center gap-4 pr-4">
            <div className="relative group overflow-hidden">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={16} />
               <input 
                 type="text" 
                 placeholder="Search Reference..."
                 className="pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-emerald-100 outline-none w-64 transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
            </div>
            <button className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-inner"><Filter size={18} /></button>
         </div>
      </div>

      {/* Invoice Table Grid */}
      <div className="space-y-6">
         <div className="grid grid-cols-12 px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
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
             className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-emerald-400 transition-all group shadow-sm hover:shadow-[0_20px_50px_rgba(16,185,129,0.1)] text-left relative overflow-hidden"
           >
             <div className="grid grid-cols-12 items-center relative z-10">
                <div className="col-span-3 flex items-center gap-6">
                   <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-[1.2rem] flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-inner">
                      <Receipt size={24} />
                   </div>
                   <div className="text-left">
                      <h4 className="font-black text-slate-900 text-lg group-hover:text-emerald-700 transition-colors tracking-tight leading-none mb-2 uppercase">{inv.vendorName}</h4>
                      <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">{inv.invoiceNumber}</p>
                   </div>
                </div>

                <div className="col-span-2 text-left">
                   <div className="flex items-center gap-1 font-black text-slate-900 text-lg tracking-tighter">
                      <span className="text-[10px] text-slate-300 font-black uppercase tracking-widest mr-1">{inv.currency}</span>
                      {inv.amount.toLocaleString()}
                   </div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter italic opacity-60">Base Multiplier Check: Pass</p>
                </div>

                <div className="col-span-2 text-left">
                   <div className="flex items-center gap-2 text-xs font-black text-slate-800 uppercase tracking-tight">
                      <Calendar size={14} className="text-emerald-400" />
                      {inv.dueDate}
                   </div>
                   {inv.status === 'Overdue' && (
                     <p className="text-[9px] font-black text-red-500 uppercase mt-2 tracking-tighter">Exceeds 30-Day Fiscal Cycle</p>
                   )}
                </div>

                <div className="col-span-2">
                   <span className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase border shadow-sm", getStatusStyle(inv.status))}>
                      {inv.status === 'Paid' && <CheckCircle2 size={12} />}
                      {inv.status === 'Under Review' && <Clock size={12} className="animate-spin-slow" />}
                      {inv.status}
                   </span>
                </div>

                <div className="col-span-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   {inv.submissionDate}
                </div>

                <div className="col-span-1 flex justify-end gap-3">
                   <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:bg-indigo-600 hover:text-white transition-all group-active:scale-90 border border-slate-100 shadow-inner">
                      <FileText size={18} />
                   </button>
                   <button className="p-3 bg-slate-50 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all group-active:scale-90 border border-slate-100 shadow-inner">
                      <ArrowUpRight size={18} />
                   </button>
                </div>
             </div>

             {inv.status === 'Disputed' && inv.disputeNote && (
               <div className="mt-8 p-6 bg-red-50/50 rounded-[1.5rem] border border-red-100 flex items-start gap-4 shadow-inner relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-5"><AlertCircle size={80} /></div>
                  <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                     <p className="text-[10px] font-black text-red-700 uppercase tracking-[0.2em] mb-2 font-mono">Dispute Protocol Invoked</p>
                     <p className="text-sm font-bold text-slate-700 italic leading-relaxed">"{inv.disputeNote}"</p>
                  </div>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-700 transition-all font-mono">Resolve Dispute</button>
               </div>
             )}
           </motion.div>
         ))}
      </div>

      {/* Payment Tracker Widget Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <Wallet className="absolute -right-8 -bottom-8 text-white/5 scale-[3] -rotate-12" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-10 flex items-center gap-3 font-mono">
               <CreditCard size={16} className="text-emerald-500" />
               Current Cash Cycle
            </h4>
            <div className="grid grid-cols-2 gap-14 relative z-10 text-left">
               <div>
                  <p className="text-4xl font-black mb-3 tracking-tighter">$840,200</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Cleared This Week</p>
               </div>
               <div>
                  <p className="text-4xl font-black mb-3 tracking-tighter">$212,500</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Awaiting Capture</p>
               </div>
            </div>
            <div className="mt-12 pt-10 border-t border-white/5 flex justify-between items-center relative z-10">
               <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-[1.5rem] flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-emerald-500/10 shadow-lg">
                     <TrendingUp size={24} />
                  </div>
                  <div className="text-left">
                     <p className="text-sm font-black tracking-tight mb-1 uppercase font-mono">Treasury Positive</p>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Auto-funding triggers active</p>
                  </div>
               </div>
               <button className="px-8 py-5 bg-white text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all shadow-xl active:scale-95">
                  Process Batch
               </button>
            </div>
         </div>

         <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm relative group overflow-hidden text-left">
            <Building2 className="absolute -right-4 -bottom-4 text-slate-50 scale-[2.5] -rotate-12" />
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-10 font-mono italic">Top Vendor Aging Matrix</h4>
            <div className="space-y-10 relative z-10">
               {[
                 { vendor: 'Global Talent Solutions', amount: '$420k', health: '85%' },
                 { vendor: 'TalentHive Inc', amount: '$115k', health: '98%' },
                 { vendor: 'Quantum Cloud', amount: '$42k', health: '62%' }
               ].map(item => (
                 <div key={item.vendor}>
                    <div className="flex justify-between text-xs font-black mb-3 uppercase tracking-widest">
                       <span className="text-slate-800">{item.vendor}</span>
                       <span className="text-slate-400 font-mono">{item.amount}</span>
                    </div>
                    <div className="h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100 shadow-inner">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: item.health }}
                         transition={{ duration: 1, ease: "easeOut" }}
                         className={cn("h-full rounded-full transition-all duration-1000", 
                           parseInt(item.health) > 90 ? 'bg-emerald-500 shadow-emerald-200' : parseInt(item.health) > 70 ? 'bg-indigo-500 shadow-indigo-200' : 'bg-red-500 shadow-red-200'
                         )} 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <NewInvoiceModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
