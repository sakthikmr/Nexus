import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Search, Filter, ChevronRight, Clock, ShieldCheck, 
  AlertCircle, FileText, CheckCircle2, MoreHorizontal, ArrowRight,
  ClipboardList, Mail, RefreshCw, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { AssessmentReviewer } from './AssessmentReviewer.tsx';
import { db, auth } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

import { MOCK_ONBOARDING } from '../services/mockData.ts';

interface OnboardingApp {
  id: string;
  vendorName: string;
  category: string;
  stage: string;
  progress: number;
  submittedAt: string;
  riskScore: number;
  tier: string;
  docs: string[];
}

export const OnboardingView = () => {
  const [apps, setApps] = useState<OnboardingApp[]>(MOCK_ONBOARDING);
  const [selectedApp, setSelectedApp] = useState<OnboardingApp | null>(null);
  const [view, setView] = useState<'LIST' | 'DETAIL'>('LIST');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeSnap: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnap) unsubscribeSnap();

      if (!user) {
        setApps(MOCK_ONBOARDING);
        setLoading(false);
        return;
      }

      const q = query(collection(db, 'onboarding'), orderBy('submittedAt', 'desc'));
      unsubscribeSnap = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          setApps(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as OnboardingApp)));
        } else {
          setApps(MOCK_ONBOARDING);
        }
        setLoading(false);
      }, (error) => {
        console.warn("Onboarding Firebase Read Failed, using mocks", error);
        setApps(MOCK_ONBOARDING);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, []);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Under Review': return 'bg-purple-100 text-purple-700';
      case 'Submitted': return 'bg-blue-100 text-blue-700';
      case 'Rework Requested': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (view === 'DETAIL' && selectedApp) {
    return (
      <div className="space-y-6 pb-20 text-left">
        <button 
          onClick={() => setView('LIST')}
          className="flex items-center gap-2 text-[10px] font-black text-slate-500 hover:text-blue-600 transition-all uppercase tracking-widest"
        >
          <ArrowRight className="rotate-180" size={14} />
          Back
        </button>

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">
              {selectedApp.vendorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                 <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{selectedApp.vendorName}</h2>
                 <span className={cn("px-2 py-0.5 rounded-lg text-[8px] font-black uppercase", getStageColor(selectedApp.stage))}>
                   {selectedApp.stage}
                 </span>
              </div>
              <p className="text-slate-500 mt-0.5 text-[11px] font-medium italic">Application ID: {selectedApp.id} • {selectedApp.category}</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="px-4 py-2 bg-red-50 text-red-700 rounded-xl font-black text-[9px] uppercase tracking-widest border border-red-100 hover:bg-red-100 transition-all">Reject</button>
             <button className="px-4 py-2 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-amber-100 flex items-center gap-2">
                <RefreshCw size={14} />
                Rework
             </button>
             <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-emerald-700 shadow-lg shadow-emerald-100">Approve</button>
          </div>
        </div>

        {/* Onboarding Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Onboarding Health</h3>
                    <div className="text-[10px] font-black text-slate-400">{selectedApp.progress}% Complete</div>
                 </div>
                 <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-6">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedApp.progress}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    />
                 </div>
                 <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'KYC & Legal', status: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
                      { label: 'Security', status: 'Review', icon: Clock, color: 'text-purple-500' },
                      { label: 'Financials', status: 'Done', icon: CheckCircle2, color: 'text-emerald-500' },
                      { label: 'SLA', status: 'Pending', icon: AlertCircle, color: 'text-slate-300' }
                    ].map((step, idx) => (
                      <div key={idx} className="bg-slate-50 p-3 rounded-xl text-center space-y-1.5 border border-slate-100">
                         <step.icon size={16} className={cn("mx-auto", step.color)} />
                         <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter truncate">{step.label}</p>
                         <p className="text-[10px] font-bold text-slate-800 uppercase">{step.status}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Assessment Drilldown Integration */}
              <div className="border-t border-slate-100 pt-6">
                 <h3 className="text-base font-black text-slate-900 mb-4 px-2 uppercase tracking-tight">Vetting Workspace</h3>
                 <AssessmentReviewer />
              </div>
           </div>

           <div className="space-y-4">
              {/* Risk Scorecard */}
              <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden shadow-xl">
                 <ShieldCheck className="absolute -right-6 -bottom-6 text-white/5 opacity-50" size={120} />
                 <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1 font-mono">Risk Score</p>
                 <div className="text-4xl font-black mb-1">{selectedApp.riskScore || '--'}</div>
                 <p className="text-[10px] text-slate-400 mb-4 font-medium italic opacity-80 leading-tight">Automated Vetting Results.</p>
                 <div className="flex gap-2">
                    <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border border-blue-500/20">{selectedApp.tier}</span>
                 </div>
              </div>

              {/* Document Evidence */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2 mb-4">
                    <FileText className="text-slate-400" size={16} />
                    <h3 className="font-black text-slate-800 uppercase text-[9px] tracking-widest">Evidence Vault</h3>
                 </div>
                 <div className="space-y-2">
                   {selectedApp.docs.map(doc => (
                     <div key={doc} className="group p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-100 cursor-pointer transition-all">
                        <div className="flex items-center gap-2 min-w-0">
                           <FileText size={14} className="text-red-500 shrink-0" />
                           <span className="text-[10px] font-bold text-slate-700 truncate">{doc}</span>
                        </div>
                        <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                     </div>
                   ))}
                 </div>
              </div>

              {/* Internal Comments */}
              <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2 mb-3">
                    <Star className="text-blue-500" size={16} />
                    <h3 className="font-black text-slate-800 uppercase text-[9px] tracking-widest">Review Notes</h3>
                 </div>
                 <div className="text-[10px] text-slate-500 leading-relaxed font-medium italic p-3 bg-slate-50 rounded-xl border border-slate-100">
                    "Financial history looks robust, but need a secondary signature on the ESG environmental disclosure section."
                    <span className="block mt-2 font-black text-[8px] uppercase tracking-widest opacity-60">— Sarah V. (Legal)</span>
                 </div>
                 <input 
                   placeholder="Add review comment..."
                   className="mt-3 w-full p-2.5 bg-white border border-slate-200 rounded-xl text-[10px] outline-none focus:border-blue-300 transition-all font-medium"
                 />
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight">Onboarding</h2>
           <p className="text-slate-500 mt-0.5 font-medium italic text-sm">Unified vetting queue.</p>
        </div>
        <div className="flex gap-2">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search candidates..."
                className="pl-9 pr-3 py-1.5 border border-slate-200 rounded-xl text-[11px] outline-none focus:border-blue-300 w-48 bg-white"
              />
           </div>
           <button className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <UserPlus size={16} />
              Invite
           </button>
        </div>
      </div>

      {/* Analytics Highlights */}
      <div className="grid grid-cols-4 gap-4">
         {[
            { label: 'Pipeline', value: '12', icon: ClipboardList, color: 'text-blue-600' },
            { label: 'Avg Time', value: '14 Days', icon: Clock, color: 'text-purple-600' },
            { label: 'Success', value: '92%', icon: Star, color: 'text-amber-500' },
            { label: 'Invites', value: '45', icon: Mail, color: 'text-emerald-500' }
         ].map((stat, idx) => (
           <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 group hover:shadow-md transition-all text-left">
              <div className={cn("p-2 rounded-xl bg-opacity-10 shrink-0", stat.color.replace('text-', 'bg-'))}>
                 <stat.icon className={stat.color} size={18} />
              </div>
              <div className="min-w-0">
                 <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                 <div className="text-lg font-black text-slate-900">{stat.value}</div>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-left">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="font-bold text-slate-800 text-[11px] uppercase tracking-widest">Operational Queue</h3>
           <button className="text-slate-400 hover:text-slate-600"><Filter size={14} /></button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                 <tr>
                    <th className="px-6 py-3">ID</th>
                    <th className="px-6 py-3">Vendor</th>
                    <th className="px-6 py-3">Category</th>
                    <th className="px-6 py-3">Stage</th>
                    <th className="px-6 py-3">Progress</th>
                    <th className="px-6 py-3">Risk</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {loading ? (
                    <tr><td colSpan={7} className="text-center py-10 text-slate-400">Fetching...</td></tr>
                 ) : apps.map(app => (
                   <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-3 font-mono text-[10px] font-bold text-slate-400 group-hover:text-blue-500 transition-colors">#{app.id}</td>
                      <td className="px-6 py-3">
                         <div className="font-bold text-slate-900 text-[11px] uppercase">{app.vendorName}</div>
                         <div className="text-[9px] text-slate-400 font-medium">{app.submittedAt}</div>
                      </td>
                      <td className="px-6 py-3">
                         <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded-lg">{app.category}</span>
                      </td>
                      <td className="px-6 py-3">
                         <span className={cn("px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter", getStageColor(app.stage))}>
                           {app.stage}
                         </span>
                      </td>
                      <td className="px-6 py-3">
                         <div className="flex items-center gap-2">
                            <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden shrink-0">
                               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${app.progress}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-slate-600">{app.progress}%</span>
                         </div>
                      </td>
                      <td className="px-6 py-3">
                         {app.riskScore > 0 ? (
                            <div className="flex items-center gap-1.5">
                               <div className={cn("w-1.5 h-1.5 rounded-full", app.riskScore > 80 ? "bg-red-500" : app.riskScore > 50 ? "bg-amber-500" : "bg-emerald-500")} />
                               <span className="text-[10px] font-bold text-slate-700">{app.riskScore}</span>
                            </div>
                         ) : (
                            <span className="text-[10px] text-slate-400 italic">Pending</span>
                         )}
                      </td>
                      <td className="px-6 py-3 text-right">
                         <button 
                           onClick={() => { setSelectedApp(app); setView('DETAIL'); }}
                           className="p-1.5 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                         >
                            <ChevronRight size={16} />
                         </button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
};
