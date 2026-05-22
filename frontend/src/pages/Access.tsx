import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Camera, Shield, X, Fingerprint, Globe } from 'lucide-react';
import eyeIcon from '../assets/eye-svgrepo-com.svg';
import eyeOffIcon from '../assets/eye-off-svgrepo-com.svg';
import axios from 'axios';
import { API_URL } from '../utils/api';

function SocialLogins() {
    const handleSocialLogin = (provider: string) => {
        window.location.href = `${API_URL}/auth/${provider}`;
    };

    return (
        <div className="space-y-3 mb-6">
            <button 
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 py-2.5 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-bold text-sm text-[#1E2933] dark:text-[#E2E8F0]"
            >
                <Globe size={18} className="text-blue-500" />
                Continue with Google
            </button>
            <div className="flex gap-3">
                <button 
                    onClick={() => handleSocialLogin('facebook')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-bold text-xs"
                >
                    Facebook
                </button>
                <button 
                    onClick={() => handleSocialLogin('microsoft')}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all font-bold text-xs"
                >
                    Microsoft
                </button>
            </div>
        </div>
    );
}

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login, passkeyLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/my-dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handlePasskeyLogin = async () => {
        if (!email) {
            setError('Please enter your email or username first to use a passkey.');
            return;
        }
        try {
            await passkeyLogin(email);
            navigate('/my-dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] dark:bg-[#0F1720] px-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl shadow-xl">
                <h2 className="mb-2 text-3xl font-bold text-center text-[#1E2933] dark:text-[#E2E8F0]">Welcome Back</h2>
                <p className="mb-8 text-center text-[#5A6B7A] dark:text-[#94A3B8] text-sm italic">"Precision in every transaction"</p>

                <SocialLogins />

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E2E8F0] dark:border-[#2D3A4A]"></span></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white dark:bg-[#1A2433] px-3 text-[#5A6B7A]">Or use credentials</span></div>
                </div>

                {error && <p className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 text-center text-[#C73E2D] dark:text-[#E05A4A] rounded text-xs border border-red-100 dark:border-red-900/40">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Identifier (Email or Username)</label>
                        <input
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email or Username"
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-[#2E7D64] dark:bg-[#0F1720] dark:text-[#E2E8F0] dark:border-[#2D3A4A] outline-none"
                            required
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-[#2E7D64] dark:bg-[#0F1720] dark:text-[#E2E8F0] dark:border-[#2D3A4A] pr-12 outline-none"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-[30px] p-1 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            <img src={showPassword ? eyeOffIcon : eyeIcon} className="w-5 h-5 opacity-50 dark:invert" alt="toggle" />
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className="flex-[2] py-3 text-white bg-[#2E7D64] rounded-lg font-bold hover:bg-[#256652] transition-colors shadow-lg"
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={handlePasskeyLogin}
                            className="flex-1 py-3 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-lg flex items-center justify-center text-[#5A6B7A] hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                            title="Sign in with Passkey"
                        >
                            <Fingerprint size={24} />
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-[#5A6B7A] dark:text-[#94A3B8]">
                    New member? <a href="/sign-up" className="text-[#2E7D64] font-bold hover:underline">Apply for Account</a>
                </p>
            </div>
        </div>
    );
}

function SignUp() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        full_name: '',
        national_id: '',
        kra_pin: '',
        phone_number: '',
        physical_address: ''
    });
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const startCamera = async () => {
        setIsCameraOpen(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera access denied", err);
            setError("Camera access denied. Please check permissions.");
            setIsCameraOpen(false);
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                canvasRef.current.width = videoRef.current.videoWidth;
                canvasRef.current.height = videoRef.current.videoHeight;
                context.drawImage(videoRef.current, 0, 0);
                const dataUrl = canvasRef.current.toDataURL('image/png');
                setProfilePic(dataUrl);
                stopCamera();
            }
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
            setIsCameraOpen(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register({ ...formData, profile_picture_data: profilePic || undefined });
            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (success) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#F8F9FA] dark:bg-[#0F1720]">
                <div className="p-8 text-center bg-white dark:bg-[#1A2433] border rounded-lg shadow-xl animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                    <h2 className="text-2xl font-bold text-[#2E7D64]">Application Received!</h2>
                    <p className="mt-2 text-[#5A6B7A] dark:text-[#94A3B8]">Identity verified and accounts linked. Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] dark:bg-[#0F1720] py-12 px-4">
            <div className="w-full max-w-2xl p-8 bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2E7D64] via-blue-500 to-orange-400"></div>
                <h2 className="mb-2 text-3xl font-bold text-center text-[#1E2933] dark:text-[#E2E8F0]">Apply for Membership</h2>
                
                <SocialLogins />

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E2E8F0] dark:border-[#2D3A4A]"></span></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white dark:bg-[#1A2433] px-3 text-[#5A6B7A]">Or direct application</span></div>
                </div>

                <div className="flex flex-col items-center mb-8 mt-4">
                    <div className="relative w-32 h-32 rounded-full border-4 border-[#2E7D64] overflow-hidden bg-gray-100 dark:bg-slate-800 flex items-center justify-center group">
                        {profilePic ? (
                            <img src={profilePic} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                            <Camera size={48} className="text-[#5A6B7A] dark:text-[#94A3B8]" />
                        )}
                        <button 
                            type="button"
                            onClick={startCamera}
                            className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold text-xs"
                        >
                            {profilePic ? "Change Photo" : "Take Photo"}
                        </button>
                    </div>
                    <p className="mt-2 text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Biometric Identity Photo</p>
                </div>

                {isCameraOpen && (
                    <div className="fixed inset-0 bg-black/90 z-[100] flex flex-col items-center justify-center p-4">
                        <video ref={videoRef} autoPlay playsInline className="max-w-full max-h-[70vh] rounded-2xl border-2 border-[#2E7D64]" />
                        <canvas ref={canvasRef} className="hidden" />
                        <div className="flex gap-6 mt-8">
                            <button onClick={captureImage} className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#2E7D64] hover:scale-110 transition-transform shadow-2xl">
                                <Camera size={32} />
                            </button>
                            <button onClick={stopCamera} className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-2xl">
                                <X size={32} />
                            </button>
                        </div>
                    </div>
                )}

                {error && <p className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-center text-[#C73E2D] dark:text-[#E05A4A] rounded-md border border-red-100 dark:border-red-900/50 text-sm font-medium">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Full Name (National ID)</label>
                                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">National ID Number</label>
                                <input type="text" name="national_id" value={formData.national_id} onChange={handleChange} className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">KRA PIN</label>
                                <input type="text" name="kra_pin" value={formData.kra_pin} onChange={handleChange} className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Preferred Username</label>
                                <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Phone Number</label>
                                <input type="text" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Physical Address</label>
                            <textarea name="physical_address" value={formData.physical_address} onChange={handleChange} rows={1} className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]" required />
                        </div>
                        <div className="relative">
                            <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Security Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white pr-12 outline-none focus:ring-2 focus:ring-[#2E7D64]"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[26px] p-1 opacity-50 dark:invert">
                                <img src={showPassword ? eyeOffIcon : eyeIcon} className="w-5 h-5" alt="toggle" />
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 text-white bg-[#2E7D64] rounded-xl font-bold text-lg hover:bg-[#256652] transition-all transform hover:-translate-y-0.5 shadow-xl"
                    >
                        Confirm Identity & Join
                    </button>
                </form>

                <p className="mt-8 text-center text-sm text-[#5A6B7A] dark:text-[#94A3B8]">
                    Already a member? <a href="/login" className="text-[#2E7D64] font-black hover:underline">I already have an account</a>
                </p>
            </div>
        </div>
    );
}

function CompleteIdentity() {
    const { updateProfile, passkeyRegister } = useAuth();
    const [formData, setFormData] = useState({
        national_id: '',
        kra_pin: '',
        phone_number: '',
        physical_address: ''
    });
    const [step, setStep] = useState(1); // 1: Details, 2: Passkey
    const navigate = useNavigate();

    const handleSubmitDetails = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            setStep(2);
        } catch (err) {
            alert("Failed to update profile details.");
        }
    };

    const handleRegisterPasskey = async () => {
        try {
            await passkeyRegister();
            navigate('/my-dashboard');
        } catch (err) {
            alert("Passkey registration failed, but you can try again later in profile settings.");
            navigate('/my-dashboard');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] dark:bg-[#0F1720] px-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-[#1A2433] border border-[#2E7D64] rounded-2xl shadow-xl">
                <div className="flex justify-center mb-6">
                    <Shield size={48} className="text-[#2E7D64]" />
                </div>
                <h2 className="mb-2 text-2xl font-bold text-center text-[#1E2933] dark:text-[#E2E8F0]">
                    {step === 1 ? 'Complete Your Identity' : 'Secure Your Account'}
                </h2>
                <p className="mb-8 text-center text-[#5A6B7A] dark:text-[#94A3B8] text-sm">
                    {step === 1 
                        ? 'To access financial features, we need your Kenyan identity details.' 
                        : 'Passkeys are mandatory for secure, passwordless access.'}
                </p>

                {step === 1 ? (
                    <form onSubmit={handleSubmitDetails} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A6B7A]">National ID</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]"
                                value={formData.national_id}
                                onChange={(e) => setFormData({...formData, national_id: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A6B7A]">KRA PIN</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]"
                                value={formData.kra_pin}
                                onChange={(e) => setFormData({...formData, kra_pin: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A6B7A]">Phone Number</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]"
                                value={formData.phone_number}
                                onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5A6B7A]">Physical Address</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white outline-none focus:ring-2 focus:ring-[#2E7D64]"
                                value={formData.physical_address}
                                onChange={(e) => setFormData({...formData, physical_address: e.target.value})}
                            />
                        </div>
                        <button type="submit" className="w-full py-3 bg-[#2E7D64] text-white rounded-lg font-bold shadow-lg hover:bg-[#256652] transition-colors">Next: Secure Account</button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 dark:bg-[#0F1720] rounded-xl border border-dashed border-[#2E7D64] flex flex-col items-center">
                            <Fingerprint size={64} className="text-[#2E7D64] mb-4 animate-pulse" />
                            <p className="text-xs text-center text-[#5A6B7A]">Registration uses your device's biometric or PIN security.</p>
                        </div>
                        <button 
                            onClick={handleRegisterPasskey}
                            className="w-full py-4 bg-[#2E7D64] text-white rounded-xl font-bold shadow-xl flex items-center justify-center gap-2 hover:bg-[#256652] transition-colors"
                        >
                            <Fingerprint size={20} />
                            Register Passkey
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Access({ accessType }: { accessType: 'login' | 'signup' }) {
    const [searchParams] = useSearchParams();
    const { setToken, setUser } = useAuth();
    const navigate = useNavigate();
    const [isCompletingIdentity, setIsCompletingIdentity] = useState(false);

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
            localStorage.setItem('token', urlToken);
            // Fetch user data with this token
            axios.get(`${API_URL}/users/me`, {
                headers: { Authorization: `Bearer ${urlToken}` }
            }).then(res => {
                setUser(res.data);
                localStorage.setItem('user', JSON.stringify(res.data));
                if (!res.data.national_id) {
                    setIsCompletingIdentity(true);
                } else {
                    navigate('/my-dashboard');
                }
            }).catch(() => {
                navigate('/login');
            });
        }
    }, [searchParams]);

    if (isCompletingIdentity) {
        return <CompleteIdentity />;
    }

    return accessType === 'login' ? <Login /> : <SignUp />;
}
