import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Globe, MapPin, Building, Award, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils.ts';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface AddVendorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddVendorModal = ({ isOpen, onClose }: AddVendorModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'IT Staffing',
    location: 'Global',
    contactEmail: '',
    risk: 'Low',
    status: 'Onboarding'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const path = 'vendors';
      await addDoc(collection(db, path), {
        ...formData,
        onboardingDate: new Date().toISOString().split('T')[0],
        score: 0,
        createdAt: serverTimestamp()
      });
      onClose();
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'vendors');
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
            className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center px-10 py-8 bg-slate-50 border-b border-slate-100">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                     <UserPlus size={24} />
                  </div>
                  <div>
                     <h2 className="text-2xl font-black text-slate-900 tracking-tight">Onboard New Partner</h2>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nexus Vendor Ecosystem</p>
                  </div>
               </div>
               <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
                  <X size={24} className="text-slate-400" />
               </button>
            </div>

            <form onSubmit={handleSubmit} className="p-10 space-y-8">
               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Name</label>
                     <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           required
                           type="text" 
                           placeholder="e.g. Quantum Talent Group"
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                           value={formData.name}
                           onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Category</label>
                     <select 
                        className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium appearance-none"
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                     >
                        <option>IT Staffing</option>
                        <option>Hardware Procurement</option>
                        <option>Security Consulting</option>
                        <option>Cloud Infrastructure</option>
                        <option>BPO Services</option>
                     </select>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           required
                           type="email" 
                           placeholder="admin@partner.com"
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                           value={formData.contactEmail}
                           onChange={e => setFormData({...formData, contactEmail: e.target.value})}
                        />
                     </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">HQ Location</label>
                     <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input 
                           type="text" 
                           placeholder="Silicon Valley, CA"
                           className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all text-sm font-medium"
                           value={formData.location}
                           onChange={e => setFormData({...formData, location: e.target.value})}
                        />
                     </div>
                  </div>
               </div>

               <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
                  <div className="flex items-center gap-2 mb-2">
                     <ShieldCheck className="text-blue-600" size={18} />
                     <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Initial Compliance Flags</span>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Risk Level Assessment</label>
                        <div className="flex gap-2">
                           {['Low', 'Med', 'High'].map(r => (
                              <button
                                 key={r}
                                 type="button"
                                 onClick={() => setFormData({...formData, risk: r as any})}
                                 className={cn(
                                    "flex-1 py-2 rounded-xl text-[10px] font-black uppercase transition-all border",
                                    formData.risk === r 
                                       ? "bg-slate-900 text-white border-slate-900 shadow-lg" 
                                       : "bg-white text-slate-400 border-slate-200 hover:border-slate-300"
                                 )}
                              >
                                 {r}
                              </button>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Vetting Status</label>
                        <select 
                           className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase outline-none focus:border-blue-400"
                           value={formData.status}
                           onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                           <option>Onboarding</option>
                           <option>Pending Review</option>
                           <option>Active</option>
                        </select>
                     </div>
                  </div>
               </div>

               <div className="flex gap-4 pt-4">
                  <button 
                     type="button" 
                     onClick={onClose}
                     className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                     Cancel
                  </button>
                  <button 
                     type="submit" 
                     disabled={isSubmitting}
                     className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2"
                  >
                     {isSubmitting ? (
                        <>
                           <Globe size={18} className="animate-spin" />
                           Syncing with Nexus Hub...
                        </>
                     ) : (
                        <>
                           <ArrowUpRight size={18} />
                           Initiate Onboarding
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
