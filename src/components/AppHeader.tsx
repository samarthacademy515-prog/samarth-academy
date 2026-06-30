import { GraduationCap, Phone, ShieldCheck, User, Users, BookOpen } from "lucide-react";
import { ACADEMY_INFO } from "../data";
import logoImage from "../assets/images/academy_logo_1782839442092.jpg";

interface AppHeaderProps {
  currentRole: string;
  onChangeRole: (role: string) => void;
}

export default function AppHeader({ currentRole, onChangeRole }: AppHeaderProps) {
  const roles = [
    { id: "admin", label: "Director / Admin", icon: ShieldCheck, color: "bg-red-500 text-white" },
    { id: "teacher", label: "Teacher", icon: BookOpen, color: "bg-emerald-500 text-white" },
    { id: "student", label: "Student", icon: GraduationCap, color: "bg-blue-500 text-white" },
    { id: "parent", label: "Parent", icon: Users, color: "bg-amber-500 text-white" }
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
        <div className="flex items-center gap-4">
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
          <div>
            <div className="flex items-baseline gap-2">
              <h1 className="text-2xl font-black text-white tracking-tight">{ACADEMY_INFO.name}</h1>
              <span className="text-xs bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-bold">Parbhani</span>
            </div>
            <p className="text-amber-400 text-xs font-semibold tracking-wider font-sans mt-0.5">
              {ACADEMY_INFO.tagline} • {ACADEMY_INFO.mission}
            </p>
          </div>
        </div>

        {/* Dynamic Role Switcher */}
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
      </div>
    </header>
  );
}
