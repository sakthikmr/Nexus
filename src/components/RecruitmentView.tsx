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
    <div className="space-y-8 min-h-screen text-left">
      {/* Module Header & KPIs */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shadow-sm border border-blue-200">
                <Target size={18} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Talent</h2>
            </div>
            <p className="text-slate-500 font-medium italic text-sm">Growth mandates.</p>
          </div>
          
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 gap-1 shadow-sm">
            <button 
              onClick={() => setView('POSITIONS')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                view === 'POSITIONS' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <List size={12} /> Open
            </button>
            <button 
              onClick={() => setView('PIPELINE')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                view === 'PIPELINE' ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <Trello size={12} /> Pipeline
            </button>
          </div>
        </div>

        {/* Tactical Overview Widgets */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Active', value: positions.length, trend: '+2', icon: Briefcase, color: 'text-blue-600' },
            { label: 'Pipeline', value: candidates.length, trend: '42 matches', icon: Users, color: 'text-indigo-600' },
            { label: 'Rate', value: '64%', trend: 'Avg 4.2d', icon: Activity, color: 'text-emerald-600' },
            { label: 'Closing', value: '18d', trend: '-2d', icon: TrendingUp, color: 'text-amber-500' }
          ].map((stat, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all text-left">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1 group-hover:text-blue-500 transition-colors">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <div className="text-xl font-black text-slate-900 tracking-tighter">{stat.value}</div>
                <div className="text-[8px] font-bold text-slate-400 italic">{stat.trend}</div>
              </div>
              <stat.icon className="absolute -right-2 -bottom-2 text-slate-50 group-hover:text-blue-50 transition-all scale-150 rotate-12" size={32} />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* Filter Bar */}
        <div className="flex justify-between items-center gap-3">
          <div className="flex-1 max-w-lg relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search talent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-12 pr-4 text-[11px] font-medium focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
             <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                <Filter size={16} />
             </button>
             <button 
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-500/20"
              >
                <Plus size={14} /> New Mandate
             </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'POSITIONS' ? (
            <motion.div 
              key="pos-list"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-20"
            >
              {filteredPositions.map(pos => (
                <div 
                   key={pos.id} 
                   className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:border-blue-400 transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start relative z-10 text-left">
                    <div className="space-y-3 min-w-0">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-black uppercase border",
                          pos.priority === 'High' || pos.priority === 'Critical' ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                          {pos.priority}
                        </div>
                        <span className="text-[8px] font-bold text-slate-400 tracking-widest uppercase font-mono">ID: {pos.id}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight uppercase leading-tight truncate">{pos.title}</h3>
                        <div className="flex items-center gap-3 mt-1 text-slate-500 font-bold text-[10px] uppercase tracking-tight">
                           <span>{pos.businessUnit}</span>
                           <span className="w-1 h-1 bg-slate-200 rounded-full" />
                           <span>{pos.openDate}</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl text-center border border-slate-100 shrink-0 min-w-[70px] shadow-inner">
                      <div className="text-xl font-black text-slate-900 leading-none mb-1">{pos.hiresNeeded}</div>
                      <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Slots</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10 text-left">
                    <div className="flex items-center gap-4">
                       <div className="flex -space-x-2">
                         {[1,2,3].map((_, i) => (
                           <div key={i} className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400 shadow-sm">JD</div>
                         ))}
                       </div>
                       <div>
                         <p className="text-[9px] font-black text-emerald-500 uppercase">Accelerated</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setView('PIPELINE')}
                      className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:translate-x-1 transition-transform"
                    >
                      Pipeline <ArrowUpRight size={14} />
                    </button>
                  </div>
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
