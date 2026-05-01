import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, Package, X, Info, LayoutDashboard, Briefcase, ShoppingBag } from 'lucide-react';

const PublicNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'The Exchange', path: '/marketplace', icon: ShoppingBag, important: true },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Services', path: '/services', icon: Briefcase },
    { name: 'About Us', path: '/about-us', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-white/70 dark:bg-[#0F1720]/70 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#2D3A4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#2E7D64] rounded-xl flex items-center justify-center text-white shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <span className="font-black text-xl text-[#1E2933] dark:text-[#E2E8F0] tracking-tight">WEWSHG</span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
                <Link 
                    key={link.path}
                    to={link.path} 
                    className={`text-sm ${link.important ? 'font-black text-[#2E7D64] dark:text-[#3B8B76]' : 'font-bold text-[#5A6B7A] dark:text-[#94A3B8]'} hover:text-[#2E7D64] transition-all flex items-center gap-2`}
                >
                    {link.important && <link.icon size={18} />}
                    {link.name}
                </Link>
            ))}
            <Link to="/login" className="px-6 py-2.5 bg-[#2E7D64] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#256652] transition-all transform hover:-translate-y-0.5">Member Login</Link>
          </div>

          {/* Hamburger Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#5A6B7A] dark:text-[#E2E8F0] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 top-20 z-[-1] bg-white dark:bg-[#0F1720] md:hidden transition-all duration-300 transform ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
        <div className="flex flex-col p-6 space-y-6">
            {navLinks.map((link) => (
                <Link 
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8F9FA] dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A]"
                >
                    <div className={`p-3 rounded-xl ${link.important ? 'bg-[#2E7D64] text-white' : 'bg-white dark:bg-[#0F1720] text-[#5A6B7A]'}`}>
                        <link.icon size={20} />
                    </div>
                    <div>
                        <p className={`font-black text-sm ${link.important ? 'text-[#2E7D64]' : 'text-[#1E2933] dark:text-[#E2E8F0]'}`}>{link.name}</p>
                        <p className="text-[10px] text-[#5A6B7A] uppercase font-bold tracking-widest">Explore Section</p>
                    </div>
                </Link>
            ))}
            <Link 
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-5 bg-[#1E2933] dark:bg-white text-white dark:text-[#1E2933] rounded-2xl font-black shadow-xl"
            >
                <LayoutDashboard size={20} />
                Access Member Dashboard
            </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
