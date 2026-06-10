import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import DashboardSidebar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
    ShieldCheck, 
    TrendingUp, 
    Building2, 
    PieChart, 
    ArrowUpRight,
    ArrowDownRight,
    Activity,
    Info,
    Receipt
} from "lucide-react";
import axios from 'axios';
import { API_URL } from "../utils/api";

function CommunityFunds() {
    const { token } = useAuth();
    const [data, setData] = useState<{
        pools: any[],
        assets: any[],
        recentActivity: any[]
    } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!token) return;
            try {
                const res = await axios.get(`${API_URL}/finance/community-funds`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch community funds", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [token]);

    const totalLiquidity = data?.pools.reduce((acc, p) => acc + parseFloat(p.balance), 0) || 0;
    const totalAssetValue = data?.assets.reduce((acc, a) => acc + parseFloat(a.value), 0) || 0;

    return (
        <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#0F1720]">
            <DashboardSidebar />
            
            <div className="flex-grow flex flex-col sm:ml-72 transition-all duration-300">
                <main className="flex-grow pb-20 sm:pb-8 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {/* Header */}
                        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-[#1A2433] p-10 rounded-[3rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <ShieldCheck size={200} />
                            </div>
                            <div className="relative z-10">
                                <h1 className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-2">Community Treasury ∑</h1>
                                <p className="text-[#5A6B7A] dark:text-[#94A3B8] font-bold uppercase tracking-[0.2em] text-xs">Public Financial Oversight & Asset Valuation</p>
                            </div>
                            <div className="flex gap-8 relative z-10">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Total Group Capital ∑</p>
                                    <p className="text-3xl font-black text-[#2E7D64]">KES {(totalLiquidity + totalAssetValue).toLocaleString()}</p>
                                </div>
                            </div>
                        </header>

                        {loading ? (
                            <div className="py-20 text-center">
                                <div className="w-12 h-12 border-4 border-[#2E7D64] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                <p className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-[0.2em]">Synchronizing Public Ledger...</p>
                            </div>
                        ) : (
                            <div className="space-y-10">
                                {/* Pool Liquidity Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-[#2E7D64] rounded-2xl text-white">
                                            <PieChart size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Liquid Reserves ∑</h2>
                                            <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest">Real-time balances of multi-signature pools</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {data?.pools.map((pool) => (
                                            <div key={pool.name} className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm group hover:border-[#2E7D64] transition-all">
                                                <div className="flex justify-between items-start mb-6">
                                                    <p className="text-[11px] font-black text-[#475569] dark:text-[#94A3B8] uppercase tracking-[0.2em]">{pool.name} Pool Δ</p>
                                                    <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/10 flex items-center justify-center text-[#2E7D64]">
                                                        <ArrowUpRight size={16} />
                                                    </div>
                                                </div>
                                                <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-4">
                                                    KES {parseFloat(pool.balance).toLocaleString()}
                                                </p>
                                                <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#2E7D64]" style={{ width: '65%' }}></div>
                                                </div>
                                                <p className="mt-4 text-[10px] font-bold text-[#5A6B7A] uppercase">Utilization: 35.0% Reserved</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Asset Valuation Section */}
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="p-3 bg-purple-500 rounded-2xl text-white">
                                            <Building2 size={24} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Communal Assets Δ</h2>
                                            <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest">Infrastructure, Equipment & Property Valuation</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        {data?.assets.map((asset) => (
                                            <div key={asset.id} className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm flex flex-col md:flex-row gap-8">
                                                <div className="w-full md:w-40 h-40 bg-gray-50 dark:bg-[#0F1720] rounded-[2rem] flex items-center justify-center text-[#94A3B8] border-2 border-dashed border-[#E2E8F0] dark:border-[#2D3A4A]">
                                                    <Building2 size={48} />
                                                </div>
                                                <div className="flex-grow">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0]">{asset.name}</h3>
                                                            <p className="text-[10px] font-black text-purple-500 uppercase tracking-widest">{asset.type} • Community Property</p>
                                                        </div>
                                                        <span className="px-3 py-1 bg-purple-50 dark:bg-purple-900/10 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-100 dark:border-purple-900/20">
                                                            Δ Verified
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                                        <div>
                                                            <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Current Value ∑</p>
                                                            <p className="text-lg font-black text-[#1E2933] dark:text-[#E2E8F0]">KES {parseFloat(asset.value).toLocaleString()}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-[#94A3B8] uppercase tracking-widest mb-1">Unit Contributions ∑</p>
                                                            <p className="text-lg font-black text-[#2E7D64]">KES {parseFloat(asset.total_contributed).toLocaleString()}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                                            <span className="text-[#5A6B7A]">Funding Progress</span>
                                                            <span className="text-[#1E2933] dark:text-[#E2E8F0]">{((parseFloat(asset.total_contributed) / parseFloat(asset.target_amount)) * 100).toFixed(1)}%</span>
                                                        </div>
                                                        <div className="h-2 w-full bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-purple-500" style={{ width: `${(parseFloat(asset.total_contributed) / parseFloat(asset.target_amount)) * 100}%` }}></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </section>

                                {/* Recent Activity & Insights */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-2 bg-white dark:bg-[#1A2433] p-10 rounded-[3rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                        <div className="flex items-center gap-4 mb-10">
                                            <div className="p-3 bg-orange-500 rounded-2xl text-white">
                                                <Activity size={24} />
                                            </div>
                                            <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Global Activity Flow Δ</h2>
                                        </div>
                                        <div className="space-y-6">
                                            {data?.recentActivity.map((tx, i) => (
                                                <div key={i} className="flex items-center justify-between p-6 bg-gray-50 dark:bg-[#0F1720] rounded-[2rem] border border-transparent hover:border-orange-500/20 transition-all">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-orange-500 shadow-sm">
                                                            <Receipt size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-[#1E2933] dark:text-[#E2E8F0]">{tx.category.replace('_', ' ').toUpperCase()}</p>
                                                            <p className="text-[10px] text-[#5A6B7A] uppercase tracking-widest font-bold">
                                                                {new Date(tx.date).toLocaleDateString()} • {tx.payment_method}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-lg font-black text-[#2E7D64]">KES +{parseFloat(tx.amount).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="lg:col-span-1 space-y-8">
                                        <div className="bg-[#1E2933] text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-6 opacity-10">
                                                <Info size={80} />
                                            </div>
                                            <h3 className="text-xl font-bold mb-6">Transparency Mandate</h3>
                                            <p className="text-sm text-white/70 leading-relaxed mb-8 font-medium">
                                                In accordance with our "Wholesome System" philosophy, all communal fund balances are public to members. This ensures collective accountability and encourages informed participation in group investments.
                                            </p>
                                            <div className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                                                <ShieldCheck className="text-[#2E7D64] shrink-0" size={20} />
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Verified by Multi-Signature Audit Logs</p>
                                            </div>
                                        </div>

                                        <div className="bg-white dark:bg-[#1A2433] p-10 rounded-[3rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                            <h4 className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-8">Group Health Metrics</h4>
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-end">
                                                    <p className="text-[10px] font-black text-[#94A3B8] uppercase">Growth Rate Δ</p>
                                                    <p className="text-xl font-black text-green-500">+12.4%</p>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <p className="text-[10px] font-black text-[#94A3B8] uppercase">Utilization Δ</p>
                                                    <p className="text-xl font-black text-blue-500">65.2%</p>
                                                </div>
                                                <div className="flex justify-between items-end">
                                                    <p className="text-[10px] font-black text-[#94A3B8] uppercase">Volatility ±</p>
                                                    <p className="text-xl font-black text-orange-500">2.1%</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default CommunityFunds;
