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
      <div className="space-y-8 pb-20">
        <button 
          onClick={() => setView('LIST')}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowRight className="rotate-180" size={16} />
          Back to Onboarding Queue
        </button>

        <div className="flex justify-between items-start">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-200">
              {selectedApp.vendorName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedApp.vendorName}</h2>
                 <span className={cn("px-3 py-1 rounded-full text-[10px] font-black uppercase", getStageColor(selectedApp.stage))}>
                   {selectedApp.stage}
                 </span>
              </div>
              <p className="text-slate-500 mt-1 font-medium">Application ID: <span className="text-slate-800">{selectedApp.id}</span> • Category: {selectedApp.category}</p>
            </div>
          </div>
          <div className="flex gap-3">
             <button className="px-5 py-2.5 bg-red-50 text-red-700 rounded-xl font-bold text-sm border border-red-100 hover:bg-red-100 transition-all">Reject Application</button>
             <button className="px-5 py-2.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-xl font-bold text-sm hover:bg-amber-100 flex items-center gap-2">
                <RefreshCw size={16} />
                Request Rework
             </button>
             <button className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-100">Approve & Activate</button>
          </div>
        </div>

        {/* Onboarding Overview */}
        <div className="grid grid-cols-3 gap-8">
           <div className="col-span-2 space-y-8">
              <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-slate-800">Onboarding Health</h3>
                    <div className="text-sm font-bold text-slate-400">{selectedApp.progress}% Complete</div>
                 </div>
                 <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-8">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedApp.progress}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                    />
                 </div>
                 <div className="grid grid-cols-4 gap-4">
                    {[
                      { label: 'KYC & Legal', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
                      { label: 'Security Review', status: 'In Review', icon: Clock, color: 'text-purple-500' },
                      { label: 'Financials', status: 'Approved', icon: CheckCircle2, color: 'text-emerald-500' },
                      { label: 'SLA Agreement', status: 'Pending', icon: AlertCircle, color: 'text-slate-300' }
                    ].map((step, idx) => (
                      <div key={idx} className="bg-slate-50 p-4 rounded-2xl text-center space-y-2 border border-slate-100">
                         <step.icon size={20} className={cn("mx-auto", step.color)} />
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{step.label}</p>
                         <p className="text-xs font-bold text-slate-800">{step.status}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Assessment Drilldown Integration */}
              <div className="border-t border-slate-100 pt-8">
                 <h3 className="text-xl font-black text-slate-900 mb-6 px-2">Detailed Due Diligence Workspace</h3>
                 <AssessmentReviewer />
              </div>
           </div>

           <div className="space-y-6">
              {/* Risk Scorecard */}
              <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                 <ShieldCheck className="absolute -right-8 -bottom-8 text-white/5" size={160} />
                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2 font-mono">Real-time Risk Score</p>
                 <div className="text-5xl font-black mb-2">{selectedApp.riskScore || '--'}</div>
                 <p className="text-sm text-slate-400 mb-6 font-medium italic">Calculated based on 24 automated parameters.</p>
                 <div className="flex gap-2">
                    <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-blue-500/20">{selectedApp.tier} Vendor</span>
                 </div>
              </div>

              {/* Document Evidence */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2 mb-6">
                    <FileText className="text-slate-400" size={18} />
                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Evidence Vault</h3>
                 </div>
                 <div className="space-y-3">
                   {selectedApp.docs.map(doc => (
                     <div key={doc} className="group p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-100/50 cursor-pointer transition-all">
                        <div className="flex items-center gap-3">
                           <FileText size={16} className="text-red-500" />
                           <span className="text-xs font-bold text-slate-700">{doc}</span>
                        </div>
                        <CheckCircle2 size={14} className="text-emerald-500" />
                     </div>
                   ))}
                   <button className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:border-blue-400 transition-all">
                      Internal Checklist
                   </button>
                 </div>
              </div>

              {/* Internal Comments */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                 <div className="flex items-center gap-2 mb-4">
                    <Star className="text-blue-500" size={18} />
                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Review Notes</h3>
                 </div>
                 <div className="text-xs text-slate-500 leading-relaxed space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-800 italic">
                      "Financial history looks robust, but need a secondary signature on the ESG environmental disclosure section."
                      <span className="block mt-2 font-bold text-[9px] uppercase tracking-widest">— Sarah V. (Legal)</span>
                    </div>
                 </div>
                 <input 
                   placeholder="Add internal review comment..."
                   className="mt-4 w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-blue-300 transition-all"
                 />
              </div>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
           <h2 className="text-3xl font-black text-slate-900 tracking-tight">Onboarding Engine</h2>
           <p className="text-slate-500 mt-1 font-medium italic">Unified queue for vendor qualification and compliance vetting.</p>
        </div>
        <div className="flex gap-4">
           <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search candidates..."
                className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-blue-300 w-64 bg-white"
              />
           </div>
           <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <UserPlus size={18} />
              Invite New Partner
           </button>
        </div>
      </div>

      {/* Analytics Highlights */}
      <div className="grid grid-cols-4 gap-6">
         {[
           { label: 'Active Pipeline', value: '12', icon: ClipboardList, color: 'text-blue-600' },
           { label: 'Avg. Onboarding', value: '14 Days', icon: Clock, color: 'text-purple-600' },
           { label: 'Conversion Rate', value: '92%', icon: Star, color: 'text-amber-500' },
           { label: 'Email Invites', value: '45', icon: Mail, color: 'text-emerald-500' }
         ].map((stat, idx) => (
           <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:shadow-md transition-all">
              <div className={cn("p-3 rounded-2xl bg-opacity-10", stat.color.replace('text-', 'bg-'))}>
                 <stat.icon className={stat.color} size={24} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                 <div className="text-xl font-black text-slate-900">{stat.value}</div>
              </div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/10 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
           <h3 className="font-bold text-slate-800">Operational Queue</h3>
           <button className="text-slate-400 hover:text-slate-600"><Filter size={18} /></button>
        </div>
        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead className="bg-[#F8FAFC] text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
                 <tr>
                    <th className="px-8 py-4">Application ID</th>
                    <th className="px-8 py-4">Vendor Partner</th>
                    <th className="px-8 py-4">Category</th>
                    <th className="px-8 py-4">Onboarding Stage</th>
                    <th className="px-8 py-4">Internal Progress</th>
                    <th className="px-8 py-4">Risk Rating</th>
                    <th className="px-8 py-4 text-center">Actions</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                 {loading ? (
                    <tr><td colSpan={7} className="text-center py-20 text-slate-400">Inventory fetching...</td></tr>
                 ) : apps.map(app => (
                   <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-6 font-mono text-xs font-bold text-slate-400 group-hover:text-blue-500 transition-colors">#{app.id}</td>
                      <td className="px-8 py-6">
                         <div className="font-bold text-slate-900">{app.vendorName}</div>
                         <div className="text-[10px] text-slate-400 font-medium">Applied: {app.submittedAt}</div>
                      </td>
                      <td className="px-8 py-6">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 px-2 py-1 rounded-lg">{app.category}</span>
                      </td>
                      <td className="px-8 py-6">
                         <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter", getStageColor(app.stage))}>
                           {app.stage}
                         </span>
                      </td>
                      <td className="px-8 py-6">
                         <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-[80px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                               <div className="h-full bg-blue-500 rounded-full" style={{ width: `${app.progress}%` }} />
                            </div>
                            <span className="text-[11px] font-bold text-slate-600">{app.progress}%</span>
                         </div>
                      </td>
                      <td className="px-8 py-6">
                         {app.riskScore > 0 ? (
                            <div className="flex items-center gap-2">
                               <div className={cn("w-2 h-2 rounded-full", app.riskScore > 80 ? "bg-red-500" : app.riskScore > 50 ? "bg-amber-500" : "bg-emerald-500")} />
                               <span className="text-xs font-bold text-slate-700">{app.riskScore}</span>
                            </div>
                         ) : (
                            <span className="text-xs text-slate-400 italic">Pending Calc</span>
                         )}
                      </td>
                      <td className="px-8 py-6 text-center">
                         <button 
                           onClick={() => { setSelectedApp(app); setView('DETAIL'); }}
                           className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                         >
                            <ChevronRight size={20} />
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
