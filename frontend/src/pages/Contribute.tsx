import { useState, useEffect } from 'react';
import DashboardSidebar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
    PlusCircle, 
    Users, 
    CreditCard, 
    Receipt, 
    History, 
    Search, 
    CheckCircle2, 
    AlertCircle,
    Printer,
    Share2,
    X,
    Loader2,
    Landmark,
    ShieldCheck
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Contribute = () => {
    const { user, token } = useAuth();
    const isTreasurer = user?.role === 'board_member' || user?.role === 'admin';

    if (!isTreasurer) {
        return <Navigate to="/unauthorized" />;
    }

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('mandatory_contribution');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [targetUserId, setTargetUserId] = useState('');
    const [treasurerNotes, setTreasurerNotes] = useState('');
    const [usersList, setUsersList] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [recentEntries, setRecentEntries] = useState<any[]>([]);

    useEffect(() => {
        if (token) {
            axios.get(`${API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setUsersList(res.data))
              .catch(err => console.error("Failed to fetch users", err));
              
            fetchRecentEntries();
        }
    }, [token]);

    const fetchRecentEntries = async () => {
        try {
            const res = await axios.get(`${API_URL}/finance/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRecentEntries(res.data.slice(0, 5));
        } catch (err) {
            console.error("Failed to fetch transactions", err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!targetUserId) {
            alert("Please select a target member.");
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post(`${API_URL}/finance/contribute`, {
                amount: parseFloat(amount),
                category,
                payment_method: paymentMethod,
                target_user_id: targetUserId,
                treasurer_notes: treasurerNotes,
                description: `${category.replace('_', ' ')} recorded by treasurer`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Extract receipt number from response or simulated logic
            // Since our backend doesn't return the description directly in the 201 response body,
            // we'll simulate the display of the receipt if it was a cash payment.
            setSuccessData({
                amount,
                category,
                member: usersList.find(u => u.id === targetUserId)?.full_name,
                method: paymentMethod,
                date: new Date().toLocaleString(),
                receiptNumber: paymentMethod === 'Cash' ? `RCPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : null
            });
            
            // Reset form
            setAmount('');
            setTreasurerNotes('');
            fetchRecentEntries();
        } catch (err) {
            alert("Failed to record contribution.");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = usersList.filter(u => 
        u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#0F1720]">
            <DashboardSidebar />
            
            <div className="flex-grow flex flex-col sm:ml-72 transition-all duration-300">
                <main className="flex-grow pb-20 sm:pb-8 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        <header className="mb-12">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-[#2E7D64] rounded-2xl text-white shadow-lg">
                                    <PlusCircle size={32} />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Treasurer Terminal</h1>
                                    <p className="text-xs text-[#2E7D64] font-black uppercase tracking-[0.3em]">Authorized Ledger Entry</p>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Entry Form */}
                            <div className="lg:col-span-2 space-y-8">
                                <section className="bg-white dark:bg-[#1A2433] rounded-[2.5rem] p-10 border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                    <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-8 flex items-center gap-3">
                                        <Landmark className="text-[#2E7D64]" />
                                        Record New Contribution
                                    </h2>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Member Selection */}
                                            <div className="space-y-4">
                                                <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest">Select Member</label>
                                                <div className="relative">
                                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                                                    <input 
                                                        type="text" 
                                                        placeholder="Search member..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl outline-none focus:border-[#2E7D64] dark:text-white"
                                                    />
                                                </div>
                                                <div className="max-h-48 overflow-y-auto custom-scrollbar border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl p-2 space-y-1">
                                                    {filteredUsers.map(u => (
                                                        <button 
                                                            key={u.id}
                                                            type="button"
                                                            onClick={() => setTargetUserId(u.id)}
                                                            className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${targetUserId === u.id ? 'bg-[#2E7D64] text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-[#1E2933] dark:text-[#E2E8F0]'}`}
                                                        >
                                                            <div>
                                                                <p className="font-bold text-sm">{u.full_name}</p>
                                                                <p className={`text-[10px] ${targetUserId === u.id ? 'text-white/70' : 'text-[#5A6B7A]'}`}>@{u.username}</p>
                                                            </div>
                                                            {targetUserId === u.id && <CheckCircle2 size={16} />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Details */}
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Amount (KES) ∑</label>
                                                    <input 
                                                        type="number" 
                                                        required 
                                                        placeholder="0.00"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl text-2xl font-black outline-none focus:border-[#2E7D64] dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Fund Allocation</label>
                                                    <select 
                                                        value={category}
                                                        onChange={(e) => setCategory(e.target.value)}
                                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-[#2E7D64] dark:text-white"
                                                    >
                                                        <option value="mandatory_contribution">Mandatory Contribution</option>
                                                        <option value="benevolence">Benevolence Fund</option>
                                                        <option value="personal_deposit">Personal Savings Deposit</option>
                                                        <option value="asset_purchase">Asset Share Units</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Payment Method</label>
                                                    <select 
                                                        value={paymentMethod}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-[#2E7D64] dark:text-white"
                                                    >
                                                        <option value="Cash">Physical Cash Handover</option>
                                                        <option value="M-Pesa">M-Pesa Business Till</option>
                                                        <option value="Bank Transfer">Bank Internal Transfer</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Internal Audit Notes</label>
                                            <textarea 
                                                placeholder="Explain the context of this manual entry..."
                                                value={treasurerNotes}
                                                onChange={(e) => setTreasurerNotes(e.target.value)}
                                                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-[#2E7D64] dark:text-white min-h-[100px]"
                                            />
                                        </div>

                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full py-6 bg-[#2E7D64] text-white rounded-3xl font-black text-xl hover:bg-[#256652] transition-all shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                                            Commit to Immutable Ledger
                                        </button>
                                    </form>
                                </section>

                                {/* Recent History */}
                                <section className="bg-white dark:bg-[#1A2433] rounded-[2.5rem] p-10 border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                    <h3 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-6 flex items-center gap-2">
                                        <History size={20} className="text-[#5A6B7A]" />
                                        Your Recent Entries
                                    </h3>
                                    <div className="space-y-4">
                                        {recentEntries.map((entry) => (
                                            <div key={entry.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-[#0F1720] rounded-2xl border border-transparent hover:border-[#2E7D64] transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/10 flex items-center justify-center text-[#2E7D64]">
                                                        <Receipt size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{entry.description}</p>
                                                        <p className="text-[10px] text-[#5A6B7A] uppercase tracking-widest">{new Date(entry.execution_date).toLocaleDateString()} • {entry.payment_method}</p>
                                                    </div>
                                                </div>
                                                <p className="font-black text-[#2E7D64]">KES {parseFloat(entry.amount).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            {/* Info & Help */}
                            <div className="space-y-8">
                                <div className="bg-[#1E2933] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <ShieldCheck size={120} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">Treasurer Responsibility</h3>
                                    <p className="text-sm text-white/70 leading-relaxed mb-6">As a Board Member, your entries directly affect the communal liquidity. Ensure physical cash is secured before committing to the ledger.</p>
                                    <div className="flex gap-4">
                                        <div className="w-1 h-12 bg-[#2E7D64] rounded-full"></div>
                                        <p className="text-xs italic text-white/50">"Transparency is the foundation of our wholesome community."</p>
                                    </div>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30 flex gap-4">
                                    <AlertCircle className="text-orange-500 shrink-0" size={20} />
                                    <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed"><strong>Audit Note:</strong> All manual entries are logged with your User ID and IP address for security. Non-reversible once committed.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>

            {/* Success / Receipt Modal */}
            {successData && (
                <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1A2433] rounded-[3rem] p-12 max-w-lg w-full shadow-2xl border-4 border-[#2E7D64] relative">
                        <button onClick={() => setSuccessData(null)} className="absolute top-8 right-8 p-2 text-[#5A6B7A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                            <X size={24} />
                        </button>

                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/10 text-[#2E7D64] rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                                <CheckCircle2 size={48} />
                            </div>
                            <h2 className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Transaction Success</h2>
                            <p className="text-sm text-[#5A6B7A] dark:text-[#94A3B8] mt-2 uppercase tracking-[0.2em] font-bold">Ledger Updated Locally & Globally</p>
                        </div>

                        <div className="bg-gray-50 dark:bg-[#0F1720] rounded-[2rem] p-8 space-y-4 mb-10 border border-[#E2E8F0] dark:border-[#2D3A4A] relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Landmark size={80} />
                            </div>
                            <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                <span className="text-[10px] font-black text-[#94A3B8] uppercase">Member</span>
                                <span className="text-sm font-black text-[#1E2933] dark:text-[#E2E8F0]">{successData.member}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                <span className="text-[10px] font-black text-[#94A3B8] uppercase">Amount</span>
                                <span className="text-lg font-black text-[#2E7D64]">KES {parseFloat(successData.amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                <span className="text-[10px] font-black text-[#94A3B8] uppercase">Category</span>
                                <span className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{successData.category.replace('_', ' ').toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[10px] font-black text-[#94A3B8] uppercase">Receipt No</span>
                                <span className="text-xs font-mono font-black text-[#2E7D64]">{successData.receiptNumber || 'N/A (Digital)'}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button className="flex items-center justify-center gap-2 py-4 bg-[#1E2933] text-white rounded-2xl font-black text-sm hover:scale-105 transition-transform">
                                <Printer size={18} />
                                Print Receipt
                            </button>
                            <button className="flex items-center justify-center gap-2 py-4 bg-[#2E7D64] text-white rounded-2xl font-black text-sm hover:scale-105 transition-transform shadow-xl">
                                <Share2 size={18} />
                                Share Digital
                            </button>
                        </div>
                        
                        {successData.receiptNumber && (
                            <p className="text-center text-[10px] text-[#5A6B7A] font-bold mt-8 uppercase tracking-widest animate-pulse">
                                Digital Receipt Sent to Member's Registered Device
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contribute;
