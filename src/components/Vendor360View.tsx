import React, { useState } from 'react';
import { 
  Award, ShieldCheck, FileText, Globe, Mail, Phone, MapPin, 
  ChevronLeft, ExternalLink, Calendar, Briefcase, TrendingUp, 
  AlertCircle, Users, Activity, BarChart3, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { Vendor } from '../types.ts';

interface Vendor360Props {
  vendor: any;
  onBack: () => void;
}

export const Vendor360View = ({ vendor, onBack }: Vendor360Props) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'COMPLIANCE' | 'RECRUITMENT' | 'FINANCE'>('OVERVIEW');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Vendor Inventory
      </button>

      {/* Header Profile */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
           <div className={cn("px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter shadow-sm border", 
             vendor.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
             vendor.status === 'Suspended' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-blue-50 text-blue-700 border-blue-100'
           )}>
             {vendor.status} Status
           </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
          <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[2.5rem] flex items-center justify-center font-black text-3xl text-slate-400 shadow-inner">
            {vendor.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                 <h2 className="text-4xl font-black text-slate-900 tracking-tight">{vendor.name}</h2>
                 {vendor.score > 90 && <Award className="text-amber-500 fill-amber-500/10" size={24} />}
              </div>
              <p className="text-slate-500 font-medium">#{vendor.id} • {vendor.category} Specialist</p>
            </div>

            <div className="flex flex-wrap gap-6 items-center pt-2">
               <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <MapPin size={16} className="text-slate-300" />
                  {vendor.location}
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <Globe size={16} className="text-slate-300" />
                  www.{vendor.name.toLowerCase().replace(/\s/g, '')}.com
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <Mail size={16} className="text-slate-300" />
                  {vendor.email}
               </div>
               <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                  <Phone size={16} className="text-slate-300" />
                  {vendor.phone}
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-slate-200 p-1.5 rounded-2xl inline-flex gap-1 shadow-sm">
        {[
          { id: 'OVERVIEW', label: '360 Overview', icon: Activity },
          { id: 'COMPLIANCE', label: 'Compliance & Risk', icon: ShieldCheck },
          { id: 'RECRUITMENT', label: 'Staffing Stats', icon: Briefcase },
          { id: 'FINANCE', label: 'Commercial Ledger', icon: CreditCard }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              activeTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
            )}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'OVERVIEW' && (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2 space-y-8">
              {/* Scoring Highlights */}
              <div className="grid grid-cols-2 gap-6">
                 <div className="bg-white border border-slate-200 p-6 rounded-3xl group hover:border-blue-500 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Performance Score</p>
                    <div className="flex items-end gap-3">
                       <div className="text-4xl font-black text-slate-900">{vendor.score}</div>
                       <div className="text-xs font-bold text-emerald-600 mb-2">+4.2% YoY</div>
                    </div>
                    <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                       <div className="h-full bg-blue-600 rounded-full" style={{ width: `${vendor.score}%` }} />
                    </div>
                 </div>
                 <div className="bg-white border border-slate-200 p-6 rounded-3xl group hover:border-blue-500 transition-all">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Risk Rating</p>
                    <div className="flex items-center gap-3">
                       <div className={cn("px-4 py-1 rounded-2xl text-xs font-black uppercase", 
                         vendor.risk === 'Low' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                       )}>
                         {vendor.risk} Risk
                       </div>
                       <ShieldCheck className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <p className="mt-4 text-[11px] text-slate-400 font-medium leading-relaxed italic">Last automated background check: 24h ago</p>
                 </div>
              </div>

              {/* Vendor Intelligence */}
              <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-8">
                 <div>
                    <h3 className="text-xl font-black text-slate-900 mb-6">Partner Intelligence</h3>
                    <div className="grid grid-cols-2 gap-10">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Business Focus</p>
                          <p className="text-sm font-bold text-slate-700 leading-relaxed">
                            Specializing in {vendor.category.toLowerCase()} across global enterprise accounts. High emphasis on automated matching and quality compliance.
                          </p>
                       </div>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                             <span className="text-[10px] font-black text-slate-400 uppercase">Hiring Speed</span>
                             <span className="text-xs font-black text-slate-800">4.2 Days (Avg)</span>
                          </div>
                          <div className="flex justify-between items-center px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
                             <span className="text-[10px] font-black text-slate-400 uppercase">Retention 12M</span>
                             <span className="text-xs font-black text-slate-800">92.4%</span>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 border-t border-slate-100">
                    <h4 className="text-sm font-black text-slate-900 mb-4 uppercase tracking-widest">Primary Service Offerings</h4>
                    <div className="flex flex-wrap gap-2">
                       {['Cloud Solutions', 'Staff Augmentation', 'Digital Transformation', 'App Modernization', 'Agile Pods'].map(tag => (
                         <span key={tag} className="px-4 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-tighter">
                           {tag}
                         </span>
                       ))}
                    </div>
                 </div>
              </div>
            </div>

            <div className="space-y-8">
               {/* Quick Actions */}
               <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-6">Management Desk</h4>
                  <button className="w-full py-3 bg-blue-600 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">Create Work Order</button>
                  <button className="w-full py-3 bg-white/10 border border-white/10 rounded-2xl font-bold text-sm hover:bg-white/20 transition-all">Launch Performance Review</button>
                  <button className="w-full py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl font-bold text-sm hover:bg-red-500/20 transition-all">Initiate Suspension</button>
               </div>

               {/* Lifecycle Stats */}
               <div className="bg-white border border-slate-200 p-6 rounded-3xl space-y-6 shadow-sm">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4">Lifecycle Milestones</p>
                  <div className="space-y-6">
                     {[
                       { label: 'Onboarded', date: vendor.founded + ' (Est)', icon: Calendar, active: true },
                       { label: 'Contract Renewed', date: 'Jan 2024', icon: FileText, active: true },
                       { label: 'Compliance Audit', date: 'Next: Oct 2024', icon: ShieldCheck, active: false }
                     ].map((item, idx) => (
                       <div key={idx} className="flex gap-4 relative group">
                          {idx !== 2 && <div className="absolute left-[11px] top-6 w-0.5 h-10 bg-slate-100" />}
                          <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0 z-10", item.active ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-300")}>
                             <item.icon size={12} />
                          </div>
                          <div>
                             <p className="text-xs font-bold text-slate-900 leading-none mb-1">{item.label}</p>
                             <p className="text-[10px] text-slate-400 font-medium italic">{item.date}</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
