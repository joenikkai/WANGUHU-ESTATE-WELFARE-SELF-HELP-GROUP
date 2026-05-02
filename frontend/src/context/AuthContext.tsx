import { createContext, type ReactNode, useContext, useState, useEffect } from "react";
import axios from 'axios';
import { 
    startRegistration, 
    startAuthentication 
} from '@simplewebauthn/browser';

axios.defaults.withCredentials = true;

type Role = "admin" | "board_member" | "member" | "guest";

type User = {
    id: string;
    username: string;
    email: string;
    full_name: string;
    national_id: string;
    kra_pin: string;
    phone_number: string;
    role: Role;
    title: string;
    personal_balance: number;
    profile_picture_url: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (details: {
        username: string;
        email: string;
        password: string;
        full_name: string;
        national_id: string;
        kra_pin: string;
        phone_number: string;
        physical_address: string;
        profile_picture_data?: string;
    }) => Promise<void>;
    logout: () => void;
    updateProfilePicture: (data: string | File) => Promise<void>;
    removeProfilePicture: () => Promise<void>;
    updateProfile: (formData: any) => Promise<any>;
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    loading: boolean;
    passkeyRegister: () => Promise<void>;
    passkeyLogin: (identifier: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5555/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, { email, password });
            const { token, user } = response.data;
            handleAuthSuccess(token, user);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const handleAuthSuccess = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
    };

    const passkeyRegister = async () => {
        if (!token) return;
        try {
            const optionsResponse = await axios.get(`${API_URL}/passkeys/register-options`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const attestationResponse = await startRegistration({ optionsJSON: optionsResponse.data });
            await axios.post(`${API_URL}/passkeys/register-verify`, attestationResponse, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Passkey registered successfully!");
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message || 'Passkey registration failed');
        }
    };

    const passkeyLogin = async (identifier: string) => {
        try {
            const optionsResponse = await axios.get(`${API_URL}/passkeys/login-options?identifier=${identifier}`);
            const assertionResponse = await startAuthentication({ optionsJSON: optionsResponse.data });
            const verifyResponse = await axios.post(`${API_URL}/passkeys/login-verify`, assertionResponse);
            const { token, user } = verifyResponse.data;
            handleAuthSuccess(token, user);
        } catch (error: any) {
            console.error(error);
            throw new Error(error.message || 'Passkey login failed');
        }
    };

    const register = async (details: any) => {
        try {
            await axios.post(`${API_URL}/auth/register`, details);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const updateProfilePicture = async (data: string | File) => {
        if (!token) return;
        try {
            let response;
            if (typeof data === 'string') {
                response = await axios.post(`${API_URL}/users/profile-picture`, { profile_picture_data: data }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                const formData = new FormData();
                formData.append('profile_picture', data);
                response = await axios.post(`${API_URL}/users/profile-picture-upload`, formData, {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }
            const { profile_picture_url } = response.data;
            if (user) {
                const updatedUser = { ...user, profile_picture_url };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Update failed');
        }
    };

    const removeProfilePicture = async () => {
        if (!token) return;
        try {
            await axios.delete(`${API_URL}/users/profile-picture`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (user) {
                const updatedUser = { ...user, profile_picture_url: '' };
                setUser(updatedUser);
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Removal failed');
        }
    };

    const updateProfile = async (formData: any) => {
        if (!token) return;
        try {
            const response = await axios.put(`${API_URL}/users/profile`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Update failed');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ 
            user, token, login, register, logout, 
            updateProfilePicture, removeProfilePicture, 
            updateProfile, setUser, setToken, loading,
            passkeyRegister, passkeyLogin
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};
