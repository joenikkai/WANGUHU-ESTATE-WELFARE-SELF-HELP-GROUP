import { useState, useEffect } from 'react';
import DashboardSidebar from '../components/Navbar';
import Footer from '../components/Footer';
import { TrendingUp, BarChart3, PieChart, Info, ArrowUpRight, ArrowDownRight, GraduationCap, Loader2, Globe, Landmark } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const StockHub = () => {
    const { token } = useAuth();
    const [stocks, setStocks] = useState<any[]>([]);
    const [indices, setIndices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [exchangeRates, setExchangeRates] = useState<any>(null);

    const fetchData = async () => {
        if (!token) return;
        try {
            const [nseRes, indicesRes, cbkRes] = await Promise.all([
                axios.get(`${API_URL}/external/nse`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/external/indices`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`${API_URL}/external/cbk`, { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setStocks(nseRes.data);
            setIndices(indicesRes.data);
            setExchangeRates(cbkRes.data);
        } catch (err) {
            console.error("Failed to fetch market data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [token]);

    return (
        <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#0F1720]">
            <DashboardSidebar />
            
            <div className="flex-grow flex flex-col sm:ml-72 transition-all duration-300">
                <main className="flex-grow pb-20 sm:pb-8 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <header className="mb-12">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-[#2E7D64] rounded-2xl text-white shadow-lg shadow-green-900/20">
                                    <TrendingUp size={32} />
                                </div>
                                <h1 className="text-4xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Stock Hub</h1>
                            </div>
                            <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-lg max-w-3xl">Your gateway to community-led investment. Track market trends, learn about wealth creation, and monitor shared portfolio growth.</p>
                        </header>

                        {/* Market Indices & Exchange Rates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {loading ? [1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-white dark:bg-[#1A2433] rounded-[2rem] animate-pulse border border-[#E2E8F0] dark:border-[#2D3A4A]"></div>
                            )) : (
                                <>
                                    {indices.map((index, i) => (
                                        <div key={i} className="bg-white dark:bg-[#1A2433] p-6 rounded-[2rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                            <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2">{index.name}</p>
                                            <p className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">{index.value.toLocaleString()}</p>
                                            <p className={`text-xs font-bold mt-1 flex items-center gap-1 ${index.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                {index.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                {index.change_percent}%
                                            </p>
                                        </div>
                                    ))}
                                    <div className="bg-[#2E7D64] p-6 rounded-[2rem] shadow-xl text-white">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">USD / KES</span>
                                            <Globe size={16} />
                                        </div>
                                        <p className="text-2xl font-black">
                                            {exchangeRates?.usd?.rate ? (1 / exchangeRates.usd.rate).toFixed(2) : '---'}
                                        </p>
                                        <p className="text-xs text-white/80 mt-1">CBK Indicative Rate</p>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Market Watchlist */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Market Watchlist</h2>
                                    <button onClick={fetchData} className="text-xs font-bold text-[#2E7D64] uppercase tracking-widest hover:underline flex items-center gap-2">
                                        {loading && <Loader2 size={12} className="animate-spin" />}
                                        Refresh Live Data
                                    </button>
                                </div>
                                <div className="bg-white dark:bg-[#1A2433] rounded-3xl border border-[#E2E8F0] dark:border-[#2D3A4A] overflow-hidden shadow-sm">
                                    {loading ? (
                                        <div className="p-20 flex flex-col items-center justify-center text-[#5A6B7A]">
                                            <Loader2 size={40} className="animate-spin mb-4" />
                                            <p className="font-bold">Fetching latest NSE prices...</p>
                                        </div>
                                    ) : (
                                        stocks.map((stock, i) => (
                                            <div key={stock.symbol} className={`p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${i !== stocks.length - 1 ? 'border-b border-[#E2E8F0] dark:border-[#2D3A4A]' : ''}`}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gray-100 dark:bg-slate-800 rounded-xl flex items-center justify-center font-black text-[#2E7D64]">
                                                        {stock.symbol[0]}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-[#1E2933] dark:text-[#E2E8F0]">{stock.symbol}</h4>
                                                        <p className="text-xs text-[#5A6B7A] dark:text-[#94A3B8]">{stock.name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-black text-[#1E2933] dark:text-[#E2E8F0]">KES {stock.price.toFixed(2)}</p>
                                                    <span className={`text-xs font-bold flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change_percent}%)
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Education Hub & Macro Data */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0] px-2">Macro Hub</h2>
                                <div className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <Landmark className="text-[#2E7D64]" />
                                        <h3 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">Economic Indicators</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#0F1720] rounded-2xl">
                                            <span className="text-xs font-bold text-[#5A6B7A]">Inflation Rate</span>
                                            <span className="font-black text-red-500">6.3%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#0F1720] rounded-2xl">
                                            <span className="text-xs font-bold text-[#5A6B7A]">CBR Rate</span>
                                            <span className="font-black text-[#2E7D64]">13.00%</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-[#0F1720] rounded-2xl">
                                            <span className="text-xs font-bold text-[#5A6B7A]">GDP Growth</span>
                                            <span className="font-black text-blue-500">+5.4%</span>
                                        </div>
                                    </div>
                                    <button className="w-full mt-8 py-4 bg-[#1E2933] text-white rounded-2xl font-bold hover:bg-[#2E7D64] transition-all flex items-center justify-center gap-2">
                                        <Globe size={18} />
                                        Full World Bank Report
                                    </button>
                                </div>

                                <div className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <GraduationCap size={80} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">Investment 101</h3>
                                    <p className="text-sm text-[#5A6B7A] dark:text-[#94A3B8] mb-8 leading-relaxed">New to stocks? Learn the basics of the Nairobi Securities Exchange and how we invest together.</p>
                                    <button className="w-full py-4 bg-gray-100 dark:bg-slate-800 text-[#1E2933] dark:text-[#E2E8F0] rounded-2xl font-bold hover:bg-[#2E7D64] hover:text-white transition-all">Start Learning</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
};

export default StockHub;
