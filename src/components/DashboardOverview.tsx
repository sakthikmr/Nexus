import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  Users, Briefcase, ShieldCheck, FileText, TrendingUp, AlertCircle 
} from 'lucide-react';

const COLORS = ['#2563eb', '#10b981', '#7c3aed', '#f59e0b', '#ef4444'];

const data = [
  { name: 'Jan', profiles: 40, hires: 24, interviews: 65 },
  { name: 'Feb', profiles: 30, hires: 13, interviews: 48 },
  { name: 'Mar', profiles: 20, hires: 38, interviews: 52 },
  { name: 'Apr', profiles: 27, hires: 39, interviews: 70 },
];

const vendorDist = [
  { name: 'IT Staffing', value: 45 },
  { name: 'Facilities', value: 25 },
  { name: 'Project Services', value: 20 },
  { name: 'Logistics', value: 10 },
];

export const DashboardOverview = () => {
  return (
    <div className="space-y-8 max-w-[1600px]">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Nexus Intelligence</h2>
          <p className="text-slate-500 mt-1">Cross-platform operational analytics and executive KPIs.</p>
        </div>
        <div className="flex gap-4">
          <select className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 outline-none">
            <option>Last 30 Days</option>
            <option>Last Quarter</option>
            <option>MTD</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
            <TrendingUp size={16} />
            Export Insights
          </button>
        </div>
      </div>

      {/* Primary Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px]">
          <h3 className="font-bold text-slate-800 mb-6 px-2">Recruitment Pipeline Health</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc' }}
              />
              <Bar dataKey="profiles" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={30} />
              <Bar dataKey="interviews" fill="#7c3aed" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-[400px]">
          <h3 className="font-bold text-slate-800 mb-6 px-2">Vendor Service Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={vendorDist}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {vendorDist.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Compliance & Risk Heatmap Placeholder */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <ShieldCheck className="text-purple-600" size={24} />
          <h3 className="font-bold text-slate-800 text-lg">Compliance Risk Monitor</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Data Privacy (GDPR)', value: '100%', status: 'Compliant' },
            { label: 'ISO 27001', value: '88%', status: 'In Review' },
            { label: 'SOC2 Type II', value: '100%', status: 'Compliant' },
            { label: 'Labor Compliance', value: '92%', status: 'Action Req' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{item.label}</div>
              <div className="text-2xl font-bold text-slate-900">{item.value}</div>
              <div className={`text-xs font-bold ${item.status === 'Compliant' ? 'text-emerald-600' : 'text-amber-500'}`}>
                {item.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
