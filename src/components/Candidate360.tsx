import React from 'react';
import { 
  X, Mail, Phone, MapPin, Globe, Award, ShieldCheck, 
  Calendar, Briefcase, FileText, CheckCircle2, AlertCircle,
  ExternalLink, MessageSquare, Clock, History, UserCheck, Share2
} from 'lucide-react';
import { motion } from 'motion/react';
import { Candidate, RecruitmentStage, CustomerStatus } from '../types.ts';
import { cn } from '../lib/utils.ts';

interface Candidate360Props {
  candidate: Candidate;
  onClose: () => void;
  onUpdateStatus: (stage: RecruitmentStage, status: string) => void;
  onShareToCustomer: () => void;
}

export const Candidate360 = ({ candidate, onClose, onUpdateStatus, onShareToCustomer }: Candidate360Props) => {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="w-full max-w-4xl h-full bg-[#F8FAFC] shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-200">
              {candidate.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{candidate.name}</h2>
                <span className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                  candidate.source === 'Internal' ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                )}>
                  {candidate.source} Resource
                </span>
              </div>
              <p className="text-slate-500 font-medium text-sm">{candidate.currentCompany} • {candidate.experience} Experince</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Dual Action Bar */}
          <div className="flex gap-4">
            <button className="flex-1 bg-blue-600 text-white p-4 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100">
              <UserCheck size={20} />
              Update Internal Stage
            </button>
            <button 
              onClick={onShareToCustomer}
              className="flex-1 bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-center gap-3 font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <Share2 size={20} />
              Share to Customer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              {/* Status Tracking Summary */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Workflow Status</h3>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Internal Stage</p>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                        <History size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{candidate.stage}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{candidate.status}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Customer Status</p>
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center",
                        candidate.customerStatus === 'Yet to Share' ? "bg-slate-200 text-slate-500" : "bg-emerald-100 text-emerald-600"
                      )}>
                        <Globe size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{candidate.customerStatus}</p>
                        <p className="text-[11px] text-slate-500 font-medium tracking-tight">Active Visibility: Global FinOps</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline / History */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6">Interaction Timeline</h3>
                <div className="space-y-8 relative">
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-100" />
                  {candidate.history.map((h, i) => (
                    <div key={i} className="flex gap-6 relative">
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-600 z-10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="text-blue-600" size={14} />
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex justify-between items-center mb-1">
                          <p className="font-black text-slate-900 text-sm">{h.stage}</p>
                          <p className="text-[10px] font-bold text-slate-400">{h.date}</p>
                        </div>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">{h.action || 'Stage progression validated by recruiter.'}</p>
                      </div>
                    </div>
                  ))}
                  {/* Future Expected Steps */}
                  <div className="flex gap-6 opacity-30">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border-2 border-slate-200 z-10 flex items-center justify-center shrink-0" />
                    <div className="flex-1">
                      <p className="font-black text-slate-400 text-sm uppercase italic tracking-tighter">Next: Final Selection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Profile Links & Docs */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Repository</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Master Resume', icon: FileText },
                    { name: 'Technical Test Report', icon: Award },
                    { name: 'Customer Sub Profile', icon: Share2 },
                    { name: 'Background Check', icon: ShieldCheck }
                  ].map((doc, idx) => (
                    <button key={idx} className="w-full p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-blue-300 transition-all">
                      <div className="flex items-center gap-3">
                        <doc.icon className="text-slate-400 group-hover:text-blue-600 transition-colors" size={16} />
                        <span className="text-xs font-bold text-slate-700">{doc.name}</span>
                      </div>
                      <Download size={14} className="text-slate-300" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recruiter Notes */}
              <div className="bg-slate-900 p-6 rounded-3xl text-white">
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare size={16} className="text-blue-400" />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300">Internal Remarks</h4>
                </div>
                <div className="space-y-4">
                  <div className="text-xs font-medium leading-relaxed italic text-slate-200">
                    "Candidate shows high proficiency in cloud infrastructure. Communication scores are above average. Highly recommended for the FinDev role."
                  </div>
                  <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[8px] font-bold">SM</div>
                    <span className="text-[10px] text-slate-400 italic">Added by Sarah Miller (Recruiter)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const Download = ({ size, className }: { size: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);
