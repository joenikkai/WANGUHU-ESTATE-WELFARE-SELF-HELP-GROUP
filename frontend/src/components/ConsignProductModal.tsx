import { useState } from 'react';
import { X, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../utils/api';

interface ConsignProductModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

const ConsignProductModal = ({ onClose, onSuccess }: ConsignProductModalProps) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        product_name: '',
        category: 'produce',
        quantity: '',
        unit: 'kg',
        price_per_unit: '',
        description: ''
    });
    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        inspection_certificate: null,
        license_permit: null
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles({ ...files, [field]: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        Object.entries(formData).forEach(([key, value]) => data.append(key, value));
        if (files.inspection_certificate) data.append('inspection_certificate', files.inspection_certificate);
        if (files.license_permit) data.append('license_permit', files.license_permit);

        try {
            await axios.post(`${API_URL}/marketplace/consign`, data, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            onSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to consign product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[110] backdrop-blur-md">
            <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#5A6B7A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                    <X size={24} />
                </button>
                
                <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-2">Consign Produce to WEWSHG</h2>
                <p className="text-sm text-[#5A6B7A] dark:text-[#94A3B8] mb-8">WEWSHG handles the warehouse, legalities, and quality assurance for you.</p>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Product Name</label>
                                <input type="text" name="product_name" value={formData.product_name} onChange={handleChange} placeholder="e.g. Grade A Maize" className="w-full px-4 py-3 border rounded-xl dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Category</label>
                                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]">
                                    <option value="produce">Farm Produce</option>
                                    <option value="manufactured">Manufactured Goods</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Quantity</label>
                                    <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="0.00" className="w-full px-4 py-3 border rounded-xl dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none" required />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Unit</label>
                                    <input type="text" name="unit" value={formData.unit} onChange={handleChange} placeholder="kg / bags" className="w-full px-4 py-3 border rounded-xl dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none" required />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Price per Unit (KES)</label>
                                <input type="number" name="price_per_unit" value={formData.price_per_unit} onChange={handleChange} placeholder="0.00" className="w-full px-4 py-3 border rounded-xl dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-1">Detailed Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={4} placeholder="Moisture content, variety, harvest date..." className="w-full px-4 py-3 border rounded-xl dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative group">
                            <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-2">Inspection Certificate</label>
                            <label className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${files.inspection_certificate ? 'border-green-500 bg-green-50/10' : 'border-[#E2E8F0] dark:border-[#2D3A4A] hover:border-[#2E7D64]'}`}>
                                <input type="file" onChange={(e) => handleFileChange(e, 'inspection_certificate')} className="hidden" accept="image/*,.pdf" />
                                {files.inspection_certificate ? (
                                    <>
                                        <CheckCircle2 size={32} className="text-green-500 mb-2" />
                                        <span className="text-xs font-bold text-green-600">{files.inspection_certificate.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={32} className="text-[#5A6B7A] mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold text-[#5A6B7A] uppercase">Upload Certificate</span>
                                    </>
                                )}
                            </label>
                        </div>

                        <div className="relative group">
                            <label className="block text-[10px] font-bold text-[#5A6B7A] uppercase tracking-widest mb-2">License / Permit</label>
                            <label className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all ${files.license_permit ? 'border-green-500 bg-green-50/10' : 'border-[#E2E8F0] dark:border-[#2D3A4A] hover:border-[#2E7D64]'}`}>
                                <input type="file" onChange={(e) => handleFileChange(e, 'license_permit')} className="hidden" accept="image/*,.pdf" />
                                {files.license_permit ? (
                                    <>
                                        <CheckCircle2 size={32} className="text-green-500 mb-2" />
                                        <span className="text-xs font-bold text-green-600">{files.license_permit.name}</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={32} className="text-[#5A6B7A] mb-2 group-hover:scale-110 transition-transform" />
                                        <span className="text-[10px] font-bold text-[#5A6B7A] uppercase">Upload Permit</span>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-[#2E7D64] text-white rounded-2xl font-black text-lg shadow-xl hover:bg-[#256652] disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Confirm Consignment'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConsignProductModal;
