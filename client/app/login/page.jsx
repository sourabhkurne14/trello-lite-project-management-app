'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function Login() {
    const { login } = useAuth(); 
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await login(formData.email, formData.password); 
        } catch (err) {
            setError(err.message || 'Something went wrong!');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-300">
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">Login</h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border border-gray-700 rounded placeholder-gray-600 text-gray-900"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full mb-3 p-2 border border-gray-700 rounded placeholder-gray-600 text-gray-900"
                />

                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded cursor-pointer">Login</button>

            <Link href='/register' >
            <p className='mt-4 text-sm text-gray-700 text-center'>New to the app? <span className='text-blue-500 underline cursor-pointer'>Register</span></p>
            </Link>
            </form>
            
        </div>
    );
}
