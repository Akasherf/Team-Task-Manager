import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');

    const fetchProjects = async () => {
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8084';
            const response = await axios.get(`${API_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProjects(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8084';
            await axios.post(`${API_URL}/api/projects`, { name, description }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage({ text: 'Project created successfully!', type: 'success' });
            setName('');
            setDescription('');
            fetchProjects();
        } catch (err) {
            setMessage({ text: 'Error: Only Admins can create projects.', type: 'danger' });
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col-md-8">
                        <h2>All Projects</h2>
                        <div className="list-group mt-3 shadow-sm">
                            {projects?.map(p => (
                                <div key={p.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5 className="mb-1">{p.name}</h5>
                                        <small className="text-muted">{p.description}</small>
                                    </div>
                                    <Link to={`/projects/${p.id}/tasks`} className="btn btn-sm btn-outline-primary">View Tasks</Link>
                                </div>
                            ))}
                        </div>
                        {projects.length === 0 && <p className="mt-3 text-muted">No projects found.</p>}
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm border-0 bg-light">
                            <div className="card-body">
                                <h4>Create Project</h4>
                                {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}
                                <form onSubmit={handleCreateProject}>
                                    <div className="mb-2">
                                        <label>Project Name</label>
                                        <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} required />
                                    </div>
                                    <div className="mb-3">
                                        <label>Description</label>
                                        <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required></textarea>
                                    </div>
                                    <button type="submit" className="btn btn-success w-100">Create</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Projects;
