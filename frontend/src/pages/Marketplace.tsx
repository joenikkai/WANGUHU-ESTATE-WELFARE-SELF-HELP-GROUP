import { useState, useEffect } from 'react';
import PublicNavbar from '../components/PublicNavbar';
import Footer from '../components/Footer';
import axios from 'axios';
import { API_URL } from '../utils/api';
import { Package, ShieldCheck, ShoppingCart, Search, Filter, FileText, X } from 'lucide-react';

const Marketplace = () => {
    const [listings, setListings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);

    const fetchListings = async () => {
        try {
            const response = await axios.get(`${API_URL}/marketplace/public`);
            setListings(response.data);
        } catch (err) {
            console.error("Failed to fetch listings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const filteredListings = listings.filter(l => 
        l.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        l.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-[#F8F9FA] dark:bg-[#0F1720]">
            <PublicNavbar />
            
            <main className="flex-grow pt-32 pb-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                        <div className="max-w-2xl">
                            <h1 className="text-5xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-4">WEWSHG Exchange</h1>
                            <p className="text-[#5A6B7A] dark:text-[#94A3B8] text-lg">Browse verified community produce. WEWSHG handles the logistics, warehousing, and quality assurance for absolute peace of mind.</p>
                        </div>
                        <div className="w-full md:w-96 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#5A6B7A]" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search maize, wheat, honey..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl outline-none focus:ring-2 focus:ring-[#2E7D64] shadow-sm"
                            />
                        </div>
                    </div>

                    {/* Listings Grid */}
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-[400px] bg-white dark:bg-[#1A2433] rounded-3xl animate-pulse border border-[#E2E8F0] dark:border-[#2D3A4A]"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredListings.length > 0 ? filteredListings.map((l) => (
                                <div key={l.id} className="bg-white dark:bg-[#1A2433] rounded-[2.5rem] border border-[#E2E8F0] dark:border-[#2D3A4A] overflow-hidden group shadow-sm hover:shadow-2xl transition-all flex flex-col">
                                    <div className="p-8 flex-grow">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-2xl text-[#2E7D64]">
                                                <Package size={24} />
                                            </div>
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2E7D64]/10 text-[#2E7D64] rounded-full text-[10px] font-black uppercase tracking-widest">
                                                <ShieldCheck size={14} />
                                                Verified
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-2">{l.product_name}</h3>
                                        <p className="text-sm text-[#5A6B7A] dark:text-[#94A3B8] mb-6 line-clamp-2">{l.description}</p>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="p-4 bg-[#F8F9FA] dark:bg-[#0F1720] rounded-2xl">
                                                <p className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1">Available</p>
                                                <p className="font-black text-[#1E2933] dark:text-[#E2E8F0]">{l.quantity} {l.unit}</p>
                                            </div>
                                            <div className="p-4 bg-[#F8F9FA] dark:bg-[#0F1720] rounded-2xl">
                                                <p className="text-[10px] font-bold text-[#94A3B8] uppercase mb-1">Price</p>
                                                <p className="font-black text-[#2E7D64]">KES {l.price_per_unit}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest">Quality Assurance</p>
                                            <div className="flex flex-wrap gap-2">
                                                {l.documents?.map((doc: any) => (
                                                    <button 
                                                        key={doc.id}
                                                        onClick={() => setSelectedDoc(doc.document_url)}
                                                        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-slate-800 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] hover:border-[#2E7D64] transition-colors"
                                                    >
                                                        <FileText size={14} />
                                                        {doc.document_type.replace('_', ' ').toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="p-8 pt-0">
                                        <button className="w-full py-4 bg-[#1E2933] dark:bg-slate-700 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#2E7D64] transition-all transform hover:-translate-y-1 shadow-lg">
                                            <ShoppingCart size={20} />
                                            Buy via WEWSHG
                                        </button>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-full py-24 text-center">
                                    <Package size={64} className="mx-auto text-[#E2E8F0] mb-6" />
                                    <h3 className="text-2xl font-bold text-[#1E2933] dark:text-[#E2E8F0]">No products found</h3>
                                    <p className="text-[#5A6B7A]">Try adjusting your search or check back later.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Document Viewer Modal */}
            {selectedDoc && (
                <div className="fixed inset-0 bg-black/90 z-[120] flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="max-w-4xl w-full max-h-[90vh] relative flex flex-col">
                        <button 
                            onClick={() => setSelectedDoc(null)}
                            className="absolute -top-12 right-0 text-white flex items-center gap-2 font-bold hover:text-[#2E7D64] transition-colors"
                        >
                            <X size={24} /> Close
                        </button>
                        <div className="flex-grow bg-white rounded-2xl overflow-hidden shadow-2xl">
                            {selectedDoc.endsWith('.pdf') ? (
                                <iframe src={selectedDoc} className="w-full h-full min-h-[70vh]" />
                            ) : (
                                <img src={selectedDoc} alt="Document" className="w-full h-auto object-contain mx-auto" />
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Marketplace;
