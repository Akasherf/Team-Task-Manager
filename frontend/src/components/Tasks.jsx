import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Tasks = () => {
    const { projectId } = useParams();
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedToId, setAssignedToId] = useState('');
    const [message, setMessage] = useState('');

    const fetchTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8084';
            const response = await axios.get(`${API_URL}/api/tasks/project/${projectId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [projectId]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8084';
            await axios.post(`${API_URL}/api/tasks`, {
                title,
                description,
                project: { id: projectId },
                assignedTo: assignedToId ? { id: assignedToId } : null
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Task created successfully!', type: 'success' });
            setTitle('');
            setDescription('');
            setAssignedToId('');
            fetchTasks();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error: Only Admins can create tasks.';
            setMessage({ text: errorMessage, type: 'danger' });
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8084';
            await axios.put(`${API_URL}/api/tasks/${taskId}/status?status=${newStatus}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch (err) {
            alert('Not authorized to update this task. You can only update tasks assigned to you.');
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'COMPLETED') return 'bg-success';
        if (status === 'IN_PROGRESS') return 'bg-warning text-dark';
        return 'bg-secondary';
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <h2>Task Board</h2>
                        <div className="row mt-3">
                            {tasks?.map(t => (
                                <div key={t.id} className="col-md-6 mb-3">
                                    <div className="card shadow-sm h-100 border-0 bg-light">
                                        <div className="card-body">
                                            <h5 className="card-title">{t.title}</h5>
                                            <p className="card-text text-muted mb-2">{t.description}</p>
                                            <p className="small mb-2">Assigned User ID: {t.assignedTo ? t.assignedTo.id : 'Unassigned'}</p>
                                            <span className={`badge ${getStatusBadge(t.status)} mb-3`}>{t.status}</span>
                                            
                                            <select 
                                                className="form-select form-select-sm" 
                                                value={t.status} 
                                                onChange={(e) => handleStatusChange(t.id, e.target.value)}
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                                <option value="COMPLETED">COMPLETED</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {tasks.length === 0 && <p className="text-muted">No tasks found for this project.</p>}
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body">
                                <h4>Add Task</h4>
                                {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                                <form onSubmit={handleCreateTask}>
                                    <div className="mb-2">
                                        <label>Task Title</label>
                                        <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
                                    </div>
                                    <div className="mb-2">
                                        <label>Description</label>
                                        <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                                    </div>
                                    <div className="mb-3">
                                        <label>Assign To (User ID)</label>
                                        <input type="number" className="form-control" placeholder="Optional" value={assignedToId} onChange={e => setAssignedToId(e.target.value)} />
                                    </div>
                                    <button type="submit" className="btn btn-success w-100">Create Task</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Tasks;
