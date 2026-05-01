import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function MinutesRegistry() {
    const { user } = useAuth();
    const isSecretary = user?.title === 'Secretary' || user?.role === 'admin';
    const [selectedMinutes, setSelectedMinutes] = useState<string | null>(null);

    const dummyMinutes = [
        { id: '1', date: '2026-03-15', title: 'Q1 Strategy Meeting', link: 'https://docs.google.com/document/d/e/2PACX-1vRE-E-Z8P-H3r9xY9r/pub' },
        { id: '2', date: '2026-02-10', title: 'Asset Acquisition Discussion', link: 'https://docs.google.com/document/d/e/2PACX-1vRE-E-Z8P-H3r9xY9r/pub' },
        { id: '3', date: '2026-01-05', title: 'Annual General Meeting', link: 'https://docs.google.com/document/d/e/2PACX-1vRE-E-Z8P-H3r9xY9r/pub' },
    ];

    return (
        <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">Meetings & Minutes</h2>
                {isSecretary && (
                    <button className="px-3 py-1 bg-[#2E7D64] text-white text-xs rounded-md font-bold hover:bg-[#256652]">
                        + Add New Minutes
                    </button>
                )}
            </div>

            <div className="space-y-3">
                {dummyMinutes.map((m) => (
                    <div key={m.id} className="flex items-center justify-between p-3 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <div>
                            <p className="font-bold text-sm text-[#1E2933] dark:text-[#E2E8F0]">{m.title}</p>
                            <p className="text-xs text-[#5A6B7A] dark:text-[#94A3B8]">{m.date}</p>
                        </div>
                        <button 
                            onClick={() => setSelectedMinutes(m.link)}
                            className="text-[#2E7D64] text-xs font-bold hover:underline"
                        >
                            View Record
                        </button>
                    </div>
                ))}
            </div>

            {selectedMinutes && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[100] backdrop-blur-md">
                    <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] overflow-hidden flex flex-col relative">
                        <header className="p-4 border-b flex justify-between items-center">
                            <span className="font-bold">Official Record Registry</span>
                            <button onClick={() => setSelectedMinutes(null)} className="p-2 hover:bg-gray-100 rounded-full">✕</button>
                        </header>
                        <iframe 
                            src={selectedMinutes} 
                            className="flex-grow w-full border-none"
                            title="Minutes Viewer"
                        />
                        {isSecretary && (
                            <div className="p-4 border-t bg-yellow-50 text-xs flex justify-between items-center">
                                <span className="font-bold text-yellow-800">Secretary Access: You are currently viewing this in read-only mode. Use "Edit" in registry to modify.</span>
                                <button className="px-4 py-2 bg-yellow-600 text-white rounded-md font-bold">Unlock for Edit</button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default MinutesRegistry;
