import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, ChevronRight, MoreVertical, 
  MapPin, Globe, Award, ShieldCheck, Mail, Phone, ExternalLink,
  UserPlus, FileInput, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vendor } from '../types.ts';
import { Vendor360View } from './Vendor360View.tsx';
import { AddVendorModal } from './AddVendorModal.tsx';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase.ts';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { MOCK_VENDORS } from '../services/mockData.ts';
import { cn } from '../lib/utils.ts';

export const VendorMasterView = () => {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let unsubscribeSnap: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnap) unsubscribeSnap();
      
      if (!user) {
        setVendors(MOCK_VENDORS);
        setLoading(false);
        return;
      }

      const path = 'vendors';
      const q = query(collection(db, path), orderBy('name'));
      unsubscribeSnap = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vendor));
          setVendors(data);
        } else {
          setVendors(MOCK_VENDORS);
        }
        setLoading(false);
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, path);
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeSnap) unsubscribeSnap();
    };
  }, []);

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedVendor) {
    return <Vendor360View vendor={selectedVendor} onBack={() => setSelectedVendor(null)} />;
  }

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-between items-end">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl shadow-sm border border-blue-200">
               <Users size={22} />
            </div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Vendor Ecosystem</h2>
          </div>
          <p className="text-slate-500 font-medium italic">Master repository of verified organizational partners.</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm uppercase">
            <Download size={16} /> Bulk Export
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
          >
             <UserPlus size={16} /> Invite Partner
          </button>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex gap-4 items-center">
         <div className="flex-1 relative group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
               type="text" 
               placeholder="Search by Vendor Name, Category, or ID..."
               className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-14 pr-4 text-sm font-medium focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all shadow-sm"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <button className="p-4 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 transition-all">
            <Filter size={20} />
         </button>
      </div>

      {/* Grid of Vendors */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
           <div className="col-span-full py-20 text-center flex flex-col items-center gap-4 text-slate-400 italic">
              <Globe className="animate-spin-slow opacity-20" size={64} />
              <p className="font-black uppercase tracking-widest text-[10px]">Syncing Global Inventory...</p>
           </div>
        ) : filteredVendors.map((vendor) => (
          <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            key={vendor.id} 
            className="bg-white border border-slate-200 rounded-[2.5rem] p-8 hover:shadow-2xl hover:border-blue-400 transition-all group relative overflow-hidden cursor-default text-left"
          >
            <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="text-slate-300 hover:text-slate-900 transition-colors"><MoreVertical size={22} /></button>
            </div>
            
            <div className="flex gap-6 mb-8">
               <div className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center justify-center font-black text-3xl text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                 {vendor.name.substring(0, 2).toUpperCase()}
               </div>
               <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-2">
                     <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight">{vendor.name}</h3>
                     {vendor.status === 'Active' && <Award size={18} className="text-amber-500 shadow-sm" />}
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{vendor.category}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8 text-left">
               <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Risk Profile</div>
                  <div className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5", 
                    vendor.risk === 'Low' ? 'text-emerald-500' : 'text-amber-500'
                  )}>
                    <div className={cn("w-1.5 h-1.5 rounded-full shadow-sm", vendor.risk === 'Low' ? "bg-emerald-500 shadow-emerald-200" : "bg-amber-500 shadow-amber-200")} />
                    {vendor.risk} Rating
                  </div>
               </div>
               <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 opacity-60">Ops Status</div>
                  <div className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-200" />
                    {vendor.status}
                  </div>
               </div>
            </div>

            <div className="space-y-3 mb-10 text-left">
               <div className="flex items-center gap-3 text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                  <Mail size={16} className="text-slate-300 group-hover:text-blue-400" />
                  <span className="truncate">{vendor.contactEmail || `ops@${vendor.name.toLowerCase().replace(/\s/g, '')}.com`}</span>
               </div>
               <div className="flex items-center gap-3 text-xs font-bold text-slate-500 group-hover:text-slate-900 transition-colors">
                  <Globe size={16} className="text-slate-300 group-hover:text-blue-400" />
                  <span className="truncate">nexus.connect/{vendor.name.toLowerCase().replace(/\s/g, '')}</span>
               </div>
            </div>

            <div className="flex gap-3">
               <button 
                  onClick={() => setSelectedVendor(vendor)}
                  className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 transform group-active:scale-95 uppercase"
               >
                  Nexus 360 View
               </button>
               <button className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 uppercase">
                  <ExternalLink size={16} className="mx-auto" />
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      <AddVendorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
};
