import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Filter, Plus, ChevronRight, 
  Clock, AlertCircle, CheckCircle2, MoreVertical, 
  User, Tag, LifeBuoy, ShieldAlert, ArrowUpRight,
  Send, Paperclip, Mail, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket } from '../types.ts';
import { cn } from '../lib/utils.ts';
import { MOCK_TICKETS } from '../services/mockData.ts';

import { db } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

export const TicketingView = () => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'OPEN' | 'BREACHED' | 'ESCALATED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
        setTickets(data);
      }
    }, (error) => {
      console.error("Ticketing Firebase Error:", error);
    });

    return () => unsubscribe();
  }, []);

  const filtered = tickets.filter(t => {
    const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.vendorName.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'ALL') return matchesSearch;
    if (activeTab === 'OPEN') return t.status !== 'Closed' && t.status !== 'Resolved' && matchesSearch;
    if (activeTab === 'BREACHED') return t.slaBreached && matchesSearch;
    if (activeTab === 'ESCALATED') return t.isEscalated && matchesSearch;
    return matchesSearch;
  });

  const getPriorityStyle = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'Critical': return 'bg-red-50 text-red-700 border-red-100 ring-2 ring-red-500/10';
      case 'High': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Medium': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-50 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl shadow-sm border border-blue-200">
               <LifeBuoy size={22} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Nexus Helpdesk</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Partner Support Queue, SLA Tracking & Escalation Governance.</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-white border border-slate-200 rounded-3xl p-1.5 flex gap-1 shadow-sm">
              <button className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Queue Status</button>
              <button className="px-5 py-2 text-slate-500 hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest">SLA Insights</button>
           </div>
           <button className="px-6 py-4 bg-blue-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-2xl">
              <Plus size={18} />
              Open Support Case
           </button>
        </div>
      </div>

      {/* Helpdesk Widgets */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Active Tickets', value: tickets.filter(t => t.status !== 'Closed').length, icon: MessageSquare, color: 'text-blue-600' },
          { label: 'Avg Resolution', value: '4.2h', icon: Clock, color: 'text-emerald-600' },
          { label: 'SLA Breaches', value: tickets.filter(t => t.slaBreached).length, icon: ShieldAlert, color: 'text-red-500' },
          { label: 'CSAT Rating', value: '4.8/5', icon: Bell, color: 'text-amber-500' }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <stat.icon className={cn("absolute -right-2 -bottom-2 text-slate-50 scale-[2.5] transition-transform group-hover:rotate-12", stat.color.replace('text', 'text-opacity-10 text'))} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">{stat.label}</p>
            <div className="text-3xl font-black text-slate-900 relative z-10">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex justify-between items-center bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex gap-1">
            {[
              { id: 'ALL', label: 'All Cases' },
              { id: 'OPEN', label: 'Open / Pending' },
              { id: 'BREACHED', label: 'Breached SLA' },
              { id: 'ESCALATED', label: 'Escalated' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </button>
            ))}
         </div>
         <div className="flex-1 max-w-sm ml-8 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search Vendor or Subject..."
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-medium focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-4">
         {filtered.map(ticket => (
           <motion.div
             layout
             initial={{ opacity: 0, x: -10 }}
             animate={{ opacity: 1, x: 0 }}
             key={ticket.id}
             className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-300 transition-all group relative overflow-hidden"
           >
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-5">
                   <div className={cn(
                     "w-14 h-14 rounded-[1.5rem] flex items-center justify-center transition-all shadow-sm",
                     ticket.slaBreached ? "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white" : "bg-slate-100 text-slate-400 group-hover:bg-blue-600 group-hover:text-white"
                   )}>
                      <MessageSquare size={22} />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-1">
                         <h4 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1">{ticket.subject}</h4>
                         <span className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase border", getPriorityStyle(ticket.priority))}>
                           {ticket.priority}
                         </span>
                         {ticket.isEscalated && (
                           <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-lg border border-red-100">
                             <ShieldAlert size={10} />
                             <span className="text-[8px] font-black uppercase">Escalated</span>
                           </div>
                         )}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                         <span className="text-blue-600 font-black">#{ticket.id}</span>
                         <span className="w-1 h-1 bg-slate-300 rounded-full" />
                         <span>{ticket.vendorName}</span>
                         <span className="w-1 h-1 bg-slate-300 rounded-full" />
                         <span className="flex items-center gap-1"><Tag size={12} /> {ticket.category}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Assigned To</p>
                      <div className="flex items-center gap-2 justify-end">
                         <span className="text-xs font-black text-slate-700">{ticket.assignedTo || 'Unassigned'}</span>
                         <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[8px] font-bold text-slate-400">?</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                <div className="flex gap-8">
                   <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                      <Clock size={14} /> Created {new Date(ticket.createdAt).toLocaleDateString()}
                   </div>
                   <div className={cn(
                     "flex items-center gap-2 text-[10px] font-black uppercase",
                     ticket.status === 'Resolved' ? 'text-emerald-500' : 'text-blue-500'
                   )}>
                      <div className={cn("w-1.5 h-1.5 rounded-full", ticket.status === 'Resolved' ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-blue-500')} />
                      {ticket.status}
                   </div>
                </div>
                <div className="flex gap-2">
                   <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 text-slate-700 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      Open Case Hub <ArrowUpRight size={14} />
                   </button>
                   <button className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-900">
                      <MoreVertical size={16} />
                   </button>
                </div>
             </div>

             {/* Background Polish */}
             <div className="absolute -right-2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </motion.div>
         ))}
      </div>

      {/* Analytics Overlay Widget */}
      <div className="bg-slate-900 p-10 rounded-[3rem] text-white overflow-hidden relative">
         <div className="absolute right-0 top-0 w-1/3 h-full bg-blue-600/10 skew-x-12 translate-x-20" />
         <div className="relative z-10 grid grid-cols-2 gap-20">
            <div className="space-y-6">
               <h3 className="text-2xl font-black tracking-tight leading-tight">Queue Velocity &<br />SLA Performance</h3>
               <p className="text-sm text-slate-400 font-medium leading-relaxed italic">"Global support metrics are currently within the 92nd percentile. Response times for High priority tickets have improved by 14%."</p>
               <div className="flex gap-4">
                  <button className="px-6 py-3 bg-blue-600 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/10">Download Monthly Stats</button>
                  <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest">Audit Logs</button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               {[
                 { label: 'MTTR', val: '2.4 Hours', health: '88%' },
                 { label: 'First Response', val: '14 Mins', health: '95%' },
                 { label: 'Resolution Rate', val: '98.2%', health: '92%' },
                 { label: 'Escalation Vol', val: '5.4%', health: '45%', reverse: true }
               ].map(stat => (
                 <div key={stat.label} className="bg-white/5 p-5 rounded-3xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                    <p className="text-lg font-black">{stat.val}</p>
                    <div className="mt-3 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <div 
                         className={cn("h-full rounded-full transition-all", 
                           stat.reverse ? (parseInt(stat.health) < 20 ? 'bg-emerald-400' : 'bg-red-400') : (parseInt(stat.health) > 80 ? 'bg-emerald-400' : 'bg-amber-400')
                         )} 
                         style={{ width: stat.health }} 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
