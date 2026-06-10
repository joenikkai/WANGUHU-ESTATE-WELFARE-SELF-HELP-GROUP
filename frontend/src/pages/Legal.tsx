import { useParams, Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import DashboardSidebar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Scale, Lock, BookOpen, ChevronLeft } from "lucide-react";

const legalContent = {
    "terms": {
        title: "Terms & Conditions ∑",
        icon: Scale,
        color: "text-blue-500",
        sections: [
            {
                heading: "1. The Wholesome Mandate",
                content: "By accessing the WEWSHG platform, you agree to uphold the 'Wholesome System' philosophy. This includes a commitment to conceptual understanding, mutual accountability, and the collective progress of the Wanguhu Estate Welfare Self Help Group."
            },
            {
                heading: "2. Financial Integrity ∑",
                content: "All financial transactions recorded on the platform are legally binding within the group's bylaws. Members are responsible for ensuring that contributions (Mandatory, Benevolence, Asset Shares) are accurate and timely. Fraudulent entries will result in immediate termination of biometric identity access."
            },
            {
                heading: "3. Membership Identity",
                content: "Your digital identity (linked to National ID and KRA PIN) is non-transferable. You are responsible for all actions taken under your credentials. Multi-factor authentication is mandated for all high-value transactions."
            }
        ]
    },
    "privacy": {
        title: "Privacy Policy Δ",
        icon: Lock,
        color: "text-[#2E7D64]",
        sections: [
            {
                heading: "1. Data Sovereignty",
                content: "WEWSHG adheres to a 'Privacy First' mandate. Your sensitive legal data (National ID, KRA PIN, Address) is masked by default and only revealed through authenticated biometric verification or secure password input."
            },
            {
                heading: "2. The Immutable Ledger",
                content: "Financial data is stored in an immutable central ledger. While personal details are protected, communal fund balances and asset valuations are public to all verified members to ensure total transparency."
            },
            {
                heading: "3. Audit Logs",
                content: "All critical system changes and financial entries are recorded in forensics-grade audit logs. These logs track the actor, action, and timestamp to ensure accountability without compromising personal privacy."
            }
        ]
    },
    "bylaws": {
        title: "Group Bylaws Book ∑",
        icon: BookOpen,
        color: "text-purple-500",
        sections: [
            {
                heading: "1. Mandatory Contributions",
                content: "Every registered member is mandated to contribute KES 1,000 monthly to the Maintenance Pool. Failure to contribute for three consecutive months may lead to a review of membership status."
            },
            {
                heading: "2. The Benevolence Fund",
                content: "The Benevolence Pool is a voluntary communal reserve used to support members during life events. Disbursement is subject to approval by the Chairperson and the Treasurer based on verified needs."
            },
            {
                heading: "3. Asset Unit Ownership",
                content: "Communal assets (Infrastructure, Equipment) are funded through fractional unit purchases. Ownership is proportional to the units held, and dividends/utilization rights are distributed accordingly."
            }
        ]
    }
};

function Legal() {
    const { type } = useParams();
    const { user } = useAuth();
    const isMember = !!user;
    
    const content = legalContent[type as keyof typeof legalContent] || legalContent["terms"];
    const Icon = content.icon;

    const mainContent = (
        <div className="max-w-4xl mx-auto">
            <div className={`mb-12 ${isMember ? '' : 'pt-32'}`}>
                <Link to={isMember ? "/my-dashboard" : "/"} className="inline-flex items-center gap-2 text-[10px] font-black text-[#5A6B7A] hover:text-[#2E7D64] uppercase tracking-widest mb-8 transition-colors">
                    <ChevronLeft size={14} />
                    Back to {isMember ? "Dashboard" : "Home"}
                </Link>
                
                <div className="flex items-center gap-6 mb-8">
                    <div className={`w-16 h-16 rounded-[1.5rem] bg-white dark:bg-[#1A2433] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] flex items-center justify-center ${content.color} shadow-sm`}>
                        <Icon size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">{content.title}</h1>
                        <p className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-[0.2em] mt-1">Official WEWSHG Legal Framework</p>
                    </div>
                </div>

                <div className="space-y-12">
                    {content.sections.map((section, i) => (
                        <section key={i} className="bg-white dark:bg-[#1A2433] p-10 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                            <h2 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-6 flex items-center gap-3">
                                <span className="text-[#2E7D64] opacity-20 text-4xl font-black font-mono">0{i + 1}</span>
                                {section.heading}
                            </h2>
                            <p className="text-[#5A6B7A] dark:text-[#94A3B8] leading-relaxed font-medium">
                                {section.content}
                            </p>
                        </section>
                    ))}
                </div>

                <div className="mt-16 p-10 bg-gray-50 dark:bg-[#0F1720] rounded-[2.5rem] border border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] text-center">
                    <ShieldCheck className="mx-auto text-[#2E7D64] mb-4" size={40} />
                    <p className="text-sm text-[#5A6B7A] font-bold mb-2">Last Updated: June 10, 2026</p>
                    <p className="text-xs text-[#94A3B8]">These terms are governed by the laws of the Republic of Kenya and the WEWSHG Constitution.</p>
                </div>
            </div>
        </div>
    );

    if (isMember) {
        return (
            <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#0F1720]">
                <DashboardSidebar />
                <div className="flex-grow flex flex-col sm:ml-72 transition-all duration-300">
                    <main className="flex-grow pb-20 sm:pb-8 p-4 sm:p-6 lg:p-8">
                        {mainContent}
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
                {mainContent}
            </main>
            <Footer />
        </div>
    );
}

export default Legal;
