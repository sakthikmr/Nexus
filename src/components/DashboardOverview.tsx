import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  Users, Briefcase, ShieldCheck, FileText, TrendingUp, AlertCircle,
  CreditCard, LayoutDashboard, Target, Activity, DollarSign,
  Download, Calendar, Filter, ChevronRight, ArrowUpRight, ArrowDownRight,
  ShieldAlert, Clock, CheckCircle2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { MOCK_ANALYTICS } from '../services/mockData.ts';

import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { seedDatabase } from '../lib/seeding.ts';

const COLORS = ['#2563eb', '#10b981', '#7c3aed', '#f59e0b', '#ef4444', '#06b6d4'];

type DashboardTab = 'OVERVIEW' | 'RECRUITMENT' | 'FINANCIAL' | 'VENDORS' | 'TICKET_SLA';

export const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('OVERVIEW');
  const [analyticsData, setAnalyticsData] = useState<any>(MOCK_ANALYTICS);
  const [isExporting, setIsExporting] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    let unsubscribeSnap: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnap) unsubscribeSnap();
      
      if (user) {
        const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
        unsubscribeSnap = onSnapshot(q, (snapshot) => {
          // Future: Aggregation logic here
        }, (error) => {
          console.warn("Dashboard Ticket Sync Error (Expected if not admin):", error);
        });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, []);

  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase();
      alert("Nexus Database Hybrid-Seeded Successfully!");
    } catch (err) {
      console.error(err);
      alert("Seeding failed. Target: Global Persistence.");
    } finally {
      setIsSeeding(false);
    }
  };

  const downloadReport = (title: string) => {
    setIsExporting(true);
    setTimeout(() => {
      alert(`Nexus Engine: ${title} Collation Complete.\nFormats: PDF, Excel, JSON Engine.`);
      setIsExporting(false);
    }, 1500);
  };

  const MetricCard = ({ label, value, trend, trendType, icon: Icon, color }: any) => (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group text-left transition-all hover:shadow-xl hover:border-blue-400 cursor-default">
      <div className={cn("absolute -right-4 -top-4 w-32 h-32 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700", color.replace('text', 'bg'))} />
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={cn("p-3 rounded-2xl border shadow-inner", color.replace('text', 'bg-opacity-5 bg'), color.replace('text', 'border-opacity-10 border'))}>
          <Icon className={color} size={24} />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border", 
            trendType === 'up' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'
          )}>
            {trendType === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 relative z-10 italic">{label}</p>
      <p className="text-4xl font-black text-slate-900 relative z-10 tracking-tighter">{value}</p>
    </div>
  );

  return (
    <div className="space-y-12 max-w-[1700px] text-left">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-slate-900 text-white rounded-[1.5rem] shadow-2xl border border-slate-800 transform -rotate-3">
               <Activity size={26} />
            </div>
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter italic">Nexus Command</h2>
          </div>
          <p className="text-slate-500 font-bold italic text-lg uppercase tracking-tight opacity-70">Unified Operational Intelligence & Global Governance.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-[2rem] px-6 py-4 shadow-sm font-mono">
              <Calendar size={18} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">FY 2024 - Real-time Stream</span>
           </div>
           <button 
             onClick={handleSeed}
             disabled={isSeeding}
             className={cn(
               "px-8 py-5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl transform active:scale-95",
               isSeeding ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20"
             )}
           >
              {isSeeding ? <Clock size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
              {isSeeding ? 'Synchronizing Genesis...' : 'Seed Global Data'}
           </button>
           <button 
             onClick={() => downloadReport('Operational Governance Atlas')}
             disabled={isExporting}
             className={cn(
               "px-8 py-5 rounded-[2.5rem] font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 shadow-2xl transform active:scale-95",
               isExporting ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
             )}
           >
              {isExporting ? <Clock size={16} className="animate-spin" /> : <Download size={16} />}
              {isExporting ? 'Collating...' : 'Export Pulse'}
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2.5 p-2 bg-slate-100/50 border border-slate-200/50 rounded-[2.5rem] w-fit shadow-inner backdrop-blur-md">
        {[
          { id: 'OVERVIEW', label: 'Command Hub', icon: LayoutDashboard },
          { id: 'RECRUITMENT', label: 'Talent Funnel', icon: Target },
          { id: 'FINANCIAL', label: 'Fiscal Flow', icon: CreditCard },
          { id: 'VENDORS', label: 'Partner Integrity', icon: ShieldCheck },
          { id: 'TICKET_SLA', label: 'SLA Reliability', icon: Clock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DashboardTab)}
            className={cn(
              "flex items-center gap-3 px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-white text-blue-600 shadow-xl border border-slate-100" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
            )}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'OVERVIEW' ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-10"
          >
            <div className="grid grid-cols-4 gap-8">
               <MetricCard label="Global Mandates" value="248" trend="+12%" trendType="up" icon={Briefcase} color="text-blue-600" />
               <MetricCard label="Rolling Budget" value="$4.22M" trend="-4%" trendType="down" icon={DollarSign} color="text-emerald-600" />
               <MetricCard label="Pending Claims" value="112" trend="+18%" trendType="up" icon={FileText} color="text-amber-500" />
               <MetricCard label="SLA Resilience" value="94.2%" trend="+0.5%" trendType="up" icon={ShieldCheck} color="text-indigo-600" />
            </div>

            <div className="grid grid-cols-3 gap-10">
               <div className="col-span-2 bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-12 relative z-10">
                     <div className="text-left">
                        <h4 className="text-3xl font-black text-slate-900 tracking-tighter italic leading-none mb-3">Headcount Velocity</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-70">12-Month Performance Matrix</p>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-600" /><span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Total Hires</span></div>
                        <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-slate-200" /><span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Pool Size</span></div>
                     </div>
                  </div>
                  <div className="h-[400px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData?.recruitment || []}>
                          <defs>
                            <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} dy={20} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                          <Tooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '24px' }} />
                          <Area type="monotone" dataKey="hires" stroke="#2563eb" strokeWidth={5} fillOpacity={1} fill="url(#colorHires)" />
                          <Area type="monotone" dataKey="candidates" stroke="#cbd5e1" strokeWidth={3} fill="transparent" strokeDasharray="10 5" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-white p-12 rounded-[4rem] border border-slate-200 shadow-sm flex flex-col items-center">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tighter italic mb-12 text-center uppercase">Partner Entropy</h4>
                  <div className="flex-1 w-full min-h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData?.vendorsByCategory || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={10}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={40}
                          >
                            {analyticsData?.vendorsByCategory?.map((entry: any, index: number) => (entry.name !== 'Total' && 
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-6 mt-12 w-full pt-10 border-t border-slate-50">
                    {analyticsData?.vendorsByCategory?.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-2 text-left">
                        <div className="flex items-center gap-2.5">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{item.name}</span>
                        </div>
                        <span className="text-xl font-black text-slate-900 ml-5">{item.value}%</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </motion.div>
        ) : activeTab === 'RECRUITMENT' ? (
          <motion.div 
            key="recruitment" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10"
          >
             <div className="bg-white p-12 rounded-[4rem] border border-slate-100 shadow-sm text-left">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-10">Application Pulse</h3>
                <div className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData?.recruitment || []}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                         <Tooltip cursor={{fill: '#f8fafc'}} />
                         <Bar dataKey="candidates" fill="#2563eb" radius={[15, 15, 0, 0]} />
                         <Bar dataKey="hires" fill="#10b981" radius={[15, 15, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <div className="bg-slate-900 p-12 rounded-[4rem] text-white text-left relative overflow-hidden">
                <Target className="absolute -right-8 -bottom-8 text-white/5 scale-[3] -rotate-12" />
                <h3 className="text-3xl font-black tracking-tighter italic mb-12">Recruiter Bandwidth</h3>
                <div className="space-y-12 relative z-10">
                   {[
                     { name: 'Sarah Miller', active: 42, interviews: 18, efficiency: 94 },
                     { name: 'Marcus Chen', active: 38, interviews: 12, efficiency: 88 },
                     { name: 'David Voss', active: 29, interviews: 22, efficiency: 91 },
                     { name: 'Nexus AI Engine', active: 112, interviews: 42, efficiency: 99 }
                   ].map(r => (
                     <div key={r.name} className="space-y-4">
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-xl font-black leading-none mb-2">{r.name}</p>
                              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{r.active} Active Mandates</p>
                           </div>
                           <div className="text-right">
                              <p className="text-2xl font-black text-blue-400">{r.efficiency}%</p>
                              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Efficiency Index</p>
                           </div>
                        </div>
                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${r.efficiency}%` }} className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </motion.div>
        ) : activeTab === 'FINANCIAL' ? (
          <motion.div 
            key="financial" 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-10"
          >
             <div className="bg-white p-12 rounded-[4rem] col-span-2 border border-slate-100 shadow-sm text-left">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic mb-10">Cash Flow Integrity</h3>
                <div className="h-[400px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData?.recruitment || []}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 900}} />
                         <Tooltip />
                         <Line type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={6} dot={{ r: 8, fill: '#10b981', strokeWidth: 4, stroke: '#fff' }} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <div className="bg-emerald-600 p-12 rounded-[4rem] text-white text-left relative overflow-hidden shadow-2xl shadow-emerald-200/50">
                <DollarSign className="absolute -right-8 -bottom-8 text-white/10 scale-[3] -rotate-12" />
                <div className="relative z-10 flex flex-col h-full">
                   <Zap className="mb-8" size={32} />
                   <h3 className="text-4xl font-black tracking-tighter leading-tight mb-8">Yield & Savings Engine</h3>
                   <div className="space-y-12 flex-1">
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Total Savings Achieved</p>
                         <p className="text-6xl font-black tracking-tighter">$1.84M</p>
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-70">Cost Variance Delta</p>
                         <p className="text-4xl font-black tracking-tighter text-emerald-200">14.8%</p>
                      </div>
                   </div>
                   <button className="w-full py-5 bg-white text-emerald-600 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 active:scale-95 transition-all">
                      Audit Treasury Logs
                   </button>
                </div>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="coming-soon"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white border border-slate-100 rounded-[4rem] h-[500px] flex flex-col items-center justify-center text-slate-300 italic shadow-inner"
          >
             <div className="p-8 bg-slate-50 rounded-full mb-8 shadow-inner">
               <Activity size={80} className="opacity-10 animate-pulse-slow" />
             </div>
             <p className="text-xl font-black tracking-widest uppercase opacity-40">Nexus Intelligence Collation in Progress...</p>
             <p className="text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest font-mono">Module: {activeTab} | Priority: Alpha</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Context Monitor */}
      <div className="bg-white p-10 rounded-[3.5rem] border-2 border-slate-100 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all cursor-default">
         <div className="flex items-center gap-12 text-left">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center border border-red-100 ring-4 ring-red-500/5 animate-pulse">
                  <ShieldAlert size={22} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Tactical Alerts</p>
                  <p className="text-sm font-black text-slate-900 tracking-tight leading-none italic uppercase">12 Vendor Contracts Expiring</p>
               </div>
            </div>
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center border border-amber-100 ring-4 ring-amber-500/5">
                  <AlertCircle size={22} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Escalation Status</p>
                  <p className="text-sm font-black text-slate-900 tracking-tight leading-none italic uppercase">4 Critical SLA Over-runs</p>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-4 text-emerald-600 bg-emerald-50 px-8 py-4 rounded-[2rem] border border-emerald-100 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform">
            <div className="absolute inset-0 bg-emerald-400/5 group-hover:bg-emerald-400/10 transition-colors" />
            <CheckCircle2 size={24} className="relative z-10" />
            <div className="relative z-10">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">Nexus Core</p>
               <p className="text-sm font-black italic uppercase">System Integrity: 100%</p>
            </div>
         </div>
      </div>
    </div>
  );
};
