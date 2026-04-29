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
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-blue-100 text-blue-600 rounded-xl shadow-sm border border-blue-200">
               <LifeBuoy size={16} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Helpdesk</h2>
          </div>
          <p className="text-slate-500 font-medium italic text-sm">Partner Support Queue.</p>
        </div>
        
        <div className="flex gap-2">
           <div className="bg-white border border-slate-200 rounded-xl p-0.5 flex gap-0.5 shadow-sm">
              <button className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[8px] font-black uppercase tracking-widest leading-none">Queue</button>
              <button className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 rounded-lg text-[8px] font-black uppercase tracking-widest leading-none">Insights</button>
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
           >
              <Plus size={14} /> New Case
           </button>
        </div>
      </div>

      {/* Helpdesk Widgets */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active', value: tickets.filter(t => t.status !== 'Closed').length, icon: MessageSquare, color: 'text-blue-600' },
          { label: 'Resolution', value: '4.2h', icon: Clock, color: 'text-emerald-600' },
          { label: 'Breaches', value: tickets.filter(t => t.slaBreached).length, icon: ShieldAlert, color: 'text-red-500' },
          { label: 'Rating', value: '4.8/5', icon: Bell, color: 'text-amber-500' }
        ].map(stat => (
          <div key={stat.label} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group text-left">
            <stat.icon className={cn("absolute -right-1 -bottom-1 text-slate-50 scale-[1.5] transition-transform group-hover:rotate-12", stat.color.replace('text', 'text-opacity-10 text'))} />
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 relative z-10 italic">{stat.label}</p>
            <div className="text-lg font-black text-slate-900 relative z-10">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex justify-between items-center bg-white p-1 rounded-2xl border border-slate-200 shadow-sm">
         <div className="flex gap-0.5">
            {[
              { id: 'ALL', label: 'All' },
              { id: 'OPEN', label: 'Open' },
              { id: 'BREACHED', label: 'Breached' },
              { id: 'ESCALATED', label: 'Escalated' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab.id ? "bg-slate-900 text-white shadow-md" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
              >
                {tab.label}
              </button>
            ))}
         </div>
         <div className="flex-1 max-w-xs ml-4 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Filter cases..."
              className="w-full bg-slate-50 border-none rounded-xl py-1.5 pl-9 pr-3 text-[10px] font-bold focus:ring-2 focus:ring-blue-100 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
         {filtered.map(ticket => (
           <motion.div
             layout
             initial={{ opacity: 0, scale: 0.99 }}
             animate={{ opacity: 1, scale: 1 }}
             key={ticket.id}
             className="bg-white p-4 rounded-2xl border border-slate-100 hover:border-blue-400 transition-all group relative overflow-hidden text-left shadow-sm"
           >
             <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                   <div className={cn(
                     "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-inner border border-slate-100 shrink-0",
                     ticket.slaBreached ? "bg-red-50 text-red-500 group-hover:bg-red-500 group-hover:text-white" : "bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white"
                   )}>
                      <MessageSquare size={16} />
                   </div>
                   <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                         <h4 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight line-clamp-1 leading-none uppercase truncate">{ticket.subject}</h4>
                         <span className={cn("px-1.5 py-0.5 rounded-lg text-[7px] font-black uppercase border", getPriorityStyle(ticket.priority))}>
                           {ticket.priority}
                         </span>
                         {ticket.isEscalated && (
                           <div className="flex items-center gap-1 text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 shadow-sm shadow-red-200">
                             <ShieldAlert size={10} />
                             <span className="text-[7px] font-black uppercase tracking-widest">Escalated</span>
                           </div>
                         )}
                      </div>
                      <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">
                         <span className="text-blue-600">#{ticket.id}</span>
                         <span className="w-1 h-1 bg-slate-200 rounded-full" />
                         <span className="truncate max-w-[150px]">{ticket.vendorName}</span>
                      </div>
                   </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                   <div className="text-right bg-slate-50 p-2 rounded-xl border border-slate-100 shadow-inner min-w-[100px]">
                      <p className="text-[7px] font-black text-slate-400 uppercase tracking-widest mb-0.5 opacity-60 italic">Assigned</p>
                      <div className="flex items-center gap-1.5 justify-end">
                         <span className="text-[9px] font-black text-slate-900 uppercase tracking-tighter truncate">{ticket.assignedTo || 'Unassigned'}</span>
                         <div className="w-5 h-5 bg-white border border-slate-100 rounded-full flex items-center justify-center text-[8px] font-black text-slate-300 shadow-sm shrink-0 uppercase">?</div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex justify-between items-center pt-3 border-t border-slate-50">
                <div className="flex gap-4">
                   <div className="flex items-center gap-1.5 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                      <Clock size={12} className="text-blue-400" /> {new Date(ticket.createdAt).toLocaleDateString()}
                   </div>
                   <div className={cn(
                     "flex items-center gap-1 text-[7px] font-black uppercase tracking-widest px-1.5 py-0.5 bg-slate-50 rounded-lg border border-slate-100",
                     ticket.status === 'Resolved' ? 'text-emerald-500' : 'text-blue-500'
                   )}>
                      <div className={cn("w-1 h-1 rounded-full", ticket.status === 'Resolved' ? 'bg-emerald-500' : 'bg-blue-500 animate-pulse')} />
                      {ticket.status}
                   </div>
                </div>
                <div className="flex gap-1.5">
                   <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white rounded-lg font-black text-[8px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 leading-none">
                      Hub <ArrowUpRight size={12} />
                   </button>
                   <button className="p-1.5 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all shadow-inner border border-slate-100">
                      <MoreVertical size={14} />
                   </button>
                </div>
             </div>
             {/* Background Decoration */}
             <div className="absolute -right-2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           </motion.div>
         ))}
      </div>

      {/* Analytics Overlay Widget */}
      <div className="bg-slate-900 p-8 rounded-3xl text-white overflow-hidden relative shadow-xl">
         <div className="absolute right-0 top-0 w-1/2 h-full bg-blue-600/5 skew-x-12 translate-x-32" />
         <div className="relative z-10 grid grid-cols-2 gap-12 items-center">
            <div className="space-y-4 text-left">
               <h3 className="text-2xl font-black tracking-tight leading-none italic uppercase">Performance</h3>
               <p className="text-sm text-slate-400 font-medium leading-tight italic opacity-80 max-w-sm">Global support metrics within the 92nd percentile.</p>
               <div className="flex gap-4 pt-2">
                  <button className="px-5 py-2.5 bg-blue-600 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all italic">Insights</button>
                  <button className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all italic">Audit</button>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Avg MTTR', val: '2.4 Hours', health: '88%' },
                 { label: 'Response', val: '14 Mins', health: '95%' },
                 { label: 'Success', val: '98.2%', health: '92%' },
                 { label: 'Escalation', val: '5.4%', health: '45%' }
               ].map(stat => (
                 <div key={stat.label} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left group">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-2 group-hover:text-blue-400 transition-colors">{stat.label}</p>
                    <p className="text-lg font-black mb-3 tracking-tight">{stat.val}</p>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: stat.health }}
                         transition={{ duration: 1.5 }}
                         className="h-full bg-blue-500 rounded-full" 
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
