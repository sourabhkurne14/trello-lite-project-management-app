'use client'

import { List } from '@/components/List';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import ActivityLog from '@/components/ActivityLog';
import AddMemberForm from '@/components/AddMemberForm';


export default function BoardDetailsPage() {
    
    const { user, loading } = useAuth();
    const token = user?.token;
    const router = useRouter();
    const pathname = usePathname();
    const boardId = pathname.split('/').pop();

    const [board, setBoard] = useState(null);
    const [lists, setLists] = useState([]);
    const [newListTitle, setNewListTitle] = useState('');
    const [taskTitles, setTaskTitles] = useState({});
    const [assignedTo, setAssignedTo] = useState({});
    const [members, setMembers] = useState([]);
    const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);
    const [error, setError] = useState('');

    console.log("Full user object:", user);


    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
            return;
        }

        

        const fetchBoardAndLists = async () => {
            try {
                const [boardRes, listRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/board/${boardId}`, {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }),
                ]);

                const boardData = await boardRes.json();
                const listData = await listRes.json();

                if (!boardRes.ok) throw new Error(boardData.message);
                if (!listRes.ok) throw new Error(listData.message);

                setBoard(boardData);
                setLists(listData);
                setMembers(boardData.members || []);

                const userId = user?.id || user?._id;

                const isAdmin = boardData.owner._id === userId ||
                    boardData.members?.some((m) => m.user._id === userId && m.role === 'admin');
                // console.log("User ID for checking:", userId);
                // console.log("Board owner Id:", boardData.owner);
                // console.log("Members:", boardData.members);


                // console.log("Is current user admin:", isAdmin);

                setCurrentUserIsAdmin(isAdmin);
                // console.log("Is current user admin:", isAdmin);


            } catch (err) {
                setError(err.message || 'Error fetching board')
            }
        };

        fetchBoardAndLists();
    }, [loading, user, boardId, router]);

    const handleCreateList = async () => {
        if (!newListTitle.trim())
            return;

        try {
            const token = user.token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title: newListTitle, boardId })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setLists((prev) => [...prev, data]);
            setNewListTitle('');
        } catch (err) {
            setError(err.message || 'Error creating list');
        }
    };

    const handleTaskInputChange = (listId, value) => {
        setTaskTitles((prev) => ({ ...prev, [listId]: value }));
    };

    const handleCreateTask = async (listId) => {
        const title = taskTitles[listId]?.trim();
        const assignedUserId = assignedTo[listId];
        if (!title)
            return;

        try {
            const token = user.token;
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ title, listId, boardId, assignedTo: assignedUserId })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            setLists((prevLists) =>
                prevLists.map((list) =>
                    list._id === listId ? { ...list, tasks: [...(list.tasks || []), data] } : list)

            );
            setTaskTitles((prev) => ({ ...prev, [listId]: '' }));
        } catch (err) {
            setError(err.message || 'Error creating task');
        }
    };

    const updateRole = async (memberId, newRole) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}/members/${memberId}/role`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`
                },
                body: JSON.stringify({ newRole })
            })

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            fetchBoardAndLists();
        } catch (err) {
            alert('Error updating role:' + err.message);
        }
    }

    const handleDropTask = async (taskId, targetListId) => {
        try{
            let sourceListId = null;
            let movedTask = null;

            const updatedLists = lists.map((list) => {
                const taskIndex = list.tasks.findIndex((task) => task._id === taskId);
                if(taskIndex !== -1){
                    sourceListId = list._id;
                    movedTask = list.tasks[taskIndex];

                    const newTasks = [...list.tasks];
                    newTasks.splice(taskIndex, 1);

                    return {...list, tasks: newTasks};
                }
                return list;
            });

            if(!movedTask || !sourceListId) return;

            const finalLists = updatedLists.map((list) => {
                if(list._id === targetListId) {
                    return {
                        ...list, tasks: [...list.tasks, movedTask]
                    };
                }
                return list;
            });

            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}/move`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user?.token}`
                },
                body: JSON.stringify({listId: targetListId})
            });
            setLists(finalLists);

            if(!res.ok) throw new Error('Failed to move task');

            const updatedRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/board/${boardId}`,{
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            const updatedListss = await updatedRes.json();
            setLists(updatedListss);
         }catch(err){
            console.error('Error moving task:', err.message);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token')
            router.push('/login');
        
    }

    const handleDeleteBoard = async () => {
        if(!confirm("Are you sure you want to delete this board? This action cannot be undone")) return;

        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if(!res.ok){
                const data = await res.json();
                throw new Error(data,message || 'Failed to delete board');
            }

            router.push('/dashboard');
        }catch(err){
            alert(err.message)
        }
    };

    const handleDeleteTask = async (taskId) => {
        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${taskId}`,{
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            if(!res.ok){
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete task')
            }

            const updateRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/board/${boardId}`,{
                headers: {
                    Authorization: `Bearer ${user?.token}`
                }
            });

            const updatedLists = await updateRes.json();
            setLists(updatedLists)
        }catch(err){
            alert('Error deleting task:'+ err.message)
        }
    };

    const handleDeleteList = async (listId) => {
        if(!confirm('Are you sure want to delete this list?')) return;

        try{
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/lists/${listId}`,{
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            });

            if(!res.ok){
                const data = await res.json();
                throw new Error(data.message || 'Failed to delete list');
            }

            setLists(prev => prev.filter(list => list._id !== listId));

        }catch(err){
            alert(err.message);
        }
    };

    

    return (
    <div className='min-h-screen bg-gray-300 p-4'>
        {!board && !error && <p className='text-center text-gray-700'>Loading...</p>}
        {/* {error && <p className='text-red-500 text-center'>{error}</p>} */}
        {board && (
            <>
                <h1 className='text-3xl font-bold text-gray-800 mg-4 mb-8'>{board.title}</h1>

                <AddMemberForm boardId={board._id} token={token} members={members} currentUserIsAdmin={currentUserIsAdmin}   />
                

                <div className='mb-4'>
                    <input
                        type="text"
                        placeholder="New list title"
                        value={newListTitle}
                        onChange={(e) => setNewListTitle(e.target.value)}
                        className='p-2 border border-gray-400 rounded w-64 mr-2 placeholder-gray-700 text-gray-900'
                    />
                    <button onClick={handleCreateList} 
                    className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>Add List</button>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-4 ">
                    {lists.map((list) => (
                        <div
                            key={list._id}
                            className='bg-white rounded shadow p-4 min-w-[250px] flex-shrink-0'
                        >
                            <h2 className='text-xl font-semibold mb-2 text-gray-800'>{list.title}</h2>

                            <List list={list} onDropTask={handleDropTask} onDeleteTask={handleDeleteTask} onDeleteList={handleDeleteList} />

                            


                            <input
                                type="text"
                                placeholder="New Task"
                                value={taskTitles[list._id] || ''}
                                onChange={(e) => handleTaskInputChange(list._id, e.target.value)}
                                className='w-full p-2 border boarder-gray-300 rounded mt-2  placeholder-gray-700 text-gray-900'
                            />
                            <button onClick={() => handleCreateTask(list._id)} 
                            className='w-full bg-green-600 text-white mt-2 py-1 rounded hover:bg-green-700'>Add Task</button>

                            <select
                                value={assignedTo[list._id || '']}
                                onChange={(e) =>
                                    setAssignedTo((prev) => ({
                                        ...prev,
                                        [list._id]: e.target.value,
                                    }))
                                }
                                className='w-full mt-2 p-2 border border-gray-300 rounded text-sm  text-gray-900'
                            >
                                <option value="">Assign to..</option>
                                {members.map(
                                    (member, index) =>
                                        member.user && (
                                            <option
                                                key={index}
                                                value={member.user._id}
                                                className="decoration-black"
                                            >
                                                {member.user.name}
                                            </option>
                                        )
                                )}
                            </select>
                        </div>
                    ))}
                </div>
                <div className='mt-6   text-gray-900'>

                {currentUserIsAdmin && (
                    <button onClick={handleDeleteBoard} className='bg-red-600 text-black px-4 py-2 rounded mt-4 ml-10 hover:bg-red-800'>
                        Delete Board
                    </button>
                )}

                <ActivityLog boardId={boardId}></ActivityLog>
                </div>

                <button onClick={handleLogout} className='bg-red-500 text-white px-4 py-2 rounded'>
                    Logout
                </button>

            </>
        )}
    </div>
);


}

