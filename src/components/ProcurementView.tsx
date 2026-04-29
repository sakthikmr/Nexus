import React, { useState, useEffect } from 'react';
import { 
  FileText, ShoppingBag, Truck, HardDrive, BarChart3, 
  Calendar, Clock, ShieldAlert, CheckCircle2, ChevronRight,
  Search, Filter, Plus, DollarSign, Users, Briefcase, Tag,
  ArrowUpRight, AlertCircle, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProcurementRequirement, ProcurementType, ProcurementStatus } from '../types.ts';
import { NewRequirementModal } from './NewRequirementModal.tsx';
import { cn } from '../lib/utils.ts';
import { MOCK_PROCUREMENT } from '../services/mockData.ts';

import { db, auth } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const ProcurementView = () => {
  const [requirements, setRequirements] = useState<ProcurementRequirement[]>(MOCK_PROCUREMENT);
  const [activeTab, setActiveTab] = useState<ProcurementType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let unsubscribeSnap: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnap) unsubscribeSnap();

      if (!user) {
        setRequirements(MOCK_PROCUREMENT);
        return;
      }

      const q = query(collection(db, 'procurement'), orderBy('deadline', 'asc'));
      unsubscribeSnap = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProcurementRequirement));
          setRequirements(data);
        } else {
          setRequirements(MOCK_PROCUREMENT);
        }
      }, (error) => {
        console.error("Procurement Firebase Error:", error);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, []);

  const getTypeIcon = (type: ProcurementType) => {
    switch (type) {
      case 'PROJECT_SOW': return <Briefcase size={20} />;
      case 'RFQ_RFP': return <FileText size={20} />;
      case 'ASSET_PROCUREMENT': return <HardDrive size={20} />;
      case 'SERVICE_CONTRACT': return <Truck size={20} />;
    }
  };

  const getStatusColor = (status: ProcurementStatus) => {
    switch (status) {
      case 'Bidding Open': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Evaluation': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Awarded': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Closed': return 'bg-slate-50 text-slate-500 border-slate-200';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  const filtered = requirements.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'ALL' || r.type === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm border border-indigo-200">
               <ShoppingBag size={18} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Procurement</h2>
          </div>
          <p className="text-slate-500 font-medium italic text-sm">Mandates & Tenders.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl"
        >
           <Plus size={16} />
           New Requirement
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto pb-px scrollbar-hide">
        {[
          { id: 'ALL', label: 'All', icon: BarChart3 },
          { id: 'PROJECT_SOW', label: 'SOW', icon: Briefcase },
          { id: 'RFQ_RFP', label: 'Tenders', icon: FileText },
          { id: 'ASSET_PROCUREMENT', label: 'Assets', icon: HardDrive },
          { id: 'SERVICE_CONTRACT', label: 'Services', icon: Truck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-[9px] font-black uppercase tracking-widest transition-all relative shrink-0",
              activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="proc-active-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
            )}
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
             <input 
               type="text" 
               placeholder="Search requirements..."
               className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-[11px] font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filtered.map((req) => (
              <motion.div 
                layout
                key={req.id}
                className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group relative overflow-hidden text-left"
              >
                <div className="flex justify-between items-start mb-4 relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner shrink-0">
                         {getTypeIcon(req.type)}
                      </div>
                      <div className="min-w-0">
                         <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase leading-tight truncate">{req.title}</h3>
                            <span className={cn("px-2 py-0.5 rounded-lg text-[8px] font-black uppercase border", getStatusColor(req.status))}>
                               {req.status}
                            </span>
                         </div>
                         <div className="flex items-center gap-3 text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">
                            <span>ID: {req.id}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="truncate">{req.department}</span>
                            <span className="w-1 h-1 bg-slate-200 rounded-full" />
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-indigo-400" /> {req.deadline}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-inner shrink-0">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Budget</p>
                      <p className="text-base font-black text-slate-900">{req.budget}</p>
                   </div>
                </div>

                <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6 relative z-10 line-clamp-2 italic pr-12">
                  "{req.description}"
                </p>

                <div className="flex justify-between items-center pt-4 border-t border-slate-50 relative z-10">
                   <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2">
                         <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-7 h-7 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[8px] font-black text-slate-400 shadow-sm">V</div>
                            ))}
                         </div>
                         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{req.bidCount} Active</p>
                      </div>
                      {req.priority === 'Critical' && (
                        <div className="flex items-center gap-1.5 text-red-500 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                           <ShieldAlert size={12} />
                           <span className="text-[8px] font-black uppercase tracking-widest">Critical</span>
                        </div>
                      )}
                   </div>
                   <button className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-transform">
                      Evaluate <ArrowUpRight size={16} />
                   </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-6 text-left">
           {/* Requirement Insights */}
           <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-6 relative overflow-hidden shadow-2xl">
              <BarChart3 className="absolute -right-4 -bottom-4 text-white/5 scale-125" size={100} />
              <div>
                 <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 font-mono">Monitor</h4>
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                          <span>Awarded</span>
                          <span className="text-indigo-400">$8.2M</span>
                       </div>
                       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" style={{ width: '72%' }} />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-[9px] font-black uppercase tracking-widest mb-2">
                          <span>Savings</span>
                          <span className="text-emerald-400">14.2%</span>
                       </div>
                       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: '45%' }} />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-3 pt-2 relative z-10">
                 <button className="w-full py-3 bg-indigo-600 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 transform active:scale-95">
                    Generate Spend
                 </button>
                 <button className="w-full py-3 bg-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5 transform active:scale-95">
                    Qualification
                 </button>
              </div>
           </div>

           {/* Quick Tips/Help */}
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-left">
              <div className="flex items-center gap-2 text-indigo-600">
                 <AlertCircle size={18} />
                 <h4 className="font-black uppercase text-[9px] tracking-widest italic">Governance</h4>
              </div>
              <ul className="space-y-4">
                 {[
                   'RFPs > $50k need 3+ bids.',
                   'Technical eval must be blind.',
                   'Audit trail is immutable.'
                 ].map((tip, i) => (
                    <li key={i} className="flex gap-3 items-start">
                       <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-100 border border-slate-200 shrink-0 shadow-inner" />
                       <p className="text-[10px] font-bold text-slate-500 leading-relaxed uppercase tracking-tight">{tip}</p>
                    </li>
                 ))}
              </ul>
              <div className="pt-4 border-t border-slate-50">
                 <button className="flex items-center gap-2 text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:translate-x-1 transition-all">
                    Compliance <MessageSquare size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>

      <NewRequirementModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
