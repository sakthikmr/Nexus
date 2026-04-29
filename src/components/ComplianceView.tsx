import React, { useState } from 'react';
import { 
  ShieldCheck, AlertCircle, FileText, CheckCircle2, Info, ChevronDown, 
  Search, Filter, Lock, ExternalLink, Download
} from 'lucide-react';
import { motion } from 'motion/react';

export const ComplianceView = () => {
  const [activeTab, setActiveTab] = useState<'ASSESSMENTS' | 'FRAMEWORK'>('ASSESSMENTS');

  const assessments = [
    { id: 'AS-901', vendor: 'Global Talent Solutions', category: 'Security Review', score: 92, status: 'Completed', reviewer: 'Sarah K.' },
    { id: 'AS-902', vendor: 'TechBridge Systems', category: 'Financial Audit', score: 78, status: 'In Progress', reviewer: 'Mark D.' },
    { id: 'AS-903', vendor: 'Facility Plus', category: 'Initial Onboarding', score: null, status: 'Pending Evidence', reviewer: null },
  ];

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-xl shadow-sm border border-purple-200">
               <ShieldCheck size={18} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Compliance</h2>
          </div>
          <p className="text-slate-500 font-medium italic text-sm">Governance & Vendor Qualification.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 text-[9px] uppercase tracking-widest transition-all shadow-sm">Templates</button>
          <button className="bg-purple-600 text-white px-5 py-2 rounded-xl font-black hover:bg-purple-700 transition-all flex items-center gap-2 shadow-xl shadow-purple-500/20 text-[9px] uppercase tracking-widest">
            New Audit
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-100 p-1 bg-slate-50/50">
          {[
            { id: 'ASSESSMENTS', label: 'Assessments', count: 12 },
            { id: 'FRAMEWORK', label: 'Framework', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 text-[9px] font-black uppercase tracking-widest transition-all rounded-lg ${
                activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.label}
                {tab.count !== null && (
                  <span className={cn("px-1.5 py-0.5 rounded text-[8px]", activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500")}>{tab.count}</span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white border-b border-slate-100 text-[9px] uppercase font-black text-slate-400 tracking-widest">
              <tr>
                <th className="px-6 py-3">ID</th>
                <th className="px-6 py-3">Vendor</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Score</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {assessments.map(as => (
                <tr key={as.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-3 font-bold text-slate-900 text-[11px]">{as.id}</td>
                  <td className="px-6 py-3 font-bold text-slate-800 text-[11px] truncate max-w-[150px] uppercase">{as.vendor}</td>
                  <td className="px-6 py-3 text-[10px] text-slate-500 font-medium uppercase">{as.category}</td>
                  <td className="px-6 py-3">
                    {as.score ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-slate-100 h-1 rounded-full overflow-hidden shrink-0">
                          <div 
                             className={`h-full rounded-full ${as.score > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                             style={{ width: `${as.score}%` }} 
                          />
                        </div>
                        <span className="text-[10px] font-black text-slate-900">{as.score}%</span>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400 italic">Pending</span>
                    )}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-tighter border ${
                      as.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                      as.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>
                      {as.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-purple-600 hover:text-purple-800 transition-colors font-black text-[9px] uppercase flex items-center gap-1 justify-end ml-auto">
                      Review <ChevronDown size={12} className="-rotate-90" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900 p-6 rounded-2xl text-white relative overflow-hidden group shadow-xl">
          <ShieldCheck className="absolute -right-6 -bottom-6 text-white/5 transition-transform group-hover:rotate-12" size={150} />
          <h3 className="text-lg font-black mb-1 uppercase tracking-tight">AI Evidence Review</h3>
          <p className="text-slate-400 text-[11px] mb-4 max-w-sm font-medium leading-relaxed italic opacity-80">
            Automatically parse vendor documents (ISO, SOC2, GST) for policy alignment.
          </p>
          <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95">
            Configure Engine
          </button>
        </div>
        
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm text-left">
          <div className="flex items-center gap-2 mb-4">
             <AlertCircle className="text-red-500" size={16} />
             <h3 className="font-black text-slate-900 uppercase text-[9px] tracking-widest">Urgent Gaps</h3>
          </div>
          <div className="space-y-3">
            {[
              { vendor: 'TechBridge Systems', msg: 'Insurance expired 3d ago', type: 'critical' },
              { vendor: 'Global Talent Solutions', msg: 'Audit due in 12 days', type: 'warning' }
            ].map((gap, i) => (
              <div key={i} className={cn("p-3 rounded-xl flex items-center justify-between border", 
                gap.type === 'critical' ? "bg-red-50 border-red-100" : "bg-amber-50 border-amber-100"
              )}>
                <div className="min-w-0">
                   <p className="text-[10px] font-black text-slate-900 uppercase truncate">{gap.vendor}</p>
                   <span className="text-[10px] text-slate-600 font-medium italic truncate block">{gap.msg}</span>
                </div>
                <button className={cn("text-[8px] font-black uppercase border px-2 py-1 rounded-lg bg-white hover:bg-slate-50 transition-all shrink-0 ml-2 shadow-sm",
                  gap.type === 'critical' ? "text-red-900 border-red-200" : "text-amber-900 border-amber-200"
                )}>Action</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
