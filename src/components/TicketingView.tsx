import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, Search, Filter, Plus, ChevronRight, 
  Clock, AlertCircle, CheckCircle2, MoreVertical, 
  User, Tag, LifeBuoy, ShieldAlert, ArrowUpRight,
  Send, Paperclip, Mail, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket } from '../types.ts';
import { NewTicketModal } from './NewTicketModal.tsx';
import { cn } from '../lib/utils.ts';
import { MOCK_TICKETS } from '../services/mockData.ts';

import { db, auth } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export const TicketingView = () => {
  const [tickets, setTickets] = useState<Ticket[]>(MOCK_TICKETS);
  const [activeTab, setActiveTab] = useState<'ALL' | 'OPEN' | 'BREACHED' | 'ESCALATED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let unsubscribeSnap: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnap) unsubscribeSnap();

      if (!user) {
        setTickets(MOCK_TICKETS);
        return;
      }

      const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
      unsubscribeSnap = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Ticket));
          setTickets(data);
        } else {
          setTickets(MOCK_TICKETS);
        }
      }, (error) => {
        console.error("Ticketing Firebase Error:", error);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
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
    <div className="space-y-10 text-left">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="text-left">
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
              <button className="px-5 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest uppercase">Queue Status</button>
              <button className="px-5 py-2 text-slate-500 hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest uppercase">SLA Insights</button>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-6 py-4 bg-blue-600 text-white rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-2xl"
           >
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
          <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm relative overflow-hidden group text-left">
            <stat.icon className={cn("absolute -right-2 -bottom-2 text-slate-50 scale-[2.5] transition-transform group-hover:rotate-12", stat.color.replace('text', 'text-opacity-10 text'))} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 relative z-10">{stat.label}</p>
            <div className="text-3xl font-black text-slate-900 relative z-10">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex justify-between items-center bg-white p-2.5 rounded-3xl border border-slate-200 shadow-sm">
         <div className="flex gap-1.5">
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
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-xl" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
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
              className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 text-xs font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-6">
         {filtered.map(ticket => (
           <motion.div
             layout
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: 1, scale: 1 }}
             key={ticket.id}
             className="bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-blue-400 transition-all group relative overflow-hidden text-left shadow-sm"
           >
             <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-6">
                   <div className={cn(
                     "w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all shadow-inner border border-slate-100",
                     ticket.slaBreached ? "bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white" : "bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white"
                   )}>
                      <MessageSquare size={24} />
                   </div>
                   <div>
                      <div className="flex items-center gap-3 mb-2">
                         <h4 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1 leading-tight uppercase">{ticket.subject}</h4>
                         <span className={cn("px-2.5 py-1 rounded-full text-[9px] font-black uppercase border shadow-sm", getPriorityStyle(ticket.priority))}>
                           {ticket.priority}
                         </span>
                         {ticket.isEscalated && (
                           <div className="flex items-center gap-1 text-red-600 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 shadow-sm shadow-red-200">
                             <ShieldAlert size={12} />
                             <span className="text-[8px] font-black uppercase tracking-widest">Escalated</span>
                           </div>
                         )}
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">
                         <span className="text-blue-600 font-black">#{ticket.id}</span>
                         <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                         <span>{ticket.vendorName}</span>
                         <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                         <span className="flex items-center gap-1.5 font-bold"><Tag size={14} className="text-blue-400" /> {ticket.category}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-3">
                   <div className="text-right bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-inner min-w-[140px]">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Lead Dispatcher</p>
                      <div className="flex items-center gap-3 justify-end">
                         <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">{ticket.assignedTo || 'Unassigned'}</span>
                         <div className="w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-300 shadow-sm">?</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                <div className="flex gap-10">
                   <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={16} className="text-blue-400" /> Case Logged {new Date(ticket.createdAt).toLocaleDateString()}
                   </div>
                   <div className={cn(
                     "flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-xl border border-slate-100",
                     ticket.status === 'Resolved' ? 'text-emerald-500' : 'text-blue-500'
                   )}>
                      <div className={cn("w-2 h-2 rounded-full", ticket.status === 'Resolved' ? 'bg-emerald-500 shadow-sm shadow-emerald-200' : 'bg-blue-500 animate-pulse')} />
                      {ticket.status} Status
                   </div>
                </div>
                <div className="flex gap-3">
                   <button className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                      Open Case Hub <ArrowUpRight size={18} />
                   </button>
                   <button className="p-3.5 bg-slate-50 text-slate-300 rounded-2xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-inner">
                      <MoreVertical size={20} />
                   </button>
                </div>
             </div>

             {/* Background Polish Decoration */}
             <div className="absolute -right-2 top-0 bottom-0 w-1.5 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </motion.div>
         ))}
      </div>

      {/* Analytics Overlay Widget */}
      <div className="bg-slate-900 p-12 rounded-[4rem] text-white overflow-hidden relative shadow-2xl">
         <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-600/5 skew-x-12 translate-x-32" />
         <div className="relative z-10 grid grid-cols-2 gap-24 items-center">
            <div className="space-y-8 text-left">
               <h3 className="text-4xl font-black tracking-tight leading-none italic">Queue Velocity &<br />SLA Performance</h3>
               <p className="text-lg text-slate-400 font-medium leading-relaxed italic opacity-80">"Global support metrics are currently within the 92nd percentile. Response times for High focus tickets have improved by 14% this quarter."</p>
               <div className="flex gap-6">
                  <button className="px-8 py-4 bg-blue-600 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-blue-500/20 hover:bg-blue-700 transition-all uppercase italic">Pulse Insights</button>
                  <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all uppercase italic">Audit Logs</button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-8">
               {[
                 { label: 'Avg MTTR', val: '2.4 Hours', health: '88%' },
                 { label: 'First Response', val: '14 Mins', health: '95%' },
                 { label: 'Resolution Rate', val: '98.2%', health: '92%' },
                 { label: 'Escalation Vol', val: '5.4%', health: '45%', reverse: true }
               ].map(stat => (
                 <div key={stat.label} className="bg-white/5 p-8 rounded-[2.5rem] border border-white/5 shadow-inner text-left group">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4 group-hover:text-blue-400 transition-colors font-mono">{stat.label}</p>
                    <p className="text-3xl font-black mb-6 tracking-tighter">{stat.val}</p>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: stat.health }}
                         transition={{ duration: 1.5, delay: 0.2 }}
                         className={cn("h-full rounded-full transition-all", 
                           stat.reverse ? (parseInt(stat.health) < 20 ? 'bg-emerald-400' : 'bg-red-400') : (parseInt(stat.health) > 80 ? 'bg-emerald-400' : 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]')
                         )} 
                       />
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </div>

      <NewTicketModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
