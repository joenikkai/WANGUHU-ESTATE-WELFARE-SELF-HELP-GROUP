import { Link } from 'react-router-dom';
import { ShieldCheck, Menu } from 'lucide-react';

const PublicNavbar = () => {
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
          
          <div className="hidden md:flex items-center gap-8">
            <Link to="/products" className="text-sm font-bold text-[#5A6B7A] dark:text-[#94A3B8] hover:text-[#2E7D64] transition-colors">Products</Link>
            <Link to="/services" className="text-sm font-bold text-[#5A6B7A] dark:text-[#94A3B8] hover:text-[#2E7D64] transition-colors">Services</Link>
            <Link to="/about-us" className="text-sm font-bold text-[#5A6B7A] dark:text-[#94A3B8] hover:text-[#2E7D64] transition-colors">About Us</Link>
            <Link to="/help-desk" className="text-sm font-bold text-[#5A6B7A] dark:text-[#94A3B8] hover:text-[#2E7D64] transition-colors">Help Desk</Link>
            <Link to="/login" className="px-6 py-2.5 bg-[#2E7D64] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#256652] transition-all transform hover:-translate-y-0.5">Member Login</Link>
          </div>

          <button className="md:hidden p-2 text-[#5A6B7A]">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
