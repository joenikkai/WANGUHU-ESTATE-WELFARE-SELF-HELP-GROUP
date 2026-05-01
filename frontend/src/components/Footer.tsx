import { useAuth } from "../context/AuthContext";

function Footer() {
    const { user } = useAuth();
    
    // Hide footer on dashboard if preferred, or keep it consistent.
    // User requested applying it to all necessary pages.
    
    return (
        <footer className="w-full bg-[#FFFFFF] dark:bg-[#1A2433] border-t border-[#E2E8F0] dark:border-[#2D3A4A] py-8 px-6 mt-auto">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="text-center md:text-left">
                    <p className="text-[#1E2933] dark:text-[#E2E8F0] font-bold text-lg">WEWSHG</p>
                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-sm">Wanguhu Estate Welfare Self Help Group</p>
                </div>
                
                <div className="text-center md:text-right">
                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-sm">
                        &copy; {new Date().getFullYear()} All Rights Reserved.
                    </p>
                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-[10px] mt-1">
                        Built with precision by <a href="https://github.com/joenikkai" target="_blank" rel="noopener noreferrer" className="text-[#2E7D64] dark:text-[#3B8B76] font-semibold hover:underline">joenikkai</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
