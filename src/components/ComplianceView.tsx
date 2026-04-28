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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Governance & Compliance</h2>
          <p className="text-slate-500 mt-1">Audit, risk assessment, and vendor qualification controls.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl font-medium text-slate-600 hover:bg-slate-50 text-sm">Download Templates</button>
          <button className="bg-purple-600 text-white px-5 py-2 rounded-xl font-bold hover:bg-purple-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-100 text-sm">
            Launch Assessment
          </button>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="flex border-b border-slate-100">
          {[
            { id: 'ASSESSMENTS', label: 'Active Assessments', count: 12 },
            { id: 'FRAMEWORK', label: 'Compliance Framework', count: null }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-8 py-4 text-sm font-bold transition-all relative ${
                activeTab === tab.id ? 'text-purple-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <div className="flex items-center gap-2">
                {tab.label}
                {tab.count !== null && (
                  <span className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{tab.count}</span>
                )}
              </div>
              {activeTab === tab.id && (
                <motion.div layoutId="compliance-tab" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600" />
              )}
            </button>
          ))}
        </div>

        <div className="p-0">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase font-black text-slate-400 tracking-widest">
              <tr>
                <th className="px-8 py-4">Assessment ID</th>
                <th className="px-8 py-4">Vendor Entity</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Score</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {assessments.map(as => (
                <tr key={as.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5 font-bold text-slate-900 text-sm">{as.id}</td>
                  <td className="px-8 py-5 font-medium text-slate-700 text-sm">{as.vendor}</td>
                  <td className="px-8 py-5 text-sm text-slate-500">{as.category}</td>
                  <td className="px-8 py-5">
                    {as.score ? (
                      <div className="flex items-center gap-2">
                        <div className="w-full max-w-[60px] bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                             className={`h-full rounded-full ${as.score > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
                             style={{ width: `${as.score}%` }} 
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{as.score}%</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No score yet</span>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                      as.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                      as.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {as.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <button className="text-purple-600 hover:text-purple-800 transition-colors font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      View Details
                      <ChevronDown size={14} className="-rotate-90" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 p-8 rounded-2xl text-white relative overflow-hidden">
          <ShieldCheck className="absolute -right-8 -bottom-8 text-white/5" size={200} />
          <h3 className="text-xl font-bold mb-2">Automated Evidence Review</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-sm">
            Leverage Nexus AI to automatically parse vendor document uploads (ISO, SOC2, GST) for policy alignment.
          </p>
          <button className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
            Configure AI Engine
          </button>
        </div>
        
        <div className="bg-white border border-slate-200 p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-4">
             <AlertCircle className="text-red-500" size={20} />
             <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest">Urgent Compliance Gaps</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                 <p className="text-sm font-bold text-red-900">TechBridge Systems</p>
                 <span className="text-xs text-red-700">Insurance certificate expired 3 days ago</span>
              </div>
              <button className="text-[10px] font-black text-red-900 uppercase border border-red-200 px-2 py-1 rounded bg-white hover:bg-red-50">Notify Vendor</button>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center justify-between">
              <div>
                 <p className="text-sm font-bold text-amber-900">Global Talent Solutions</p>
                 <span className="text-xs text-amber-700">Annual re-assessment due in 12 days</span>
              </div>
              <button className="text-[10px] font-black text-amber-900 uppercase border border-amber-200 px-2 py-1 rounded bg-white hover:bg-amber-50">Schedule</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
