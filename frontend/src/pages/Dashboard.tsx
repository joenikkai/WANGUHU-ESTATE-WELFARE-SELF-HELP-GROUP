import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import DashboardSidebar from "../components/Navbar";
import Footer from "../components/Footer";
import Shield from "../components/Shield";
import MinutesRegistry from "../components/MinutesRegistry";
import TransactionGraph from "../components/TransactionGraph";
import ConsignProductModal from "../components/ConsignProductModal";
import { Camera, Eye, EyeOff, Upload, X, Package, CheckCircle, Clock, TrendingUp, ShieldCheck } from "lucide-react";
import { useOnlineStatus, useOfflineSync } from "../context/SyncContext";
import axios from 'axios';

function Dashboard() {
    const { user, token, updateProfilePicture } = useAuth();
    const isOnline = useOnlineStatus();
    const { addToQueue } = useOfflineSync();
    
    const [showSensitives, setShowSensitives] = useState(false);
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

    // Simulated Graph Data
    const dummyGraphData = Array.from({ length: 15 }, (_, i) => ({
        date: `May ${i + 1}`,
        amount: Math.floor(Math.random() * 10000) + 1000,
        type: 'contribution'
    }));

    return (
        <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#0F1720]">
            <DashboardSidebar />
            
            <main className="flex-grow sm:ml-72 pb-20 sm:pb-8 p-4 sm:p-6 lg:p-8 transition-all duration-300">
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
                                    <span className="text-[10px] text-[#5A6B7A] font-black uppercase tracking-[0.2em] block mb-1">Consolidated Capital</span>
                                    <span className="text-2xl font-black text-[#2E7D64] dark:text-[#3B8B76]">KES 8,450,000.00</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="p-6 bg-[#F8F9FA] dark:bg-[#0F1720] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl group hover:border-[#2E7D64] transition-all">
                                    <p className="text-[10px] text-[#5A6B7A] font-black uppercase tracking-widest mb-2">Benevolence Pool</p>
                                    <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">KES 245K</p>
                                    <div className="mt-4 h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500 w-[65%]"></div>
                                    </div>
                                </div>
                                <div className="p-6 bg-[#F8F9FA] dark:bg-[#0F1720] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl group hover:border-[#2E7D64] transition-all">
                                    <p className="text-[10px] text-[#5A6B7A] font-black uppercase tracking-widest mb-2">Asset Growth</p>
                                    <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">KES 6.2M</p>
                                    <div className="mt-4 h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 w-[82%]"></div>
                                    </div>
                                </div>
                                <div className="p-6 bg-[#F8F9FA] dark:bg-[#0F1720] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl group hover:border-[#2E7D64] transition-all">
                                    <p className="text-[10px] text-[#5A6B7A] font-black uppercase tracking-widest mb-2">Operating Fund</p>
                                    <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">KES 2.0M</p>
                                    <div className="mt-4 h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[45%]"></div>
                                    </div>
                                </div>
                                <div className="p-6 bg-[#F8F9FA] dark:bg-[#0F1720] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl group hover:border-[#2E7D64] transition-all">
                                    <p className="text-[10px] text-[#5A6B7A] font-black uppercase tracking-widest mb-2">Pending Pledges</p>
                                    <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">KES 112K</p>
                                    <div className="mt-4 h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-purple-500 w-[30%]"></div>
                                    </div>
                                </div>
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
                            { label: 'Personal Balance', value: `KES ${user?.personal_balance?.toLocaleString()}`, trend: '+2.4%', color: 'blue' },
                            { label: 'Mandatory Savings', value: 'KES 45,000', trend: 'On Track', color: 'green' },
                            { label: 'Benevolence Fund', value: 'KES 2,500', trend: 'Active', color: 'orange' },
                            { label: 'Asset Shares', value: '1,240 Units', trend: '+12%', color: 'purple' },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm hover:shadow-xl transition-all">
                                <p className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-[0.2em] mb-3">{stat.label}</p>
                                <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-2">{showSensitives ? stat.value : '••••••••'}</p>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded-full bg-opacity-10 uppercase tracking-widest bg-current text-${stat.color}-500`}>{stat.trend}</span>
                            </div>
                        ))}
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
                                        <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest">Growth Analytics & History</p>
                                    </div>
                                </div>
                                <select className="text-[10px] bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl px-4 py-2 outline-none font-black text-[#5A6B7A] uppercase tracking-widest">
                                    <option>Private Balance</option>
                                    <option>Benevolence Pool</option>
                                </select>
                            </div>
                            <div className="h-[400px]">
                                <TransactionGraph data={dummyGraphData} />
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <MinutesRegistry />
                        </div>
                    </div>

                    {/* My Market Listings */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">My Market Consignments</h2>
                            <button onClick={fetchMyListings} className="text-xs font-bold text-[#2E7D64] uppercase tracking-widest hover:underline">Refresh</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myListings.length > 0 ? myListings.map((listing) => (
                                <div key={listing.id} className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl p-6 shadow-sm group">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-bold text-[#1E2933] dark:text-[#E2E8F0] group-hover:text-[#2E7D64] transition-colors">{listing.product_name}</h3>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                            listing.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                            {listing.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#94A3B8]">Quantity:</span>
                                            <span className="font-bold dark:text-[#E2E8F0]">{listing.quantity} {listing.unit}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-[#94A3B8]">Price:</span>
                                            <span className="font-bold text-[#2E7D64]">KES {listing.price_per_unit} / {listing.unit}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-[#5A6B7A]">
                                        {listing.warehouse_status ? (
                                            <><CheckCircle size={14} className="text-green-500" /> In Warehouse</>
                                        ) : (
                                            <><Clock size={14} className="text-orange-500" /> Pending Delivery</>
                                        )}
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-12 text-center border-2 border-dashed border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl">
                                    <Package size={48} className="mx-auto text-[#94A3B8] mb-4 opacity-20" />
                                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] font-bold italic">No active consignments.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">Member Welfare</h2>
                            <p className="text-sm text-[#5A6B7A] mb-6 leading-relaxed italic">"Supporting each other in times of need."</p>
                            <button 
                                onClick={() => setShowBenevolenceModal(true)}
                                className="w-full py-4 border-2 border-dashed border-[#2E7D64] text-[#2E7D64] rounded-2xl font-bold hover:bg-[#2E7D64] hover:text-white transition-all flex items-center justify-center gap-3"
                            >
                                Call for Benevolence
                            </button>
                        </div>
                        <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl p-6 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">Group Assets</h2>
                                <p className="text-sm text-[#5A6B7A] mb-4">You own 4.5% of the communal tractor and 2.1% of Sector A land.</p>
                            </div>
                            <button className="w-full py-3 bg-[#1E2933] dark:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-xl">Manage Asset Portfolio</button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Profile Picture Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100] backdrop-blur-md">
                    <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl p-8 max-w-md w-full shadow-2xl relative">
                        <button onClick={() => { stopCamera(); setShowProfileModal(false); }} className="absolute top-4 right-4 p-2 text-[#5A6B7A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                            <X size={24} />
                        </button>
                        <h2 className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-6">Update Profile Identity</h2>
                        
                        {!isCameraOpen ? (
                            <div className="space-y-4">
                                <button 
                                    onClick={startCamera}
                                    className="w-full py-6 border-2 border-dashed border-[#2E7D64] text-[#2E7D64] rounded-2xl flex flex-col items-center gap-3 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all"
                                >
                                    <Camera size={32} />
                                    <span className="font-bold">Use Real-time Camera</span>
                                </button>
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t"></span></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#1A2433] px-2 text-[#5A6B7A]">Or</span></div>
                                </div>
                                <button 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-4 bg-gray-100 dark:bg-slate-800 text-[#1E2933] dark:text-[#E2E8F0] rounded-2xl flex items-center justify-center gap-3 font-bold"
                                >
                                    <Upload size={20} />
                                    Upload from Device
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <video ref={videoRef} autoPlay playsInline className="w-full rounded-2xl border-2 border-[#2E7D64] mb-6" />
                                <canvas ref={canvasRef} className="hidden" />
                                <div className="flex gap-4">
                                    <button onClick={captureImage} className="px-8 py-3 bg-[#2E7D64] text-white rounded-xl font-bold shadow-xl">Capture</button>
                                    <button onClick={stopCamera} className="px-8 py-3 bg-red-500 text-white rounded-xl font-bold shadow-xl">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Consign Product Modal */}
            {showConsignModal && (
                <ConsignProductModal 
                    onClose={() => setShowConsignModal(false)} 
                    onSuccess={() => {
                        setShowConsignModal(false);
                        fetchMyListings();
                    }} 
                />
            )}

            <Footer />
        </div>
    );
}

export default Dashboard;
