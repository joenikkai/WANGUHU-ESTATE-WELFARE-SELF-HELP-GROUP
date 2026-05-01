import PublicNavbar from "../components/PublicNavbar";
import Logo from "../components/Logo";
import Search from "../components/Search";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Landing() {
    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F1720]">
            <PublicNavbar />

            {/* Hero Section */}
            <main className="flex-grow pt-20">
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-6xl font-extrabold text-[#1E2933] dark:text-[#E2E8F0] tracking-tight">
                                Empowering Our Community
                            </h1>
                        </div>
                        
                        <p className="text-xl italic text-[#2E7D64] dark:text-[#3B8B76] font-serif border-l-4 border-[#2E7D64] pl-4 py-2">
                            "Harambee: Pulling together for a sustainable future through collective transparency."
                        </p>

                        <p className="text-lg text-[#5A6B7A] dark:text-[#94A3B8] leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Transitioning from paper to digital precision. We empower our members by providing a unified platform for tracking contributions, managing communal assets, and fostering financial education.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link to="/sign-up" className="px-8 py-4 bg-[#2E7D64] text-white rounded-lg font-bold shadow-lg hover:bg-[#256652] transition-all transform hover:-translate-y-1 text-center">
                                Join the Community
                            </Link>
                            <Link to="/about-us" className="px-8 py-4 bg-white dark:bg-[#1A2433] text-[#1E2933] dark:text-[#E2E8F0] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-lg font-bold shadow-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-all text-center">
                                Learn More
                            </Link>
                        </div>

                        <div className="pt-4 max-w-md mx-auto lg:mx-0">
                            <Search />
                        </div>
                    </div>

                    <div className="hidden lg:flex justify-center items-center">
                        <div className="relative w-full max-w-lg aspect-square bg-gradient-to-br from-[#2E7D64]/10 to-blue-500/10 rounded-full flex items-center justify-center p-12">
                            <div className="w-full h-full bg-white dark:bg-[#1A2433] rounded-2xl shadow-2xl border border-[#E2E8F0] dark:border-[#2D3A4A] p-8 flex flex-col justify-center space-y-6">
                                <div className="space-y-2">
                                    <div className="h-4 w-3/4 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/2 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-20 bg-[#2E7D64]/5 rounded-lg border border-[#2E7D64]/20 flex items-center justify-center">
                                        <span className="text-[#2E7D64] font-bold">Assets</span>
                                    </div>
                                    <div className="h-20 bg-blue-500/5 rounded-lg border border-blue-500/20 flex items-center justify-center">
                                        <span className="text-blue-500 font-bold">Stocks</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                    <div className="h-4 w-5/6 bg-gray-100 dark:bg-slate-800 rounded animate-pulse"></div>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-orange-400/20 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section className="bg-white dark:bg-[#1A2433] py-20 border-y border-[#E2E8F0] dark:border-[#2D3A4A]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">Our Core Services</h3>
                            <div className="w-20 h-1.5 bg-[#2E7D64] mx-auto mt-4 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                { title: "Contribution Tracking", desc: "Transparent records of all mandatory and benevolence contributions with real-time personal balances.", icon: "📊" },
                                { title: "Asset Management", desc: "Digital registry of communal land, equipment, and shared property for collective oversight.", icon: "🏗️" },
                                { title: "Stock Education", desc: "Integrated stock market tracking and investment education hub for community members.", icon: "📈" }
                            ].map((service, i) => (
                                <div key={i} className="p-8 rounded-xl border border-[#E2E8F0] dark:border-[#2D3A4A] hover:shadow-xl transition-shadow bg-[#F8F9FA] dark:bg-[#0F1720]">
                                    <div className="text-4xl mb-4">{service.icon}</div>
                                    <h4 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-3">{service.title}</h4>
                                    <p className="text-[#5A6B7A] dark:text-[#94A3B8]">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Benefits / CTA */}
                <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-3xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-6">Empowering Members Since Transition</h3>
                    <p className="text-lg text-[#5A6B7A] dark:text-[#94A3B8] mb-12 max-w-3xl mx-auto">
                        Whether you are a board member managing the ledger or a visitor looking to invest, WEWSHG provides the tools to ensure every shilling counts towards our collective prosperity.
                    </p>
                    <Link to="/sign-up" className="inline-block px-10 py-5 bg-[#2E7D64] text-white rounded-full font-bold text-xl shadow-xl hover:bg-[#256652] transition-transform transform hover:scale-105">
                        Get Started Today
                    </Link>
                </section>
            </main>

            <Footer />
        </div>
    );
}

export default Landing;