import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import DashboardSidebar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
    Receipt, 
    TrendingUp, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    Search,
    FileText,
    X,
    ShieldCheck,
    CheckCircle2,
    Printer,
    Download
} from "lucide-react";
import axios from 'axios';
import { API_URL } from "../utils/api";

function Transactions() {
    const { user, token } = useAuth();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState('');
    const [onlyMe, setOnlyMe] = useState(false);
    const [viewingReceipt, setViewingReceipt] = useState<any>(null);

    const isTreasurer = user?.role === 'board_member' || user?.role === 'admin';
    const limit = 14;

    const fetchTransactions = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const params: any = {
                limit,
                offset: page * limit,
                category: category || undefined,
            };

            if (isTreasurer && onlyMe) {
                params.user_id = user?.id;
            }

            const response = await axios.get(`${API_URL}/finance/transactions`, {
                headers: { Authorization: `Bearer ${token}` },
                params
            });
            setTransactions(response.data.transactions);
            setTotal(response.data.total);
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [token, page, category, onlyMe]);

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#0F1720]">
            <DashboardSidebar />
            
            <div className="flex-grow flex flex-col sm:ml-72 transition-all duration-300">
                <main className="flex-grow pb-20 sm:pb-8 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {/* Header */}
                        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 bg-[#2E7D64] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#2E7D64]/20">
                                    <Receipt size={32} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Financial Ledger</h1>
                                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                                        Total Recorded Transactions: ∑ {total}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                                <div className="flex items-center gap-2 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl px-4 py-2">
                                    <Filter size={16} className="text-[#5A6B7A]" />
                                    <select 
                                        value={category} 
                                        onChange={(e) => { setCategory(e.target.value); setPage(0); }}
                                        className="bg-transparent outline-none text-[10px] font-black uppercase tracking-widest text-[#5A6B7A]"
                                    >
                                        <option value="">All Categories</option>
                                        <option value="mandatory_contribution">Mandatory Fund</option>
                                        <option value="benevolence">Benevolence</option>
                                        <option value="personal_deposit">Personal Deposit</option>
                                        <option value="asset_purchase">Asset Units</option>
                                    </select>
                                </div>
                                {isTreasurer && (
                                    <button 
                                        onClick={() => { setOnlyMe(!onlyMe); setPage(0); }}
                                        className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 border-2 ${
                                            onlyMe 
                                            ? 'bg-[#2E7D64] text-white border-[#2E7D64]' 
                                            : 'bg-white dark:bg-[#1A2433] text-[#5A6B7A] border-[#E2E8F0] dark:border-[#2D3A4A]'
                                        }`}
                                    >
                                        {onlyMe ? <ShieldCheck size={14} /> : <Filter size={14} />}
                                        {onlyMe ? 'Showing My Entries' : 'Show Only My Entries'}
                                    </button>
                                )}
                            </div>
                        </header>

                        {/* Transactions Table */}
                        <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-[2.5rem] p-8 shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-separate border-spacing-y-4">
                                    <thead>
                                        <tr className="text-[10px] font-black text-[#94A3B8] uppercase tracking-[0.2em]">
                                            <th className="px-6 pb-2">Execution Date • Ref</th>
                                            <th className="px-6 pb-2">Category Δ</th>
                                            {isTreasurer && !onlyMe && <th className="px-6 pb-2">Member Identity</th>}
                                            <th className="px-6 pb-2">Method</th>
                                            <th className="px-6 pb-2 text-right">Value ∑</th>
                                            <th className="px-6 pb-2 text-center">Audit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="space-y-4">
                                        {transactions.length > 0 ? transactions.map((tx) => (
                                            <tr key={tx.id} className="bg-gray-50 dark:bg-[#0F1720] rounded-2xl border border-transparent hover:border-[#2E7D64] transition-all group">
                                                <td className="px-6 py-5 rounded-l-2xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${parseFloat(tx.amount) < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-[#2E7D64]'}`}>
                                                            <TrendingUp size={14} className={parseFloat(tx.amount) < 0 ? 'rotate-180' : ''} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{new Date(tx.execution_date).toLocaleDateString()}</p>
                                                            <p className="text-[9px] text-[#5A6B7A] uppercase font-mono">{tx.id.split('-')[0]}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#5A6B7A] bg-white dark:bg-slate-800 px-3 py-1.5 rounded-full border border-[#E2E8F0] dark:border-[#2D3A4A]">
                                                        {tx.category.replace('_', ' ')}
                                                    </span>
                                                </td>
                                                {isTreasurer && !onlyMe && (
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden">
                                                                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${tx.user_username}`} alt="" />
                                                            </div>
                                                            <p className="text-xs font-bold text-[#1E2933] dark:text-[#E2E8F0]">{tx.user_full_name}</p>
                                                        </div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-5">
                                                    <p className="text-xs font-bold text-[#5A6B7A]">{tx.payment_method}</p>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <p className={`text-sm font-black ${parseFloat(tx.amount) < 0 ? 'text-red-500' : 'text-[#2E7D64]'}`}>
                                                        {parseFloat(tx.amount) < 0 ? 'KES −' : 'KES '}
                                                        {Math.abs(parseFloat(tx.amount)).toLocaleString()}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-5 rounded-r-2xl text-center">
                                                    <button 
                                                        onClick={() => setViewingReceipt({
                                                            amount: tx.amount,
                                                            category: tx.category,
                                                            member: tx.user_full_name || user?.full_name,
                                                            method: tx.payment_method,
                                                            date: new Date(tx.execution_date).toLocaleString(),
                                                            receiptNumber: tx.description.match(/\[Receipt: (.*?)\]/)?.[1] || (tx.payment_method === 'Cash' ? 'CASH-REF' : 'DIGITAL-TX')
                                                        })}
                                                        className="p-2 text-[#94A3B8] hover:text-[#2E7D64] hover:bg-white dark:hover:bg-slate-800 rounded-xl transition-all"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan={isTreasurer ? 6 : 5} className="py-20 text-center">
                                                    {loading ? (
                                                        <div className="flex flex-col items-center gap-4">
                                                            <div className="w-10 h-10 border-4 border-[#2E7D64] border-t-transparent rounded-full animate-spin"></div>
                                                            <p className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-[0.2em]">Synchronizing Ledger...</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                                            <Receipt size={48} className="text-[#5A6B7A]" />
                                                            <p className="text-sm font-bold text-[#5A6B7A]">No transactions found in this range.</p>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {total > limit && (
                                <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-6 pt-8 border-t border-[#E2E8F0] dark:border-[#2D3A4A]">
                                    <p className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-[0.2em]">
                                        Showing {page * limit + 1} — {Math.min((page + 1) * limit, total)} of {total} Records
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            disabled={page === 0}
                                            onClick={() => setPage(page - 1)}
                                            className="p-3 border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl text-[#5A6B7A] hover:border-[#2E7D64] hover:text-[#2E7D64] disabled:opacity-30 disabled:hover:border-[#E2E8F0] transition-all"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                                let pageNum = page;
                                                if (totalPages > 5) {
                                                    if (page < 3) pageNum = i;
                                                    else if (page > totalPages - 3) pageNum = totalPages - 5 + i;
                                                    else pageNum = page - 2 + i;
                                                } else {
                                                    pageNum = i;
                                                }
                                                return (
                                                    <button 
                                                        key={pageNum}
                                                        onClick={() => setPage(pageNum)}
                                                        className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                                                            page === pageNum 
                                                            ? 'bg-[#2E7D64] text-white shadow-lg shadow-[#2E7D64]/20' 
                                                            : 'bg-gray-50 dark:bg-[#0F1720] text-[#5A6B7A] hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-[#E2E8F0]'
                                                        }`}
                                                    >
                                                        {pageNum + 1}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button 
                                            disabled={page >= totalPages - 1}
                                            onClick={() => setPage(page + 1)}
                                            className="p-3 border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl text-[#5A6B7A] hover:border-[#2E7D64] hover:text-[#2E7D64] disabled:opacity-30 disabled:hover:border-[#E2E8F0] transition-all"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>

            {/* Receipt Modal */}
            {viewingReceipt && (
                <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1A2433] rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border-4 border-[#2E7D64] relative">
                        <button onClick={() => setViewingReceipt(null)} className="absolute top-8 right-8 p-2 text-[#5A6B7A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                            <X size={24} />
                        </button>

                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-green-50 dark:bg-green-900/10 text-[#2E7D64] rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Official Group Receipt</h2>
                            <p className="text-[10px] text-[#5A6B7A] mt-1 uppercase tracking-[0.3em] font-black">Wanguhu Estate Welfare Self Help Group</p>
                        </div>

                        {/* Receipt Body */}
                        <div className="bg-gray-50 dark:bg-[#0F1720] rounded-[2rem] p-8 border border-[#E2E8F0] dark:border-[#2D3A4A] relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-15deg] pointer-events-none">
                                <ShieldCheck size={240} />
                            </div>

                            <div className="space-y-5 relative z-10">
                                <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Member</span>
                                    <span className="text-sm font-black text-[#1E2933] dark:text-[#E2E8F0]">{viewingReceipt.member}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Value Received</span>
                                    <span className="text-xl font-black text-[#2E7D64]">KES {parseFloat(viewingReceipt.amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Allocation</span>
                                    <span className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{viewingReceipt.category.replace('_', ' ').toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Payment Ref</span>
                                    <span className="text-xs font-mono font-bold text-[#1E2933] dark:text-[#E2E8F0]">{viewingReceipt.method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Receipt No</span>
                                    <span className="text-xs font-mono font-black text-[#2E7D64]">{viewingReceipt.receiptNumber}</span>
                                </div>
                                <div className="flex justify-between mt-2 pt-2 text-[9px] text-[#5A6B7A] font-medium">
                                    <span>Issued: {viewingReceipt.date}</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Verified Ledger</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <button className="flex items-center justify-center gap-2 py-4 bg-[#1E2933] text-white rounded-2xl font-black text-sm hover:scale-105 transition-transform">
                                <Printer size={18} />
                                Print PDF
                            </button>
                            <button className="flex items-center justify-center gap-2 py-4 bg-[#2E7D64] text-white rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl">
                                <Download size={18} />
                                Save Copy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Transactions;
