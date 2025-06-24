'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateBoardPage() {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');
    
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const token = localStorage.getItem('token');
        if(!token){
            setError('You must login');
            return;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({title})
        });

        if(!res.ok){
            const data = await res.json();

            setError(data.message || 'Something went wrong');
        }else{
            setTitle('');
            router.push('/dashboard');
        }


    };


    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-300">


            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                Create Board
            </h1>
                <input type="text" placeholder="Board title" value={title} onChange={(e) => setTitle(e.target.value)} required 
                className="w-full mb-3 p-2 border border-gray-300 rounded placeholder-gray-600 text-gray-900" />

                <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded">
                    Create
                </button>

                {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
                
            </form>
        </div>
    );


}