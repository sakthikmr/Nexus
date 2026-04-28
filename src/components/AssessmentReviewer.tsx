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
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/40 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 min-h-[600px]">
        {/* Navigation Sidebar */}
        <div className="bg-slate-50 p-6 border-r border-slate-200">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Assessment Sections</p>
           <nav className="space-y-2">
             {[
               { id: 'SECURITY', label: 'Info Security', score: 92, icon: ShieldCheck },
               { id: 'ESG', label: 'ESG & Sustain', score: 45, icon: ShieldAlert },
               { id: 'FINANCIAL', label: 'Financial Due Diligence', score: 0, icon: FileText }
             ].map(sec => (
               <button
                 key={sec.id}
                 onClick={() => setActiveCategory(sec.id as any)}
                 className={cn(
                   "w-full flex items-center justify-between p-3 rounded-xl transition-all group",
                   activeCategory === sec.id ? "bg-white shadow-md shadow-slate-200 border border-slate-200 text-blue-600" : "text-slate-500 hover:bg-slate-100"
                 )}
               >
                 <div className="flex items-center gap-3">
                   <sec.icon size={18} className={cn(activeCategory === sec.id ? "text-blue-600" : "text-slate-400")} />
                   <span className="text-xs font-bold whitespace-nowrap">{sec.label}</span>
                 </div>
                 <div className={cn("text-[9px] font-black px-1.5 py-0.5 rounded", sec.score > 80 ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-400")}>
                    {sec.score === 0 ? 'PENDING' : `${sec.score}%`}
                 </div>
               </button>
             ))}
           </nav>
        </div>

        {/* Content Area */}
        <div className="md:col-span-3 flex flex-col">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold text-slate-900">{activeCategory.replace('_', ' ')} Review</h3>
              <p className="text-xs text-slate-500 font-medium">Evaluation of vendor response for Global Talent Solutions.</p>
            </div>
            <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
               <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
               Drafting Review
            </button>
          </div>

          <div className="flex-1 p-8 space-y-8 overflow-y-auto max-h-[600px]">
            {questions.filter(q => q.category === activeCategory).map((q, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                key={q.id} 
                className="space-y-4"
              >
                <div className="flex items-start gap-4">
                   <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0 mt-1">
                      {idx + 1}
                   </div>
                   <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800 leading-relaxed mb-4">{q.text}</p>
                      
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 transition-all border-l-4 border-l-blue-500">
                         <div className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                            <Info size={10} /> Vendor Response
                         </div>
                         <p className="text-xs font-medium text-slate-700 leading-relaxed">
                           {q.response}
                         </p>
                         {q.evidenceId && (
                           <button className="mt-4 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:bg-white hover:border-blue-300 hover:text-blue-600 transition-all">
                              <Upload size={12} />
                              Open Evidence: {q.evidenceId}.pdf
                           </button>
                         )}
                      </div>
                   </div>
                </div>

                <div className="flex gap-2 ml-10">
                   <button className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase rounded-lg border border-emerald-100 hover:bg-emerald-100 transition-all">Accept</button>
                   <button className="px-3 py-1.5 bg-red-50 text-red-700 text-[10px] font-black uppercase rounded-lg border border-red-100 hover:bg-red-100 transition-all">Needs Rework</button>
                   <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg"><MessageSquare size={16} /></button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 bg-slate-50 border-t border-slate-100 text-right flex justify-between items-center">
             <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <ShieldCheck size={14} className="text-emerald-500" />
                Evidence is hashed and verified on upload.
             </div>
             <button className="bg-slate-900 text-white px-6 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
                Finalize Section Review
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};
