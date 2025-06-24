'use client'

import { useEffect, useState } from "react";

const ActivityLog = ({boardId}) => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const fetchLogs = async () => {
            try{
                const res = await fetch(`http://localhost:5000/api/activity-logs/${boardId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                const data = await res.json();
                setLogs(data);
                console.log(logs);

            }catch(err){
                console.error('Error fetching logs:', err);
            }
        };
        fetchLogs();
    }, [boardId]);

    return(
        <div style={{marginTop: '2rem'}}>
            <h3 className=" text-2xl font-bold text-gray-900">📘 Activity Logs</h3>

            {logs.length === 0 ? (
                <p>No activity yet..</p>
            ): (

            <ul>
                {logs.map((log) => (
                    <li key={log._id} style={{marginBottom: '0.5rem'}}>
                        <strong style={{color: 'black'}}>{log.user?.name || 'Someone'}</strong> {log.action}
                        <br />
                        <small>{new Date(log.createdAt).toLocaleString()}</small>

                    </li>
                ))}
            </ul>
            )}

        </div>
    );
};

export default ActivityLog;