import React, { useState } from 'react';
import { X, Receipt, Building, DollarSign, Calendar, FileText, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewInvoiceModal = ({ isOpen, onClose }: NewInvoiceModalProps) => {
  const [formData, setFormData] = useState({
    vendorName: '',
    invoiceNumber: '',
    amount: '',
    currency: 'USD',
    dueDate: '',
    description: '',
    category: 'IT Services'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const path = 'invoices';
      await addDoc(collection(db, path), {
        ...formData,
        amount: parseFloat(formData.amount.replace(/[^0-9.]/g, '')),
        status: 'Under Review',
        submissionDate: new Date().toISOString().split('T')[0],
        createdAt: serverTimestamp()
      });
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'invoices');
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
                  <div className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-200">
                     <Receipt size={24} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Register Fiscal Claim</h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">Nexus Financial Ledger</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <X size={24} className="text-slate-400" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-8 text-left">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Vendor Partner</label>
                     <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. Global Talent Solutions"
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium"
                           value={formData.vendorName}
                           onChange={e => setFormData({...formData, vendorName: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Invoice Reference #</label>
                     <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           required
                           type="text" 
                           placeholder="INV-2024-XXX"
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium"
                           value={formData.invoiceNumber}
                           onChange={e => setFormData({...formData, invoiceNumber: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8 text-left">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Total Claim Amount</label>
                     <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           required
                           type="text" 
                           placeholder="0.00"
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium"
                           value={formData.amount}
                           onChange={e => setFormData({...formData, amount: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fiscal Due Date</label>
                     <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           required
                           type="date" 
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium"
                           value={formData.dueDate}
                           onChange={e => setFormData({...formData, dueDate: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               <div className="space-y-2 text-left">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Service Particulars</label>
                  <textarea 
                     rows={3}
                     placeholder="Itemized service description for audit review..."
                     className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-emerald-400 focus:ring-4 focus:ring-emerald-50 outline-none transition-all text-sm font-medium resize-none"
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
                     Discard Entry
                  </button>
                  <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="flex-[2] py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                     {isSubmitting ? (
                        <>
                           <CheckCircle2 size={18} className="animate-pulse" />
                           Verifying Ledger Integrity...
                        </>
                     ) : (
                        <>
                           <Send size={18} />
                           Submit for Approval
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
