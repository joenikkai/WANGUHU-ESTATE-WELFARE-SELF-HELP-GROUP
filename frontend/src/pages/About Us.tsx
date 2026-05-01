import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";
import { Users, History, Target, Heart } from 'lucide-react';

function AboutUs() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F1720]">
            <PublicNavbar />
            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                        <div>
                            <h1 className="text-5xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-6">Built on Trust, <br/><span className="text-[#2E7D64]">Driven by Community.</span></h1>
                            <p className="text-lg text-[#5A6B7A] dark:text-[#94A3B8] leading-relaxed mb-8">
                                Wanguhu Estate Welfare Self Help Group (WEWSHG) was founded with a single mission: to empower our residents through collective action and digital transparency. We believe that by pulling together our resources and knowledge, we can create a sustainable future for every family in our community.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div>
                                    <h4 className="text-3xl font-black text-[#2E7D64]">500+</h4>
                                    <p className="text-sm font-bold text-[#5A6B7A] uppercase">Active Members</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-black text-[#2E7D64]">KES 8M+</h4>
                                    <p className="text-sm font-bold text-[#5A6B7A] uppercase">Assets Managed</p>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="w-full aspect-video bg-gradient-to-br from-[#2E7D64] to-blue-600 rounded-[3rem] shadow-2xl flex items-center justify-center text-white text-6xl">
                                🤝
                            </div>
                            <div className="absolute -bottom-8 -left-8 bg-white dark:bg-[#1A2433] p-8 rounded-3xl shadow-xl border border-[#E2E8F0] dark:border-[#2D3A4A]">
                                <p className="text-sm italic font-serif text-[#1E2933] dark:text-[#E2E8F0]">"Transparency is the bedrock of our growth."</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { title: "Our Mission", desc: "To provide a secure and transparent digital platform for community welfare management.", icon: Target },
                            { title: "Our Vision", desc: "A digitally empowered community where every member has the tools to prosper.", icon: History },
                            { title: "Our Values", desc: "Integrity, Transparency, Accountability, and Community Spirit.", icon: Heart },
                        ].map((item, i) => (
                            <div key={i} className="text-center p-8">
                                <item.icon size={48} className="text-[#2E7D64] mx-auto mb-6" />
                                <h3 className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">{item.title}</h3>
                                <p className="text-[#5A6B7A] dark:text-[#94A3B8] leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default AboutUs;
