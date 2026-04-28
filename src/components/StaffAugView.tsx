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
    <div className="space-y-10">
      {/* Module Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-100 text-indigo-600 rounded-2xl shadow-sm border border-indigo-200">
               <RefreshCcw size={22} className="animate-spin-slow" />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Resource Management</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Staff Augmentation, Deployment Lifecycle & Bench Optimization.</p>
        </div>
        
        <div className="flex bg-white border border-slate-200 rounded-2xl p-1.5 gap-1 shadow-sm">
          {[
            { id: 'DEPLOYED', label: 'Active Deployment', icon: Globe },
            { id: 'BENCH', label: 'Bench Pool', icon: Users },
            { id: 'EXITED', label: 'Offboarding/Exits', icon: UserMinus }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                view === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Deployment KPIs */}
      <div className="grid grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">Utilization Rate</p>
            <div className="flex items-baseline gap-3">
               <div className="text-3xl font-black text-slate-900">88.4%</div>
               <div className="text-[10px] font-bold text-emerald-600">+2.1% MoM</div>
            </div>
            <div className="mt-4 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 rounded-full" style={{ width: '88%' }} />
            </div>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Headcount</p>
            <div className="text-3xl font-black text-slate-900">{resources.length}</div>
            <p className="mt-2 text-[10px] font-bold text-slate-400 uppercase italic">Across 8 Global Clusters</p>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-indigo-500 font-mono">Bench Exposure</p>
            <div className="text-3xl font-black text-slate-900">{resources.filter(r => r.status === 'Bench').length}</div>
            <p className="mt-2 text-[10px] font-bold text-amber-600 uppercase">Avg Hold: 14 Days</p>
         </div>
         <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-indigo-400 transition-all">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Monthly Billing</p>
            <div className="flex items-center gap-1">
               <span className="text-slate-400 font-black">$</span>
               <div className="text-3xl font-black text-slate-900">2.44M</div>
            </div>
            <p className="mt-2 text-[10px] font-bold text-slate-400 italic">Projected Gross</p>
         </div>
      </div>

      {/* Control Bar */}
      <div className="flex gap-4 items-center">
         <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
               type="text" 
               placeholder="Search by Resource Name, Skill, or Customer..."
               className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm font-medium focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 outline-none transition-all shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <button className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl">
           <RefreshCcw size={16} />
           Audit All Triggers
         </button>
      </div>

      {/* Resource Grid/List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
         <AnimatePresence mode="popLayout">
           {filteredResources.map((resource) => (
             <motion.div
               layout
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0, scale: 0.95 }}
               key={resource.id}
               className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-indigo-400 transition-all group cursor-pointer relative overflow-hidden"
             >
               <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-4">
                     <div className="w-14 h-14 bg-slate-100 rounded-[1.2rem] flex items-center justify-center font-black text-xl text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
                        {resource.name.substring(0, 2).toUpperCase()}
                     </div>
                     <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors leading-none mb-2">{resource.name}</h3>
                        <div className="flex items-center gap-2">
                           <span className={cn(
                             "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border",
                             resource.source === 'Vendor' ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-blue-50 text-blue-600 border-blue-100"
                           )}>
                             {resource.source}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID: {resource.id}</span>
                        </div>
                     </div>
                  </div>
                  <button className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-900">
                    <MoreVertical size={16} />
                  </button>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assignment</p>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{resource.customer || 'Bench (Allocating...)'}</p>
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Billing Rate</p>
                        <p className="text-sm font-bold text-indigo-600">${resource.billingRate}/hr</p>
                     </div>
                  </div>

                  <div className="space-y-2">
                     <div className="flex flex-wrap gap-1.5">
                        {resource.skills.map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-slate-500 uppercase">{skill}</span>
                        ))}
                     </div>
                  </div>

                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                     <div className="flex items-center gap-2 text-[10px] font-black text-slate-400">
                        <Calendar size={12} />
                        {resource.status === 'Deployed' ? `Since ${resource.deploymentDate}` : `Joined ${resource.joiningDate}`}
                     </div>
                     <div className={cn(
                        "flex items-center gap-1.5 text-[9px] font-black uppercase",
                        resource.billingStatus === 'Active' ? "text-emerald-500" : "text-amber-500"
                      )}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", resource.billingStatus === 'Active' ? "bg-emerald-500 shadow-sm shadow-emerald-200" : "bg-amber-500")} />
                        {resource.billingStatus} BILLING
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
