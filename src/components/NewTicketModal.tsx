import React, { useState } from 'react';
import { X, MessageSquare, Building, Tag, AlertCircle, Send, Plus, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface NewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewTicketModal = ({ isOpen, onClose }: NewTicketModalProps) => {
  const [formData, setFormData] = useState({
    subject: '',
    vendorName: '',
    category: 'Billing',
    priority: 'Normal',
    description: '',
    department: 'Support'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const path = 'tickets';
      await addDoc(collection(db, path), {
        ...formData,
        status: 'Open',
        slaBreached: false,
        isEscalated: false,
        createdAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp()
      });
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'tickets');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden text-left"
          >
            <div className="flex justify-between items-center px-10 py-8 bg-slate-50 border-b border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                     <MessageSquare size={24} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Open Support Case</h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Nexus Partner Helpdesk</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <X size={24} className="text-slate-400" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Case Subject</label>
                  <div className="relative">
                     <AlertCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <input 
                        required
                        type="text" 
                        placeholder="Brief summary of the issue..."
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8 text-left">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Vendor</label>
                     <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           required
                           type="text" 
                           placeholder="Vendor Name"
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                           value={formData.vendorName}
                           onChange={e => setFormData({...formData, vendorName: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
                     <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <select 
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium appearance-none"
                           value={formData.category}
                           onChange={e => setFormData({...formData, category: e.target.value})}
                        >
                           <option>Billing & Payments</option>
                           <option>Compliance Docs</option>
                           <option>Candidate Onboarding</option>
                           <option>Technical Issue</option>
                           <option>General Inquiry</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Priority Matrix</label>
                  <div className="flex gap-4 p-2 bg-slate-50 border border-slate-100 rounded-[1.5rem]">
                     {['Normal', 'High', 'Critical'].map(p => (
                        <button
                           key={p}
                           type="button"
                           onClick={() => setFormData({...formData, priority: p as any})}
                           className={cn(
                              "flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all",
                              formData.priority === p 
                                 ? "bg-slate-900 text-white shadow-xl" 
                                 : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
                           )}
                        >
                           {p}
                        </button>
                     ))}
                  </div>
               </div>

               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Narrative</label>
                  <textarea 
                     required
                     rows={3}
                     placeholder="Detailed description of the requirement or incident..."
                     className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium resize-none"
                     value={formData.description}
                     onChange={e => setFormData({...formData, description: e.target.value})}
                  />
               </div>

               <div className="flex gap-4 pt-4 text-left">
                  <button 
                     type="button" 
                     onClick={onClose}
                     className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-mono"
                  >
                     Discard
                  </button>
                  <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                     {isSubmitting ? (
                        <>
                           <ShieldAlert size={18} className="animate-pulse" />
                           Dispatching to Support...
                        </>
                     ) : (
                        <>
                           <Plus size={18} />
                           Release Support Case
                        </>
                     )}
                  </button>
               </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
