/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  FileText, 
  Settings, 
  Bell, 
  Search,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Menu,
  Terminal,
  ShieldAlert,
  UserCheck,
  UserPlus,
  ShoppingBag,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleType } from './types.ts';
import { cn } from './lib/utils.ts';

// View Components
import { DashboardOverview } from './components/DashboardOverview.tsx';
import { VendorMasterView } from './components/VendorMasterView.tsx';
import { RecruitmentView } from './components/RecruitmentView.tsx';
import { ComplianceView } from './components/ComplianceView.tsx';
import { FinanceView } from './components/FinanceView.tsx';
import { AssessmentReviewer } from './components/AssessmentReviewer.tsx';
import { GovernanceView } from './components/GovernanceView.tsx';
import { OnboardingView } from './components/OnboardingView.tsx';
import { StaffAugView } from './components/StaffAugView.tsx';
import { ProcurementView } from './components/ProcurementView.tsx';
import { TicketingView } from './components/TicketingView.tsx';
import { VendorPortalView } from './components/VendorPortalView.tsx';

import { db, auth, signInWithGoogle } from './lib/firebase.ts';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';

const PERSONAS = [
  { id: 'SUPER_ADMIN', name: 'Super Admin', role: 'Global Infrastructure', color: 'bg-blue-600' },
  { id: 'RECRUITER', name: 'Sarah Miller', role: 'Staffing Specialist', color: 'bg-emerald-600' },
  { id: 'FINANCE', name: 'Marcus Chen', role: 'Finance Approver', color: 'bg-amber-600' },
  { id: 'COMPLIANCE', name: 'David Voss', role: 'Risk Reviewer', color: 'bg-purple-600' },
  { id: 'VENDOR_ADMIN', name: 'John Global', role: 'Vendor Partner', color: 'bg-indigo-600' }
];

const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  disabled,
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  disabled?: boolean,
  onClick: () => void 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
      active 
        ? "bg-blue-600 text-white shadow-xl shadow-blue-200" 
        : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-900",
      disabled && "opacity-40 cursor-not-allowed grayscale"
    )}
  >
    <Icon size={20} className={cn("transition-transform group-hover:scale-110", active ? "text-white" : "text-slate-400")} />
    <span className="font-bold text-sm tracking-tight">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-nav-indicator" 
        className="absolute -right-4 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-l-full"
      />
    )}
  </button>
);

