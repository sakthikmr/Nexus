import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, Legend
} from 'recharts';
import { 
  Users, Briefcase, ShieldCheck, FileText, TrendingUp, AlertCircle,
  CreditCard, LayoutDashboard, Target, Activity, DollarSign,
  Download, Calendar, Filter, ChevronRight, ArrowUpRight, ArrowDownRight,
  ShieldAlert, Clock, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';

const COLORS = ['#2563eb', '#10b981', '#7c3aed', '#f59e0b', '#ef4444', '#06b6d4'];

type DashboardTab = 'OVERVIEW' | 'RECRUITMENT' | 'FINANCIAL' | 'VENDORS' | 'TICKET_SLA';

export const DashboardOverview = () => {
  const [activeTab, setActiveTab] = useState<DashboardTab>('OVERVIEW');
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    fetch('/api/analytics/trends')
      .then(res => res.json())
      .then(data => setAnalyticsData(data));
  }, []);

  const downloadReport = (title: string) => {
    setIsExporting(true);
    setTimeout(() => {
      alert(`Preparing ${title} Export...\nCSV & PDF formats including drill-down data.`);
      setIsExporting(false);
    }, 1500);
  };

  const MetricCard = ({ label, value, trend, trendType, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
      <div className={cn("absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] group-hover:scale-150 transition-transform", color.replace('text', 'bg'))} />
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={cn("p-2.5 rounded-xl border shadow-sm", color.replace('text', 'bg-opacity-10 bg'), color.replace('text', 'border-opacity-20 border'))}>
          <Icon className={color} size={20} />
        </div>
        {trend && (
          <div className={cn("flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg", 
            trendType === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
          )}>
            {trendType === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {trend}
          </div>
        )}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 relative z-10">{label}</p>
      <p className="text-3xl font-black text-slate-900 relative z-10">{value}</p>
    </div>
  );

  return (
    <div className="space-y-10 max-w-[1700px]">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-700">
               <Activity size={22} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight italic">Nexus Command</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Operational Intelligence & Executive VMP Governance.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-2.5 shadow-sm">
              <Calendar size={16} className="text-slate-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">May 2023 - Apr 2024</span>
           </div>
           <button 
             onClick={() => downloadReport('Executive Operational Summary')}
             disabled={isExporting}
             className={cn(
               "px-6 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl",
               isExporting ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
             )}
           >
              {isExporting ? <Clock size={16} className="animate-spin" /> : <Download size={16} />}
              {isExporting ? 'Collating Engine Data...' : 'Export Intelligence'}
           </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1.5 bg-slate-50 border border-slate-100 rounded-3xl w-fit shadow-inner">
        {[
          { id: 'OVERVIEW', label: 'Command Center', icon: LayoutDashboard },
          { id: 'RECRUITMENT', label: 'Pipeline Analytics', icon: Target },
          { id: 'FINANCIAL', label: 'Fiscal Control', icon: CreditCard },
          { id: 'VENDORS', label: 'Network Health', icon: ShieldCheck },
          { id: 'TICKET_SLA', label: 'Service Reliability', icon: Clock }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as DashboardTab)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-white text-blue-600 shadow-sm border border-slate-100" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
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
            className="space-y-8"
          >
            {/* KPI Cluster */}
            <div className="grid grid-cols-4 gap-6">
               <MetricCard label="Global Open Roles" value="248" trend="+12%" trendType="up" icon={Briefcase} color="text-blue-600" />
               <MetricCard label="Active Budget" value="$4.2M" trend="-4%" trendType="down" icon={DollarSign} color="text-emerald-600" />
               <MetricCard label="Pending Invoices" value="112" trend="+18%" trendType="up" icon={FileText} color="text-amber-500" />
               <MetricCard label="SLA Compliance" value="94.2%" trend="+0.5%" trendType="up" icon={ShieldCheck} color="text-purple-600" />
            </div>

            <div className="grid grid-cols-3 gap-8">
               {/* Main Performance Area */}
               <div className="col-span-2 bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm relative overflow-hidden group">
                  <div className="flex justify-between items-start mb-10">
                     <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight italic">Headcount & Budget Velocity</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">12-Month Rolling Trend Analysis</p>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600" /><span className="text-[8px] font-black uppercase text-slate-400">Total Hires</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200" /><span className="text-[8px] font-black uppercase text-slate-400">Candidates</span></div>
                     </div>
                  </div>
                  <div className="h-[350px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analyticsData?.recruitment || []}>
                          <defs>
                            <linearGradient id="colorHires" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} 
                            dy={15} 
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} />
                          <Tooltip 
                             contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '16px' }}
                             labelStyle={{ fontWeight: 900, marginBottom: '8px', textTransform: 'uppercase', fontSize: '10px' }}
                          />
                          <Area type="monotone" dataKey="hires" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorHires)" />
                          <Area type="monotone" dataKey="candidates" stroke="#cbd5e1" strokeWidth={2} fill="transparent" strokeDasharray="5 5" />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>

               {/* Network Distribution Pie */}
               <div className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-sm flex flex-col">
                  <h4 className="text-lg font-black text-slate-900 tracking-tight italic mb-8">Vendor Category Entropy</h4>
                  <div className="flex-1 min-h-[300px]">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analyticsData?.vendorsByCategory || []}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="value"
                            stroke="none"
                            cornerRadius={40}
                          >
                            {analyticsData?.vendorsByCategory?.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-slate-50">
                    {analyticsData?.vendorsByCategory?.map((item: any, idx: number) => (
                      <div key={idx} className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{item.name}</span>
                        </div>
                        <span className="text-sm font-black text-slate-900 ml-4">{item.value}% Share</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Bottom Row: Scorecard & Efficiency */}
            <div className="grid grid-cols-3 gap-8">
               <div className="bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden group">
                  <div className="absolute right-0 top-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700" />
                  <Target className="text-blue-500 mb-6" size={32} />
                  <h4 className="text-2xl font-black tracking-tighter mb-2 italic">Funnel Performance</h4>
                  <p className="text-xs text-slate-400 font-medium leading-relaxed italic mb-8">Efficiency across the candidate journey stages.</p>
                  
                  <div className="space-y-5">
                    {analyticsData?.funnelDropOff?.map((stage: any, idx: number) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                           <span>{stage.stage}</span>
                           <span>{stage.count} Users</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(stage.count / 1200) * 100}%` }}
                             className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                             transition={{ duration: 1.5, delay: idx * 0.1 }}
                           />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="col-span-2 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-10">
                     <div>
                        <h4 className="text-xl font-black text-slate-900 tracking-tight italic">Top Vendor Scorecards</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest italic">Quality, Cost & Response Speed Indices</p>
                     </div>
                     <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all">View All Scores <ChevronRight size={14} /></button>
                  </div>
                  
                  <table className="w-full">
                    <thead>
                       <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50">
                          <th className="pb-4 text-left">Vendor Partner</th>
                          <th className="pb-4 text-center">Quality Score</th>
                          <th className="pb-4 text-center">Efficiency Score</th>
                          <th className="pb-4 text-center">Risk Factor</th>
                          <th className="pb-4 text-right">Trend</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {[
                         { name: 'Quantum Cloud Specialists', quality: 98, efficiency: 95, risk: 'Low', trend: '+2.4%' },
                         { name: 'Global Talent Solutions', quality: 88, efficiency: 82, risk: 'Medium', trend: '-1.2%' },
                         { name: 'TalentHive Inc', quality: 92, efficiency: 89, risk: 'Low', trend: '+0.8%' },
                         { name: 'TechBridge Partners', quality: 75, efficiency: 70, risk: 'High', trend: '-4.5%' },
                         { name: 'NexGen Resources', quality: 99, efficiency: 98, risk: 'Excempt', trend: '+5.1%' }
                       ].map((vendor, idx) => (
                         <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="py-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">{vendor.name[0]}</div>
                                  <span className="font-bold text-slate-800 text-sm">{vendor.name}</span>
                               </div>
                            </td>
                            <td className="py-5 text-center">
                               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black">
                                  {vendor.quality}%
                               </div>
                            </td>
                            <td className="py-5 text-center">
                               <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black">
                                  {vendor.efficiency}%
                               </div>
                            </td>
                            <td className="py-5 text-center">
                               <span className={cn("text-[9px] font-black uppercase",
                                 vendor.risk === 'Low' || vendor.risk === 'Excempt' ? 'text-emerald-500' : 
                                 vendor.risk === 'Medium' ? 'text-amber-500' : 'text-red-500'
                               )}>
                                  {vendor.risk}
                               </span>
                            </td>
                            <td className="py-5 text-right font-mono text-[10px] font-black">
                               <span className={vendor.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}>
                                  {vendor.trend}
                               </span>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                  </table>
               </div>
            </div>
          </motion.div>
        )}

        {/* Other Tabs placeholders mapping to user requirements */}
        {activeTab === 'RECRUITMENT' && (
           <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[3rem] text-slate-400 italic">
              <Target size={48} className="mb-4 opacity-10" />
              <p>Diving deep into Funnel Stages, Recruiter Load & Conversion Ratios...</p>
           </motion.div>
        )}
        
        {activeTab === 'FINANCIAL' && (
           <motion.div key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[3rem] text-slate-400 italic">
              <CreditCard size={48} className="mb-4 opacity-10" />
              <p>Analyzing Budget Utilization, Cost-per-Hire & Invoice Aging...</p>
           </motion.div>
        )}

        {activeTab === 'VENDORS' && (
           <motion.div key="ven" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[3rem] text-slate-400 italic">
              <ShieldCheck size={48} className="mb-4 opacity-10" />
              <p>Scanning Network Compliance, Risk Heatmaps & Document Integrity...</p>
           </motion.div>
        )}

        {activeTab === 'TICKET_SLA' && (
           <motion.div key="sla" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-64 flex flex-col items-center justify-center bg-white border border-slate-100 rounded-[3rem] text-slate-400 italic">
              <Clock size={48} className="mb-4 opacity-10" />
              <p>Calculating Mean-time-to-resolution, First-response Velocity & SLA Breaches...</p>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Global Risk Monitor Mini-Strip */}
      <div className="bg-white p-6 rounded-[2.5rem] border-2 border-slate-100 shadow-sm flex items-center justify-between">
         <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
               <ShieldAlert className="text-red-500" size={18} />
               <span className="text-[10px] font-black uppercase text-slate-900">Critical Alerts:</span>
            </div>
            <div className="flex gap-4">
               <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-2xl border border-red-100">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-bold text-red-700 uppercase tracking-tighter italic">12 VENDOR DOCUMENTS EXPIRED</span>
               </div>
               <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                  <span className="text-[10px] font-bold text-amber-700 uppercase tracking-tighter italic">4 SLA BREACHES ESCALATED</span>
               </div>
            </div>
         </div>
         <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
            <CheckCircle2 size={14} />
            <span className="text-[10px] font-bold uppercase italic">System Integrity: 100%</span>
         </div>
      </div>
    </div>
  );
};

