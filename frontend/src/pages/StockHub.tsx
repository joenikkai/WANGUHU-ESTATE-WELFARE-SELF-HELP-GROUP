import { useState, useEffect } from 'react';
import DashboardSidebar from '../components/Navbar';
import Footer from '../components/Footer';
import { TrendingUp, BarChart3, PieChart, Info, ArrowUpRight, ArrowDownRight, GraduationCap } from 'lucide-react';

const StockHub = () => {
    // Simulated Stock Data
    const stocks = [
        { symbol: 'SCOM', name: 'Safaricom PLC', price: 42.15, change: '+1.2%', trend: 'up' },
        { symbol: 'EQTY', name: 'Equity Group Holdings', price: 38.50, change: '-0.5%', trend: 'down' },
        { symbol: 'KCB', name: 'KCB Group', price: 35.80, change: '+2.4%', trend: 'up' },
        { symbol: 'COOP', name: 'Co-operative Bank', price: 12.45, change: '0.0%', trend: 'neutral' },
    ];

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

                        {/* Quick Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Community Equity</span>
                                    <PieChart size={20} className="text-[#2E7D64]" />
                                </div>
                                <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">KES 4,250,000</p>
                                <p className="text-xs text-green-500 font-bold mt-2 flex items-center gap-1">
                                    <ArrowUpRight size={14} /> +15.4% this year
                                </p>
                            </div>
                            <div className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Active Investors</span>
                                    <BarChart3 size={20} className="text-blue-500" />
                                </div>
                                <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">142 Members</p>
                                <p className="text-xs text-[#5A6B7A] font-bold mt-2">28% of total community</p>
                            </div>
                            <div className="bg-[#2E7D64] p-8 rounded-[2.5rem] shadow-xl shadow-green-900/20 text-white">
                                <div className="flex justify-between items-start mb-6">
                                    <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">Next Education Session</span>
                                    <GraduationCap size={20} />
                                </div>
                                <p className="text-xl font-bold">Understanding Dividends</p>
                                <p className="text-sm text-white/80 mt-2">Saturday, May 15th • 10:00 AM</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Market Watchlist */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Market Watchlist</h2>
                                    <button className="text-xs font-bold text-[#2E7D64] uppercase tracking-widest hover:underline">View NSE Live</button>
                                </div>
                                <div className="bg-white dark:bg-[#1A2433] rounded-3xl border border-[#E2E8F0] dark:border-[#2D3A4A] overflow-hidden shadow-sm">
                                    {stocks.map((stock, i) => (
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
                                                <p className="font-black text-[#1E2933] dark:text-[#E2E8F0]">KES {stock.price}</p>
                                                <span className={`text-xs font-bold ${stock.trend === 'up' ? 'text-green-500' : stock.trend === 'down' ? 'text-red-500' : 'text-[#5A6B7A]'}`}>
                                                    {stock.change}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Education Hub */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0] px-2">Education Hub</h2>
                                <div className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <GraduationCap size={80} />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">Investment 101</h3>
                                    <p className="text-sm text-[#5A6B7A] dark:text-[#94A3B8] mb-8 leading-relaxed">New to stocks? Learn the basics of the Nairobi Securities Exchange and how we invest together as a community.</p>
                                    <button className="w-full py-4 bg-gray-100 dark:bg-slate-800 text-[#1E2933] dark:text-[#E2E8F0] rounded-2xl font-bold hover:bg-[#2E7D64] hover:text-white transition-all">Start Learning</button>
                                </div>
                                
                                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex gap-4">
                                    <Info className="text-blue-500 shrink-0" size={20} />
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed"><strong>Wholesome Fact:</strong> Investing as a group reduces individual risk and opens doors to institutional-level opportunities.</p>
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
