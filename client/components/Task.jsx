'use client'
import { useDrag } from "react-dnd";

export const Task = ({task, onDeleteTask}) => {
    const [{ isDragging }, drag] = useDrag(()=> ({
        type: 'task',
        item: {id: task._id},
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return(
        <div ref={drag} style={{opacity: isDragging ? 0.5 : 1, background: '#2414c4 ',padding: '0.5rem',margin: '0.5rem 0',borderRadius: '4px', color: 'white', position: 'relative'}}>
            <p >{task.title}</p>
            {task.assignedTo && (
                <p style={{fontSize: '12px', color: '#fff'}}>
                    Assigned to: {task.assignedTo?.name || 'Unassigned'}
                </p>
            )}

            <button
                onClick={() => onDeleteTask(task._id)}
                style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '2px 6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                }}
            >
                X
            </button>
        </div>
    )
};