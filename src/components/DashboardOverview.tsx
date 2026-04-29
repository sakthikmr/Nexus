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
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group text-left transition-all hover:shadow-lg hover:border-blue-400 cursor-default">
      <div className={cn("absolute -right-4 -top-4 w-16 h-16 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform duration-700", color.replace('text', 'bg'))} />
      <div className="flex justify-between items-start mb-3 relative z-10">
        <div className={cn("p-1.5 rounded-lg border shadow-inner", color.replace('text', 'bg-opacity-5 bg'), color.replace('text', 'border-opacity-10 border'))}>
          <Icon className={color} size={16} />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-lg border", 
            trendType === 'up' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-red-600 bg-red-50 border-red-100'
          )}>
            {trendType === 'up' ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 relative z-10 italic">{label}</p>
      <p className="text-xl font-black text-slate-900 relative z-10 tracking-tight">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-[1700px] text-left">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-slate-900 text-white rounded-lg shadow-lg border border-slate-800 transform -rotate-3">
               <Activity size={16} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">Dashboard</h2>
          </div>
          <p className="text-slate-500 font-bold italic text-xs uppercase tracking-tight opacity-70">Operational Intelligence.</p>
        </div>
        
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm font-mono">
              <Calendar size={12} className="text-blue-500" />
              <span className="text-[8px] font-black uppercase tracking-widest text-slate-600">FY 2024</span>
           </div>
           <button 
             onClick={handleSeed}
             disabled={isSeeding}
             className={cn(
               "px-4 py-2.5 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg transform active:scale-95",
               isSeeding ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-purple-600 text-white hover:bg-purple-700 shadow-purple-500/20"
             )}
           >
              {isSeeding ? <Clock size={12} className="animate-spin" /> : <ShieldCheck size={12} />}
              {isSeeding ? 'Syncing...' : 'Seed Data'}
           </button>
           <button 
             onClick={() => downloadReport('Operational Governance Atlas')}
             disabled={isExporting}
             className={cn(
               "px-4 py-2.5 rounded-xl font-black text-[8px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-lg transform active:scale-95",
               isExporting ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
             )}
           >
              {isExporting ? <Clock size={12} className="animate-spin" /> : <Download size={12} />}
              Export
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100/50 border border-slate-200/50 rounded-xl w-fit shadow-inner">
        {[
          { id: 'OVERVIEW', label: 'Overview', icon: LayoutDashboard },
          { id: 'RECRUITMENT', label: 'Talent', icon: Target },
          { id: 'FINANCIAL', label: 'Fiscal', icon: CreditCard },
          { id: 'VENDORS', label: 'Partners', icon: ShieldCheck },
          { id: 'TICKET_SLA', label: 'Support', icon: Clock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DashboardTab)}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'OVERVIEW' ? (
          <motion.div 
            key="overview"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-4 gap-4">
               <MetricCard label="Mandates" value="248" trend="+12%" trendType="up" icon={Briefcase} color="text-blue-600" />
               <MetricCard label="Budget" value="$4.22M" trend="-4%" trendType="down" icon={DollarSign} color="text-emerald-600" />
               <MetricCard label="Claims" value="112" trend="+18%" trendType="up" icon={FileText} color="text-amber-500" />
               <MetricCard label="Resilience" value="94.2%" trend="+0.5%" trendType="up" icon={ShieldCheck} color="text-indigo-600" />
            </div>

            <div className="grid grid-cols-3 gap-6">
               <div className="col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-8 relative z-10">
                     <div className="text-left">
                        <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase leading-none mb-1">Headcount Velocity</h4>
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic opacity-70">12-Month Performance</p>
                     </div>
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600" /><span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Hires</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200" /><span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">Pool</span></div>
                     </div>
                  </div>
                  <div className="h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData?.recruitment || []}>
                          <defs>
                            <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} />
                          <Tooltip />
                          <Area type="monotone" dataKey="hires" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorHires)" />
                          <Area type="monotone" dataKey="candidates" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="8 4" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center">
                  <h4 className="text-sm font-black text-slate-900 tracking-tight italic mb-8 uppercase">Partner Entropy</h4>
                  <div className="flex-1 w-full min-h-[200px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData?.vendorsByCategory || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={20}
                          >
                            {analyticsData?.vendorsByCategory?.map((entry: any, index: number) => (entry.name !== 'Total' && 
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-6 w-full pt-4 border-t border-slate-50">
                    {analyticsData?.vendorsByCategory?.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-0.5 text-left min-w-0">
                        <div className="flex items-center gap-1.5 min-w-0">
                           <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                           <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest truncate">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900 ml-3.5 leading-none">{item.value}%</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </motion.div>
        ) : activeTab === 'RECRUITMENT' ? (
          <motion.div 
            key="recruitment" 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
             <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-left">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight italic mb-6">Pulse</h3>
                <div className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData?.recruitment || []}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} />
                         <Tooltip cursor={{fill: '#f8fafc'}} />
                         <Bar dataKey="candidates" fill="#2563eb" radius={[10, 10, 0, 0]} />
                         <Bar dataKey="hires" fill="#10b981" radius={[10, 10, 0, 0]} />
                      </BarChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <div className="bg-slate-900 p-8 rounded-3xl text-white text-left relative overflow-hidden">
                <Target className="absolute -right-6 -bottom-6 text-white/5 opacity-50 scale-125" />
                <h3 className="text-lg font-black uppercase tracking-tight italic mb-8">Bandwidth</h3>
                <div className="space-y-6 relative z-10">
                   {[
                     { name: 'Sarah Miller', active: 42, efficiency: 94 },
                     { name: 'Marcus Chen', active: 38, efficiency: 88 },
                     { name: 'David Voss', active: 29, efficiency: 91 },
                     { name: 'Nexus AI', active: 112, efficiency: 99 }
                   ].map(r => (
                     <div key={r.name} className="space-y-2">
                        <div className="flex justify-between items-end">
                           <div>
                              <p className="text-sm font-black leading-none mb-1 uppercase truncate">{r.name}</p>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">{r.active} Active</p>
                           </div>
                           <div className="text-right">
                              <p className="text-base font-black text-blue-400">{r.efficiency}%</p>
                           </div>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                           <motion.div initial={{ width: 0 }} animate={{ width: `${r.efficiency}%` }} className="h-full bg-blue-500" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </motion.div>
        ) : activeTab === 'FINANCIAL' ? (
          <motion.div 
            key="financial" 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-3 gap-6"
          >
             <div className="bg-white p-6 rounded-3xl col-span-2 border border-slate-100 shadow-sm text-left">
                <h3 className="text-lg font-black text-slate-900 tracking-tight italic mb-6">Integrity</h3>
                <div className="h-[300px]">
                   <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData?.recruitment || []}>
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} />
                         <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 9, fontWeight: 900}} />
                         <Tooltip />
                         <Line type="monotone" dataKey="hires" stroke="#10b981" strokeWidth={4} dot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} />
                      </LineChart>
                   </ResponsiveContainer>
                </div>
             </div>
             <div className="bg-emerald-600 p-6 rounded-3xl text-white text-left relative overflow-hidden shadow-xl">
                <DollarSign className="absolute -right-6 -bottom-6 text-white/10 scale-150 rotate-12" />
                <div className="relative z-10 flex flex-col h-full">
                   <Zap className="mb-4" size={24} />
                   <h3 className="text-2xl font-black tracking-tight leading-tight mb-8 uppercase">Yield Engine</h3>
                   <div className="space-y-8 flex-1">
                      <div>
                         <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Savings</p>
                         <p className="text-4xl font-black tracking-tighter leading-none">$1.84M</p>
                      </div>
                      <div>
                         <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-2 opacity-70">Variance</p>
                         <p className="text-2xl font-black tracking-tight text-emerald-200">14.8%</p>
                      </div>
                   </div>
                   <button className="w-full py-3 bg-white text-emerald-600 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl active:scale-95 transition-all mt-4">
                      Audit Logs
                   </button>
                </div>
             </div>
          </motion.div>
        ) : (
          <motion.div 
            key="coming-soon"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white border border-slate-100 rounded-3xl h-[300px] flex flex-col items-center justify-center text-slate-300 italic shadow-inner"
          >
             <div className="p-4 bg-slate-50 rounded-full mb-4 shadow-inner">
               <Activity size={40} className="opacity-10 animate-pulse-slow" />
             </div>
             <p className="text-sm font-black tracking-widest uppercase opacity-40 italic">Collation in Progress...</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Context Monitor */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-all cursor-default">
         <div className="flex items-center gap-8 text-left">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100 animate-pulse">
                  <ShieldAlert size={18} />
               </div>
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Alerts</p>
                  <p className="text-xs font-black text-slate-900 tracking-tight leading-none italic uppercase">12 Contracts Expiring</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-amber-50 text-amber-500 rounded-xl flex items-center justify-center border border-amber-100">
                  <AlertCircle size={18} />
               </div>
               <div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 italic">Escalation</p>
                  <p className="text-xs font-black text-slate-900 tracking-tight leading-none italic uppercase">4 Critical Over-runs</p>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden group-hover:scale-105 transition-transform">
            <CheckCircle2 size={18} className="relative z-10" />
            <div className="relative z-10 text-left">
               <p className="text-[8px] font-black uppercase tracking-[0.2em] leading-none mb-1">Nexus Core</p>
               <p className="text-[11px] font-black italic uppercase leading-none">Integrity: 100%</p>
            </div>
         </div>
      </div>
    </div>
  );
};
