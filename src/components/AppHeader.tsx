import { GraduationCap, Phone, ShieldCheck, User, Users, BookOpen, Menu, LogOut } from "lucide-react";
import { ACADEMY_INFO } from "../data";
import logoImage from "../assets/images/academy_logo_1782839442092.jpg";
import { useLanguage } from "../context/LanguageContext";

interface AppHeaderProps {
  currentRole: string;
  onChangeRole: (role: string) => void;
  onMenuClick?: () => void;
  currentUser?: any;
  onLogout?: () => void;
}

export default function AppHeader({ currentRole, onChangeRole, onMenuClick, currentUser, onLogout }: AppHeaderProps) {
  const { t } = useLanguage();
  
  const roles = [
    { id: "admin", label: t("role.admin"), icon: ShieldCheck, color: "bg-red-500 text-white" },
    { id: "teacher", label: t("role.teacher"), icon: BookOpen, color: "bg-emerald-500 text-white" },
    { id: "student", label: t("role.student"), icon: GraduationCap, color: "bg-blue-500 text-white" },
    { id: "parent", label: t("role.parent"), icon: Users, color: "bg-amber-500 text-white" }
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40" id="header-root">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-red-700 via-amber-600 to-red-700 text-white text-xs py-1 px-4 text-center font-medium flex justify-between items-center max-w-7xl mx-auto md:px-6">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Sinchan Nagar, Parbhani, Maharashtra — Admissions Open (2026)
        </span>
        <span className="flex items-center gap-1.5">
          <Phone className="w-3.5 h-3.5" />
          संपर्क: <a href="tel:9511668617" className="hover:underline font-bold">9511668617</a>
        </span>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand/Identity */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            {/* 3-Lines hamburger menu */}
            <button
              onClick={onMenuClick}
              className="p-2.5 text-slate-400 hover:text-white bg-slate-950 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-center cursor-pointer shrink-0 shadow-lg active:scale-95"
              id="hamburger-menu-btn"
              title="Menu Options"
            >
              <Menu className="w-5 h-5" />
            </button>
            
            <div className="relative group shrink-0">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500 to-red-600 rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-slate-950 rounded-2xl p-1 border border-slate-800 shadow-xl overflow-hidden flex items-center justify-center">
                <img 
                  src={logoImage} 
                  alt="Samarth Academy Logo" 
                  className="w-14 h-14 object-cover rounded-xl"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">{t("nav.brand")}</h1>
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">Parbhani</span>
            </div>
            <p className="text-amber-400 text-xs font-semibold tracking-wider font-sans mt-0.5">
              {t("nav.tagline")} • Sinchan Nagar Parbhani
            </p>
          </div>
        </div>

        {/* User Details / Profile & Logout Panel */}
        {currentUser ? (
          <div className="flex items-center gap-3 w-full md:w-auto justify-end bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-xl" id="header-user-panel">
            {/* User Profile Badge */}
            <div className="flex items-center gap-2.5 px-3 py-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-amber-500 flex items-center justify-center text-white text-xs font-black uppercase border border-slate-800 shadow-inner">
                {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : "G"}
              </div>
              <div className="text-left">
                <span className="text-[9px] text-slate-500 font-extrabold uppercase tracking-widest block leading-none">
                  {currentUser.role}
                </span>
                <strong className="text-xs text-white font-bold block mt-0.5 max-w-[160px] truncate">
                  {currentUser.name}
                </strong>
              </div>
            </div>

            {/* Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2 text-slate-400 hover:text-red-400 bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/20 rounded-xl transition-all flex items-center justify-center cursor-pointer active:scale-95 text-xs font-bold gap-1.5"
                title="Log Out"
                id="btn-header-logout"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">बाहेर पडा (Logout)</span>
              </button>
            )}
          </div>
        ) : (
          /* Dynamic Role Switcher (Unlikely to be shown since Auth gates) */
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 px-2.5 font-bold">Role:</span>
            {roles.map((r) => {
              const IconComponent = r.icon;
              const isActive = currentRole === r.id;
              return (
                <button
                  key={r.id}
                  id={`role-btn-${r.id}`}
                  onClick={() => onChangeRole(r.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? `${r.color} shadow-lg scale-102`
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  {r.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
