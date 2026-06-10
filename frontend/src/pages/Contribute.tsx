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
    ShieldCheck,
    FileText,
    Download,
    Eye
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Contribute = () => {
    const { user, token } = useAuth();
    const isTreasurer = user?.role === 'board_member' || user?.role === 'admin';

    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('mandatory_contribution');
    const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
    const [targetUserId, setTargetUserId] = useState(user?.id || '');
    const [assetId, setAssetId] = useState('');
    const [assetsList, setAssetsList] = useState<any[]>([]);
    const [treasurerNotes, setTreasurerNotes] = useState('');
    const [usersList, setUsersList] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [successData, setSuccessData] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [viewingReceipt, setViewingReceipt] = useState<any>(null);

    useEffect(() => {
        if (token) {
            if (isTreasurer) {
                axios.get(`${API_URL}/users`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).then(res => setUsersList(res.data))
                  .catch(err => console.error("Failed to fetch users", err));
            }
            axios.get(`${API_URL}/assets`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setAssetsList(res.data))
              .catch(err => console.error("Failed to fetch assets", err));
            fetchTransactions();
        }
    }, [token, isTreasurer]);

    const fetchTransactions = async () => {
        try {
            const res = await axios.get(`${API_URL}/finance/transactions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTransactions(res.data);
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
                asset_id: assetId || null,
                treasurer_notes: treasurerNotes,
                description: `${category.replace('_', ' ')} recorded via Contribution Hub`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Extract info for the receipt
            const targetMember = isTreasurer 
                ? usersList.find(u => u.id === targetUserId)?.full_name 
                : user?.full_name;

            setSuccessData({
                amount,
                category,
                member: targetMember,
                method: paymentMethod,
                date: new Date().toLocaleString(),
                receiptNumber: paymentMethod === 'Cash' ? `RCPT-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : `MPESA-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
            });
            
            // Reset form
            setAmount('');
            setTreasurerNotes('');
            if (!isTreasurer) setTargetUserId(user?.id || '');
            fetchTransactions();
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
                                    <h1 className="text-4xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Contribution Hub</h1>
                                    <p className="text-xs text-[#2E7D64] font-black uppercase tracking-[0.3em]">
                                        {isTreasurer ? 'Authorized Ledger & Receipting Terminal' : 'Personal Contribution & Digital Receipting'}
                                    </p>
                                </div>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Entry Form */}
                            <div className="lg:col-span-2 space-y-8">
                                <section className="bg-white dark:bg-[#1A2433] rounded-[2.5rem] p-10 border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                    <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-8 flex items-center gap-3">
                                        <Landmark className="text-[#2E7D64]" />
                                        {isTreasurer ? 'Record Contribution for Member' : 'Make a Contribution'}
                                    </h2>
                                    
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {/* Member Selection / Info */}
                                            <div className="space-y-4">
                                                <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest">
                                                    {isTreasurer ? 'Select Member' : 'Member Identity'}
                                                </label>
                                                
                                                {isTreasurer ? (
                                                    <>
                                                        <div className="relative">
                                                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                                                            <input 
                                                                type="text" 
                                                                placeholder="Search name or @username..."
                                                                value={searchTerm}
                                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl outline-none focus:border-[#2E7D64] dark:text-white"
                                                            />
                                                        </div>
                                                        <div className="max-h-48 overflow-y-auto custom-scrollbar border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl p-2 space-y-1">
                                                            <button 
                                                                type="button"
                                                                onClick={() => setTargetUserId(user?.id || '')}
                                                                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between ${targetUserId === user?.id ? 'bg-[#2E7D64] text-white' : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-[#1E2933] dark:text-[#E2E8F0]'}`}
                                                            >
                                                                <div>
                                                                    <p className="font-bold text-sm">Myself ({user?.full_name})</p>
                                                                    <p className={`text-[10px] ${targetUserId === user?.id ? 'text-white/70' : 'text-[#5A6B7A]'}`}>Personal Contribution</p>
                                                                </div>
                                                                {targetUserId === user?.id && <CheckCircle2 size={16} />}
                                                            </button>
                                                            {filteredUsers.filter(u => u.id !== user?.id).map(u => (
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
                                                    </>
                                                ) : (
                                                    <div className="p-6 bg-[#F8F9FA] dark:bg-[#0F1720] rounded-2xl border-2 border-[#E2E8F0] dark:border-[#2D3A4A] flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full border-2 border-[#2E7D64] overflow-hidden">
                                                            <img src={user?.profile_picture_url} className="w-full h-full object-cover" />
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-[#1E2933] dark:text-[#E2E8F0]">{user?.full_name}</p>
                                                            <p className="text-[10px] text-[#5A6B7A] uppercase tracking-widest">{user?.username}</p>
                                                        </div>
                                                    </div>
                                                )}
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
                                                {category === 'asset_purchase' && (
                                                    <div>
                                                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Target Asset</label>
                                                        <select 
                                                            value={assetId}
                                                            onChange={(e) => setAssetId(e.target.value)}
                                                            className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-[#2E7D64] dark:text-white"
                                                            required
                                                        >
                                                            <option value="">Select an Asset...</option>
                                                            {assetsList.filter(a => a.is_communal).map(a => (
                                                                <option key={a.id} value={a.id}>{a.name} (Goal: KES {parseFloat(a.target_amount).toLocaleString()})</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                )}
                                                <div>
                                                    <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Payment Method</label>
                                                    <select 
                                                        value={paymentMethod}
                                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                                        className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-[#2E7D64] dark:text-white"
                                                    >
                                                        <option value="M-Pesa">M-Pesa Business Till</option>
                                                        <option value="Bank Transfer">Bank Internal Transfer</option>
                                                        {isTreasurer && <option value="Cash">Physical Cash (Receipt Issue)</option>}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {isTreasurer && targetUserId !== user?.id && (
                                            <div className="pt-4">
                                                <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Internal Audit Notes</label>
                                                <textarea 
                                                    placeholder="Explain the context of this manual entry (e.g. Received cash at Saturday meeting)..."
                                                    value={treasurerNotes}
                                                    onChange={(e) => setTreasurerNotes(e.target.value)}
                                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-[#2E7D64] dark:text-white min-h-[100px]"
                                                />
                                            </div>
                                        )}

                                        <button 
                                            type="submit" 
                                            disabled={loading}
                                            className="w-full py-6 bg-[#2E7D64] text-white rounded-3xl font-black text-xl hover:bg-[#256652] transition-all shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                                            {isTreasurer && targetUserId !== user?.id ? 'Authorize & Issue Receipt' : 'Commit Contribution'}
                                        </button>
                                    </form>
                                </section>

                                {/* Transaction Monitoring */}
                                <section className="bg-white dark:bg-[#1A2433] rounded-[2.5rem] p-10 border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <h3 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] flex items-center gap-2">
                                            <History size={20} className="text-[#5A6B7A]" />
                                            {isTreasurer ? 'Ledger Oversight' : 'Your Contribution History'}
                                        </h3>
                                        {isTreasurer && <span className="text-[10px] font-black text-[#2E7D64] uppercase tracking-widest px-3 py-1 bg-green-50 dark:bg-green-900/10 rounded-full border border-green-100 dark:border-green-900/20">All Member Records</span>}
                                    </div>
                                    <div className="space-y-4">
                                        {transactions.map((entry) => (
                                            <div key={entry.id} className="flex items-center justify-between p-5 bg-gray-50 dark:bg-[#0F1720] rounded-2xl border border-transparent hover:border-[#2E7D64] transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/10 flex items-center justify-center text-[#2E7D64]">
                                                        <Receipt size={18} />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">
                                                            {entry.category.replace('_', ' ').toUpperCase()} 
                                                            {isTreasurer && <span className="text-[10px] text-[#5A6B7A] font-medium ml-2">— {entry.user_full_name}</span>}
                                                        </p>
                                                        <p className="text-[10px] text-[#5A6B7A] uppercase tracking-widest">{new Date(entry.execution_date).toLocaleDateString()} • {entry.payment_method}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="font-black text-[#2E7D64]">KES {parseFloat(entry.amount).toLocaleString()}</p>
                                                    <button 
                                                        onClick={() => setViewingReceipt({
                                                            amount: entry.amount,
                                                            category: entry.category,
                                                            member: entry.user_full_name || user?.full_name,
                                                            method: entry.payment_method,
                                                            date: new Date(entry.execution_date).toLocaleString(),
                                                            receiptNumber: entry.description.match(/\[Receipt: (.*?)\]/)?.[1] || (entry.payment_method === 'Cash' ? 'CASH-REF' : 'DIGITAL-TX')
                                                        })}
                                                        className="p-2 text-[#5A6B7A] hover:text-[#2E7D64] hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors"
                                                        title="View/Print Receipt"
                                                    >
                                                        <FileText size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                        {transactions.length === 0 && <p className="text-center text-[#5A6B7A] text-sm py-10 italic">No entries found in the ledger.</p>}
                                    </div>
                                </section>
                            </div>

                            {/* Info & Rules */}
                            <div className="space-y-8">
                                <div className="bg-[#1E2933] text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <ShieldCheck size={120} />
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{isTreasurer ? 'Treasurer Mandate' : 'Wholesome Giving'}</h3>
                                    <p className="text-sm text-white/70 leading-relaxed mb-6">
                                        {isTreasurer 
                                            ? 'As a Board Member, your manual ledger entries are legally binding. Ensure physical cash is verified before issuance of a digital receipt.' 
                                            : 'Your contributions fuel the communal progress. All funds are held in transparent, multi-signature pools for collective security.'}
                                    </p>
                                    <div className="flex gap-4">
                                        <div className="w-1 h-12 bg-[#2E7D64] rounded-full"></div>
                                        <p className="text-xs italic text-white/50">"Building a legacy through transparent financial unity."</p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                    <h4 className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-6">Fund Guidelines</h4>
                                    <ul className="space-y-4">
                                        <li className="flex gap-3 text-xs text-[#1E2933] dark:text-[#E2E8F0] font-bold">
                                            <CheckCircle2 size={16} className="text-[#2E7D64] shrink-0" />
                                            Mandatory: KES 1,000 monthly
                                        </li>
                                        <li className="flex gap-3 text-xs text-[#1E2933] dark:text-[#E2E8F0] font-bold">
                                            <CheckCircle2 size={16} className="text-[#2E7D64] shrink-0" />
                                            Benevolence: Voluntary contribution
                                        </li>
                                        <li className="flex gap-3 text-xs text-[#1E2933] dark:text-[#E2E8F0] font-bold">
                                            <CheckCircle2 size={16} className="text-[#2E7D64] shrink-0" />
                                            Receipts: Issued instantly
                                        </li>
                                    </ul>
                                </div>

                                <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-3xl border border-orange-100 dark:border-orange-900/30 flex gap-4">
                                    <AlertCircle className="text-orange-500 shrink-0" size={20} />
                                    <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
                                        <strong>{isTreasurer ? 'Audit Alert:' : 'Note:'}</strong> 
                                        {isTreasurer 
                                            ? 'All manual entries are logged with your unique Treasurer ID for forensic transparency.' 
                                            : 'Bank transfers may take up to 24 hours to reflect in your personal dashboard.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>

            {/* Receipt Modal (Shared for success and history viewing) */}
            {(successData || viewingReceipt) && (
                <div className="fixed inset-0 bg-black/90 z-[300] flex items-center justify-center p-4 backdrop-blur-xl animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-[#1A2433] rounded-[3rem] p-10 max-w-lg w-full shadow-2xl border-4 border-[#2E7D64] relative">
                        <button onClick={() => { setSuccessData(null); setViewingReceipt(null); }} className="absolute top-8 right-8 p-2 text-[#5A6B7A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
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
                            {/* Watermark */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] rotate-[-15deg] pointer-events-none">
                                <ShieldCheck size={240} />
                            </div>

                            <div className="space-y-5 relative z-10">
                                <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Member</span>
                                    <span className="text-sm font-black text-[#1E2933] dark:text-[#E2E8F0]">{(successData || viewingReceipt).member}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Value Received</span>
                                    <span className="text-xl font-black text-[#2E7D64]">KES {parseFloat((successData || viewingReceipt).amount).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Allocation</span>
                                    <span className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{(successData || viewingReceipt).category.replace('_', ' ').toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between border-b border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] pb-3">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Payment Ref</span>
                                    <span className="text-xs font-mono font-bold text-[#1E2933] dark:text-[#E2E8F0]">{(successData || viewingReceipt).method}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[10px] font-black text-[#94A3B8] uppercase">Receipt No</span>
                                    <span className="text-xs font-mono font-black text-[#2E7D64]">{(successData || viewingReceipt).receiptNumber}</span>
                                </div>
                                <div className="flex justify-between mt-2 pt-2 text-[9px] text-[#5A6B7A] font-medium">
                                    <span>Issued: {(successData || viewingReceipt).date}</span>
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
                        
                        <p className="text-center text-[9px] text-[#5A6B7A] font-bold mt-8 uppercase tracking-widest opacity-50">
                            This is a digitally generated document. No physical signature required.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contribute;
