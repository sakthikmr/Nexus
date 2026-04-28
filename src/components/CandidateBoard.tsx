import React from 'react';
import { motion } from 'motion/react';
import { Calendar, Briefcase, ChevronRight, Globe, ShieldCheck } from 'lucide-react';
import { Candidate, Position, RecruitmentStage, CustomerStatus } from '../types.ts';
import { cn } from '../lib/utils.ts';

interface CandidateBoardProps {
  candidates: Candidate[];
  positions: Position[];
  onSelectCandidate: (candidate: Candidate) => void;
}

const STAGES: RecruitmentStage[] = [
  'Sourcing', 
  'Discussion', 
  'Interview R1', 
  'Test/Round 2', 
  'Final Selection', 
  'Onboarding'
];

export const CandidateBoard = ({ candidates, positions, onSelectCandidate }: CandidateBoardProps) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-8 -mx-8 px-8 scrollbar-hide">
      {STAGES.map((stage) => {
        const stageCandidates = candidates.filter(c => c.stage === stage);
        return (
          <div key={stage} className="min-w-[340px] max-w-[340px] shrink-0">
            <div className="mb-6 flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
               <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.15em] mb-0.5">{stage}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{stageCandidates.length} Leads</p>
               </div>
               <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                  <Briefcase size={14} className="text-slate-300" />
               </div>
            </div>
            
            <div className="space-y-4">
              {stageCandidates.map(cand => (
                <motion.div 
                  layoutId={cand.id}
                  key={cand.id} 
                  onClick={() => onSelectCandidate(cand)}
                  className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 hover:border-blue-400 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">#{cand.id}</span>
                    <div className="flex gap-1.5">
                       {cand.customerStatus !== 'Yet to Share' && (
                         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-200" title="Visible to Customer" />
                       )}
                       <span className={cn(
                         "px-2 py-0.5 rounded-lg text-[9px] font-black uppercase border",
                         cand.source === 'Vendor' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                       )}>
                         {cand.source}
                       </span>
                    </div>
                  </div>

                  <h5 className="font-black text-slate-900 text-lg mb-1 group-hover:text-blue-600 transition-colors leading-tight">{cand.name}</h5>
                  <p className="text-[11px] font-medium text-slate-500 line-clamp-1 mb-4">
                    {positions.find(p => p.id === cand.positionId)?.title || 'Unmapped Profile'}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50/80">
                     <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase transition-colors group-hover:text-slate-600">
                           <Globe size={12} className={cn(cand.customerStatus !== 'Yet to Share' ? 'text-emerald-500' : 'text-slate-300')} />
                           {cand.customerStatus === 'Yet to Share' ? 'Private' : 'Shared'}
                        </div>
                     </div>
                     <div className="flex items-center gap-1 text-[10px] font-black text-slate-300 group-hover:text-blue-500 transition-all">
                        VIEW 360 <ChevronRight size={14} />
                     </div>
                  </div>
                </motion.div>
              ))}
              
              {stageCandidates.length === 0 && (
                <div className="py-20 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center grayscale opacity-40">
                   <ShieldCheck className="text-slate-300 mb-2" size={32} />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No candidates</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
