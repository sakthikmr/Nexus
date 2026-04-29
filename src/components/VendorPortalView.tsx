import React, { useState } from 'react';
import { 
  Users, UserPlus, FileText, Settings, Bell, Search, LayoutDashboard,
  MessageSquare, Briefcase, Plus, Send, Download, Globe, ShieldCheck,
  ChevronRight, Calendar, Star, TrendingUp, HelpCircle, ListTree, CreditCard,
  ArrowUpRight, Clock, CheckCircle2, AlertCircle, HardDrive, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { db, auth } from '../lib/firebase.ts';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Ticket, ProcurementRequirement, Invoice, Contract, Candidate } from '../types.ts';
import { MOCK_TICKETS, MOCK_PROCUREMENT, MOCK_INVOICES, MOCK_CONTRACTS, MOCK_CANDIDATES } from '../services/mockData.ts';

export const VendorPortalView = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'OPPORTUNITIES' | 'TALENT' | 'FINANCE' | 'CONTRACTS' | 'SUPPORT'>('DASHBOARD');
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS.filter(t => t.vendorId === 'V001'));
  const [requirements, setRequirements] = useState<ProcurementRequirement[]>(MOCK_PROCUREMENT);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES.filter(i => i.vendorId === 'V001'));
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS.filter(c => c.vendorId === 'V001'));
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES.filter(c => c.vendorId === 'V001'));

  React.useEffect(() => {
    let unsubscribeTickets: (() => void) | undefined;
    let unsubscribeReqs: (() => void) | undefined;
    let unsubscribeInvoices: (() => void) | undefined;
    let unsubscribeContracts: (() => void) | undefined;
    let unsubscribeCandidates: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeTickets) unsubscribeTickets();
      if (unsubscribeReqs) unsubscribeReqs();
      if (unsubscribeInvoices) unsubscribeInvoices();
      if (unsubscribeContracts) unsubscribeContracts();
      if (unsubscribeCandidates) unsubscribeCandidates();

      const vendorId = "V001"; // Fixed for demo

      if (!user) {
        setTickets(MOCK_TICKETS.filter(t => t.vendorId === vendorId));
        setRequirements(MOCK_PROCUREMENT);
        setInvoices(MOCK_INVOICES.filter(i => i.vendorId === vendorId));
        setContracts(MOCK_CONTRACTS.filter(c => c.vendorId === vendorId));
        setCandidates(MOCK_CANDIDATES.filter(c => c.vendorId === vendorId));
        return;
      }
      
      const tQuery = query(collection(db, 'tickets'), where('vendorId', '==', vendorId), orderBy('createdAt', 'desc'));
      unsubscribeTickets = onSnapshot(tQuery, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
          setTickets(data);
        }
      });

      const rQuery = query(collection(db, 'procurement'), orderBy('deadline', 'asc'));
      unsubscribeReqs = onSnapshot(rQuery, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProcurementRequirement));
          setRequirements(data);
        }
      });

      const iQuery = query(collection(db, 'invoices'), where('vendorId', '==', vendorId));
      unsubscribeInvoices = onSnapshot(iQuery, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
          setInvoices(data);
        }
      });

      const cQuery = query(collection(db, 'contracts'), where('vendorId', '==', vendorId));
      unsubscribeContracts = onSnapshot(cQuery, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contract));
          setContracts(data);
        }
      });

      const canQuery = query(collection(db, 'candidates'), where('vendorId', '==', vendorId));
      unsubscribeCandidates = onSnapshot(canQuery, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate));
          setCandidates(data);
        }
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeTickets) unsubscribeTickets();
      if (unsubscribeReqs) unsubscribeReqs();
      if (unsubscribeInvoices) unsubscribeInvoices();
      if (unsubscribeContracts) unsubscribeContracts();
      if (unsubscribeCandidates) unsubscribeCandidates();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] z-[100] flex flex-col font-sans">
      {/* Portal Top Bar */}
      <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('DASHBOARD')}>
            <div className="w-10 h-10 bg-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200">
               <Globe className="text-white" size={22} />
            </div>
            <div>
               <h1 className="text-lg font-black tracking-tight text-slate-800 leading-none">NEXUS CONNECT</h1>
               <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Global Talent Solutions</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 mx-4" />
          <nav className="flex items-center gap-8">
             {[
               { id: 'DASHBOARD', label: 'Home', icon: LayoutDashboard },
               { id: 'OPPORTUNITIES', label: 'Opportunities', icon: ListTree },
               { id: 'TALENT', label: 'Talent', icon: Users },
               { id: 'FINANCE', label: 'Finance', icon: CreditCard },
               { id: 'CONTRACTS', label: 'Contracts', icon: FileText },
               { id: 'SUPPORT', label: 'Support', icon: MessageSquare }
             ].map(item => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id as any)}
                 className={cn(
                   "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all relative py-2",
                   activeTab === item.id ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
                 )}
               >
                 {activeTab === item.id && (
                   <motion.div layoutId="vendor-tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full" />
                 )}
                 <item.icon size={16} />
                 {item.label}
               </button>
             ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
           <button className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-200 rounded-2xl hover:border-purple-300 transition-all group">
             <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-black transition-all group-hover:scale-105">
               JG
             </div>
             <div className="text-left">
               <div className="text-sm font-bold text-slate-900 leading-tight">John Global</div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Vendor Administrator</div>
             </div>
           </button>
           <button className="p-2.5 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/10"></span>
           </button>
        </div>
      </header>

      {/* Portal Content Scroll Area */}
      <main className="flex-1 overflow-y-auto px-12 py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'DASHBOARD' && (
            <motion.div 
               key="dash" 
               initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
               className="space-y-10 max-w-7xl mx-auto"
            >
              <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Partner Dashboard</h2>
                   <p className="text-slate-500 mt-1 font-medium italic">Welcome back to your Coherent Nexus hub.</p>
                </div>
                <div className="flex bg-white border border-slate-200 rounded-2xl p-1 gap-1 shadow-sm">
                   <button className="px-5 py-2 bg-purple-600 text-white rounded-xl text-xs font-black shadow-lg shadow-purple-200">Global Pulse</button>
                   <button className="px-5 py-2 text-slate-500 text-xs font-black hover:bg-slate-50 rounded-xl transition-all">Historical Stats</button>
                </div>
              </div>

              {/* Vendor Specific KPIs */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: 'Active RQs', value: requirements.length, icon: ListTree, color: 'text-purple-600', trend: '+2' },
                  { label: 'Support Cases', value: tickets.length, icon: MessageSquare, color: 'text-blue-600', trend: 'Healthy' },
                  { label: 'Hiring Rate', value: '42%', icon: Star, color: 'text-amber-500', trend: '+5%' },
                  { label: 'Pending Payout', value: `$${invoices.filter(i => i.status !== 'Paid').reduce((acc, i) => acc + i.amount, 0).toLocaleString()}`, icon: CreditCard, color: 'text-emerald-500', trend: 'On Time' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all cursor-default text-left">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 font-mono group-hover:text-purple-400 transition-colors uppercase">{kpi.label}</p>
                     <div className="text-4xl font-black text-slate-900 mb-1 tracking-tight">{kpi.value}</div>
                     <div className="text-[10px] font-bold text-emerald-600">{kpi.trend}</div>
                     <kpi.icon className="absolute bottom-6 right-6 text-slate-50 group-hover:text-purple-50 group-hover:scale-125 transition-all" size={64} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Active Requirements List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm flex flex-col">
                   <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Fresh Requirements</h3>
                      <button onClick={() => setActiveTab('OPPORTUNITIES')} className="text-xs font-black text-purple-600 hover:translate-x-1 transition-transform flex items-center gap-1 uppercase">Full Feed <ChevronRight size={14} /></button>
                   </div>
                   <div className="divide-y divide-slate-100 flex-1">
                      {requirements.slice(0, 4).map(rq => (
                        <div key={rq.id} className="p-6 hover:bg-slate-50/50 transition-all flex justify-between items-center group cursor-pointer">
                           <div className="flex gap-4">
                              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all text-sm", rq.priority === 'Critical' ? "bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white" : "bg-slate-100 text-slate-400 group-hover:bg-purple-600 group-hover:text-white")}>
                                 {rq.title.charAt(0)}
                              </div>
                              <div className="text-left">
                                 <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900">{rq.title}</h4>
                                    {rq.priority === 'Critical' && <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">URGENT</span>}
                                 </div>
                                 <p className="text-[11px] font-medium text-slate-500">{rq.department} • ID: {rq.id} • Bids: {rq.bidCount}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent transition-all">Submit Bid</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Performance Feed */}
                <div className="space-y-6">
                   <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden ring-4 ring-slate-900/10 shadow-2xl text-left">
                      <ShieldCheck className="absolute -right-6 -bottom-6 text-white/5" size={140} />
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Compliance Score</h3>
                      <div className="text-5xl font-black mb-4 tracking-tighter">92.4%</div>
                      <p className="text-xs text-slate-400 font-medium italic mb-6 leading-relaxed">"Global Talent Solutions is ranked in the top 10% of our global staffing partners. High compliance noted."</p>
                      <button className="w-full py-3.5 bg-purple-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-purple-700 transition-all shadow-xl shadow-purple-500/20">Audit Report</button>
                   </div>

                   <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm border-t-4 border-t-purple-600">
                      <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                         <HelpCircle className="text-purple-500" size={18} />
                         <h3 className="font-black text-slate-800 uppercase text-[10px] tracking-widest">Connect Support</h3>
                      </div>
                      <div className="space-y-3">
                         <button onClick={() => setActiveTab('SUPPORT')} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-purple-300 transition-all group flex items-center justify-between">
                            <div>
                               <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700 font-black">Open Service Ticket</p>
                               <p className="text-[10px] text-slate-400 font-medium tracking-tight">Bespoke assistance for any VMP issues.</p>
                            </div>
                            <Plus size={16} className="text-slate-300 group-hover:text-purple-600" />
                         </button>
                         <button className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-purple-300 transition-all group flex items-center justify-between">
                            <div>
                               <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700 font-black">Knowledge Base</p>
                               <p className="text-[10px] text-slate-400 font-medium tracking-tight">Browse Coherent operation manuals.</p>
                            </div>
                            <ArrowUpRight size={16} className="text-slate-300 group-hover:text-purple-600" />
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'OPPORTUNITIES' && (
            <motion.div 
               key="opps" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
               className="space-y-8 max-w-7xl mx-auto"
            >
               <div className="flex justify-between items-end">
                <div className="text-left">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight">Requirement Pipeline</h2>
                   <p className="text-slate-500 mt-1 font-medium italic">Active Projects, Staff Augmentation & Asset Tenders.</p>
                </div>
                <div className="flex gap-2">
                   <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-purple-600"><Filter size={20} /></button>
                   <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-purple-600"><Search size={20} /></button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                 {requirements.map(req => (
                   <div key={req.id} className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:border-purple-400 transition-all group relative overflow-hidden">
                      <div className="flex justify-between items-start relative z-10">
                         <div className="flex gap-6">
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-sm">
                               <Briefcase size={28} />
                            </div>
                            <div className="text-left">
                               <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-purple-600 transition-colors uppercase">{req.title}</h3>
                                  <span className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase border", 
                                    req.status === 'Bidding Open' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600'
                                  )}>
                                    {req.status}
                                  </span>
                               </div>
                               <div className="flex items-center gap-5 text-sm font-bold text-slate-500 uppercase tracking-tighter">
                                  <span>ID: {req.id}</span>
                                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                  <span>{req.department}</span>
                                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                                  <span className="flex items-center gap-1.5 text-purple-600 font-black"><Calendar size={14} /> {req.deadline}</span>
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Target Budget</p>
                            <p className="text-xl font-black text-slate-900 tracking-tight">{req.budget}</p>
                         </div>
                      </div>
                      <div className="mt-8 pt-8 border-t border-slate-50 flex justify-between items-center relative z-10">
                         <div className="flex items-center gap-6">
                             <div className="flex items-center gap-2">
                                <Users size={14} className="text-slate-400" />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-tight">{req.bidCount} Bids Submitted</span>
                             </div>
                             <div className="flex items-center gap-2">
                                <Clock size={14} className="text-slate-400" />
                                <span className="text-xs font-black text-slate-500 uppercase tracking-tight">Expires in 4 days</span>
                             </div>
                         </div>
                         <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 transition-all shadow-xl group/btn">
                            Initiate Proposal <ArrowUpRight size={16} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                         </button>
                      </div>
                      <HardDrive size={100} className="absolute -right-8 -bottom-8 text-slate-50 group-hover:text-purple-50/40 transition-colors -rotate-12 scale-150" />
                   </div>
                 ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'TALENT' && (
            <motion.div 
               key="talent" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
               className="space-y-8 max-w-7xl mx-auto"
            >
               <div className="flex justify-between items-end">
                <div className="text-left">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight">Talent Bench</h2>
                   <p className="text-slate-500 mt-1 font-medium italic">Active Candidates, Screened Profiles & Interview pipeline.</p>
                </div>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-purple-700 transition-all shadow-purple-500/20"><UserPlus size={18} /> New Profile</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {candidates.map(can => (
                   <div key={can.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-purple-400 transition-all relative overflow-hidden text-left">
                      <div className="flex items-center gap-5 mb-8">
                         <div className="w-14 h-14 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-center font-black text-xl text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all shadow-inner">
                            {can.name.substring(0, 2).toUpperCase()}
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors leading-none mb-2">{can.name}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{can.experience}YRS XP • {can.id}</p>
                         </div>
                      </div>

                      <div className="space-y-6">
                         <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1 text-left">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Position ID</p>
                               <p className="text-xs font-bold text-slate-700">{can.positionId}</p>
                            </div>
                            <div className="space-y-1 text-right">
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">Current Stage</p>
                               <p className="text-xs font-black text-purple-600 uppercase tracking-tighter">{can.stage}</p>
                            </div>
                         </div>

                         <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex justify-between items-center mb-3">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selection Status/Progress</p>
                               <span className="text-[9px] font-black text-emerald-600 flex items-center gap-1 uppercase"><CheckCircle2 size={10} /> Active</span>
                            </div>
                            <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                               <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: can.stage.includes('Interview') ? '60%' : can.stage.includes('Onboarding') ? '100%' : '20%' }} />
                            </div>
                         </div>

                         <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Updated {can.lastUpdated}</p>
                            <button className="text-xs font-black text-purple-600 uppercase hover:translate-x-1 transition-transform flex items-center gap-1">Deep View <ChevronRight size={14} /></button>
                         </div>
                      </div>
                      <Star className="absolute -right-4 -bottom-6 text-slate-50 group-hover:text-purple-50/40 transition-colors -rotate-12 scale-150 shadow-sm" />
                   </div>
                 ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'FINANCE' && (
            <motion.div 
               key="finance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
               className="space-y-8 max-w-7xl mx-auto"
            >
               <div className="flex justify-between items-end">
                <div className="text-left">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight">Invoice Center</h2>
                   <p className="text-slate-500 mt-1 font-medium italic">Managed billing, cycle approvals & historical payout data.</p>
                </div>
                <button className="px-6 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest shadow-2xl flex items-center gap-2 hover:bg-purple-600 transition-all"><CreditCard size={18} /> Submit New Invoice</button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-purple-600 overflow-x-auto">
                 <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                       <tr className="bg-slate-50/50">
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">ID / Invoice #</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Billing Period</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Invoice Value</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status Badge</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {invoices.map(inv => (
                         <tr key={inv.id} className="hover:bg-slate-50/50 transition-all group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                     <Download size={18} />
                                  </div>
                                  <div className="text-left">
                                     <p className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition-colors uppercase">{inv.invoiceNumber}</p>
                                     <p className="text-[10px] font-bold text-slate-400">ID: {inv.id} • Due: {inv.dueDate}</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-sm font-bold text-slate-600 uppercase tracking-tight">{inv.billingPeriod}</td>
                            <td className="px-8 py-6 text-right">
                               <p className="text-base font-black text-slate-900 tracking-tight">${inv.amount.toLocaleString()}</p>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{inv.currency}</p>
                            </td>
                            <td className="px-8 py-6 text-center">
                               <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter inline-block border shadow-sm", 
                                 inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                 inv.status === 'Disputed' ? 'bg-red-50 text-red-600 border-red-100' :
                                 'bg-slate-50 text-slate-500 border-slate-100'
                               )}>
                                  {inv.status}
                               </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                               <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"><ArrowUpRight size={20} /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'CONTRACTS' && (
            <motion.div 
               key="contracts" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
               className="space-y-8 max-w-7xl mx-auto"
            >
               <div className="flex justify-between items-end">
                <div className="text-left">
                   <h2 className="text-4xl font-black text-slate-900 tracking-tight">Legal Repository</h2>
                   <p className="text-slate-500 mt-1 font-medium italic">MSA, SOWs, Work Orders & NDA history.</p>
                </div>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 hover:bg-purple-700 transition-all shadow-purple-500/20">Sign New SOW</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {contracts.map(con => (
                   <div key={con.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm group hover:border-purple-400 transition-all relative overflow-hidden text-left">
                      <div className="flex justify-between items-start mb-8 border-b border-slate-50 pb-6">
                         <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                               <FileText size={24} />
                            </div>
                            <div className="text-left">
                               <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-600 transition-colors uppercase leading-none mb-2">{con.type}</h3>
                               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2rem]">{con.id}</p>
                            </div>
                         </div>
                         <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter inline-block shadow-sm ring-1 ring-inset", 
                           con.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-slate-50 text-slate-500 ring-slate-400/20'
                         )}>
                            {con.status}
                         </div>
                      </div>
                      <div className="space-y-6 text-left">
                         <div className="grid grid-cols-2 gap-6">
                             <div className="space-y-1">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">End Customer</p>
                                <p className="text-sm font-bold text-slate-800 line-clamp-1 italic">"{con.customer}"</p>
                             </div>
                             <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Est. TCV</p>
                                <p className="text-sm font-black text-indigo-600">{con.value}</p>
                             </div>
                         </div>
                         <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                             <div className="space-y-1 text-left">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Effective Date</p>
                                <p className="text-xs font-bold text-slate-500 uppercase">{con.startDate}</p>
                             </div>
                             <div className="space-y-1 text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</p>
                                <p className="text-xs font-bold text-slate-500 uppercase">{con.endDate}</p>
                             </div>
                         </div>
                         <div className="pt-6 flex gap-3">
                            <button className="flex-1 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all flex items-center justify-center gap-2"><Download size={14} /> PDF Contract</button>
                            <button className="flex-1 py-3 bg-purple-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-purple-700 transition-all flex items-center justify-center gap-2">View SOW Detail</button>
                         </div>
                      </div>
                   </div>
                 ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'SUPPORT' && (
            <motion.div 
               key="tickets-tab" 
               initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
               className="space-y-10 max-w-7xl mx-auto"
            >
               <div className="flex justify-between items-end">
                <div className="text-left">
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Support Desk</h2>
                   <p className="text-slate-500 mt-1 font-medium">Track your raising cases and service requests.</p>
                </div>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-200 flex items-center gap-2">
                   <Plus size={16} /> New Support Case
                </button>
              </div>

               <div className="grid grid-cols-1 gap-6">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center group hover:border-purple-300 transition-all shadow-sm">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                             <MessageSquare size={20} />
                          </div>
                          <div className="text-left">
                             <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-bold text-slate-900 line-clamp-1 leading-tight">{ticket.subject}</h4>
                                <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border", 
                                  ticket.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                                  ticket.priority === 'Critical' ? 'bg-purple-50 text-purple-600 border-purple-200 animate-pulse' :
                                  'bg-slate-50 text-slate-500 border-slate-100'
                                )}>
                                  {ticket.priority}
                                </span>
                             </div>
                             <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex-wrap">
                                <span className="text-purple-600 font-black">#{ticket.id}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <span>{ticket.category}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                                <span className="flex items-center gap-1 font-mono tracking-tighter"><Clock size={10} /> Last updated: {new Date(ticket.updatedAt).toLocaleTimeString()}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase border shadow-sm", 
                            ticket.status === 'Resolved' || ticket.status === 'Closed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          )}>
                             {ticket.status}
                          </span>
                          <button className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"><ChevronRight size={20} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="h-12 bg-white border-t border-slate-200/60 px-10 flex items-center justify-between shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Talent Solutions © 2024 • Enterprise Secure Partner Gateway • V1.4.2</p>
          <div className="flex gap-6">
             <button className="text-[10px] font-black text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-tight">Terms of Portal</button>
             <button className="text-[10px] font-black text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-tight">SLA Standards</button>
             <button className="text-[10px] font-black text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-tight font-mono">SUPPORT-HQ</button>
          </div>
      </footer>
    </div>
  );
};
