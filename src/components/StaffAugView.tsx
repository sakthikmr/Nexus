import React, { useState, useEffect } from 'react';
import { 
  Users, MapPin, Briefcase, Calendar, Search, Filter, 
  ChevronRight, MoreVertical, LayoutGrid, List,
  UserCheck, UserMinus, RefreshCcw, TrendingUp,
  DollarSign, ShieldCheck, Globe, Clock, Terminal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Resource } from '../types.ts';
import { cn } from '../lib/utils.ts';
import { MOCK_RESOURCES } from '../services/mockData.ts';

import { db, auth } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const StaffAugView = () => {
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [view, setView] = useState<'DEPLOYED' | 'BENCH' | 'EXITED'>('DEPLOYED');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let unsubscribeSnap: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnap) unsubscribeSnap();

      if (!user) {
        setResources(MOCK_RESOURCES);
        return;
      }

      const q = query(collection(db, 'resources'), orderBy('id'));
      unsubscribeSnap = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Resource));
          setResources(data);
        }
      }, (error) => {
        console.error("StaffAug Firebase Error:", error);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, []);

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (r.customer?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    if (view === 'DEPLOYED') return r.status === 'Deployed' && matchesSearch;
    if (view === 'BENCH') return r.status === 'Bench' && matchesSearch;
    if (view === 'EXITED') return r.status === 'Exited' && matchesSearch;
    return matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Module Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl shadow-sm border border-indigo-200">
               <RefreshCcw size={18} className="animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Resources</h2>
          </div>
          <p className="text-slate-500 font-medium italic text-sm">Deployment & Bench Optimization.</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
          {[
            { id: 'DEPLOYED', label: 'Active', icon: Globe },
            { id: 'BENCH', label: 'Bench', icon: Users },
            { id: 'EXITED', label: 'Exits', icon: UserMinus }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                view === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deployment KPIs */}
      <div className="grid grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-indigo-500 transition-colors">Utilization</p>
            <div className="flex items-baseline gap-2">
               <div className="text-xl font-black text-slate-900">88.4%</div>
               <div className="text-[9px] font-bold text-emerald-600">+2.1%</div>
            </div>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Headcount</p>
            <div className="text-xl font-black text-slate-900">{resources.length}</div>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 text-indigo-500">Bench</p>
            <div className="text-xl font-black text-slate-900">{resources.filter(r => r.status === 'Bench').length}</div>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all text-left">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Billing</p>
            <div className="flex items-center gap-1">
               <span className="text-slate-400 font-black text-sm">$</span>
               <div className="text-xl font-black text-slate-900">2.44M</div>
            </div>
         </div>
      </div>

      {/* Control Bar */}
      <div className="flex gap-3 items-center">
         <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
               type="text" 
               placeholder="Search resources..."
               className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-[11px] font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <button className="px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl">
           <RefreshCcw size={14} />
           Audit
         </button>
      </div>

      {/* Resource Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
         <AnimatePresence mode="popLayout">
           {filteredResources.map((resource) => (
             <motion.div
               layout
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.98 }}
               key={resource.id}
               className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group cursor-pointer relative overflow-hidden text-left"
             >
               <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-sm text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner shrink-0">
                        {resource.name.substring(0, 2).toUpperCase()}
                     </div>
                     <div className="min-w-0">
                        <h3 className="text-base font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-none mb-1 truncate uppercase">{resource.name}</h3>
                        <div className="flex items-center gap-2">
                           <span className={cn(
                             "px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase border",
                             resource.source === 'Vendor' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                           )}>
                             {resource.source}
                           </span>
                           <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">ID: {resource.id}</span>
                        </div>
                     </div>
                  </div>
                  <button className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900 shrink-0">
                    <MoreVertical size={14} />
                  </button>
               </div>

               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Client</p>
                        <p className="text-[11px] font-bold text-slate-800 line-clamp-1 uppercase">{resource.customer || 'Bench'}</p>
                     </div>
                     <div className="space-y-0.5">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Rate</p>
                        <p className="text-[11px] font-bold text-indigo-600">${resource.billingRate}/hr</p>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                     {resource.skills.slice(0, 3).map(skill => (
                       <span key={skill} className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[7px] font-bold text-slate-500 uppercase">{skill}</span>
                     ))}
                     {resource.skills.length > 3 && <span className="text-[7px] font-bold text-slate-400">+{resource.skills.length - 3}</span>}
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase">
                        <Calendar size={10} />
                        {resource.status === 'Deployed' ? `Since ${resource.deploymentDate}` : `Joined ${resource.joiningDate}`}
                     </div>
                     <div className={cn(
                        "flex items-center gap-1 text-[8px] font-black uppercase",
                        resource.billingStatus === 'Active' ? "text-emerald-500" : "text-amber-500"
                      )}>
                        <div className={cn("w-1 h-1 rounded-full", resource.billingStatus === 'Active' ? "bg-emerald-500 shadow-sm" : "bg-amber-500")} />
                        {resource.billingStatus}
                     </div>
                  </div>
               </div>
               {/* Background Decorative Element */}
               <Briefcase className="absolute -right-4 -bottom-6 text-slate-50 group-hover:text-indigo-50/40 transition-colors -rotate-12 scale-150" />
             </motion.div>
           ))}
         </AnimatePresence>
      </div>
    </div>
  );
};
