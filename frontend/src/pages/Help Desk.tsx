import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";
import { MessageSquare, Phone, Mail, FileText } from 'lucide-react';

function HelpDesk() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F1720]">
            <PublicNavbar />
            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h1 className="text-4xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-4">How can we help?</h1>
                    <p className="text-[#5A6B7A] dark:text-[#94A3B8]">Our support team is here to assist you with any inquiries regarding the WEWSHG community and platform.</p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Direct Chat", desc: "Talk to a representative now", icon: MessageSquare, color: "text-[#2E7D64]" },
                        { title: "Phone Support", desc: "+254 700 000 000", icon: Phone, color: "text-blue-500" },
                        { title: "Email Us", desc: "support@wewshg.com", icon: Mail, color: "text-orange-500" },
                        { title: "Knowledge Base", desc: "Browse documentation", icon: FileText, color: "text-purple-500" },
                    ].map((item, i) => (
                        <div key={i} className="bg-white dark:bg-[#1A2433] p-8 rounded-3xl border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm hover:shadow-xl transition-all text-center group">
                            <item.icon size={40} className={`${item.color} mx-auto mb-4 group-hover:scale-110 transition-transform`} />
                            <h3 className="text-lg font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-2">{item.title}</h3>
                            <p className="text-sm text-[#5A6B7A] dark:text-[#94A3B8]">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default HelpDesk;
