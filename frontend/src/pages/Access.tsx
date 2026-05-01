import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eyeIcon from '../assets/eye-svgrepo-com.svg';
import eyeOffIcon from '../assets/eye-off-svgrepo-com.svg';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA] dark:bg-[#0F1720] px-4">
            <div className="w-full max-w-md p-8 bg-white dark:bg-[#1A2433] border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-2xl shadow-xl">
                <h2 className="mb-2 text-3xl font-bold text-center text-[#1E2933] dark:text-[#E2E8F0]">Welcome Back</h2>
                <p className="mb-8 text-center text-[#5A6B7A] dark:text-[#94A3B8] text-sm italic">"Precision in every transaction"</p>

                {/* Social Logins */}
                <div className="space-y-3 mb-8">
                    <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.27 3.28-8.11 3.28-11.83z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        <span className="text-sm font-semibold dark:text-white">Continue with Google</span>
                    </button>
                    <button className="w-full flex items-center justify-center gap-3 px-4 py-2.5 bg-[#1877F2] text-white rounded-lg hover:bg-[#166fe5] transition-colors">
                        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span className="text-sm font-semibold">Continue with Facebook</span>
                    </button>
                </div>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E2E8F0] dark:border-[#2D3A4A]"></span></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-[#1A2433] px-2 text-[#5A6B7A]">Or secure login</span></div>
                </div>

                {error && <p className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 text-center text-[#C73E2D] dark:text-[#E05A4A] rounded text-xs border border-red-100 dark:border-red-900/40">{error}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <div>
                        <label className="block text-[10px] font-bold text-[#5A6B7A] dark:text-[#94A3B8] uppercase tracking-widest">Identifier</label>
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
                    <button
                        type="submit"
                        className="w-full py-3 text-white bg-[#2E7D64] rounded-lg font-bold hover:bg-[#256652] transition-colors shadow-lg"
                    >
                        Sign In
                    </button>
                </form>

                {/* MFA / Passkey Options */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                    <button className="flex flex-col items-center justify-center p-3 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group">
                        <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🔑</span>
                        <span className="text-[10px] font-bold text-[#5A6B7A] uppercase">Passkey</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-3 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all group">
                        <span className="text-xl mb-1 group-hover:scale-110 transition-transform">🛡️</span>
                        <span className="text-[10px] font-bold text-[#5A6B7A] uppercase">MFA Code</span>
                    </button>
                </div>

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
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await register(formData);
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
                <p className="mb-8 text-center text-[#5A6B7A] dark:text-[#94A3B8] text-sm italic">Linking physical identity with digital transparency.</p>

                {/* Social Link Integration */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <button className="flex items-center justify-center gap-3 px-4 py-2 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group">
                        <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-3.27 3.28-8.11 3.28-11.83z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                        <span className="text-xs font-bold dark:text-white uppercase tracking-wider">Link Google</span>
                    </button>
                    <button className="flex items-center justify-center gap-3 px-4 py-2 border border-[#E2E8F0] dark:border-[#2D3A4A] rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors group">
                        <svg className="w-5 h-5 fill-[#1877F2]" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        <span className="text-xs font-bold dark:text-white uppercase tracking-wider">Link Facebook</span>
                    </button>
                </div>

                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-[#E2E8F0] dark:border-[#2D3A4A]"></span></div>
                    <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest"><span className="bg-white dark:bg-[#1A2433] px-3 text-[#5A6B7A]">Personal Information</span></div>
                </div>
                
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
                                onChange={(e) => { handleChange(e); /* Simulate identity link status logic */ }}
                                className="w-full px-4 py-2 mt-1 border rounded-md dark:bg-[#0F1720] dark:border-[#2D3A4A] dark:text-white pr-12 outline-none focus:ring-2 focus:ring-[#2E7D64]"
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[26px] p-1 opacity-50 dark:invert">
                                <img src={showPassword ? eyeOffIcon : eyeIcon} className="w-5 h-5" alt="toggle" />
                            </button>
                        </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-xl flex items-start gap-4">
                        <span className="text-xl">🛡️</span>
                        <div className="text-xs text-[#5A6B7A] dark:text-[#94A3B8] leading-relaxed">
                            <strong>Secure Identity Link:</strong> By continuing, your physical identity will be cryptographically linked to your digital account. MFA and Passkey options will be available upon first login.
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 text-white bg-[#2E7D64] rounded-xl font-bold text-lg hover:bg-[#256652] transition-all transform hover:-translate-y-0.5 shadow-xl"
                    >
                        Confirm Identity & Join
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-[#5A6B7A] dark:text-[#94A3B8]">
                    I already have an account? <a href="/login" className="text-[#2E7D64] font-bold hover:underline">Sign In here</a>
                </p>
            </div>
        </div>
    );
}

function Access(params: { accessType?: string }) {
    const { accessType } = params;
    if (accessType === "login") return <Login />;
    return <SignUp />;
}

export default Access;