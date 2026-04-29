import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Plus, ChevronRight, User, Calendar, ExternalLink, 
  MapPin, DollarSign, Users, Briefcase, Activity, Target,
  Trello, List, FilterX, ArrowUpRight, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Position, Candidate } from '../types.ts';
import { CandidateBoard } from './CandidateBoard.tsx';
import { Candidate360 } from './Candidate360.tsx';
import { NewPositionModal } from './NewPositionModal.tsx';
import { cn } from '../lib/utils.ts';
import { db, auth } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { MOCK_POSITIONS, MOCK_CANDIDATES } from '../services/mockData.ts';

export const RecruitmentView = () => {
  const [positions, setPositions] = useState<Position[]>(MOCK_POSITIONS);
  const [candidates, setCandidates] = useState<Candidate[]>(MOCK_CANDIDATES);
  const [view, setView] = useState<'POSITIONS' | 'PIPELINE'>('POSITIONS');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let unsubscribePos: (() => void) | undefined;
    let unsubscribeCand: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Cleanup previous observers
      if (unsubscribePos) unsubscribePos();
      if (unsubscribeCand) unsubscribeCand();

      if (!user) {
        setPositions(MOCK_POSITIONS);
        setCandidates(MOCK_CANDIDATES);
        return;
      }

      // Sync Positions
      const posQuery = query(collection(db, 'positions'), orderBy('openDate', 'desc'));
      unsubscribePos = onSnapshot(posQuery, (snapshot) => {
        if (!snapshot.empty) {
          setPositions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Position)));
        } else {
          setPositions(MOCK_POSITIONS);
        }
      }, (error) => {
        console.error("Positions Sync Error:", error);
      });

      // Sync Candidates
      const candQuery = query(collection(db, 'candidates'), orderBy('lastUpdated', 'desc'));
      unsubscribeCand = onSnapshot(candQuery, (snapshot) => {
        if (!snapshot.empty) {
          setCandidates(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Candidate)));
        } else {
          setCandidates(MOCK_CANDIDATES);
        }
      }, (error) => {
        console.error("Candidates Sync Error:", error);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribePos) unsubscribePos();
      if (unsubscribeCand) unsubscribeCand();
    };
  }, []);

  const filteredPositions = positions.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 min-h-screen text-left">
      {/* Module Header & KPIs */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl shadow-sm border border-blue-200">
                <Target size={22} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Talent Acquisition</h2>
            </div>
            <p className="text-slate-500 font-medium italic">Orchestrating Coherent's global human capital growth.</p>
          </div>
          
          <div className="flex bg-white border border-slate-200 rounded-2xl p-1.5 gap-1 shadow-sm">
            <button 
              onClick={() => setView('POSITIONS')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                view === 'POSITIONS' ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <List size={14} /> Open Mandates
            </button>
            <button 
              onClick={() => setView('PIPELINE')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                view === 'PIPELINE' ? "bg-slate-900 text-white shadow-xl" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Trello size={14} /> Global Pipeline
            </button>
          </div>
        </div>

        {/* Tactical Overview Widgets */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Active Positions', value: positions.length, trend: '+2 this week', icon: Briefcase, color: 'text-blue-600' },
            { label: 'Total Pipeline', value: candidates.length, trend: '42 fresh matches', icon: Users, color: 'text-indigo-600' },
            { label: 'Interview Rate', value: '64%', trend: 'Avg 4.2 days to R1', icon: Activity, color: 'text-emerald-600' },
            { label: 'Closing Time', value: '18d', trend: '-2d vs last month', icon: TrendingUp, color: 'text-amber-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors uppercase">{stat.label}</p>
              <div className="flex items-baseline gap-3">
                <div className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-400 italic">{stat.trend}</div>
              </div>
              <stat.icon className="absolute -right-2 -bottom-2 text-slate-50 group-hover:text-blue-50 transition-all scale-150 rotate-12" size={48} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search by Position ID, Title, or Candidate Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-4">
             <button className="px-6 py-4 bg-white border border-slate-200 rounded-2xl text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                <Filter size={18} /> Filters
             </button>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20"
              >
                <Plus size={18} /> New Mandate
             </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'POSITIONS' ? (
            <motion.div 
              key="pos-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-20"
            >
              {filteredPositions.map(pos => (
                <div 
                   key={pos.id} 
                   className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-blue-400 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start relative z-10 text-left">
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase border",
                          pos.priority === 'High' || pos.priority === 'Critical' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {pos.priority} Priority
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase font-mono">ID: {pos.id}</span>
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight uppercase leading-tight">{pos.title}</h3>
                        <div className="flex items-center gap-4 mt-2 text-slate-500 font-bold text-xs uppercase tracking-tight">
                           <span>{pos.businessUnit} Unit</span>
                           <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                           <span>Started {pos.openDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-[2rem] text-center border border-slate-100 shrink-0 min-w-[100px] shadow-inner">
                      <div className="text-3xl font-black text-slate-900 leading-none mb-1">{pos.hiresNeeded}</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Slots</div>
                    </div>
                  </div>

                  <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10 text-left">
                    <div className="flex items-center gap-8">
                       <div className="flex -space-x-3">
                         {[1,2,3].map((_, i) => (
                           <div key={i} className="w-10 h-10 rounded-full bg-slate-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">JD</div>
                         ))}
                         <div className="w-10 h-10 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-[10px] font-black text-white shadow-lg">+9</div>
                       </div>
                       <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Pipeline Health</p>
                         <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">Accelerated</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setView('PIPELINE')}
                      className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] hover:translate-x-2 transition-transform"
                    >
                      Manage Pipeline <ArrowUpRight size={18} />
                    </button>
                  </div>

                  <Briefcase size={120} className="absolute -right-4 -bottom-6 text-slate-50 group-hover:text-blue-50/40 transition-colors -rotate-12 scale-150" />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="pipeline"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <CandidateBoard 
                candidates={candidates} 
                positions={positions} 
                onSelectCandidate={setSelectedCandidate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Views */}
      <AnimatePresence>
        {selectedCandidate && (
          <Candidate360 
            candidate={selectedCandidate} 
            onClose={() => setSelectedCandidate(null)}
            onUpdateStatus={() => {}}
            onShareToCustomer={() => {}}
          />
        )}
      </AnimatePresence>

      <NewPositionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
