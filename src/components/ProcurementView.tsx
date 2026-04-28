import React, { useState, useEffect } from 'react';
import { 
  FileText, ShoppingBag, Truck, HardDrive, BarChart3, 
  Calendar, Clock, ShieldAlert, CheckCircle2, ChevronRight,
  Search, Filter, Plus, DollarSign, Users, Briefcase, Tag,
  ArrowUpRight, AlertCircle, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProcurementRequirement, ProcurementType, ProcurementStatus } from '../types.ts';
import { cn } from '../lib/utils.ts';
import { MOCK_PROCUREMENT } from '../services/mockData.ts';

import { db, auth } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const ProcurementView = () => {
  const [requirements, setRequirements] = useState<ProcurementRequirement[]>(MOCK_PROCUREMENT);
  const [activeTab, setActiveTab] = useState<ProcurementType | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm border border-indigo-200">
               <ShoppingBag size={22} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Requirement Engine</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Publishing Tenders, SOWs & Asset Procurement Mandates.</p>
        </div>
        
        <button className="px-6 py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-2xl">
           <Plus size={18} />
           New Requirement
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-px">
        {[
          { id: 'ALL', label: 'All Activities', icon: BarChart3 },
          { id: 'PROJECT_SOW', label: 'Projects & SOW', icon: Briefcase },
          { id: 'RFQ_RFP', label: 'Tenders (RFQ/RFP)', icon: FileText },
          { id: 'ASSET_PROCUREMENT', label: 'Assets & IT', icon: HardDrive },
          { id: 'SERVICE_CONTRACT', label: 'Services', icon: Truck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-widest transition-all relative",
              activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {activeTab === tab.id && (
              <motion.div layoutId="proc-active-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full" />
            )}
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className="relative group">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
             <input 
               type="text" 
               placeholder="Search by ID, Requirement Title, or Department..."
               className="w-full bg-white border border-slate-200 rounded-3xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
             />
          </div>

          <div className="grid grid-cols-1 gap-6">
            {filtered.map((req) => (
              <motion.div 
                layout
                key={req.id}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-6 relative z-10">
                   <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                         {getTypeIcon(req.type)}
                      </div>
                      <div>
                         <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{req.title}</h3>
                            <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase border", getStatusColor(req.status))}>
                               {req.status}
                            </span>
                         </div>
                         <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 uppercase tracking-tight">
                            <span>ID: {req.id}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span>{req.department}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="flex items-center gap-1"><Calendar size={12} /> Deadline: {req.deadline}</span>
                         </div>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Est. Budget</p>
                      <p className="text-xl font-black text-slate-900">{req.budget}</p>
                   </div>
                </div>

                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8 relative z-10 line-clamp-2 italic">
                  "{req.description}"
                </p>

                <div className="flex justify-between items-center pt-8 border-t border-slate-50 relative z-10">
                   <div className="flex items-center gap-8">
                      <div className="flex items-center gap-2">
                         <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                              <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400">V</div>
                            ))}
                         </div>
                         <p className="text-xs font-bold text-slate-400">{req.bidCount} Bids Submitted</p>
                      </div>
                      {req.priority === 'Critical' && (
                        <div className="flex items-center gap-2 text-red-500">
                           <ShieldAlert size={14} />
                           <span className="text-[10px] font-black uppercase tracking-widest">Priority Critical</span>
                        </div>
                      )}
                   </div>
                   <button className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:translate-x-2 transition-transform">
                      Evaluate Submissions <ArrowUpRight size={18} />
                   </button>
                </div>

                {/* Background Decor */}
                <Tag size={120} className="absolute -right-4 -bottom-6 text-slate-50 group-hover:text-indigo-50/40 transition-colors -rotate-12 scale-150" />
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
           {/* Requirement Insights */}
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white space-y-8 relative overflow-hidden">
              <BarChart3 className="absolute -right-6 -bottom-6 text-white/5 scale-150" size={120} />
              <div>
                 <h4 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Engine Activity</h4>
                 <div className="space-y-6">
                    <div>
                       <div className="flex justify-between text-xs font-black mb-2">
                          <span>AWARDED VALUE</span>
                          <span className="text-indigo-400">$8.2M</span>
                       </div>
                       <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: '72%' }} />
                       </div>
                    </div>
                    <div>
                       <div className="flex justify-between text-xs font-black mb-2">
                          <span>SAVINGS ACHIEVED</span>
                          <span className="text-emerald-400">14.2%</span>
                       </div>
                       <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{ width: '45%' }} />
                       </div>
                    </div>
                 </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                 <button className="w-full py-4 bg-indigo-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20">
                    Generate Spend Report
                 </button>
                 <button className="w-full py-4 bg-white/10 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/5">
                    Vendor Qualification
                 </button>
              </div>
           </div>

           {/* Quick Tips/Help */}
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3 text-indigo-600">
                 <AlertCircle size={20} />
                 <h4 className="font-black uppercase text-xs tracking-widest">Protocol Guidance</h4>
              </div>
              <ul className="space-y-4">
                 {[
                   'All RFPs above $50k require 3+ bids.',
                   'Technical evaluation must be blind for Phase 1.',
                   'Audit trail is immutable for awarded bids.'
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-3 items-start">
                      <div className="mt-1 w-1.5 h-1.5 rounded-full bg-slate-200 shrink-0" />
                      <p className="text-xs font-medium text-slate-500 leading-relaxed">{tip}</p>
                   </li>
                 ))}
              </ul>
              <div className="pt-6 border-t border-slate-50">
                 <button className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase hover:underline">
                    View Full Compliance Book <MessageSquare size={14} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
