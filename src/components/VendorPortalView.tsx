import React, { useState } from 'react';
import { 
  Users, UserPlus, FileText, Settings, Bell, Search, LayoutDashboard,
  MessageSquare, Briefcase, Plus, Send, Download, Globe, ShieldCheck,
  ChevronRight, Calendar, Star, TrendingUp, HelpCircle, ListTree, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { db } from '../lib/firebase.ts';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { Ticket, ProcurementRequirement } from '../types.ts';

export const VendorPortalView = () => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'REQUIREMENTS' | 'CANDIDATES' | 'INVOICES' | 'TICKETS'>('DASHBOARD');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [requirements, setRequirements] = useState<ProcurementRequirement[]>([]);

  React.useEffect(() => {
    // For vendor portal, we strictly filter by vendorId (mocking V001 for now)
    const vendorId = "V001";
    
    const tQuery = query(collection(db, 'tickets'), where('vendorId', '==', vendorId), orderBy('createdAt', 'desc'));
    const unsubscribeTickets = onSnapshot(tQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
      setTickets(data);
    });

    const rQuery = query(collection(db, 'procurement'), orderBy('deadline', 'asc'));
    const unsubscribeReqs = onSnapshot(rQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProcurementRequirement));
      setRequirements(data);
    });

    return () => {
      unsubscribeTickets();
      unsubscribeReqs();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] z-[100] flex flex-col font-sans">
      {/* Portal Top Bar */}
      <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
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
               { id: 'REQUIREMENTS', label: 'Requirements', icon: ListTree },
               { id: 'CANDIDATES', label: 'Our Talent', icon: Users },
               { id: 'INVOICES', label: 'Commercials', icon: CreditCard },
               { id: 'TICKETS', label: 'Support Cases', icon: MessageSquare }
             ].map(item => (
               <button
                 key={item.id}
                 onClick={() => setActiveTab(item.id as any)}
                 className={cn(
                   "flex items-center gap-2 text-sm font-bold transition-all relative py-2",
                   activeTab === item.id ? "text-purple-600" : "text-slate-500 hover:text-slate-900"
                 )}
               >
                 {activeTab === item.id && (
                   <motion.div layoutId="vendor-tab-indicator" className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-t-full" />
                 )}
                 {item.label}
               </button>
             ))}
          </nav>
        </div>

        <div className="flex items-center gap-6">
           <button className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-200 rounded-2xl hover:border-purple-300 transition-all group">
             <div className="w-9 h-9 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center font-black transition-all">
               JG
             </div>
             <div className="text-left">
               <div className="text-sm font-bold text-slate-900 leading-tight">John Global</div>
               <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Vendor Administrator</div>
             </div>
           </button>
           <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-800 transition-all">Switch Back</button>
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
                  { label: 'Active RQs', value: requirements.length, icon: ListTree, color: 'text-purple-600' },
                  { label: 'Support Cases', value: tickets.length, icon: MessageSquare, color: 'text-blue-600' },
                  { label: 'Hiring Rate', value: '42%', icon: Star, color: 'text-amber-500' },
                  { label: 'Active Invoices', value: '03', icon: CreditCard, color: 'text-emerald-500' }
                ].map((kpi, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 font-mono group-hover:text-purple-400 transition-colors">{kpi.label}</p>
                     <div className="text-4xl font-black text-slate-900 mb-1">{kpi.value}</div>
                     <TrendingUp className="absolute bottom-6 right-6 text-slate-50 group-hover:text-purple-50 group-hover:scale-125 transition-all" size={64} />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Active Requirements List */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                   <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                      <h3 className="font-bold text-slate-800">Fresh Requirements</h3>
                      <button className="text-xs font-black text-purple-600 hover:underline">View Pipeline</button>
                   </div>
                   <div className="divide-y divide-slate-100">
                      {[
                        { id: 'RQ-2024-901', pos: 'Lead Cloud Architect', area: 'FinDev Team', urgent: true, bids: 12 },
                        { id: 'RQ-2024-902', pos: 'Fullstack React Dev', area: 'Platform Ops', urgent: false, bids: 5 },
                        { id: 'RQ-2024-903', pos: 'Data Engineer (P3)', area: 'E-Commerce', urgent: false, bids: 3 }
                      ].map(rq => (
                        <div key={rq.id} className="p-6 hover:bg-slate-50/50 transition-all flex justify-between items-center group cursor-pointer">
                           <div className="flex gap-4">
                              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all", rq.urgent ? "bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white" : "bg-slate-100 text-slate-400 group-hover:bg-purple-600 group-hover:text-white")}>
                                 {rq.pos.charAt(0)}
                              </div>
                              <div>
                                 <div className="flex items-center gap-2 mb-1">
                                    <h4 className="font-bold text-slate-900">{rq.pos}</h4>
                                    {rq.urgent && <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter">URGENT</span>}
                                 </div>
                                 <p className="text-[11px] font-medium text-slate-500">{rq.area} • ID: {rq.id}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 group-hover:bg-purple-600 group-hover:text-white group-hover:border-transparent transition-all">Submit Candidate</button>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Performance Feed */}
                <div className="space-y-6">
                   <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden">
                      <ShieldCheck className="absolute -right-6 -bottom-6 text-white/5" size={140} />
                      <h3 className="text-lg font-black mb-1">Compliance Score</h3>
                      <div className="text-5xl font-black mb-4">92.4%</div>
                      <p className="text-xs text-slate-400 font-medium italic mb-6">"You are in the top 10% of our global staffing partners. Consistent delivery noted."</p>
                      <button className="w-full py-3 bg-purple-600 rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-purple-700 transition-all">Download Audit Report</button>
                   </div>

                   <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-6 border-b border-slate-50 pb-4">
                         <HelpCircle className="text-purple-500" size={18} />
                         <h3 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Connect with Nexus Support</h3>
                      </div>
                      <div className="space-y-4">
                         <button className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-purple-300 transition-all group">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700">Open Service Ticket</p>
                            <p className="text-[10px] text-slate-400 font-medium">Bespoke assistance for VMP issues.</p>
                         </button>
                         <button className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:border-purple-300 transition-all group">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-purple-700">Knowledge Base</p>
                            <p className="text-[10px] text-slate-400 font-medium">Browse Coherent operation manuals.</p>
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'TICKETS' && (
            <motion.div 
               key="tickets-tab" 
               initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
               className="space-y-10 max-w-7xl mx-auto"
            >
               <div className="flex justify-between items-end">
                <div>
                   <h2 className="text-3xl font-black text-slate-900 tracking-tight">Support Desk</h2>
                   <p className="text-slate-500 mt-1 font-medium">Track your raising cases and service requests.</p>
                </div>
                <button className="px-6 py-3 bg-purple-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-purple-200 flex items-center gap-2">
                   <Plus size={16} /> New Support Case
                </button>
              </div>               <div className="grid grid-cols-1 gap-6">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-white p-6 rounded-3xl border border-slate-200 flex justify-between items-center group hover:border-purple-300 transition-all">
                       <div className="flex items-center gap-6">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all">
                             <MessageSquare size={20} />
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                                <h4 className="font-bold text-slate-900 line-clamp-1">{ticket.subject}</h4>
                                <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border", 
                                  ticket.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-slate-50 text-slate-500'
                                )}>
                                  {ticket.priority}
                                </span>
                             </div>
                             <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase">
                                <span className="text-purple-600 font-black">#{ticket.id}</span>
                                <span>{ticket.category}</span>
                                <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                             </div>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={cn("px-4 py-1.5 rounded-full text-[10px] font-black uppercase border", 
                            ticket.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          )}>
                             {ticket.status}
                          </span>
                          <button className="p-2 text-slate-400 hover:text-purple-600"><ChevronRight size={20} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="h-12 bg-white border-t border-slate-200/60 px-10 flex items-center justify-between shrink-0">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Talent Solutions © 2024 • Enterprise Secure Portal</p>
          <div className="flex gap-6">
             <button className="text-[10px] font-black text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-tight">Terms of Portal</button>
             <button className="text-[10px] font-black text-slate-400 hover:text-purple-600 transition-colors uppercase tracking-tight">SLA Standards</button>
          </div>
      </footer>
    </div>
  );
};
