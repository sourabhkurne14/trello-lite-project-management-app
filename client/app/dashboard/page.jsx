'use client'

import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Dashboard() {
    const { user } = useAuth();
    const router = useRouter();

    const [boards, setBoards] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user || !user.token) {
            router.push('/login');
            return;
        }


        const fetchBoards = async () => {
            const token = localStorage.getItem('token');

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();
                // console.log('Response status:', res.status);
                // console.log('Response data:', data);

                if (!res.ok) {
                    setError(data.message || 'Failed to fetch boards!');
                } else {
                    // console.log('Fetched boards:', data);

                    setBoards(data);
                }
            } catch (err) {
                setError('Server error')

            }
        };

        fetchBoards();

    }, [user]);




    return (

        <div className="min-h-screen bg-gray-300 p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4 text-center">Your Boards</h1>
            {error && <p className="text-red-500 mb-4 text-center"> {error}</p>}

            <div className="grid gap-4">
                {boards.map((board) => (
                    <div key={board._id}>
                        <Link className="block border border-gray-300 p-4 rounded hover:bg-gray-50 transition" href={`/board/${board._id}`}>
                            <h2 className="text-lg font-semibold text-gray-800">{board.title}</h2>
                        </Link>
                        <p className="text-sm text-gray-600">
                            Created on {new Date(board.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                ))}
            </div>

            <div className="text-center mt-6">

            <Link href='/create-board'>
                <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
                    ➕ Create New Board</button>
            </Link>
            </div>

        </div>

    );


}