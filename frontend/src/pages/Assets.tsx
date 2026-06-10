import { useState, useEffect } from 'react';
import DashboardSidebar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
    Building2, 
    Plus, 
    Search, 
    Filter, 
    MoreVertical, 
    TrendingUp, 
    Users, 
    ShieldCheck, 
    Landmark,
    CheckCircle2,
    X,
    Loader2,
    FileText,
    PieChart,
    ArrowUpRight,
    Receipt
} from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Assets = () => {
    const { token, user } = useAuth();
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [contributions, setContributions] = useState<any[]>([]);
    const [loadingContributions, setLoadingContributions] = useState(false);

    const isTreasurer = user?.role === 'board_member' || user?.role === 'admin';

    const fetchAssets = async () => {
        if (!token) return;
        try {
            const res = await axios.get(`${API_URL}/assets`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAssets(res.data);
        } catch (err) {
            console.error("Failed to fetch assets", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchContributions = async (assetId: string) => {
        setLoadingContributions(true);
        try {
            const res = await axios.get(`${API_URL}/assets/${assetId}/contributions`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setContributions(res.data);
        } catch (err) {
            console.error("Failed to fetch contributions", err);
        } finally {
            setLoadingContributions(false);
        }
    };

    useEffect(() => {
        fetchAssets();
    }, [token]);

    const filteredAssets = assets.filter(a => {
        const matchesSearch = a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             a.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || 
                             (filterType === 'communal' && a.is_communal) || 
                             (filterType === 'private' && !a.is_communal);
        return matchesSearch && matchesFilter;
    });

    const communalAssets = assets.filter(a => a.is_communal);
    const privateAssets = assets.filter(a => !a.is_communal);
    const totalAssetValue = assets.reduce((acc, a) => acc + parseFloat(a.value), 0);

    return (
        <div className="min-h-screen flex bg-[#F8F9FA] dark:bg-[#0F1720]">
            <DashboardSidebar />
            
            <div className="flex-grow flex flex-col sm:ml-72 transition-all duration-300">
                <main className="flex-grow pb-20 sm:pb-8 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-900/20">
                                        <Building2 size={32} />
                                    </div>
                                    <h1 className="text-4xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Asset Portfolio</h1>
                                </div>
                                <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-lg max-w-2xl">
                                    Manage your personal holdings and track communal property status. 
                                    Transparency and privacy in every brick.
                                </p>
                            </div>
                            
                            {isTreasurer && (
                                <button 
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-8 py-4 bg-[#1E2933] text-white rounded-2xl font-black hover:bg-purple-700 transition-all shadow-xl flex items-center gap-2"
                                >
                                    <Plus size={20} />
                                    Register Asset
                                </button>
                            )}
                        </header>

                        {/* Quick Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2">Consolidated Value ∑</p>
                                <p className="text-3xl font-black text-[#1E2933] dark:text-[#E2E8F0]">KES {totalAssetValue.toLocaleString()}</p>
                                <p className="text-xs text-[#5A6B7A] font-bold mt-2">Combined Private & Communal Stake</p>
                            </div>
                            <div className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2">Communal Holdings ∑</p>
                                <p className="text-3xl font-black text-[#2E7D64]">KES {communalAssets.reduce((acc, a) => acc + parseFloat(a.value), 0).toLocaleString()}</p>
                                <p className="text-xs text-[#2E7D64] font-bold mt-2">{communalAssets.length} Active Shared Projects</p>
                            </div>
                            <div className="bg-white dark:bg-[#1A2433] p-8 rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] shadow-sm">
                                <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest mb-2">Personal Equity ∑</p>
                                <p className="text-3xl font-black text-blue-500">KES {privateAssets.reduce((acc, a) => acc + parseFloat(a.value), 0).toLocaleString()}</p>
                                <p className="text-xs text-blue-500 font-bold mt-2">Private & Confidential</p>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4 mb-8">
                            <div className="relative flex-grow">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                                <input 
                                    type="text" 
                                    placeholder="Search by asset name, location or type..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1A2433] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl outline-none focus:border-purple-500 dark:text-white"
                                />
                            </div>
                            <div className="flex gap-2">
                                {['all', 'communal', 'private'].map(type => (
                                    <button 
                                        key={type}
                                        onClick={() => setFilterType(type)}
                                        className={`px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${filterType === type ? 'bg-purple-600 text-white shadow-lg' : 'bg-white dark:bg-[#1A2433] text-[#5A6B7A] border border-[#E2E8F0] dark:border-[#2D3A4A]'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Assets Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-80 bg-white dark:bg-[#1A2433] rounded-[2.5rem] animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredAssets.map(asset => (
                                    <div 
                                        key={asset.id} 
                                        onClick={() => {
                                            setSelectedAsset(asset);
                                            fetchContributions(asset.id);
                                        }}
                                        className="bg-white dark:bg-[#1A2433] rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] overflow-hidden group hover:border-purple-500 transition-all cursor-pointer shadow-sm hover:shadow-xl"
                                    >
                                        <div className="h-48 bg-[#F8F9FA] dark:bg-[#0F1720] relative p-8 flex items-end">
                                            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${asset.is_communal ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                {asset.is_communal ? <Users size={12} /> : <ShieldCheck size={12} />}
                                                {asset.is_communal ? 'Communal' : 'Private'}
                                            </div>
                                            <div className="w-16 h-16 bg-white dark:bg-[#1A2433] rounded-2xl flex items-center justify-center text-purple-600 shadow-lg group-hover:scale-110 transition-transform">
                                                <Landmark size={32} />
                                            </div>
                                        </div>
                                        <div className="p-8">
                                            <h3 className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-2">{asset.name}</h3>
                                            <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest mb-6">{asset.type}</p>
                                            
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-[10px] font-black text-[#94A3B8] uppercase mb-1">Valuation</p>
                                                    <p className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">KES {parseFloat(asset.value).toLocaleString()}</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 dark:bg-[#0F1720] rounded-xl text-[#5A6B7A] group-hover:bg-purple-600 group-hover:text-white transition-all">
                                                    <ArrowUpRight size={20} />
                                                </div>
                                            </div>

                                            {asset.is_communal && asset.target_amount && (
                                                <div className="mt-8">
                                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                                                        <span className="text-[#5A6B7A]">Funding Progress</span>
                                                        <span className="text-[#2E7D64]">{Math.round((parseFloat(asset.total_contributed) / parseFloat(asset.target_amount)) * 100)}%</span>
                                                    </div>
                                                    <div className="h-2 w-full bg-gray-100 dark:bg-[#0F1720] rounded-full overflow-hidden">
                                                        <div 
                                                            className="h-full bg-[#2E7D64] transition-all duration-1000" 
                                                            style={{ width: `${Math.min(100, (parseFloat(asset.total_contributed) / parseFloat(asset.target_amount)) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
                <Footer />
            </div>

            {/* Create Asset Modal */}
            {showCreateModal && (
                <CreateAssetModal 
                    onClose={() => setShowCreateModal(false)} 
                    onSuccess={() => {
                        setShowCreateModal(false);
                        fetchAssets();
                    }}
                    token={token}
                />
            )}

            {/* Asset Detail / Contribution Sidebar */}
            {selectedAsset && (
                <div className="fixed inset-0 bg-black/80 z-[300] flex justify-end backdrop-blur-sm animate-in fade-in duration-300">
                    <div 
                        className="w-full max-w-2xl bg-white dark:bg-[#1A2433] h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500"
                        onClick={e => e.stopPropagation()}
                    >
                        <header className="p-8 border-b border-[#E2E8F0] dark:border-[#2D3A4A] flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-purple-50 dark:bg-purple-900/10 text-purple-600 rounded-xl">
                                    <Landmark size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">{selectedAsset.name}</h2>
                                    <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest">{selectedAsset.type}</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedAsset(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                <X size={24} className="text-[#5A6B7A]" />
                            </button>
                        </header>

                        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                <div className="p-6 bg-gray-50 dark:bg-[#0F1720] rounded-[2rem] border border-[#E2E8F0] dark:border-[#2D3A4A]">
                                    <p className="text-[10px] font-black text-[#94A3B8] uppercase mb-1">Asset Value</p>
                                    <p className="text-xl font-black text-[#1E2933] dark:text-[#E2E8F0]">KES {parseFloat(selectedAsset.value).toLocaleString()}</p>
                                </div>
                                {selectedAsset.is_communal && (
                                    <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-[2rem] border border-green-100 dark:border-green-900/20">
                                        <p className="text-[10px] font-black text-[#2E7D64] uppercase mb-1">Your Stake</p>
                                        <p className="text-xl font-black text-[#2E7D64]">KES {parseFloat(selectedAsset.user_contribution).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>

                            <div className="mb-10">
                                <h4 className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-4">Description</h4>
                                <p className="text-sm text-[#1E2933] dark:text-[#E2E8F0] leading-relaxed">
                                    {selectedAsset.description || "No detailed description provided for this asset holding."}
                                </p>
                            </div>

                            {/* Contributions List */}
                            {selectedAsset.is_communal && (
                                <div>
                                    <h4 className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-4">Contribution Ledger</h4>
                                    <div className="space-y-4">
                                        {loadingContributions ? (
                                            [1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 dark:bg-[#0F1720] rounded-2xl animate-pulse"></div>)
                                        ) : (
                                            contributions.map((c, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0F1720] rounded-2xl border border-transparent hover:border-[#2E7D64] transition-all">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#1A2433] flex items-center justify-center text-[#2E7D64] shadow-sm">
                                                            <Receipt size={18} />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-[#1E2933] dark:text-[#E2E8F0]">{c.full_name}</p>
                                                            <p className="text-[10px] text-[#5A6B7A] uppercase tracking-widest">{new Date(c.execution_date).toLocaleDateString()}</p>
                                                        </div>
                                                    </div>
                                                    <p className="font-black text-[#2E7D64]">KES {parseFloat(c.amount).toLocaleString()}</p>
                                                </div>
                                            ))
                                        )}
                                        {contributions.length === 0 && !loadingContributions && (
                                            <p className="text-center text-[#5A6B7A] text-xs py-8 italic">No public contributions recorded for this asset.</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <footer className="p-8 border-t border-[#E2E8F0] dark:border-[#2D3A4A] bg-[#F8F9FA] dark:bg-[#0F1720]">
                            <button className="w-full py-4 bg-[#1E2933] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-purple-600 transition-all">
                                <FileText size={20} />
                                Download Statement
                            </button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

function CreateAssetModal({ onClose, onSuccess, token }: { onClose: () => void, onSuccess: () => void, token: string | null }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        type: 'Real Estate',
        value: '',
        target_amount: '',
        description: '',
        is_communal: true
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_URL}/assets`, {
                ...formData,
                value: parseFloat(formData.value),
                target_amount: formData.target_amount ? parseFloat(formData.target_amount) : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            onSuccess();
        } catch (err) {
            alert("Failed to register asset.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[400] flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#1A2433] rounded-[3rem] p-10 max-w-xl w-full shadow-2xl relative">
                <button onClick={onClose} className="absolute top-8 right-8 p-2 text-[#5A6B7A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X size={24} />
                </button>
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600">
                        <Plus size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Register Asset</h2>
                        <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest">Add to Communal or Private Portfolio</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Asset Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder="e.g. Ruiru Block 4 Plot"
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-purple-500 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Asset Category</label>
                            <select 
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-purple-500 dark:text-white"
                            >
                                <option value="Real Estate">Real Estate</option>
                                <option value="Equipment">Equipment</option>
                                <option value="Vehicle">Vehicle</option>
                                <option value="Livestock">Livestock</option>
                                <option value="Financial">Financial Asset</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Current Valuation (KES)</label>
                            <input 
                                type="number" 
                                required
                                placeholder="0.00"
                                value={formData.value}
                                onChange={e => setFormData({...formData, value: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-purple-500 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Asset Type</label>
                            <div className="flex bg-gray-50 dark:bg-[#0F1720] p-1 rounded-2xl border-2 border-[#E2E8F0] dark:border-[#2D3A4A]">
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, is_communal: true})}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.is_communal ? 'bg-white dark:bg-[#1A2433] text-[#2E7D64] shadow-sm' : 'text-[#5A6B7A]'}`}
                                >
                                    Communal
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({...formData, is_communal: false})}
                                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!formData.is_communal ? 'bg-white dark:bg-[#1A2433] text-blue-500 shadow-sm' : 'text-[#5A6B7A]'}`}
                                >
                                    Private
                                </button>
                            </div>
                        </div>
                        {formData.is_communal && (
                            <div>
                                <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Target Funding (KES)</label>
                                <input 
                                    type="number" 
                                    placeholder="Total amount needed"
                                    value={formData.target_amount}
                                    onChange={e => setFormData({...formData, target_amount: e.target.value})}
                                    className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-purple-500 dark:text-white"
                                />
                            </div>
                        )}
                        <div className="col-span-2">
                            <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-2">Detailed Description</label>
                            <textarea 
                                placeholder="Details about ownership, location, and purpose..."
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                                className="w-full px-6 py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl font-bold outline-none focus:border-purple-500 dark:text-white min-h-[100px]"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-6 bg-purple-600 text-white rounded-[2rem] font-black text-xl hover:bg-purple-700 transition-all shadow-xl shadow-purple-900/20 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={24} />}
                        Confirm Registration
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Assets;
