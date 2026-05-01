import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";
import { Tractor, Shield, GraduationCap, Users } from 'lucide-react';

function Services() {
    const services = [
        { title: "Equipment Leasing", desc: "Access to community-owned tractors and machinery at subsidized rates.", icon: Tractor },
        { title: "Welfare Support", desc: "Emergency benevolence funds and community support for members in need.", icon: Shield },
        { title: "Financial Literacy", desc: "Training sessions on stock market investments and community saving strategies.", icon: GraduationCap },
        { title: "Member Advocacy", desc: "Legal and social representation for all community members in the sector.", icon: Users },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F1720]">
            <PublicNavbar />
            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-4">Our Services</h1>
                        <p className="text-[#5A6B7A] dark:text-[#94A3B8] max-w-2xl mx-auto">WEWSHG provides essential services designed to foster growth, security, and prosperity for every household in our estate.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {services.map((s, i) => (
                            <div key={i} className="bg-white dark:bg-[#1A2433] p-10 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm hover:shadow-2xl transition-all flex gap-8 items-start group">
                                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-3xl text-[#2E7D64] group-hover:rotate-12 transition-transform">
                                    <s.icon size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-3">{s.title}</h3>
                                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] leading-relaxed">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default Services;
