import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "../components/Navbar";
import Footer from "../components/Footer";
import Shield from "../components/Shield";
import MinutesRegistry from "../components/MinutesRegistry";
import TransactionGraph from "../components/TransactionGraph";
import ConsignProductModal from "../components/ConsignProductModal";
import { Camera, Eye, EyeOff, Upload, X, Package, CheckCircle, Clock, TrendingUp, ShieldCheck, Receipt, Building2 } from "lucide-react";
import { useOnlineStatus, useOfflineSync } from "../context/SyncContext";
import axios from 'axios';

function Dashboard() {
    const { user, token, updateProfilePicture } = useAuth();
    const isOnline = useOnlineStatus();
    const { addToQueue } = useOfflineSync();
    
    const [showSensitives, setShowSensitives] = useState(false);
    const [selectedPool, setSelectedPool] = useState('Personal Balance');
    const [showBenevolenceModal, setShowBenevolenceModal] = useState(false);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [showConsignModal, setShowConsignModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [myListings, setMyListings] = useState<any[]>([]);
    const [uptime, setUptime] = useState("00:00:00");

    // Camera Refs
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchMyListings = async () => {
        if (!token) return;
        try {
            const response = await axios.get('http://localhost:5555/api/marketplace/my-listings', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyListings(response.data);
        } catch (err) {
            console.error("Failed to fetch listings", err);
        }
    };

    useEffect(() => {
        fetchMyListings();
        if (user?.role === 'admin') {
            const startTime = Date.now() - Math.random() * 10000000;
            const interval = setInterval(() => {
                const diff = Date.now() - startTime;
                const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setUptime(`${hours}:${minutes}:${seconds}`);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [user, token]);

    const handleAction = (action: string, payload: any) => {
        if (!isOnline) {
            addToQueue(action, payload);
        } else {
            alert(`Live Action: ${action} submitted successfully.`);
        }
    };

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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            await updateProfilePicture(e.target.files[0]);
            setShowProfileModal(false);
        }
    };

    const firstName = user?.full_name?.split(' ')[0] || 'Member';
    const isTreasurer = user?.role === 'board_member' || user?.role === 'admin';
    const isChairman = user?.title === 'Chairperson' || user?.role === 'admin';

    // Simulated Financial Data
    const dummyGraphData = {
        'Personal Balance': Array.from({ length: 15 }, (_, i) => ({ date: `May ${i + 1}`, amount: Math.floor(Math.random() * 5000) + 1000, type: 'balance' })),
        'Mandatory Fund Contribution': Array.from({ length: 15 }, (_, i) => ({ date: `May ${i + 1}`, amount: 3000, type: 'mandatory' })),
        'Benevolence Fund': Array.from({ length: 15 }, (_, i) => ({ date: `May ${i + 1}`, amount: Math.floor(Math.random() * 500) + 50, type: 'benevolence' })),
        'Asset Shares': Array.from({ length: 15 }, (_, i) => ({ date: `May ${i + 1}`, amount: Math.floor(Math.random() * 100) + 10, type: 'assets' }))
    };

    const dummyAssets = [
        { id: 1, name: 'Sector A Land', share: '2.1%', value: 'KES 450,000' },
        { id: 2, name: 'Communal Tractor', share: '4.5%', value: 'KES 120,000' },
        { id: 3, name: 'Water Pump B', share: '10.0%', value: 'KES 25,000' }
    ];

    const dummyTransactions = [
        { id: 1, type: 'Contribution', amount: 'KES 3,000', date: 'May 10', status: 'Completed' },
        { id: 2, type: 'Withdrawal', amount: 'KES −1,500', date: 'May 08', status: 'Completed' },
        { id: 3, type: 'Mandatory Fee', amount: 'KES 1,000', date: 'May 01', status: 'Completed' }
    ];

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
                                        <img src={user?.profile_picture_url} alt="Profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Camera size={20} className="text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">Hello, {firstName}!</h1>
                                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] font-medium flex items-center gap-2">
                                        {user?.title} 
                                        <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                                <button onClick={() => setShowConsignModal(true)} className="flex-1 sm:flex-none px-6 py-2.5 bg-orange-500 text-white rounded-xl font-bold text-sm shadow-lg hover:bg-orange-600 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                    <Package size={18} />
                                    Post Product
                                </button>
                                <button onClick={() => setShowContributeModal(true)} className="flex-1 sm:flex-none px-6 py-2.5 bg-[#2E7D64] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#256652] transition-all transform hover:-translate-y-0.5">Quick Contribute</button>
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
                                            {showSensitives ? 'KES ••••••••' : 'KES 8,450,000.00'}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Benevolence Pool ∑', value: 'KES 245K', color: 'blue', width: '65%' },
                                        { label: 'Asset Growth ∑', value: 'KES 6.2M', color: 'orange', width: '82%' },
                                        { label: 'Operating Fund ∑', value: 'KES 2.0M', color: 'green', width: '45%' },
                                        { label: 'Pending Pledges ∑', value: 'KES 112K', color: 'purple', width: '30%' },
                                    ].map((box, i) => (
                                        <div key={i} className="p-6 bg-[#F8F9FA] dark:bg-[#0F1720] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl group hover:border-[#2E7D64] transition-all">
                                            <p className="text-[11px] font-black text-[#475569] dark:text-[#94A3B8] uppercase tracking-widest mb-2">{box.label}</p>
                                            <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">
                                                {showSensitives ? 'KES •••' : box.value}
                                            </p>
                                            <div className="mt-4 h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div className={`h-full w-[${box.width}] ${
                                                    box.color === 'blue' ? 'bg-blue-500' : 
                                                    box.color === 'orange' ? 'bg-orange-500' : 
                                                    box.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                                                }`}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Chairman Request Portal */}
                        {isChairman && (
                            <section className="mb-8 p-6 bg-white dark:bg-[#1A2433] border border-orange-400 rounded-2xl shadow-lg border-dashed">
                                <h2 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-6 italic flex items-center gap-2">
                                    <ShieldCheck className="text-orange-500" />
                                    Chairman's Review Desk
                                </h2>
                                <div className="space-y-4">
                                    <div className="p-4 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl bg-[#F8F9FA] dark:bg-[#0F1720]/50 flex justify-between items-center group hover:border-orange-200 transition-colors">
                                        <div>
                                            <p className="font-bold text-sm text-[#1E2933] dark:text-[#E2E8F0]">Proposal: Borehole Drilling B</p>
                                            <p className="text-xs text-[#5A6B7A]">High Priority • Pending Agenda Inclusion</p>
                                        </div>
                                        <button className="px-5 py-2 bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-orange-600 transition-all shadow-md">Approve to Agenda</button>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* Dashboard Content - Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[
                                { label: 'Personal Balance ∑', value: `KES ${user?.personal_balance?.toLocaleString() || '12,450'}`, trend: 'Δ ▲ +2.4%', color: 'blue' },
                                { label: 'Mandatory Contribution Fund ∑', value: 'KES 45,000', trend: 'Δ Stable', color: 'green' },
                                { label: 'Benevolence Fund ∑', value: 'KES 2,500', trend: 'Δ ▲ +5.2%', color: 'orange' },
                                { label: 'Asset Shares ∑', value: '1,240 Units', trend: 'Δ ▲ +12%', color: 'purple' },
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
                                    <TransactionGraph data={(dummyGraphData as any)[selectedPool]} />
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                <MinutesRegistry />
                            </div>
                        </div>

                        {/* New Data Sections: Assets & Transactions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Transactions Table */}
                            <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-[2.5rem] p-8">
                                <h2 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-6 flex items-center gap-2">
                                    <Receipt size={20} className="text-[#2E7D64]" />
                                    Recent Transactions
                                </h2>
                                <div className="space-y-4">
                                    {dummyTransactions.map(tx => (
                                        <div key={tx.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0F1720] rounded-2xl border border-transparent hover:border-[#2E7D64] transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tx.amount.includes('−') ? 'bg-red-50 text-red-500' : 'bg-green-50 text-[#2E7D64]'}`}>
                                                    <TrendingUp size={18} className={tx.amount.includes('−') ? 'rotate-180' : ''} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{tx.type}</p>
                                                    <p className="text-[10px] text-[#5A6B7A]">{tx.date} • {tx.status}</p>
                                                </div>
                                            </div>
                                            <p className={`font-black ${tx.amount.includes('−') ? 'text-red-500' : 'text-[#2E7D64]'}`}>
                                                {showSensitives ? 'KES •••' : tx.amount}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Assets Portfolio */}
                            <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-[2.5rem] p-8">
                                <h2 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-6 flex items-center gap-2">
                                    <Building2 size={20} className="text-purple-500" />
                                    Asset Portfolio
                                </h2>
                                <div className="space-y-4">
                                    {dummyAssets.map(asset => (
                                        <div key={asset.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0F1720] rounded-2xl border border-transparent hover:border-purple-200 transition-all">
                                            <div>
                                                <p className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{asset.name}</p>
                                                <p className="text-[10px] text-[#5A6B7A]">Community Stake: {asset.share}</p>
                                            </div>
                                            <p className="font-black text-purple-500">
                                                {showSensitives ? 'KES •••' : asset.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </div>
    );
}

export default Dashboard;
