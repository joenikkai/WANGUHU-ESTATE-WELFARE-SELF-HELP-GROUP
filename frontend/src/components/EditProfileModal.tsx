import { useState } from 'react';
import { X, ShieldCheck, Mail, Fingerprint, MapPin, Phone, User, CheckCircle2, Lock, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface EditProfileModalProps {
    onClose: () => void;
}

const EditProfileModal = ({ onClose }: EditProfileModalProps) => {
    const { user, updateProfile, removeProfilePicture } = useAuth();
    const [step, setStep] = useState<'mfa' | 'form'>('mfa');
    const [mfaCode, setMfaCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        full_name: user?.full_name || '',
        email: user?.email || '',
        phone_number: user?.phone_number || '',
        physical_address: (user as any)?.physical_address || '',
        national_id: user?.national_id || '',
        kra_pin: user?.kra_pin || ''
    });

    const handleMfaSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate MFA verification
        setTimeout(() => {
            if (mfaCode === '123456') { // Master code for simulation
                setStep('form');
            } else {
                setError('Invalid verification code. Use 123456 for demo.');
            }
            setLoading(false);
        }, 1000);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await updateProfile(formData);
            setSuccess(true);
            setTimeout(() => onClose(), 1500);
        } catch (err: any) {
            setError(err.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (window.confirm('Are you sure you want to remove your profile photo?')) {
            try {
                await removeProfilePicture();
                alert('Photo removed');
            } catch (err) {
                alert('Failed to remove photo');
            }
        }
    };

    if (success) {
        return (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[150] backdrop-blur-md">
                <div className="bg-white dark:bg-[#1A2433] rounded-3xl p-8 text-center shadow-2xl scale-110 transition-transform">
                    <CheckCircle2 size={64} className="text-[#2E7D64] mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Profile Secured!</h2>
                    <p className="text-[#5A6B7A] dark:text-[#94A3B8] mt-2">Your data has been successfully updated.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[150] backdrop-blur-md">
            <div className="bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-3xl p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 text-[#5A6B7A] hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full">
                    <X size={24} />
                </button>

                {step === 'mfa' ? (
                    <div className="text-center py-6">
                        <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 text-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Lock size={40} />
                        </div>
                        <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0] mb-2">Security Verification</h2>
                        <p className="text-sm text-[#5A6B7A] dark:text-[#94A3B8] mb-8 px-6">
                            To protect your sensitive information, please enter the 6-digit MFA code sent to your registered phone ending in <strong>{user?.phone_number.slice(-4)}</strong>.
                        </p>

                        <form onSubmit={handleMfaSubmit} className="space-y-6">
                            <div>
                                <input 
                                    type="text" 
                                    maxLength={6}
                                    placeholder="000000"
                                    value={mfaCode}
                                    onChange={(e) => setMfaCode(e.target.value)}
                                    className="w-48 text-center text-3xl font-black tracking-[0.5em] py-4 bg-gray-50 dark:bg-[#0F1720] border-2 border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl outline-none focus:border-[#2E7D64]"
                                    required
                                />
                                {error && <p className="text-red-500 text-xs mt-4 font-bold">{error}</p>}
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#1E2933] dark:bg-[#0F1720] text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-black transition-all"
                            >
                                <Key size={20} />
                                {loading ? 'Verifying...' : 'Unlock Profile'}
                            </button>
                            <p className="text-[10px] text-[#94A3B8] uppercase font-black tracking-widest">Demo Code: 123456</p>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 dark:bg-green-900/20 text-[#2E7D64] rounded-2xl">
                                    <User size={32} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-[#1E2933] dark:text-[#E2E8F0]">Edit Member Profile</h2>
                                    <p className="text-xs text-[#5A6B7A] font-bold uppercase tracking-widest">Update your biometric & legal data</p>
                                </div>
                            </div>
                            {user?.profile_picture_url && (
                                <button 
                                    type="button" 
                                    onClick={handleRemovePhoto}
                                    className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
                                >
                                    Remove Photo
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-1">Username</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                                            <input type="text" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0F1720] border rounded-xl outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                                            <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0F1720] border rounded-xl outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                                            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0F1720] border rounded-xl outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                                            <input type="text" value={formData.phone_number} onChange={(e) => setFormData({...formData, phone_number: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0F1720] border rounded-xl outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-1">National ID</label>
                                        <div className="relative">
                                            <Fingerprint className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                                            <input type="text" value={formData.national_id} onChange={(e) => setFormData({...formData, national_id: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0F1720] border rounded-xl outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-1">KRA PIN</label>
                                        <div className="relative">
                                            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                                            <input type="text" value={formData.kra_pin} onChange={(e) => setFormData({...formData, kra_pin: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0F1720] border rounded-xl outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-black text-[#5A6B7A] uppercase tracking-widest mb-1">Physical Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
                                    <input type="text" value={formData.physical_address} onChange={(e) => setFormData({...formData, physical_address: e.target.value})} placeholder="Section, House No." className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0F1720] border rounded-xl outline-none focus:ring-2 focus:ring-[#2E7D64]" />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#2D3A4A] flex gap-4">
                                <button type="button" onClick={onClose} className="flex-1 py-4 bg-gray-100 dark:bg-slate-800 text-[#1E2933] dark:text-[#E2E8F0] rounded-2xl font-black">Cancel</button>
                                <button type="submit" disabled={loading} className="flex-2 py-4 bg-[#2E7D64] text-white rounded-2xl font-black shadow-xl hover:bg-[#256652] transition-all">
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EditProfileModal;
