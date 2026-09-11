import React from 'react';
import { 
  Sprout, 
  ShieldCheck, 
  Bot, 
  User, 
  ShoppingBag, 
  Briefcase, 
  LayoutDashboard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function Navbar({ 
  currentRole, 
  setRole, 
  user, 
  onOpenAuth, 
  onToggleAssistant, 
  isAssistantOpen 
}) {
  const roles = [
    { id: 'farmer', label: 'Farmer (किसान)', icon: Sprout, color: 'text-emerald-600' },
    { id: 'buyer', label: 'Buyer (व्यापारी)', icon: ShoppingBag, color: 'text-blue-600' },
    { id: 'worker', label: 'Laborer (श्रमिक)', icon: Briefcase, color: 'text-amber-600' },
    { id: 'admin', label: 'Admin (प्रशासक)', icon: LayoutDashboard, color: 'text-purple-600' }
  ];

  const isVerified = user?.aadhaarSimVerified || user?.digilockerVerified;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo and Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Sprout className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-800 via-green-700 to-emerald-600 bg-clip-text text-transparent">
                  AgriIntel
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  GovTech AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Digital Platform for Farmer Empowerment</p>
            </div>
          </div>

          {/* Quick Role Switcher (Pill Selector) */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {roles.map((r) => {
              const Icon = r.icon;
              const active = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    active 
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/80' 
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${active ? r.color : 'text-slate-400'}`} />
                  {r.label}
                </button>
              );
            })}
          </div>

          {/* Identity Verification Badge & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Identity Status Pill */}
            <button
              onClick={onOpenAuth}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isVerified
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100'
                  : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
              }`}
              title="Click to manage Aadhaar eKYC and DigiLocker"
            >
              {isVerified ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="hidden sm:inline">Verified:</span>
                  <span className="font-semibold">
                    {user?.digilockerVerified ? 'DigiLocker' : 'Aadhaar eKYC'}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600" />
                  <span className="font-semibold">Verify eKYC</span>
                </>
              )}
            </button>

            {/* AI Farmer Assistant Button */}
            <button
              onClick={onToggleAssistant}
              className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all ${
                isAssistantOpen
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-500 ring-offset-1'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:brightness-105'
              }`}
            >
              <Bot className="h-4 w-4" />
              <span className="hidden sm:inline">Kisan AI Assistant</span>
              <span className="sm:hidden">AI</span>
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-200"></span>
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher (Scrollable bar) */}
        <div className="flex md:hidden items-center gap-1 py-2 overflow-x-auto border-t border-slate-100">
          {roles.map((r) => {
            const Icon = r.icon;
            const active = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`flex items-center gap-1 whitespace-nowrap px-2.5 py-1 rounded-md text-[11px] font-semibold ${
                  active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                <Icon className="h-3 w-3" />
                {r.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
