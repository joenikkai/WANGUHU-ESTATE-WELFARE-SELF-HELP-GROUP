import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Receipt, 
  Building2, 
  History, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  Menu,
  X,
  PlusCircle,
  TrendingUp,
  HelpCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Fingerprint,
  User,
  Mail,
  Edit3,
  Phone,
  MapPin
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EditProfileModal from './EditProfileModal';

const DashboardSidebar = () => {
  const { user, logout, token } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isProfileMobileOpen, setIsProfileMobileOpen] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleSensitive = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        // Real password check via login endpoint (dry run)
        await axios.post('http://localhost:5555/api/auth/login', {
            email: user?.email,
            password: passwordInput
        });
        setShowSensitiveInfo(!showSensitiveInfo);
        setIsPasswordModalOpen(false);
        setPasswordInput('');
    } catch (err) {
        alert('Invalid password. Identity access denied.');
    }
  };

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/my-dashboard' },
    { name: 'Contributions', icon: PlusCircle, path: '/contributions' },
    { name: 'Transactions', icon: Receipt, path: '/transactions' },
    { name: 'Assets', icon: Building2, path: '/assets' },
    { name: 'Stocks', icon: TrendingUp, path: '/stocks' },
    { name: 'Help Desk', icon: HelpCircle, path: '/help-desk' },
  ];

  // Role-based extra items
  const isTreasurer = user?.role === 'board_member' || user?.role === 'admin';
  if (isTreasurer) {
    navItems.splice(5, 0, { name: 'Monitor Community Funds', icon: ShieldCheck, path: '/community-funds' });
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Sidebar - Desktop */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-[#1A2433] border-r border-[#E2E8F0] dark:border-[#2D3A4A] sm:translate-x-0 ${isSidebarOpen ? 'w-72' : 'w-20'} hidden sm:flex flex-col shadow-2xl shadow-black/5`}>
        <div className="flex items-center justify-between p-6 mb-4">
          <div className={`flex items-center gap-3 overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto' : 'w-0'}`}>
            <div className="w-10 h-10 bg-gradient-to-br from-[#2E7D64] to-[#1E4D3E] rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <span className="font-black text-xl text-[#1E2933] dark:text-[#E2E8F0] tracking-tight whitespace-nowrap">WEWSHG</span>
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-slate-800 text-[#5A6B7A] transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3.5 rounded-2xl transition-all group ${
                isActive(item.path) 
                ? 'bg-[#2E7D64] text-white shadow-xl shadow-green-900/10' 
                : 'text-[#5A6B7A] dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} className={`shrink-0 ${isSidebarOpen ? 'mr-4' : 'mx-auto'}`} />
              <span className={`font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                {item.name}
              </span>
            </Link>
          ))}

          {/* My Info Section */}
          {isSidebarOpen && (
            <div className="mt-8 pt-8 border-t border-[#E2E8F0] dark:border-[#2D3A4A] animate-in fade-in duration-500">
              <div className="flex items-center justify-between px-2 mb-6">
                <span className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-[0.2em]">Member Identity</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditModalOpen(true)}
                    className="p-1 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-md transition-colors text-[#2E7D64]"
                    title="Edit Profile"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button 
                    onClick={() => {
                        if (!showSensitiveInfo) setIsPasswordModalOpen(true);
                        else setShowSensitiveInfo(false);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                  >
                    {showSensitiveInfo ? <EyeOff size={14} className="text-[#2E7D64]" /> : <Eye size={14} className="text-[#5A6B7A]" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-5 px-2">
                <div className="flex items-center gap-3 group">
                  <User size={16} className="text-blue-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Full Name</span>
                    <span className="text-xs font-bold text-[#1E2933] dark:text-[#E2E8F0]">
                      {showSensitiveInfo ? user?.full_name : '•••••••• •••••'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-orange-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Email Address</span>
                    <span className="text-xs font-bold text-[#1E2933] dark:text-[#E2E8F0] truncate max-w-[180px]">
                      {showSensitiveInfo ? user?.email : '••••••••@••••.com'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Fingerprint size={16} className="text-[#2E7D64]" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">National ID</span>
                    <span className="text-xs font-mono font-bold dark:text-[#E2E8F0]">
                      {showSensitiveInfo ? user?.national_id : '••••••••'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <ShieldCheck size={16} className="text-purple-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">KRA PIN</span>
                    <span className="text-xs font-mono font-bold dark:text-[#E2E8F0]">
                      {showSensitiveInfo ? user?.kra_pin : '••••••••'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-pink-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Phone Number</span>
                    <span className="text-xs font-bold text-[#1E2933] dark:text-[#E2E8F0]">
                      {showSensitiveInfo ? user?.phone_number : '••••••••••'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-red-500" />
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">Physical Address</span>
                    <span className="text-xs font-bold text-[#1E2933] dark:text-[#E2E8F0] line-clamp-1">
                      {showSensitiveInfo ? (user as any)?.physical_address || 'Not Provided' : '••••••••••••'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 mt-auto space-y-2 border-t border-[#E2E8F0] dark:border-[#2D3A4A]">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="w-full flex items-center p-3 rounded-2xl text-[#5A6B7A] dark:text-[#94A3B8] hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
          >
            {isDarkMode ? <Sun size={20} className={isSidebarOpen ? 'mr-4' : 'mx-auto'} /> : <Moon size={20} className={isSidebarOpen ? 'mr-4' : 'mx-auto'} />}
            <span className={`font-bold text-sm overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              {isDarkMode ? 'Solar Mode' : 'Lunar Mode'}
            </span>
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center p-3 rounded-2xl text-[#C73E2D] hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
          >
            <LogOut size={20} className={isSidebarOpen ? 'mr-4' : 'mx-auto'} />
            <span className={`font-bold text-sm overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              Disconnect
            </span>
          </button>
        </div>
      </aside>

      {/* Bottom Navigation - Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 z-50 w-full h-20 bg-white/80 dark:bg-[#1A2433]/80 backdrop-blur-xl border-t border-[#E2E8F0] dark:border-[#2D3A4A] flex items-center justify-around px-6">
        {navItems.slice(0, 3).map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex flex-col items-center justify-center gap-1.5 transition-all ${
              isActive(item.path) ? 'text-[#2E7D64] scale-110' : 'text-[#5A6B7A] dark:text-[#94A3B8]'
            }`}
          >
            <item.icon size={22} />
            <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
          </Link>
        ))}
        <button 
            onClick={() => setIsProfileMobileOpen(true)}
            className="flex flex-col items-center justify-center gap-1.5 text-[#5A6B7A] dark:text-[#94A3B8]"
        >
            <User size={22} />
            <span className="text-[9px] font-black uppercase tracking-widest">Profile</span>
        </button>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex flex-col items-center justify-center gap-1.5 text-[#5A6B7A] dark:text-[#94A3B8]">
          {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
          <span className="text-[9px] font-black uppercase tracking-widest">{isDarkMode ? 'Solar' : 'Lunar'}</span>
        </button>
      </div>

      {/* Identity Password Verification Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[200] backdrop-blur-md">
            <div className="bg-white dark:bg-[#1A2433] rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-[#E2E8F0] dark:border-[#2D3A4A]">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-500 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-2">Identify Verification</h3>
                <p className="text-sm text-[#5A6B7A] dark:text-[#94A3B8] mb-8">Please enter your security password to reveal sensitive member data.</p>
                <form onSubmit={handleToggleSensitive} className="space-y-4">
                    <input 
                        type="password" 
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl outline-none focus:border-[#2E7D64] dark:text-white"
                        autoFocus
                        required
                    />
                    <div className="flex gap-3">
                        <button type="button" onClick={() => setIsPasswordModalOpen(false)} className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-[#1E2933] dark:text-[#E2E8F0] rounded-2xl font-black">Cancel</button>
                        <button type="submit" className="flex-1 py-4 bg-[#2E7D64] text-white rounded-2xl font-black shadow-xl">Verify</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Mobile Profile Sidebar/Modal */}
      {isProfileMobileOpen && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex justify-end">
            <div className="w-[85%] h-full bg-white dark:bg-[#0F1720] p-6 animate-in slide-in-from-right duration-300 overflow-y-auto">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Member Identity</h2>
                    <button onClick={() => setIsProfileMobileOpen(false)} className="p-2 bg-gray-100 dark:bg-slate-800 rounded-xl">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex flex-col items-center mb-10">
                    <div className="w-24 h-24 rounded-full border-4 border-[#2E7D64] overflow-hidden mb-4 shadow-xl">
                        <img src={user?.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-lg font-black text-[#1E2933] dark:text-[#E2E8F0]">{user?.full_name}</h3>
                    <p className="text-xs font-bold text-[#2E7D64] uppercase tracking-widest">{user?.title}</p>
                </div>

                <div className="space-y-8">
                    {[
                        { label: 'Username', value: user?.username, icon: User, color: 'text-blue-500' },
                        { label: 'Email Address', value: user?.email, icon: Mail, color: 'text-orange-500' },
                        { label: 'National ID', value: user?.national_id, icon: Fingerprint, color: 'text-[#2E7D64]' },
                        { label: 'KRA PIN', value: user?.kra_pin, icon: ShieldCheck, color: 'text-purple-500' },
                        { label: 'Phone Number', value: user?.phone_number, icon: Phone, color: 'text-pink-500' },
                        { label: 'Physical Address', value: (user as any)?.physical_address || 'Not Provided', icon: MapPin, color: 'text-red-500' },
                    ].map((info) => (
                        <div key={info.label} className="flex gap-4 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A]">
                            <div className={`p-3 rounded-xl bg-white dark:bg-[#0F1720] shadow-sm ${info.color}`}>
                                <info.icon size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-0.5">{info.label}</p>
                                <p className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{info.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 space-y-4">
                    <button 
                        onClick={() => { setIsEditModalOpen(true); setIsProfileMobileOpen(false); }}
                        className="w-full py-4 bg-[#2E7D64] text-white rounded-2xl font-black shadow-xl flex items-center justify-center gap-3"
                    >
                        <Edit3 size={18} />
                        Edit Profile
                    </button>
                    <button 
                        onClick={logout}
                        className="w-full py-4 border-2 border-red-100 text-red-500 rounded-2xl font-black flex items-center justify-center gap-3"
                    >
                        <LogOut size={18} />
                        Disconnect
                    </button>
                </div>
            </div>
        </div>
      )}

      {isEditModalOpen && <EditProfileModal onClose={() => setIsEditModalOpen(false)} />}
    </>
  );
};

export default DashboardSidebar;


