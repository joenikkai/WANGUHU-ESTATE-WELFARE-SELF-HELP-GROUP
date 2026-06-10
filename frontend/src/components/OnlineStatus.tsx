import { useState } from "react";
import { useOnlineStatus, useOfflineSync } from "../context/SyncContext";
import { Wifi, WifiOff, X, Activity, RefreshCw } from "lucide-react";

function OnlineStatus() {
    const isOnline = useOnlineStatus();
    const { queue, rollbackItem } = useOfflineSync();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-4">
            {/* Detailed Popup */}
            {isOpen && (
                <div className="bg-white dark:bg-[#1A2433] border-4 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-[2.5rem] p-8 shadow-2xl w-80 animate-in slide-in-from-bottom-4 duration-300 relative">
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="absolute top-6 right-6 p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors text-[#5A6B7A]"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4 mb-8">
                        <div className={`p-3 rounded-2xl ${isOnline ? 'bg-green-50 text-[#2E7D64]' : 'bg-red-50 text-[#C73E2D]'}`}>
                            {isOnline ? <Wifi size={24} /> : <WifiOff size={24} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0]">System Node</h3>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${isOnline ? 'text-[#2E7D64]' : 'text-[#C73E2D]'}`}>
                                {isOnline ? 'Connection: Stable ∑' : 'Connection: Interrupted Δ'}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="p-5 bg-gray-50 dark:bg-[#0F1720] rounded-3xl border border-[#E2E8F0] dark:border-[#2D3A4A]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest flex items-center gap-2">
                                    <Activity size={12} />
                                    Sync Pipeline
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${queue.length > 0 ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                    {queue.length} Pending
                                </span>
                            </div>

                            <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                                {queue.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-2 rounded-xl bg-white dark:bg-[#1A2433] border border-transparent hover:border-[#2E7D64] transition-all group">
                                        <span className="text-[10px] font-bold text-[#1E2933] dark:text-[#E2E8F0] truncate max-w-[120px]">{item.action}</span>
                                        <button 
                                            onClick={() => rollbackItem(item.id)}
                                            className="text-[9px] font-black text-red-500 uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            Purge
                                        </button>
                                    </div>
                                ))}
                                {queue.length === 0 && (
                                    <p className="text-[10px] text-[#5A6B7A] italic text-center py-2">No pending operations.</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-1 h-12 bg-[#2E7D64] rounded-full"></div>
                            <p className="text-[10px] text-[#5A6B7A] font-medium leading-relaxed">
                                {isOnline 
                                    ? "Global node synchronization is active. All interactions are verified in real-time." 
                                    : "Data is being cached in the local vault. Submission will resume upon restoration of high-speed connectivity."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Pill */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-3 px-5 py-3 rounded-full border-4 shadow-2xl transition-all transform hover:scale-105 active:scale-95 ${
                    isOnline 
                    ? "bg-white dark:bg-[#1A2433] border-[#2E7D64]/20 text-[#2E7D64]" 
                    : "bg-[#C73E2D] border-white/20 text-white animate-pulse"
                }`}
            >
                {isOnline ? (
                    <RefreshCw size={18} className={queue.length > 0 ? "animate-spin" : ""} />
                ) : (
                    <WifiOff size={18} />
                )}
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-black uppercase tracking-[0.1em]">
                        {isOnline ? (queue.length > 0 ? "Syncing..." : "Online") : "Offline"}
                    </span>
                    {queue.length > 0 && (
                        <span className="text-[8px] font-bold opacity-70">
                            {queue.length} Queue ∑
                        </span>
                    )}
                </div>
                {!isOpen && (
                    <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#2E7D64]" : "bg-white"} shadow-[0_0_8px_currentColor]`}></div>
                )}
            </button>
        </div>
    );
}

export default OnlineStatus;
