import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "../components/Navbar";
import Footer from "../components/Footer";
import MinutesRegistry from "../components/MinutesRegistry";
import TransactionGraph from "../components/TransactionGraph";
import { Camera, Eye, EyeOff, Package, TrendingUp, ShieldCheck, Receipt, Building2, Plus, X, CreditCard } from "lucide-react";
import { useOnlineStatus, useOfflineSync } from "../context/SyncContext";
import axios from 'axios';

function Dashboard() {
    const { user, token, updateProfilePicture, setUser } = useAuth();
    const isOnline = useOnlineStatus();
    const { addToQueue } = useOfflineSync();
    
    const [showSensitives, setShowSensitives] = useState(false);
    const [selectedPool, setSelectedPool] = useState('Personal Balance');
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showContributeModal, setShowContributeModal] = useState(false);
    
    const [liveData, setLiveData] = useState<{
        transactions: any[],
        assets: any[],
        pools: any[] | null,
        stats: { mandatory_total: number, benevolence_total: number },
        historical: any[]
    } | null>(null);

    // Camera Refs
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const fetchDashboardData = async () => {
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:5555/api/finance/dashboard', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLiveData(response.data);
            
            // Also refresh current user data (for balance)
            const userResponse = await axios.get('http://localhost:5555/api/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(userResponse.data);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [token]);

    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            alert("Camera access denied.");
            setIsCameraOpen(false);
        }
    };

    const captureImage = async () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL('image/png');
                await updateProfilePicture(dataUrl);
                stopCamera();
                setShowProfileModal(false);
            }
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsCameraOpen(false);
        }
    };

    const firstName = user?.full_name?.split(' ')[0] || 'Member';
    const isTreasurer = user?.role === 'board_member' || user?.role === 'admin';
    const isChairman = user?.title === 'Chairperson' || user?.role === 'admin';

    // Map historical data for the graph
    const getGraphData = () => {
        if (!liveData?.historical) return [];
        
        const categoryMap: { [key: string]: string } = {
            'Personal Balance': 'personal_deposit',
            'Mandatory Fund Contribution': 'mandatory_contribution',
            'Benevolence Fund': 'benevolence',
            'Asset Shares': 'asset_purchase'
        };

        const targetCategory = categoryMap[selectedPool];
        
        // Filter historical records for this category
        return liveData.historical
            .filter(h => h.category === targetCategory)
            .map(h => ({
                date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                amount: parseFloat(h.daily_total),
                type: h.category
            }));
    };

    const graphData = getGraphData();

    const transactions = liveData?.transactions || [];
    const assets = liveData?.assets || [];
    const pools = liveData?.pools || [];

    return (
        <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#0F1720]">
            <DashboardSidebar />
            
            <div className="flex-grow flex flex-col sm:ml-72 transition-all duration-300">
                <main className="flex-grow pb-20 sm:pb-8 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-[1600px] mx-auto">
                        {/* Header */}
                        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 bg-white dark:bg-[#1A2433] p-6 rounded-2xl border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                            <div className="flex items-center gap-5">
                                <div className="relative group cursor-pointer" onClick={() => setShowProfileModal(true)}>
                                    <div className="w-20 h-20 rounded-full border-4 border-[#2E7D64] overflow-hidden bg-gray-100 dark:bg-slate-800">
                                        <img src={user?.profile_picture_url || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user?.username}`} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">Hello, {firstName}!</h1>
                                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] font-medium flex items-center gap-2 text-sm">
                                        {user?.title || 'Member'} • {user?.role.replace('_', ' ')}
                                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                                <button className="flex-1 sm:flex-none px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                    <Package size={18} />
                                    Post Product
                                </button>
                                <button onClick={() => setShowContributeModal(true)} className="flex-1 sm:flex-none px-6 py-2.5 bg-[#2E7D64] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#256652] transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                    <Plus size={18} />
                                    Quick Contribute
                                </button>
                                <button onClick={() => setShowSensitives(!showSensitives)} className="p-2.5 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                                    {showSensitives ? <EyeOff size={20} className="text-[#5A6B7A]" /> : <Eye size={20} className="text-[#5A6B7A]" />}
                                </button>
                            </div>
                        </header>

                        {/* Treasurer Global Oversight */}
                        {isTreasurer && (
                            <section className="mb-8 p-8 bg-white dark:bg-[#1A2433] border border-[#2E7D64] rounded-[2.5rem] shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
                                <div className="flex justify-between items-center mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-[#2E7D64] rounded-2xl text-white">
                                            <ShieldCheck size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Communal Treasury</h2>
                                            <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest">Real-time Global Liquidity Oversight</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-[#5A6B7A] font-black uppercase tracking-[0.2em] block mb-1">Consolidated Capital ∑</span>
                                        <span className="text-2xl font-black text-[#2E7D64] dark:text-[#3B8B76]">
                                            {showSensitives ? 'KES ••••••••' : `KES ${(pools.reduce((acc, p) => acc + parseFloat(p.balance), 0)).toLocaleString()}`}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {pools.map((pool, i) => (
                                        <div key={i} className="p-6 bg-[#F8F9FA] dark:bg-[#0F1720] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl group hover:border-[#2E7D64] transition-all">
                                            <p className="text-[11px] font-black text-[#475569] dark:text-[#94A3B8] uppercase tracking-widest mb-2">{pool.name} Pool ∑</p>
                                            <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">
                                                {showSensitives ? 'KES •••' : `KES ${parseFloat(pool.balance).toLocaleString()}`}
                                            </p>
                                            <div className="mt-4 h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full bg-[#2E7D64]`} style={{ width: '50%' }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: 'Personal Balance ∑', value: `KES ${user?.personal_balance?.toLocaleString() || '0'}`, trend: 'Δ ± 0.0%', color: 'blue' },
                                { label: 'Mandatory Contribution Fund ∑', value: `KES ${parseFloat(liveData?.stats?.mandatory_total as any || 0).toLocaleString()}`, trend: 'Δ Live', color: 'green' },
                                { label: 'Benevolence Fund ∑', value: `KES ${parseFloat(liveData?.stats?.benevolence_total as any || 0).toLocaleString()}`, trend: 'Δ Live', color: 'orange' },
                                { label: 'Asset Shares ∑', value: `${assets.length} Assets`, trend: `Δ ${assets.filter(a => a.is_communal).length} Communal`, color: 'purple' },
                            ].map((stat, i) => {
                                const colorMap: { [key: string]: string } = {
                                    blue: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
                                    green: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
                                    orange: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20',
                                    purple: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                                };
                                return (
                                    <div 
                                        key={i} 
                                        onClick={() => setSelectedPool(stat.label.replace(' ∑', ''))}
                                        className={`p-8 rounded-[2.5rem] border transition-all cursor-pointer group shadow-sm hover:shadow-xl ${
                                            selectedPool === stat.label.replace(' ∑', '') 
                                            ? 'bg-white dark:bg-[#1A2433] border-[#2E7D64] ring-4 ring-[#2E7D64]/5' 
                                            : 'bg-white dark:bg-[#1A2433] border-[#E2E8F0] dark:border-[#2D3A4A]'
                                        }`}
                                    >
                                        <p className="text-[11px] font-black text-[#475569] dark:text-[#94A3B8] uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                                        <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-3">
                                            {showSensitives ? '••••••••' : stat.value}
                                        </p>
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${colorMap[stat.color]}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
                            <div className="lg:col-span-3 bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-[2.5rem] p-10 shadow-sm">
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center justify-center text-blue-500">
                                            <TrendingUp size={28} />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Fund Monitoring</h2>
                                            <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest">Growth Analytics & History: {selectedPool}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-[#94A3B8] uppercase">∑ Total</span>
                                        <select 
                                            value={selectedPool}
                                            onChange={(e) => setSelectedPool(e.target.value)}
                                            className="text-[10px] bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl px-4 py-2 outline-none font-black text-[#5A6B7A] uppercase tracking-widest"
                                        >
                                            <option value="Personal Balance">Personal Balance</option>
                                            <option value="Mandatory Contribution Fund">Mandatory Fund</option>
                                            <option value="Benevolence Fund">Benevolence Pool</option>
                                            <option value="Asset Shares">Asset Units</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="h-[400px]">
                                    <TransactionGraph data={graphData.length > 0 ? graphData : []} />
                                    {graphData.length === 0 && <p className="text-center text-[#5A6B7A] text-sm mt-10 italic">No historical data available for this category in the last 30 days.</p>}
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <MinutesRegistry />
                            </div>
                        </div>

                        {/* Live Data Sections */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Transactions Table */}
                            <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-[2.5rem] p-8 shadow-sm">
                                <h2 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-6 flex items-center gap-2">
                                    <Receipt size={20} className="text-[#2E7D64]" />
                                    Recent Transactions
                                </h2>
                                <div className="space-y-4">
                                    {transactions.length > 0 ? transactions.map((tx: any) => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0F1720] rounded-2xl border border-transparent hover:border-[#2E7D64] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${parseFloat(tx.amount) < 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-[#2E7D64]'}`}>
                                                    <TrendingUp size={18} className={parseFloat(tx.amount) < 0 ? 'rotate-180' : ''} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{tx.type.replace('_', ' ').toUpperCase()}</p>
                                                    <p className="text-[10px] text-[#5A6B7A]">{new Date(tx.date).toLocaleDateString()} • {tx.status}</p>
                                                </div>
                                            </div>
                                            <p className={`font-black ${parseFloat(tx.amount) < 0 ? 'text-red-500' : 'text-[#2E7D64]'}`}>
                                                {showSensitives ? 'KES •••' : `${parseFloat(tx.amount) < 0 ? 'KES −' : 'KES '}${Math.abs(parseFloat(tx.amount)).toLocaleString()}`}
                                            </p>
                                        </div>
                                    )) : (
                                        <p className="text-center text-[#5A6B7A] text-sm py-10">No recent transactions found.</p>
                                    )}
                                </div>
                            </div>

                            {/* Assets Portfolio */}
                            <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-[2.5rem] p-8 shadow-sm">
                                <h2 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-6 flex items-center gap-2">
                                    <Building2 size={20} className="text-purple-500" />
                                    Asset Portfolio
                                </h2>
                                <div className="space-y-4">
                                    {assets.length > 0 ? assets.map((asset: any) => (
                                        <div key={asset.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0F1720] rounded-2xl border border-transparent hover:border-purple-200 transition-all">
                                            <div>
                                                <p className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{asset.name}</p>
                                                <p className="text-[10px] text-[#5A6B7A]">{asset.is_communal ? 'Communal Asset' : 'Personal Asset'} • {asset.type}</p>
                                            </div>
                                            <p className="font-black text-purple-500">
                                                {showSensitives ? 'KES •••' : `KES ${parseFloat(asset.value).toLocaleString()}`}
                                            </p>
                                        </div>
                                    )) : (
                                        <p className="text-center text-[#5A6B7A] text-sm py-10">No assets listed.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>

            {/* Quick Contribute Modal */}
            {showContributeModal && (
                <QuickContributeModal 
                    onClose={() => setShowContributeModal(false)} 
                    onSuccess={() => {
                        setShowContributeModal(false);
                        fetchDashboardData();
                    }}
                    token={token}
                />
            )}

            {/* Profile Picture Modal (Re-implemented carefully) */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1A2433] rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative">
                        <button onClick={() => setShowProfileModal(false)} className="absolute top-6 right-6 p-2 text-[#5A6B7A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-2">Member Biometrics</h2>
                        <p className="text-sm text-[#5A6B7A] mb-8">Update your identity profile photo using your device camera.</p>
                        
                        <div className="space-y-4">
                            <button onClick={startCamera} className="w-full py-4 bg-[#2E7D64] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#256652] transition-all shadow-lg">
                                <Camera size={20} />
                                Open Device Camera
                            </button>
                            <label className="w-full py-4 border-2 border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-black text-[#5A6B7A] flex items-center justify-center gap-3 hover:border-[#2E7D64] cursor-pointer transition-all">
                                <Plus size={20} />
                                Upload from Storage
                                <input type="file" className="hidden" onChange={async (e) => {
                                    if (e.target.files?.[0]) {
                                        await updateProfilePicture(e.target.files[0]);
                                        setShowProfileModal(false);
                                        fetchDashboardData();
                                    }
                                }} />
                            </label>
                        </div>
                    </div>
                </div>
            )}

            {isCameraOpen && (
                <div className="fixed inset-0 bg-black/90 z-[300] flex flex-col items-center justify-center p-4">
                    <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-[70vh] rounded-3xl border-4 border-[#2E7D64]" />
                    <canvas ref={canvasRef} className="hidden" />
                    <div className="flex gap-8 mt-10">
                        <button onClick={captureImage} className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-[#2E7D64] hover:scale-110 transition-transform shadow-2xl">
                            <Camera size={40} />
                        </button>
                        <button onClick={stopCamera} className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl">
                            <X size={40} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function QuickContributeModal({ onClose, onSuccess, token }: { onClose: () => void, onSuccess: () => void, token: string | null }) {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('mandatory_contribution');
    const [paymentMethod, setPaymentMethod] = useState('M-Pesa');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5555/api/finance/contribute', {
                amount: parseFloat(amount),
                category,
                payment_method: paymentMethod,
                description: `${category.replace('_', ' ')} via ${paymentMethod}`
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
        } catch (err) {
            alert("Failed to record contribution.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1A2433] rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl relative">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 text-[#5A6B7A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} />
                </button>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-[#2E7D64]">
                        <CreditCard size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Quick Contribution</h2>
                        <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest">Instant Ledger Entry</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-[0.2em] mb-2">Amount (KES) ∑</label>
                        <input 
                            type="number" 
                            required 
                            placeholder="0.00"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl text-2xl font-black outline-none focus:border-[#2E7D64] dark:text-[#E2E8F0]"
                        />
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-[0.2em] mb-2">Fund Allocation</label>
                        <select 
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-[#2E7D64] dark:text-[#E2E8F0]"
                        >
                            <option value="mandatory_contribution">Mandatory Contribution</option>
                            <option value="benevolence">Benevolence Fund</option>
                            <option value="personal_deposit">Personal Savings Deposit</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-[0.2em] mb-2">Payment Method</label>
                        <select 
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-[#2E7D64] dark:text-[#E2E8F0]"
                        >
                            <option value="M-Pesa">M-Pesa Community Pay</option>
                            <option value="Bank Transfer">Bank Transfer</option>
                            <option value="Cash">Cash (Physical Handover)</option>
                        </select>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-5 bg-[#2E7D64] text-white rounded-2xl font-black text-lg hover:bg-[#256652] transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : 'Confirm Contribution'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Dashboard;
