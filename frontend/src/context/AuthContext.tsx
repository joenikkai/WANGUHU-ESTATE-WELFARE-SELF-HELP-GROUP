import { createContext, type ReactNode, useContext, useState, useEffect } from "react";
import axios from 'axios';

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
    }) => Promise<void>;
    logout: () => void;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:5555/api/auth';

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
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { token, user } = response.data;
            setToken(token);
            setUser(user);
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const register = async (details: {
        username: string;
        email: string;
        password: string;
        full_name: string;
        national_id: string;
        kra_pin: string;
        phone_number: string;
        physical_address: string;
    }) => {
        try {
            await axios.post(`${API_URL}/register`, details);
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};

