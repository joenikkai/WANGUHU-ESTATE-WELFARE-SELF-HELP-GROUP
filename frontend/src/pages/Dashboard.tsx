import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Shield from "../components/Shield";
import MinutesRegistry from "../components/MinutesRegistry";
import TransactionGraph from "../components/TransactionGraph";
import eyeIcon from "../assets/eye-svgrepo-com.svg";
import eyeOffIcon from "../assets/eye-off-svgrepo-com.svg";
import { useOnlineStatus, useOfflineSync } from "../context/SyncContext";

function Dashboard() {
    const { user, logout } = useAuth();
    const isOnline = useOnlineStatus();
    const { addToQueue } = useOfflineSync();
    
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [showSensitives, setShowSensitives] = useState(false);
    const [showBenevolenceModal, setShowBenevolenceModal] = useState(false);
    const [showContributeModal, setShowContributeModal] = useState(false);
    const [uptime, setUptime] = useState("00:00:00");

    useEffect(() => {
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
    }, [user]);

    const handleAction = (action: string, payload: any) => {
        if (!isOnline) {
            addToQueue(action, payload);
        } else {
            alert(`Live Action: ${action} submitted successfully.`);
        }
    };

    const isBoard = user?.role === 'board_member' || user?.role === 'admin';
    const isChairman = user?.title === 'Chairperson' || user?.role === 'admin';
    const isTreasurer = user?.title === 'Treasurer' || user?.role === 'admin';
    const firstName = user?.full_name?.split(' ')[0] || 'Member';

    const maskData = (data: string | undefined) => {
        if (!data) return "N/A";
        if (showSensitives) return data;
        return "•".repeat(8);
    };

    // Simulated Graph Data (Last 100 txs)
    const dummyGraphData = Array.from({ length: 15 }, (_, i) => ({
        date: `May ${i + 1}`,
        amount: Math.floor(Math.random() * 10000) + 1000,
        type: 'contribution'
    }));

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F1720]">
            <div className="flex-grow p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 shrink-0"><Shield /></div>
                            <div>
                                <h1 className="text-3xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">Hello, {firstName}!</h1>
                                <p className="text-[#5A6B7A] dark:text-[#94A3B8] font-medium">{user?.title}</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                            <button onClick={() => setShowContributeModal(true)} className="flex-1 sm:flex-none px-4 py-2 bg-[#2E7D64] text-white rounded-md font-bold text-sm shadow-md hover:bg-[#256652] transition-all">Make Contribution</button>
                            <button onClick={() => setShowSensitives(!showSensitives)} className="p-2 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors">
                                <img src={showSensitives ? eyeOffIcon : eyeIcon} className="w-5 h-5 dark:invert opacity-70" alt="toggle" />
                            </button>
                            <button onClick={logout} className="px-4 py-2 bg-[#C73E2D] text-white rounded-md hover:bg-red-700 transition-colors font-bold text-sm">Logout</button>
                        </div>
                    </header>

                    {/* Treasurer Global Oversight (Communal Pools) */}
                    {isTreasurer && (
                        <section className="mb-8 p-6 bg-white dark:bg-[#1A2433] border border-[#2E7D64] rounded-xl shadow-lg">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">Treasury: Communal Funds Oversight</h2>
                                <span className="text-[10px] bg-[#2E7D64]/10 text-[#2E7D64] px-2 py-1 rounded-full font-bold">TOTAL CAPITAL: KES 8,450,000</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-[#F8F9FA] dark:bg-[#0F1720] border-l-4 border-blue-500 rounded-r-lg">
                                    <p className="text-xs text-[#5A6B7A] font-bold uppercase">Benevolence Pool</p>
                                    <p className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">KES 245,000</p>
                                    <span className="text-[10px] text-[#2E7D64]">Verified & Isolated</span>
                                </div>
                                <div className="p-4 bg-[#F8F9FA] dark:bg-[#0F1720] border-l-4 border-orange-500 rounded-r-lg">
                                    <p className="text-xs text-[#5A6B7A] font-bold uppercase">Communal Asset Pool</p>
                                    <p className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">KES 6,200,000</p>
                                    <span className="text-[10px] text-[#2E7D64]">Public Asset Funding</span>
                                </div>
                                <div className="p-4 bg-[#F8F9FA] dark:bg-[#0F1720] border-l-4 border-green-500 rounded-r-lg">
                                    <p className="text-xs text-[#5A6B7A] font-bold uppercase">Maintenance Fund</p>
                                    <p className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">KES 2,005,000</p>
                                    <span className="text-[10px] text-[#2E7D64]">Group Operations</span>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Chairman Request Portal */}
                    {isChairman && (
                        <section className="mb-8 p-6 bg-white dark:bg-[#1A2433] border border-orange-400 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-6 italic">Chairman's Communal Request Desk</h2>
                            <div className="space-y-4">
                                <div className="p-4 border border-dashed border-orange-200 rounded-xl bg-orange-50/10 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-sm text-orange-600">Proposal: Borehole Drilling in Sector B</p>
                                        <p className="text-xs text-[#5A6B7A]">From: Mary Wambui • High Priority</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-4 py-2 bg-orange-500 text-white text-xs rounded-md font-bold">Approve to Agenda</button>
                                        <button className="px-4 py-2 border border-orange-200 text-xs rounded-md font-bold">Inquiry</button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Grid for Graph & Registry */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        {/* Transaction Monitoring Graph */}
                        <div className="lg:col-span-2 bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">Fund Monitoring (Last 100 Txs)</h2>
                                <select className="text-xs bg-gray-50 dark:bg-slate-800 border-none rounded-md px-2 py-1 outline-none">
                                    <option>Private Balance</option>
                                    <option>Benevolence Pool</option>
                                    <option>Communal Pool</option>
                                </select>
                            </div>
                            <TransactionGraph data={dummyGraphData} />
                            <div className="mt-4 flex justify-between items-center text-xs text-[#5A6B7A]">
                                <span>Showing real-time growth trajectory</span>
                                <span className="text-[#2E7D64] font-bold">▲ +12.3% this quarter</span>
                            </div>
                        </div>

                        {/* Minutes Registry (Read-only for all except Secretary) */}
                        <MinutesRegistry />
                    </div>

                    {/* Bottom Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl p-6">
                            <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">Member Welfare</h2>
                            <p className="text-sm text-[#5A6B7A] mb-6 leading-relaxed italic">"A community is measured by how it cares for its vulnerable."</p>
                            <button 
                                onClick={() => setShowBenevolenceModal(true)}
                                className="w-full py-4 border-2 border-dashed border-[#2E7D64] text-[#2E7D64] rounded-xl font-bold hover:bg-[#2E7D64] hover:text-white transition-all flex items-center justify-center gap-3"
                            >
                                <span className="text-2xl">🤝</span>
                                Call for Benevolence (Emergency Request)
                            </button>
                        </div>

                        <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl p-6 flex flex-col justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">Communal Asset Status</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#5A6B7A]">Tractor Maintenance</span>
                                        <span className="text-[#2E7D64] font-bold">Paid</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-[#5A6B7A]">Security Fees</span>
                                        <span className="text-[#C73E2D] font-bold">Pending</span>
                                    </div>
                                </div>
                            </div>
                            <button className="mt-6 w-full py-3 bg-[#1E2933] text-white rounded-lg font-bold text-sm shadow-xl">View Shared Asset Registry</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benevolence Request Modal */}
            {showBenevolenceModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C73E2D]"></div>
                        <h2 className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">Request Community Support</h2>
                        <form className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Emergency Category</label>
                                <select className="w-full px-4 py-3 border rounded-lg dark:bg-[#0F1720] dark:border-[#2D3A4A] outline-none">
                                    <option>Death of a Kin</option>
                                    <option>Hospitalization / Medical Bill</option>
                                    <option>School Fees Arrears</option>
                                    <option>Natural Disaster / Fire</option>
                                    <option>Other Emergency</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Estimated Need (KES)</label>
                                <input type="number" placeholder="0.00" className="w-full px-4 py-3 border rounded-lg dark:bg-[#0F1720] dark:border-[#2D3A4A]" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Narrative / Description</label>
                                <textarea rows={3} placeholder="Please provide details for the Board to review..." className="w-full px-4 py-3 border rounded-lg dark:bg-[#0F1720] dark:border-[#2D3A4A] text-sm" />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" className="flex-1 py-3 bg-[#C73E2D] text-white rounded-lg font-bold shadow-lg" onClick={() => { alert("Request submitted to Chairman and Treasurer."); setShowBenevolenceModal(false); }}>Submit Request</button>
                                <button type="button" className="px-6 py-3 border border-gray-300 text-gray-500 rounded-lg" onClick={() => setShowBenevolenceModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Contribution Modal */}
            {showContributeModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[100] backdrop-blur-sm">
                    <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1.5 bg-[#2E7D64]"></div>
                        <h2 className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0] mb-4">Community Contribution</h2>
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl text-xs text-blue-700 dark:text-blue-300 leading-relaxed border border-blue-100">
                            <strong>Fund Isolation Rule:</strong> Contributions to pools are strictly separated. They do not mix with your private funds or other pools.
                        </div>
                        <form className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Select Target Pool</label>
                                <select className="w-full px-4 py-3 border rounded-lg dark:bg-[#0F1720] dark:border-[#2D3A4A] font-bold text-[#2E7D64]">
                                    <option>Benevolence Pool (Public Good)</option>
                                    <option>Communal Asset Pool (Development)</option>
                                    <option>Maintenance Fee (Mandatory)</option>
                                    <option>Buy Shares (Private Asset Pool)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Amount to Contribute (KES)</label>
                                <input type="number" placeholder="500.00" className="w-full px-4 py-3 border rounded-lg dark:bg-[#0F1720] dark:border-[#2D3A4A] font-mono text-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" className="py-4 border rounded-xl flex flex-col items-center hover:bg-green-50 transition-colors">
                                    <span className="text-2xl">📱</span>
                                    <span className="text-[10px] font-bold uppercase mt-1">M-Pesa</span>
                                </button>
                                <button type="button" className="py-4 border rounded-xl flex flex-col items-center hover:bg-blue-50 transition-colors">
                                    <span className="text-2xl">💳</span>
                                    <span className="text-[10px] font-bold uppercase mt-1">Card / Stripe</span>
                                </button>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" className="flex-1 py-3 bg-[#2E7D64] text-white rounded-lg font-bold shadow-lg" onClick={() => { handleAction("CONTRIBUTION", { amount: 500 }); setShowContributeModal(false); }}>Confirm Contribution</button>
                                <button type="button" className="px-6 py-3 text-gray-500 font-bold" onClick={() => setShowContributeModal(false)}>Close</button>
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
