import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ChevronDown, ArrowRight, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.png';
import bgImage from '../assets/Hrmsbg.png';

type RoleKey = 'staff' | 'hod' | 'principal' | 'admin';

const roles: { value: RoleKey; label: string; path: string }[] = [
  { value: 'staff',     label: 'Staff',            path: '/staff' },
  { value: 'hod',       label: 'Department Head',  path: '/hod' },
  { value: 'principal', label: 'Principal',        path: '/principal' },
  { value: 'admin',     label: 'Administrator',    path: '/admin' },
];

export default function Home() {
  const navigate = useNavigate();
  const [role, setRole]           = useState<RoleKey>('staff');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword]   = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);

  const selectedRole = roles.find(r => r.value === role)!;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate async auth check — replace with real API call
    await new Promise(res => setTimeout(res, 800));
    setLoading(false);
    navigate(selectedRole.path);
  };

  return (
    <div className="app-root min-h-screen flex flex-col relative overflow-hidden">

      {/* Ambient background image — very subtle, blended into dark gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-[0.06] mix-blend-luminosity pointer-events-none"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Subtle radial highlight at top-left */}
      <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[rgba(128,64,18,0.08)] blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-[rgba(47,58,50,0.4)] blur-[80px] pointer-events-none" />

      {/* Top strip */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-[rgba(219,159,117,0.08)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg overflow-hidden bg-[rgba(219,159,117,0.08)] border border-[rgba(219,159,117,0.15)] flex items-center justify-center">
            <img src={logo} alt="AGMCET Logo" className="w-full h-full object-contain p-0.5" />
          </div>
          <div>
            <p className="text-[#F5EFE6] font-bold text-sm leading-tight">AGMCET</p>
            <p className="text-[#7A6F65] text-[10px] font-medium leading-tight tracking-wider">A.G.M College of Engineering & Technology</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(219,159,117,0.12)] bg-[rgba(219,159,117,0.05)]">
          <ShieldCheck size={13} className="text-[#4CAF7D]" />
          <span className="text-[#B0A090] text-[10px] font-semibold tracking-wider uppercase">Secure Connection</span>
        </div>
      </nav>

      {/* Center login panel */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-12">

        {/* College branding above card */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 mx-auto mb-5 rounded-2xl overflow-hidden bg-[rgba(219,159,117,0.06)] border border-[rgba(219,159,117,0.15)] flex items-center justify-center shadow-glass">
            <img src={logo} alt="AGMCET Logo" className="w-16 h-16 object-contain" />
          </div>
          <h1 className="text-[#F5EFE6] font-bold text-2xl md:text-3xl tracking-tight mb-1">
            A.G.M College of Engineering
          </h1>
          <p className="text-[#F5EFE6] font-bold text-2xl md:text-3xl tracking-tight mb-3">
            & Technology
          </p>
          <p className="text-[#7A6F65] text-sm font-medium tracking-widest uppercase">
            Human Resource Management System
          </p>
        </div>

        {/* Glass Login Card */}
        <div className="w-full max-w-md glass-card p-8 md:p-10">
          <h2 className="text-[#F5EFE6] font-bold text-xl mb-1.5 tracking-tight">Sign in to your portal</h2>
          <p className="text-[#7A6F65] text-sm mb-8">Select your role and enter your credentials</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Role Selector */}
            <div>
              <label className="input-label">Portal / Role</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value as RoleKey)}
                  className="input-field appearance-none pr-10 cursor-pointer"
                >
                  {roles.map(r => (
                    <option key={r.value} value={r.value} style={{ background: '#122324' }}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6F65] pointer-events-none" />
              </div>
            </div>

            {/* Employee ID */}
            <div>
              <label className="input-label">Employee ID</label>
              <input
                type="text"
                placeholder="e.g. AGM-2024-001"
                value={employeeId}
                onChange={e => setEmployeeId(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-field pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7A6F65] hover:text-sand transition-colors"
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end -mt-1">
              <button type="button" className="text-sand text-xs hover:text-[#F5EFE6] transition-colors font-medium">
                Forgot Password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 py-3 text-base disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in…
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Login to HRMS
                  <ArrowRight size={18} />
                </span>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center py-5 border-t border-[rgba(219,159,117,0.06)]">
        <p className="text-[#545748] text-[10px] tracking-widest uppercase">
          &copy; {new Date().getFullYear()} AGMCET &nbsp;·&nbsp; Powered by{' '}
          <span className="text-[#7A6F65] hover:text-sand transition-colors cursor-pointer">Synus Studio</span>
        </p>
      </footer>
    </div>
  );
}
