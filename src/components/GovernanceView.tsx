import React, { useState, useEffect } from 'react';
import { 
  Settings, Database, Layers, ShieldCheck, Clock, FileText, 
  Search, Plus, Filter, Save, ChevronRight, AlertCircle,
  ExternalLink, Trash2, ListTree
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';

type MasterType = 'VENDOR_CATS' | 'REC_STAGES' | 'SLA' | 'APPROVAL_MATRIX' | 'CONTRACTS' | 'AUDIT_LOGS';

export const GovernanceView = () => {
  const [activeMaster, setActiveMaster] = useState<MasterType>('AUDIT_LOGS');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let endpoint = '';
    const base = '/api/v1/admin';
    switch(activeMaster) {
      case 'REC_STAGES': endpoint = `${base}/masters/recruitment-stages`; break;
      case 'VENDOR_CATS': endpoint = `${base}/masters/vendor-categories`; break;
      case 'SLA': endpoint = `${base}/masters/sla`; break;
      case 'CONTRACTS': endpoint = `/api/v1/finance/contracts`; break;
      case 'AUDIT_LOGS': endpoint = `${base}/audit-logs`; break;
      default: endpoint = `${base}/masters/recruitment-stages`;
    }
    
    fetch(endpoint)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => {
        setData([]);
        setLoading(false);
      });
  }, [activeMaster]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Nexus Governance Control</h2>
          <p className="text-slate-500 mt-1 font-medium">Global master data and platform configuration framework.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm hover:bg-slate-50 shadow-sm flex items-center gap-2">
            <Save size={16} />
            Publish Changes
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <Plus size={16} />
            Add Master Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Master Navigation */}
        <div className="space-y-6">
           <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Configuration Modules</p>
              <nav className="space-y-1">
                {[
                  { id: 'AUDIT_LOGS', label: 'Platform Audit Logs', icon: Clock },
                  { id: 'CONTRACTS', label: 'Contract Lifecycle', icon: FileText },
                  { id: 'REC_STAGES', label: 'Recruitment Stages', icon: ListTree },
                  { id: 'VENDOR_CATS', label: 'Vendor Categories', icon: Layers },
                  { id: 'SLA', label: 'SLA Definitions', icon: Clock },
                  { id: 'APPROVAL_MATRIX', label: 'Approval Matrix', icon: ShieldCheck }
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveMaster(item.id as any)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold",
                      activeMaster === item.id ? "bg-blue-50 text-blue-700 border border-blue-100" : "text-slate-500 hover:bg-slate-50"
                    )}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </nav>
           </div>

           <div className="bg-slate-900 p-6 rounded-3xl text-white relative overflow-hidden group">
              <Database className="absolute -right-4 -bottom-4 text-white/5 group-hover:scale-110 transition-transform" size={120} />
              <h4 className="text-sm font-bold mb-2">Audit Synchronization</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                Changes to master data are version-controlled and require a secondary signature (Maker-Checker).
              </p>
              <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-300 transition-colors">
                View Version Logs
              </button>
           </div>
        </div>

        {/* Master Content Area */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <div className="flex items-center gap-3">
                   <Settings className="text-blue-600" size={20} />
                   <h3 className="font-bold text-slate-800">
                     {activeMaster === 'CONTRACTS' ? 'Contract Lifecycle & Repository' :
                      activeMaster === 'REC_STAGES' ? 'Recruitment Stage Workflow' : 
                      activeMaster === 'VENDOR_CATS' ? 'Vendor Category Master' : 
                      activeMaster === 'SLA' ? 'SLA Service Levels' : 
                      activeMaster === 'AUDIT_LOGS' ? 'System Audit Trails' : 'Approval Definitions'}
                   </h3>
                </div>
                <div className="flex gap-2">
                   <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" placeholder="Filter settings..." className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-300 w-48" />
                   </div>
                </div>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-[#F8FAFC] text-[10px] font-black text-slate-400 uppercase tracking-[0.1em] border-b border-slate-100">
                      <tr>
                        {activeMaster === 'CONTRACTS' && (
                          <>
                            <th className="px-8 py-4">ID / Type</th>
                            <th className="px-8 py-4">Vendor & Customer</th>
                            <th className="px-8 py-4">Start / End</th>
                            <th className="px-8 py-4">Status</th>
                            <th className="px-8 py-4 text-right">Value</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                          </>
                        )}
                        {activeMaster === 'REC_STAGES' && (
                          <>
                            <th className="px-8 py-4">Sort Order</th>
                            <th className="px-8 py-4">Stage Name</th>
                            <th className="px-8 py-4">Type</th>
                            <th className="px-8 py-4">Skip Allowed</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                          </>
                        )}
                        {activeMaster === 'SLA' && (
                          <>
                            <th className="px-8 py-4">Priority</th>
                            <th className="px-8 py-4">Category</th>
                            <th className="px-8 py-4">Target Resolution</th>
                            <th className="px-8 py-4">Escalation Path</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                          </>
                        )}
                        {activeMaster === 'VENDOR_CATS' && (
                          <>
                            <th className="px-8 py-4">Category ID</th>
                            <th className="px-8 py-4">Category Name</th>
                            <th className="px-8 py-4">System Code</th>
                            <th className="px-8 py-4">Lifecycle Status</th>
                            <th className="px-8 py-4 text-right">Actions</th>
                          </>
                        )}
                        {activeMaster === 'AUDIT_LOGS' && (
                          <>
                            <th className="px-8 py-4">Timestamp</th>
                            <th className="px-8 py-4">Identity</th>
                            <th className="px-8 py-4">Protocol Action</th>
                            <th className="px-8 py-4">Target Entity</th>
                            <th className="px-8 py-4 text-right">Activity Trace</th>
                          </>
                        )}
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-50">
                      {loading ? (
                         <tr><td colSpan={5} className="text-center py-20 text-slate-400 italic">Reading master registry...</td></tr>
                      ) : data.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                           {activeMaster === 'AUDIT_LOGS' && (
                             <>
                               <td className="px-8 py-5">
                                 <div className="flex flex-col">
                                   <span className="text-xs font-black text-slate-900">{new Date(item.timestamp).toLocaleDateString()}</span>
                                   <span className="text-[10px] font-bold text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</span>
                                 </div>
                               </td>
                               <td className="px-8 py-5">
                                 <div className="flex items-center gap-2">
                                   <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500">
                                     {item.user.split(' ').map((n: string) => n[0]).join('')}
                                   </div>
                                   <span className="text-xs font-bold text-slate-700">{item.user}</span>
                                 </div>
                               </td>
                               <td className="px-8 py-5">
                                 <span className={cn("px-2 py-1 rounded text-[9px] font-black uppercase tracking-tight", 
                                   item.action.includes('APPROVE') ? "bg-emerald-50 text-emerald-600" :
                                   item.action.includes('BREACH') ? "bg-red-50 text-red-600" :
                                   "bg-blue-50 text-blue-600"
                                 )}>
                                   {item.action}
                                 </span>
                               </td>
                               <td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                                 {item.entity} / {item.entityId}
                               </td>
                               <td className="px-8 py-5 text-right font-medium text-slate-600 text-xs italic">
                                 "{item.details}"
                               </td>
                             </>
                           )}
                           {activeMaster === 'CONTRACTS' && (
                             <>
                               <td className="px-8 py-5">
                                 <div className="flex flex-col">
                                   <span className="font-mono text-[10px] font-black text-blue-600 tracking-tighter">#{item.id}</span>
                                   <span className="font-black text-slate-900 text-xs uppercase tracking-[0.1em]">{item.type}</span>
                                 </div>
                               </td>
                               <td className="px-8 py-5">
                                 <div className="font-bold text-slate-800 text-sm group-hover:text-blue-600 transition-colors">{item.vendorName}</div>
                                 <div className="text-[10px] font-bold text-slate-400 uppercase italic tracking-tighter">{item.customer}</div>
                               </td>
                               <td className="px-8 py-5">
                                 <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                                   <Clock size={12} className="text-slate-300" />
                                   {item.startDate} → {item.endDate}
                                 </div>
                               </td>
                               <td className="px-8 py-5">
                                 <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase border", 
                                   item.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                                   item.status === 'Pending Signature' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                   'bg-slate-50 text-slate-500 border-slate-200')}>
                                   <div className={cn("w-1 h-1 rounded-full", item.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500')} />
                                   {item.status}
                                 </span>
                               </td>
                               <td className="px-8 py-5 font-black text-slate-900 text-right">{item.value}</td>
                               <td className="px-8 py-5 text-right flex justify-end gap-2">
                                  <button className="p-2.5 bg-white border border-slate-100 text-slate-400 hover:text-blue-600 rounded-xl transition-all shadow-sm"><FileText size={16} /></button>
                                  <button className="p-2.5 bg-white border border-slate-100 text-slate-300 hover:text-red-500 rounded-xl transition-all shadow-sm"><Trash2 size={18} /></button>
                               </td>
                             </>
                           )}
                           {activeMaster === 'REC_STAGES' && (
                             <>
                               <td className="px-8 py-5">
                                 <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500">{item.order}</div>
                               </td>
                               <td className="px-8 py-5 font-bold text-slate-800">{item.name}</td>
                               <td className="px-8 py-5">
                                 <span className={cn("px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-tighter", 
                                   item.type === 'Internal' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600')}>
                                   {item.type}
                                 </span>
                               </td>
                               <td className="px-8 py-5">
                                 <div className={cn("w-10 h-5 rounded-full relative transition-all", item.skipable ? "bg-emerald-100" : "bg-slate-200")}>
                                    <div className={cn("absolute top-1 w-3 h-3 rounded-full transition-all bg-white", item.skipable ? "right-1 shadow-sm" : "left-1")} />
                                 </div>
                               </td>
                               <td className="px-8 py-5 text-right flex justify-end gap-2">
                                  <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><ChevronRight size={18} /></button>
                                  <button className="p-2 text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
                               </td>
                             </>
                           )}

                           {activeMaster === 'SLA' && (
                             <>
                               <td className="px-8 py-5">
                                 <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-[10px] font-black">{item.priority}</span>
                               </td>
                               <td className="px-8 py-5 font-bold text-slate-800 italic">{item.category}</td>
                               <td className="px-8 py-5 text-sm font-medium text-slate-600">{item.target}</td>
                               <td className="px-8 py-5">
                                 <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">VP</div>
                                    <span className="text-xs font-bold text-slate-700">{item.escalation}</span>
                                 </div>
                               </td>
                               <td className="px-8 py-5 text-right">
                                  <button className="text-blue-600 text-xs font-black underline underline-offset-4 decoration-blue-200">Modify Path</button>
                               </td>
                             </>
                           )}

                           {activeMaster === 'VENDOR_CATS' && (
                             <>
                               <td className="px-8 py-5 font-mono text-xs font-bold text-slate-400">#{item.id}</td>
                               <td className="px-8 py-5 font-bold text-slate-900">{item.name}</td>
                               <td className="px-8 py-5">
                                 <span className="px-2 py-1 bg-slate-100 text-slate-500 rounded text-[10px] font-black font-mono">{item.code}</span>
                               </td>
                               <td className="px-8 py-5">
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                    <span className="text-xs font-bold text-slate-700 leading-none">{item.status}</span>
                                 </div>
                               </td>
                               <td className="px-8 py-5 text-right">
                                  <button className="p-2 text-slate-400 hover:text-blue-600"><ExternalLink size={18} /></button>
                               </td>
                             </>
                           )}
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>

          {/* Configuration Hint */}
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
             <AlertCircle className="text-blue-600 shrink-0" size={24} />
             <div>
                <h4 className="font-bold text-blue-900 mb-1">Nexus Dynamic Workflows</h4>
                <p className="text-sm text-blue-700 leading-relaxed max-w-2xl">
                  Recruitment stages defined here will automatically update the Kanban boards for both internal recruiters and vendor users. 
                  Changing "Skip Allowed" will immediately modify validation rules for candidate stage promotion.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
