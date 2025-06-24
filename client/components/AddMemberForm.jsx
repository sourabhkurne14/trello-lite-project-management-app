import { useState } from "react";
import axios from 'axios';


const AddMemberForm = ({boardId, token, members, currentUserIsAdmin}) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('member');
    const [message, setMessage] = useState('');

    const handleAddMember = async () => {
        try{
            const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/boards/${boardId}/members`,
                {email, role},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessage('Member added successfully');
            setEmail('');

        }catch(err){
            setMessage(err.response?.data?.message || 'Error adding member');
        }
    };

    return(
        <div className="bg-white p-4 rounded shadow-md mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add Member</h3>
            <div className="flex flex-wrap items-center gap-3 mb-4">

            <input type="email" placeholder="User email" value={email} onChange={(e) => setEmail(e.target.value)} 
            className="border border-gray-300 rounded px-3 py-2 w-64 text-gray-800" />

            <select value={role} onChange={(e) => setRole(e.target.value)} 
            className="border border-gray-300 rounded px-3 py-2 text-gray-800">
                <option value="member">Member</option>
                <option value="admin">Admin</option>
            </select>
            <button onClick={handleAddMember} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
            </div>
            {message && <p className="text-gray-950">{message}</p>}

            <div className='mb-6 flex flex-wrap gap-4'>
                {members.map(member => (
                    <div key={member.user._id} className='bg-white rounded p-2 shadow w-fit text-gray-800'>
                        <p className='text-sm font-medium text-gray-900'>{member.user.name} - {member.role}</p>
                        
                    </div>
                ))}
                </div>

        </div>
    );
};

export default AddMemberForm