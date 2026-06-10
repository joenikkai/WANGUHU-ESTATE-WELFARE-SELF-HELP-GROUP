import PublicNavbar from "../components/PublicNavbar";
import DashboardSidebar from "../components/Navbar";
import Footer from "../components/Footer";
import { MessageSquare, Phone, Mail, FileText, ShieldCheck, HelpCircle } from 'lucide-react';
import { useAuth } from "../context/AuthContext";

function HelpDesk() {
    const { user } = useAuth();
    const isMember = !!user;

    const content = (
        <div className="max-w-7xl mx-auto">
            <div className={`text-center mb-16 ${isMember ? '' : 'pt-32'}`}>
                <div className="inline-flex p-4 bg-[#2E7D64]/10 rounded-3xl text-[#2E7D64] mb-6">
                    <HelpCircle size={48} />
                </div>
                <h1 className="text-4xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-4">How can we help?</h1>
                <p className="text-[#5A6B7A] dark:text-[#94A3B8] max-w-2xl mx-auto font-medium">Our support team is here to assist you with any inquiries regarding the WEWSHG community, platform, or financial ledger.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { title: "Direct Chat", desc: "Talk to a representative now", icon: MessageSquare, color: "text-[#2E7D64]", bg: "bg-green-50 dark:bg-green-900/10" },
                    { title: "Phone Support", desc: "+254 700 000 000", icon: Phone, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/10" },
                    { title: "Email Us", desc: "support@wewshg.com", icon: Mail, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/10" },
                    { title: "Knowledge Base", desc: "Browse documentation", icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/10" },
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-[#1A2433] p-10 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm hover:shadow-xl transition-all text-center group">
                        <div className={`w-20 h-20 ${item.bg} ${item.color} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                            <item.icon size={32} />
                        </div>
                        <h3 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-3">{item.title}</h3>
                        <p className="text-sm text-[#5A6B7A] dark:text-[#94A3B8] font-bold">{item.desc}</p>
                    </div>
                ))}
            </div>

            {isMember && (
                <div className="mt-16 bg-[#1E2933] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <ShieldCheck size={120} />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-4">Identity Verification Support</h3>
                        <p className="text-sm text-white/70 max-w-xl leading-relaxed mb-8">
                            If you are having trouble with your Biometric identity or sensitive information access, please contact the Chairperson or Treasurer directly during business hours.
                        </p>
                        <div className="flex gap-4">
                            <div className="w-1 h-12 bg-[#2E7D64] rounded-full"></div>
                            <p className="text-xs italic text-white/50 flex items-center">"Securing your legacy through wholesome technical support."</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    if (isMember) {
        return (
            <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#0F1720]">
                <DashboardSidebar />
                <div className="flex-grow flex flex-col sm:ml-72 transition-all duration-300">
                    <main className="flex-grow pb-20 sm:pb-8 p-4 sm:p-6 lg:p-8">
                        {content}
                    </main>
                    <Footer />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F1720]">
            <PublicNavbar />
            <main className="flex-grow pb-20 px-4">
                {content}
            </main>
            <Footer />
        </div>
    );
}

export default HelpDesk;
