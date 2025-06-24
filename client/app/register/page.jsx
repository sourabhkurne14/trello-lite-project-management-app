'use client'

import {useState} from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function Register(){
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try{
            const res = await fetch('http://127.0.0.1:5000/api/auth/register', {
                method: 'POST',
                headers: {'content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            
            if(!res.ok) throw new Error(data.message || "Something went wrong!");


            localStorage.setItem('token', data.token);
            router.push('/dashboard');

                
        }catch(err){
            setError(err.message);
        }
    };


    return(
        <div className='min-h-screen flex items-center justify-center bg-gray-300'>
            <form onSubmit={handleSubmit} className='bg-white p-6 rounded shadow-md w-full max-w-sm'>
                <h2 className='text-2xl font-bold text-gray-900 mb-4 text-center'>Register</h2>
    
                <input type="text" name='name' placeholder='Enter your name' value={formData.name} onChange={handleChange} required 
                className='w-full mb-3 p-2 border border-gray-300 rounded placeholder-gray-600 text-gray-900' />
    
                <input type="email" name='email' placeholder='Enter your email' value={formData.email} onChange={handleChange} required 
                className='w-full mb-3 p-2 border border-gray-300 rounded placeholder-gray-600 text-gray-900' />
    
                <input type="password" name='password' placeholder='Enter your password' value={formData.password} onChange={handleChange} required 
                className='w-full mb-3 p-2 border border-gray-300 rounded placeholder-gray-600 text-gray-900' />
    
                {error && <p className='text-red-500 text-sm mb-3'>{error}</p>}

                <button type='submit' className='w-full bg-blue-500 hover:bg-blue=600 text-white font-medium py-2 px-4 rounded'>
                    Register
                </button>
            <Link href='/login' >
            <p className='mt-4 text-sm text-gray-700 text-center'>Already a user? <span className='text-blue-500 underline cursor-pointer'>Login</span></p>
            </Link>
            </form>

        </div>
    );


};

