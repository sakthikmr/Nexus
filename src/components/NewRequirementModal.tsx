import React, { useState } from 'react';
import { X, ShoppingBag, FileText, DollarSign, Calendar, Target, Briefcase, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface NewRequirementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewRequirementModal = ({ isOpen, onClose }: NewRequirementModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'RFQ_RFP',
    department: 'Technology',
    budget: '',
    deadline: '',
    description: '',
    priority: 'Normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const path = 'procurement';
      await addDoc(collection(db, path), {
        ...formData,
        status: 'Bidding Open',
        bidCount: 0,
        createdAt: serverTimestamp()
      });
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'procurement');
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
                  <div className="p-3 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200">
                     <ShoppingBag size={24} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Initiate Requirement</h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest uppercase">Nexus Procurement Control</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <X size={24} className="text-slate-400" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Requirement Title</label>
                  <div className="relative">
                     <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <input 
                        required
                        type="text" 
                        placeholder="e.g. Enterprise Cloud Firewall (Q3 Rollout)"
                        className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                     />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8 text-left">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mandate Type</label>
                     <select 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium appearance-none"
                        value={formData.type}
                        onChange={e => setFormData({...formData, type: e.target.value as any})}
                     >
                        <option value="RFQ_RFP">RFP / RFQ (Tender)</option>
                        <option value="PROJECT_SOW">Project / SOW</option>
                        <option value="ASSET_PROCUREMENT">Asset Procurement</option>
                        <option value="SERVICE_CONTRACT">Service Contract</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Budget Allocation</label>
                     <div className="relative text-left">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. $250,000"
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
                           value={formData.budget}
                           onChange={e => setFormData({...formData, budget: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8 text-left">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                     <select 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium appearance-none"
                        value={formData.department}
                        onChange={e => setFormData({...formData, department: e.target.value})}
                     >
                        <option>Technology</option>
                        <option>Operations</option>
                        <option>Marketing</option>
                        <option>Facility Mgmt</option>
                        <option>Human Capital</option>
                     </select>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bid Closing Date</label>
                     <div className="relative text-left">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           required
                           type="date" 
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-medium"
                           value={formData.deadline}
                           onChange={e => setFormData({...formData, deadline: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Criticality</label>
                  <div className="flex gap-4 p-2 bg-slate-50 border border-slate-100 rounded-[1.5rem]">
                     {['Normal', 'Urgent', 'Critical'].map(p => (
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

               <div className="flex gap-4 pt-4 text-left">
                  <button 
                     type="button" 
                     onClick={onClose}
                     className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all font-mono"
                  >
                     Abort Call
                  </button>
                  <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2"
                  >
                     {isSubmitting ? (
                        <>
                           <Target size={18} className="animate-spin" />
                           Encrypting Mandate...
                        </>
                     ) : (
                        <>
                           <Plus size={18} />
                           Release to Market
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
