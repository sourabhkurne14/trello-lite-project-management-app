import { useDrop } from "react-dnd";
import { Task } from "./Task";
import { useAuth } from "@/context/AuthContext";

export const List = ({ list, onDropTask, onDeleteTask, onDeleteList}) => {
    const [, drop] = useDrop(() => ({
        accept: 'task',
        drop: (item) => {
            onDropTask(item.id, list._id);
        }
    }));

    return(
        <div ref={drop} style={{minHeight: '100px', background: 'lightgray', padding: '1rem'}} >
          <h2 className="text-gray-900 font-bold">
            {list.title}
            <button onClick={() => onDeleteList(list._id)} 
            className="ml-2 text-red-600 hover:text-red-800 text-sg"
            style={{float: 'right'}}>
                delete-list
            </button>
          </h2>
            {(list.tasks || []).map((task) => (
                <Task key={task._id} task={task} onDeleteTask={onDeleteTask}/>
            ))}
        </div>
    );
};