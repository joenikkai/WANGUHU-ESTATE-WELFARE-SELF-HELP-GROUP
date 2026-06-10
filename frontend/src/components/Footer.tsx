import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Footer() {
    const { user } = useAuth();
    
    return (
        <footer className="w-full bg-[#FFFFFF] dark:bg-[#1A2433] border-t border-[#E2E8F0] dark:border-[#2D3A4A] py-12 px-6 mt-auto">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    <div className="text-center md:text-left">
                        <p className="text-[#1E2933] dark:text-[#E2E8F0] font-black text-2xl mb-2">WEWSHG</p>
                        <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-sm font-medium">Wanguhu Estate Welfare Self Help Group</p>
                    </div>

                    <div className="flex flex-col items-center md:items-start gap-4">
                        <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2">Legal Framework ∑</p>
                        <Link to="/legal/terms" className="text-sm font-bold text-[#5A6B7A] dark:text-[#E2E8F0] hover:text-[#2E7D64] transition-colors">Terms of Association</Link>
                        <Link to="/legal/privacy" className="text-sm font-bold text-[#5A6B7A] dark:text-[#E2E8F0] hover:text-[#2E7D64] transition-colors">Privacy Mandate</Link>
                        <Link to="/legal/bylaws" className="text-sm font-bold text-[#5A6B7A] dark:text-[#E2E8F0] hover:text-[#2E7D64] transition-colors">Group Bylaws</Link>
                    </div>

                    <div className="text-center md:text-right flex flex-col items-center md:items-end gap-2">
                        <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-sm font-bold">
                            &copy; {new Date().getFullYear()} WEWSHG Official Node.
                        </p>
                        <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-[10px] uppercase tracking-widest font-black flex items-center gap-2">
                            Secure • Wholesome • Transparent
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-[#E2E8F0] dark:border-[#2D3A4A] text-center">
                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-[10px] font-bold">
                        Built with precision by <a href="https://github.com/joenikkai" target="_blank" rel="noopener noreferrer" className="text-[#2E7D64] dark:text-[#3B8B76] font-black hover:underline uppercase tracking-tighter">joenikkai</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
