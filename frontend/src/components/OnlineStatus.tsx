import { useOnlineStatus, useOfflineSync } from "../context/SyncContext";

function OnlineStatus() {
    const isOnline = useOnlineStatus();
    const { queue, rollbackItem } = useOfflineSync();

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-3 pointer-events-none">
            {queue.length > 0 && (
                <div className="pointer-events-auto bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl p-4 shadow-2xl max-w-xs animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-[#C73E2D] uppercase tracking-widest">Pending Sync</span>
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 px-2 py-0.5 rounded-full font-bold">{queue.length}</span>
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto mb-3 pr-1">
                        {queue.map(item => (
                            <div key={item.id} className="text-[11px] flex justify-between items-center group">
                                <span className="text-[#5A6B7A] dark:text-[#94A3B8] italic">{item.action} scheduled...</span>
                                <button 
                                    onClick={() => rollbackItem(item.id)}
                                    className="text-red-500 hover:text-red-700 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Rollback
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-[#5A6B7A]">Changes will be submitted once connection is restored.</p>
                </div>
            )}

            <div className={`pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all shadow-md ${
                isOnline 
                ? "bg-[#2E7D64]/10 border-[#2E7D64]/20 text-[#2E7D64]" 
                : "bg-[#C73E2D]/10 border-[#C73E2D]/20 text-[#C73E2D] animate-pulse"
            }`}>
                <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#2E7D64]" : "bg-[#C73E2D]"}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-wider">{isOnline ? "System Online" : "System Offline"}</span>
            </div>
        </div>
    );
}

export default OnlineStatus;
