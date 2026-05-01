import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Shield from "../components/Shield";
import eyeIcon from "../assets/eye-svgrepo-com.svg";
import eyeOffIcon from "../assets/eye-off-svgrepo-com.svg";
import { useOnlineStatus, useOfflineSync } from "../context/SyncContext";

function Dashboard() {
    const { user, logout } = useAuth();
    const isOnline = useOnlineStatus();
    const { addToQueue } = useOfflineSync();
    
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSensitives, setShowSensitives] = useState(false);
    const [uptime, setUptime] = useState("00:00:00");

    useEffect(() => {
        if (user?.role === 'admin') {
            const startTime = Date.now() - Math.random() * 10000000; // Simulated start time
            const interval = setInterval(() => {
                const diff = Date.now() - startTime;
                const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
                const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
                const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
                setUptime(`${hours}:${minutes}:${seconds}`);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const handleAction = (action: string, payload: any) => {
        if (!isOnline) {
            addToQueue(action, payload);
        } else {
            alert(`Live Action: ${action} submitted successfully.`);
        }
    };

    const canSell = user?.role !== 'guest';
    const isBoard = user?.role === 'board_member' || user?.role === 'admin';
    const firstName = user?.full_name?.split(' ')[0] || 'Member';

    const maskData = (data: string | undefined) => {
        if (!data) return "N/A";
        if (showSensitives) return data;
        return "•".repeat(data.length > 8 ? 8 : data.length);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F1720]">
            <div className="flex-grow p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 shrink-0">
                                <Shield />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">Hello, {firstName}!</h1>
                                <p className="text-[#5A6B7A] dark:text-[#94A3B8] font-medium">{user?.title}</p>
                            </div>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => setShowSensitives(!showSensitives)}
                                className="flex-1 sm:flex-none px-4 py-2 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm"
                            >
                                <img src={showSensitives ? eyeOffIcon : eyeIcon} className="w-4 h-4 dark:invert opacity-70" alt="toggle" />
                                {showSensitives ? "Hide Private Info" : "View Private Info"}
                            </button>
                            <button
                                onClick={logout}
                                className="flex-1 sm:flex-none px-6 py-2 bg-[#C73E2D] text-white rounded-md hover:bg-red-700 transition-colors font-semibold"
                            >
                                Logout
                            </button>
                        </div>
                    </header>

                    {/* Admin Server Panel */}
                    {user?.role === 'admin' && (
                        <section className="mb-8 p-6 bg-[#1E2933] text-white rounded-xl border border-blue-500/30 shadow-2xl">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                    System Status & Server Logs
                                </h2>
                                <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">UPTIME: {uptime}</span>
                            </div>
                            <div className="bg-black/40 rounded-lg p-4 font-mono text-sm h-32 overflow-y-auto space-y-1">
                                <p className="text-green-400">[OK] DB Pool initialized (8ms)</p>
                                <p className="text-blue-400">[INFO] JWT Verification Active</p>
                                <p className="text-yellow-400">[WARN] Idle client connection timed out</p>
                                <p className="text-green-400">[OK] Auth middleware ready</p>
                                <p className="text-gray-400"># Listening on port 5555...</p>
                            </div>
                        </section>
                    )}

                    {/* Profile & Info Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                        <div className="lg:col-span-2 bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-6">Identity Verification</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                                <div>
                                    <p className="text-xs text-[#5A6B7A] dark:text-[#94A3B8] uppercase font-bold tracking-widest mb-1">National ID</p>
                                    <p className="font-mono text-lg text-[#1E2933] dark:text-[#E2E8F0]">{maskData(user?.national_id)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#5A6B7A] dark:text-[#94A3B8] uppercase font-bold tracking-widest mb-1">KRA PIN</p>
                                    <p className="font-mono text-lg text-[#1E2933] dark:text-[#E2E8F0]">{maskData(user?.kra_pin)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#5A6B7A] dark:text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Phone Number</p>
                                    <p className="font-mono text-lg text-[#1E2933] dark:text-[#E2E8F0]">{maskData(user?.phone_number)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[#5A6B7A] dark:text-[#94A3B8] uppercase font-bold tracking-widest mb-1">Email</p>
                                    <p className="text-lg text-[#1E2933] dark:text-[#E2E8F0] truncate">{maskData(user?.email)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#2E7D64] dark:bg-[#256652] rounded-xl p-6 text-white shadow-xl flex flex-col justify-center">
                            <h3 className="text-white/70 text-sm uppercase font-bold mb-2">Total Contributions</h3>
                            <p className="text-4xl font-bold mb-4">${Number(user?.personal_balance)?.toLocaleString() || '0.00'}</p>
                            <div className="pt-4 border-t border-white/20 flex justify-between items-center text-sm">
                                <span>Status: Verified Member</span>
                                <span className="bg-white/20 px-2 py-0.5 rounded-full">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Board Management / Transactions */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">
                                    {isBoard ? "Community Oversight" : "Recent Activity"}
                                </h2>
                                {isBoard && <span className="text-[10px] bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 px-2 py-1 rounded font-bold">MANAGEMENT MODE</span>}
                            </div>
                            
                            {isBoard ? (
                                <div className="space-y-4">
                                    <div className="p-4 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-lg bg-[#F8F9FA] dark:bg-[#0F1720] flex justify-between items-center">
                                        <div>
                                            <p className="font-bold dark:text-white">New M-Pesa Deposit</p>
                                            <p className="text-xs text-[#5A6B7A]">From: Member 005 • KES 2,500</p>
                                        </div>
                                        <button 
                                            className="px-3 py-1.5 bg-[#2E7D64] text-white text-xs rounded hover:bg-[#256652] font-bold"
                                            onClick={() => handleAction("VERIFY_MPESA", { id: "tx_005", amount: 2500 })}
                                        >
                                            Verify & Post
                                        </button>
                                    </div>
                                    <div className="p-4 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-lg bg-[#F8F9FA] dark:bg-[#0F1720] flex justify-between items-center">
                                        <div>
                                            <p className="font-bold dark:text-white">Cash Contribution</p>
                                            <p className="text-xs text-[#5A6B7A]">Reported to Treasurer • KES 1,000</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="px-3 py-1.5 border border-[#E2E8F0] text-xs rounded font-bold dark:text-gray-300" onClick={() => alert("Viewing scanned receipt photo...")}>View Receipt</button>
                                            <button 
                                                className="px-3 py-1.5 bg-[#C73E2D] text-white text-xs rounded font-bold"
                                                onClick={() => handleAction("CLAIM_CASH", { id: "tx_006", treasurer: user?.username })}
                                            >
                                                Claimed
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-[#5A6B7A] dark:text-[#94A3B8] italic text-center py-8">Your contribution history will appear here.</p>
                            )}
                        </div>

                        <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl p-6">
                            <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-6">Investment Hub</h2>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => user?.role === 'guest' ? setShowBuyModal(true) : alert("Redirecting to Investment Portal...")}
                                    className="flex-1 py-4 bg-[#2E7D64] text-white rounded-xl font-bold shadow-lg hover:bg-[#256652] transition-transform hover:-translate-y-1 flex flex-col items-center gap-1"
                                >
                                    <span>Buy Assets / Stocks</span>
                                    <span className="text-[10px] font-normal opacity-70">Expand Portfolio</span>
                                </button>
                                <button 
                                    disabled={!canSell}
                                    className={`flex-1 py-4 text-white rounded-xl font-bold shadow-lg transition-all flex flex-col items-center gap-1 ${canSell ? "bg-[#C73E2D] hover:bg-red-700 hover:-translate-y-1" : "bg-gray-400 cursor-not-allowed opacity-50"}`}
                                >
                                    <span>Sell Assets</span>
                                    <span className="text-[10px] font-normal opacity-70">{canSell ? "Liquidate Shares" : "Restricted for Guests"}</span>
                                </button>
                            </div>
                            {!canSell && (
                                <p className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-[#C73E2D] dark:text-[#E05A4A] rounded-lg text-xs font-medium border border-red-100 dark:border-red-900/30">
                                    * Guest accounts are permitted to initiate purchase requests but cannot sell communal assets until membership is fully verified.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal - Buy Inquiry */}
            {showBuyModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-[#2E7D64]"></div>
                        <h2 className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">Investment Inquiry</h2>
                        <p className="text-[#5A6B7A] dark:text-[#94A3B8] mb-6 leading-relaxed">
                            To proceed with your purchase, please submit your contact details. A community lead will verify your request and initiate a secure chat.
                        </p>
                        
                        <div className="space-y-4 mb-8">
                            <div className="p-4 bg-[#F8F9FA] dark:bg-[#0F1720] rounded-xl border border-[#E2E8F0] dark:border-[#2D3A4A]">
                                <p className="text-[10px] text-[#5A6B7A] font-bold uppercase mb-2 tracking-widest">Official Contact</p>
                                <p className="font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-1">Email: <a href="mailto:jeohama@wewshg.com" className="text-[#2E7D64]">jeohama@wewshg.com</a></p>
                                <p className="font-bold text-[#1E2933] dark:text-[#E2E8F0]">Office: <span className="text-[#2E7D64]">+254 7XX XXX XXX</span></p>
                            </div>
                        </div>

                        <form className="space-y-4">
                            <input type="text" placeholder="Phone Number / Email" className="w-full px-4 py-3 border rounded-lg dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white focus:ring-2 focus:ring-[#2E7D64] outline-none" />
                            <div className="flex gap-3">
                                <button type="button" className="flex-1 py-3 bg-[#2E7D64] text-white rounded-lg font-bold hover:bg-[#256652]" onClick={() => { alert("Chat request sent!"); setShowBuyModal(false); }}>
                                    Request Access
                                </button>
                                <button type="button" className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-500 rounded-lg" onClick={() => setShowBuyModal(false)}>
                                    Dismiss
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}

export default Dashboard;
