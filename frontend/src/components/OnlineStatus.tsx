import { useOnlineStatus, useOfflineSync } from "../context/SyncContext";

function OnlineStatus() {
    const isOnline = useOnlineStatus();
    const { queue, rollbackItem } = useOfflineSync();
    const isFloatingTop = queue.length > 2;

    return (
        <div className={`fixed z-[100] flex flex-col gap-3 pointer-events-none transition-all duration-500 ${
            isFloatingTop 
            ? "top-6 right-6 items-end" 
            : "bottom-6 right-6 sm:bottom-6 sm:right-6 items-end sm:items-end top-6 left-6 sm:top-auto sm:left-auto items-start sm:items-end"
        }`}>
            {queue.length > 0 && (
                <div className="pointer-events-auto bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl p-5 shadow-2xl max-w-xs animate-in zoom-in-95 duration-300">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-black text-[#C73E2D] uppercase tracking-[0.2em]">Sync Pipeline</span>
                        <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 px-2 py-0.5 rounded-full font-black">{queue.length}</span>
                    </div>
                    <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-1 custom-scrollbar">
                        {queue.map(item => (
                            <div key={item.id} className="text-[11px] flex justify-between items-center group bg-gray-50 dark:bg-[#0F1720] p-2 rounded-lg border border-transparent hover:border-red-100 dark:hover:border-red-900/30 transition-all">
                                <span className="text-[#5A6B7A] dark:text-[#94A3B8] font-bold italic truncate max-w-[150px]">{item.action}</span>
                                <button 
                                    onClick={() => rollbackItem(item.id)}
                                    className="text-red-500 hover:text-red-700 font-black text-[9px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    Cancel
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-[#5A6B7A] dark:text-[#94A3B8] font-medium leading-tight">Data is being held locally. Submission will resume upon restoration of high-speed connectivity.</p>
                </div>
            )}

            <div className={`pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full border transition-all shadow-xl backdrop-blur-md ${
                isOnline 
                ? "bg-[#2E7D64]/10 border-[#2E7D64]/20 text-[#2E7D64]" 
                : "bg-[#C73E2D]/10 border-[#C73E2D]/20 text-[#C73E2D] animate-pulse"
            }`}>
                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] ${isOnline ? "bg-[#2E7D64]" : "bg-[#C73E2D]"}`}></div>
                <span className="text-[10px] font-black uppercase tracking-[0.15em]">{isOnline ? "Network: Stable" : "Network: Interrupted"}</span>
            </div>
        </div>
    );
}

export default OnlineStatus;
