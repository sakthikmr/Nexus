import React, { useState } from 'react';
import { 
  ShieldCheck, AlertCircle, CheckCircle2, ChevronRight, 
  HelpCircle, MessageSquare, Upload, FileText, Info, ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils.ts';

interface Question {
  id: string;
  text: string;
  help?: string;
  type: 'YES_NO' | 'TEXT' | 'ATTACHMENT';
  category: string;
  response?: string;
  evidenceId?: string;
}

export const AssessmentReviewer = () => {
  const [activeCategory, setActiveCategory] = useState<'SECURITY' | 'ESG' | 'FINANCIAL'>('SECURITY');
  
  const questions: Question[] = [
    { id: 'Q1', category: 'SECURITY', type: 'YES_NO', text: 'Does the organization have a formal ISO 27001 certification?', help: 'Please provide certificate if YES.', response: 'YES', evidenceId: 'DOC-992' },
    { id: 'Q2', category: 'SECURITY', type: 'YES_NO', text: 'Is MFA enforced for all administrative access to vendor systems?', response: 'YES' },
    { id: 'Q3', category: 'SECURITY', type: 'TEXT', text: 'Describe your data breach notification policy.', response: 'Our policy ensures all stakeholders are notified within 24 hours of confirmation...' },
    { id: 'Q4', category: 'ESG', type: 'YES_NO', text: 'Do you have a documented Environmental Sustainability Policy?', response: 'NO' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm max-w-5xl mx-auto text-left">
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
        {/* Navigation Sidebar */}
        <div className="bg-slate-50 p-4 border-r border-slate-200">
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Sections</p>
           <nav className="space-y-1.5">
             {[
               { id: 'SECURITY', label: 'Security', score: 92, icon: ShieldCheck },
               { id: 'ESG', label: 'ESG', score: 45, icon: ShieldAlert },
               { id: 'FINANCIAL', label: 'Financial', score: 0, icon: FileText }
             ].map(sec => (
               <button
                 key={sec.id}
                 onClick={() => setActiveCategory(sec.id as any)}
                 className={cn(
                   "w-full flex items-center justify-between p-2 rounded-xl transition-all group",
                   activeCategory === sec.id ? "bg-white shadow-md border border-slate-200 text-blue-600" : "text-slate-500 hover:bg-slate-100"
                 )}
               >
                 <div className="flex items-center gap-2">
                   <sec.icon size={16} className={cn(activeCategory === sec.id ? "text-blue-600" : "text-slate-400")} />
                   <span className="text-[11px] font-bold whitespace-nowrap">{sec.label}</span>
                 </div>
                 <div className={cn("text-[8px] font-black px-1 py-0.5 rounded", sec.score > 80 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400")}>
                    {sec.score === 0 ? 'FIX' : `${sec.score}%`}
                 </div>
               </button>
             ))}
           </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{activeCategory.replace('_', ' ')}</h3>
              <p className="text-[10px] text-slate-500 font-medium italic">Evaluation of vendor response.</p>
            </div>
            <button className="text-[9px] font-black text-blue-600 flex items-center gap-1 uppercase tracking-widest bg-blue-50 px-2 py-1 rounded-lg">
               <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
               Drafting
            </button>
          </div>

          <div className="flex-1 p-5 space-y-6 overflow-y-auto max-h-[500px]">
            {questions.filter(q => q.category === activeCategory).map((q, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                key={q.id} 
                className="space-y-3"
              >
                <div className="flex items-start gap-3">
                   <div className="w-5 h-5 bg-slate-100 rounded-full flex items-center justify-center text-[9px] font-black text-slate-400 shrink-0 mt-0.5">
                      {idx + 1}
                   </div>
                   <div className="flex-1">
                      <p className="text-[12px] font-bold text-slate-800 leading-tight mb-3 uppercase tracking-tight">{q.text}</p>
                      
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 transition-all border-l-4 border-l-blue-500">
                         <div className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                            <Info size={10} /> Response
                         </div>
                         <p className="text-[11px] font-medium text-slate-700 leading-relaxed italic">
                           "{q.response}"
                         </p>
                         {q.evidenceId && (
                           <button className="mt-3 flex items-center gap-1.5 px-2 py-1 bg-white border border-slate-200 rounded-lg text-[9px] font-bold text-slate-600 hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm">
                              <Upload size={12} />
                              {q.evidenceId}.pdf
                           </button>
                         )}
                      </div>
                   </div>
                </div>

                <div className="flex gap-2 ml-8">
                   <button className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all">Accept</button>
                   <button className="px-2.5 py-1 bg-red-50 text-red-700 text-[8px] font-black uppercase rounded-lg border border-red-100 hover:bg-red-100 transition-all">Flag</button>
                   <button className="p-1 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg"><MessageSquare size={14} /></button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-100 text-right flex justify-between items-center">
             <div className="flex items-center gap-1.5 text-[9px] text-slate-400 italic font-medium uppercase">
                <ShieldCheck size={12} className="text-emerald-500" />
                Evidence hashed & verified.
             </div>
             <button className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg active:scale-95">
                Finalize Section
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
