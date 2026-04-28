import React, { useState, useEffect } from 'react';
import { 
  FileText, TrendingUp, AlertCircle, CheckCircle2, 
  DollarSign, Download, Filter, Search, Calendar,
  ArrowUpRight, Clock, ShieldAlert
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils.ts';

interface Invoice {
  id: string;
  vendor: string;
  amount: number;
  currency: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Paid' | 'Disputed';
  date: string;
  dueDate: string;
}

export const CommercialCenterView = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([
    { id: 'INV-2024-001', vendor: 'Global Talent Solutions', amount: 45000, currency: 'USD', status: 'Pending Approval', date: '2024-04-15', dueDate: '2024-05-15' },
    { id: 'INV-2024-002', vendor: 'TechBridge Systems', amount: 12500, currency: 'USD', status: 'Paid', date: '2024-04-10', dueDate: '2024-05-10' },
    { id: 'INV-2024-003', vendor: 'Nexus HR Partners', amount: 8200, currency: 'USD', status: 'Approved', date: '2024-04-20', dueDate: '2024-05-20' },
    { id: 'INV-2024-004', vendor: 'Facility Plus', amount: 3100, currency: 'USD', status: 'Disputed', date: '2024-04-22', dueDate: '2024-05-22' },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700';
      case 'Pending Approval': return 'bg-amber-100 text-amber-700';
      case 'Approved': return 'bg-blue-100 text-blue-700';
      case 'Disputed': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Commercial Center</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Integrated financial operations and AP/AR management.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 text-sm hover:bg-slate-50 shadow-sm flex items-center gap-2">
            <Download size={16} />
            Export Aging Report
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 shadow-lg shadow-blue-500/20">
            Process Payment Batch
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Accounts Payable</p>
          <div className="text-3xl font-black text-slate-900 mb-1">$3,420,100</div>
          <div className="flex items-center gap-2 text-xs text-emerald-600 font-bold">
            <ArrowUpRight size={14} />
            +8.2% from last month
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Pending Approvals</p>
          <div className="text-3xl font-black text-slate-900 mb-1">14</div>
          <div className="flex items-center gap-2 text-xs text-amber-600 font-bold">
            <Clock size={14} />
            Avg. time: 4.2 days
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-50 rounded-full opacity-50 group-hover:scale-110 transition-transform" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Overdue Invoices</p>
          <div className="text-3xl font-black text-slate-900 mb-1">3</div>
          <div className="flex items-center gap-2 text-xs text-red-600 font-bold">
            <ShieldAlert size={14} />
            Immediate action required
          </div>
        </div>
      </div>

      {/* Invoice Ledger */}
      <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <h3 className="font-bold text-slate-800">Financial Ledger</h3>
            <div className="flex bg-white border border-slate-200 rounded-lg p-0.5">
               <button className="px-3 py-1 text-xs font-bold text-blue-600 bg-blue-50 rounded-md">All</button>
               <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">Pending</button>
               <button className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-slate-700">Disputed</button>
            </div>
          </div>
          <div className="flex gap-2">
             <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="Search INV#" className="pl-9 pr-4 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-300" />
             </div>
             <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg"><Filter size={18} /></button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-4">Invoice ID</th>
                <th className="px-8 py-4">Vendor Partner</th>
                <th className="px-8 py-4">Issue Date</th>
                <th className="px-8 py-4">Due Date</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="font-bold text-slate-900">{inv.id}</div>
                    <div className="text-[10px] text-slate-400 font-medium">Auto-matched to SOW-442</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                       {inv.vendor}
                       <Download size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-blue-500" />
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">{inv.date}</td>
                  <td className="px-8 py-5 text-sm text-slate-500 font-medium">{inv.dueDate}</td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-black text-slate-900">${inv.amount.toLocaleString()}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">{inv.currency}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter", getStatusColor(inv.status))}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-center">
                    {inv.status === 'Pending Approval' ? (
                      <button className="text-xs font-black text-blue-600 hover:text-blue-800 underline decoration-blue-200 underline-offset-4">Approve Now</button>
                    ) : (
                      <button className="p-2 text-slate-300 hover:text-slate-600"><FileText size={16} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