export default function App() {
  const [activeModule, setActiveModule] = useState<ModuleType>('DASHBOARD');
  const [activePersona, setActivePersona] = useState(PERSONAS[0]);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [isPortalMode, setIsPortalMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email?.endsWith('@coherent.in')) {
        // Automatically sync persona if it's an admin email
        setActivePersona(PERSONAS[0]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Permission Logic
  const canAccess = (module: ModuleType) => {
    if (activePersona.id === 'SUPER_ADMIN') return true;
    if (activePersona.id === 'RECRUITER') return ['DASHBOARD', 'RECRUITMENT', 'ONBOARDING', 'STAFF_AUG', 'TICKETING'].includes(module);
    if (activePersona.id === 'FINANCE') return ['DASHBOARD', 'FINANCE', 'VENDOR_MASTER', 'ONBOARDING', 'STAFF_AUG', 'PROCUREMENT', 'TICKETING'].includes(module);
    if (activePersona.id === 'COMPLIANCE') return ['DASHBOARD', 'COMPLIANCE', 'ONBOARDING', 'STAFF_AUG', 'PROCUREMENT', 'TICKETING'].includes(module);
    return false;
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden w-full relative">
       <AnimatePresence>
         {isPortalMode && (
             <motion.div
               initial={{ opacity: 0, y: 100 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 100 }}
               className="fixed inset-0 z-[100]"
             >
                <div className="fixed top-20 right-10 z-[110]">
                   <button 
                     onClick={() => setIsPortalMode(false)}
                     className="bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-xs shadow-2xl hover:scale-105 transition-all"
                   >
                     Exit Vendor View
                   </button>
                </div>
                <VendorPortalView />
             </motion.div>
           )}
         </AnimatePresence>

      {/* Sidebar */}
      <aside className={cn(
        "w-72 bg-white border-r border-slate-200/60 flex flex-col p-6 z-20 shrink-0 transition-opacity duration-300", 
        isPortalMode ? "opacity-0 pointer-events-none" : "opacity-100"
      )}>
        <div className="flex items-center gap-3 px-2 mb-12">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
            <Terminal className="text-white" size={22} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-800 leading-none">NEXUS</h1>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Coherent VMP</span>
          </div>
        </div>

        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Core Platform</div>
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
          <SidebarItem 
            icon={LayoutDashboard} 
            label="Nexus Dashboard" 
            active={activeModule === 'DASHBOARD'} 
            onClick={() => setActiveModule('DASHBOARD')}
          />
          
          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Vendors & Compliance</div>
          <SidebarItem 
            icon={Users} 
            label="Vendor Master" 
            active={activeModule === 'VENDOR_MASTER'} 
            disabled={!canAccess('VENDOR_MASTER')}
            onClick={() => setActiveModule('VENDOR_MASTER')}
          />
          <SidebarItem 
            icon={UserPlus} 
            label="Onboarding Pipeline" 
            active={activeModule === 'ONBOARDING'} 
            disabled={!canAccess('ONBOARDING')}
            onClick={() => setActiveModule('ONBOARDING')}
          />
          <SidebarItem 
            icon={ShieldCheck} 
            label="Compliance & Risk" 
            active={activeModule === 'COMPLIANCE'} 
            disabled={!canAccess('COMPLIANCE')}
            onClick={() => setActiveModule('COMPLIANCE')}
          />

          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Talent & Recruitment</div>
          <SidebarItem 
            icon={Briefcase} 
            label="Positions & Boards" 
            active={activeModule === 'RECRUITMENT'} 
            disabled={!canAccess('RECRUITMENT')}
            onClick={() => setActiveModule('RECRUITMENT')}
          />
          <SidebarItem 
            icon={UserCheck} 
            label="Resource Bench" 
            active={activeModule === 'STAFF_AUG'} 
            disabled={!canAccess('STAFF_AUG')}
            onClick={() => setActiveModule('STAFF_AUG')}
          />

          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Finance & Sourcing</div>
          <SidebarItem 
            icon={ShoppingBag} 
            label="Procurement Feed" 
            active={activeModule === 'PROCUREMENT'} 
            disabled={!canAccess('PROCUREMENT')}
            onClick={() => setActiveModule('PROCUREMENT')}
          />
          <SidebarItem 
            icon={FileText} 
            label="Commercial Center" 
            active={activeModule === 'FINANCE'} 
            disabled={!canAccess('FINANCE')}
            onClick={() => setActiveModule('FINANCE')}
          />

          <div className="pt-4 pb-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">Support & Ops</div>
          <SidebarItem 
            icon={MessageSquare} 
            label="Nexus Helpdesk" 
            active={activeModule === 'TICKETING'} 
            disabled={!canAccess('TICKETING')}
            onClick={() => setActiveModule('TICKETING')}
          />
        </nav>

        <div className="mt-8 border-t border-slate-100 pt-6 space-y-1">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">System</div>
          <SidebarItem icon={HelpCircle} label="Help & SLA" active={false} onClick={() => {}} />
          {activePersona.id === 'SUPER_ADMIN' && <SidebarItem icon={Settings} label="Governance" active={activeModule === 'GOVERNANCE'} onClick={() => setActiveModule('GOVERNANCE')} />}
          
          {user ? (
            <SidebarItem 
              icon={LogOut} 
              label="Sign Out" 
              active={false} 
              onClick={handleLogout} 
            />
          ) : (
            <SidebarItem 
              icon={ShieldAlert} 
              label="Login to Sync" 
              active={false} 
              onClick={handleLogin} 
            />
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-10 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-6 flex-1 max-w-2xl">
            <div className="relative w-full group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Global search across Nexus..."
                className="w-full pl-12 pr-4 py-3 bg-slate-100/50 border border-transparent rounded-2xl focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-500/5 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {!user && (
              <button 
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Sign In
              </button>
            )}
            <div className="flex items-center gap-2">
               <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative group">
                <Bell size={20} />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-red-500/20 ring-offset-0 animate-pulse"></span>
              </button>
            </div>
            
            <div className="w-px h-8 bg-slate-200 mx-2" />

            {/* Persona Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowPersonaMenu(!showPersonaMenu)}
                className="flex items-center gap-3 p-1.5 pr-4 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 transition-all group ring-offset-2 ring-blue-500/20 focus:ring-2"
              >
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center font-black text-white shadow-lg", activePersona.color)}>
                  {activePersona.name.substring(0, 1)}
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-slate-900 leading-tight">{activePersona.name}</div>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{activePersona.role}</div>
                </div>
                <Users size={14} className="ml-2 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </button>

              <AnimatePresence>
                {showPersonaMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 ring-1 ring-black/5"
                  >
                    <div className="p-2 mb-2 border-b border-slate-100">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulate Nexus Persona</p>
                    </div>
                    {PERSONAS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setActivePersona(p);
                          setShowPersonaMenu(false);
                          setActiveModule('DASHBOARD');
                          setIsPortalMode(p.id === 'VENDOR_ADMIN');
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                          activePersona.id === p.id ? "bg-slate-50 border border-slate-100" : "hover:bg-slate-50 border border-transparent"
                        )}
                      >
                         <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black", p.color)}>
                           {p.name.substring(0, 1)}
                         </div>
                         <div>
                            <p className="text-sm font-bold text-slate-900">{p.name}</p>
                            <p className="text-[10px] text-slate-500 font-medium">{p.role}</p>
                         </div>
                         {activePersona.id === p.id && <UserCheck size={16} className="ml-auto text-blue-600" />}
                      </button>
                    ))}
                    <div className="mt-2 p-2 bg-slate-50 rounded-xl">
                       <p className="text-[9px] text-slate-400 leading-tight">
                         <ShieldAlert size={10} className="inline mr-1" />
                         Nexus uses RBAC with Maker-Checker patterns. Some actions require secondary approval.
                       </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dynamic Route Content */}
        <div className="flex-1 overflow-y-auto px-10 py-10 scroll-smooth">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule + activePersona.id}
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.995 }}
              transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
              className="h-full"
            >
              {activeModule === 'DASHBOARD' && <DashboardOverview />}
              {activeModule === 'VENDOR_MASTER' && <VendorMasterView />}
              {activeModule === 'ONBOARDING' && <OnboardingView />}
              {activeModule === 'STAFF_AUG' && <StaffAugView />}
              {activeModule === 'PROCUREMENT' && <ProcurementView />}
              {activeModule === 'TICKETING' && <TicketingView />}
              {activeModule === 'RECRUITMENT' && <RecruitmentView />}
              {activeModule === 'COMPLIANCE' && (
                <div className="space-y-12">
                   <ComplianceView />
                   <div className="border-t border-slate-200 pt-12">
                      <div className="mb-8 text-center">
                         <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-2">Detailed Case Review</h3>
                         <p className="text-sm text-slate-500 font-medium">Drill down into specific vendor assessment responses and evidence.</p>
                      </div>
                      <AssessmentReviewer />
                   </div>
                </div>
              )}
              {activeModule === 'FINANCE' && <FinanceView />}
              {activeModule === 'GOVERNANCE' && <GovernanceView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Floating Action / Help */}
      <button className="fixed bottom-10 right-10 w-14 h-14 bg-slate-900 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 ring-4 ring-slate-900/10">
         <HelpCircle size={24} />
      </button>
    </div>
  );
}
