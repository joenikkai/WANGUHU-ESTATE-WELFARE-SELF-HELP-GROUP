import PublicNavbar from "../components/PublicNavbar";
import Footer from "../components/Footer";
import { ShoppingBag, Star, ArrowRight } from 'lucide-react';

function Products() {
    const products = [
        { name: "Organic Fertilizer", price: "KES 2,500", img: "🌱" },
        { name: "High-Yield Seeds", price: "KES 1,200", img: "🌾" },
        { name: "Community Honey", price: "KES 800", img: "🍯" },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F1720]">
            <PublicNavbar />
            <main className="flex-grow pt-32 pb-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h1 className="text-4xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-2">Community Products</h1>
                            <p className="text-[#5A6B7A] dark:text-[#94A3B8]">High-quality produce and supplies from our group members.</p>
                        </div>
                        <button className="flex items-center gap-2 text-[#2E7D64] font-bold hover:underline">
                            View All <ArrowRight size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((p, i) => (
                            <div key={i} className="bg-white dark:bg-[#1A2433] rounded-3xl border border-[#E2E8F0] dark:border-[#2D3A4A] overflow-hidden group shadow-sm hover:shadow-2xl transition-all">
                                <div className="h-64 bg-gray-50 dark:bg-slate-800 flex items-center justify-center text-7xl group-hover:scale-110 transition-transform">
                                    {p.img}
                                </div>
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">{p.name}</h3>
                                        <div className="flex text-orange-400"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
                                    </div>
                                    <p className="text-2xl font-black text-[#2E7D64] mb-6">{p.price}</p>
                                    <button className="w-full py-4 bg-[#1E2933] dark:bg-slate-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#2E7D64] transition-colors">
                                        <ShoppingBag size={20} />
                                        Inquire to Buy
                                    </button>
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

export default Products;
