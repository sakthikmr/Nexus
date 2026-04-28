import React, { useState, useEffect } from 'react';
import { 
  Users, Search, Filter, Plus, ChevronRight, MoreVertical, 
  MapPin, Globe, Award, ShieldCheck, Mail, Phone, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Vendor } from '../types.ts';
import { Vendor360View } from './Vendor360View.tsx';

export const VendorMasterView = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    fetch('/api/vendors')
      .then(res => res.json())
      .then(data => {
        setVendors(data);
        setLoading(false);
      });
  }, []);

  if (selectedVendor) {
    return <Vendor360View vendor={selectedVendor} onBack={() => setSelectedVendor(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 text-shadow-sm">Vendor Ecosystem</h2>
          <p className="text-slate-500 mt-1">Master repository of verified organizational partners.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all text-sm shadow-sm">
            Bulk Import CSV
          </button>
          <button className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-sm">
             Invite Service Provider
          </button>
        </div>
      </div>

      {/* Grid of Vendors */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
           <div className="col-span-full py-20 text-center text-slate-400">Inventory fetching...</div>
        ) : vendors.map((vendor) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            key={vendor.id} 
            className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl hover:border-blue-200 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
            </div>
            
            <div className="flex gap-4 mb-6">
               <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center font-black text-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                 {vendor.name.substring(0, 2).toUpperCase()}
               </div>
               <div className="flex-1">
                 <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[150px]">{vendor.name}</h3>
                    {vendor.status === 'Active' && <Award size={16} className="text-amber-500" />}
                 </div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{vendor.category}</span>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
               <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Risk Rating</div>
                  <div className={`text-xs font-black uppercase ${vendor.risk === 'Low' ? 'text-emerald-600' : 'text-amber-600'}`}>{vendor.risk}</div>
               </div>
               <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-tighter mb-1">Status</div>
                  <div className="text-xs font-black text-slate-800 uppercase">{vendor.status}</div>
               </div>
            </div>

            <div className="space-y-2.5 mb-6">
               <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-800">
                  <Mail size={14} className="text-slate-300" />
                  <span>support@{vendor.name.toLowerCase().replace(/\s/g, '')}.com</span>
               </div>
               <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-slate-800">
                  <Globe size={14} className="text-slate-300" />
                  <span className="truncate">www.{vendor.name.toLowerCase().replace(/\s/g, '')}.com</span>
               </div>
            </div>

            <button 
               onClick={() => setSelectedVendor(vendor)}
               className="w-full py-2.5 bg-slate-50 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm"
            >
               View Full Profile
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
