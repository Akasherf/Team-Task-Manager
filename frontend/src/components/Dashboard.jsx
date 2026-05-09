import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from './Navbar';

const Dashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8084';
                const response = await axios.get(`${API_URL}/api/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (err) {
                setError('Failed to fetch dashboard stats.');
            }
        };
        fetchStats();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container">
                <h2 className="mb-4">My Dashboard</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="row">
                    <div className="col-md-3">
                        <div className="card text-white bg-primary mb-3 shadow-sm">
                            <div className="card-header">Total Tasks</div>
                            <div className="card-body"><h2 className="card-title">{stats.total}</h2></div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-dark bg-light mb-3 shadow-sm border-secondary">
                            <div className="card-header border-secondary">Pending</div>
                            <div className="card-body"><h2 className="card-title">{stats.pending}</h2></div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-dark bg-warning mb-3 shadow-sm">
                            <div className="card-header">In Progress</div>
                            <div className="card-body"><h2 className="card-title">{stats.inProgress}</h2></div>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="card text-white bg-success mb-3 shadow-sm">
                            <div className="card-header">Completed</div>
                            <div className="card-body"><h2 className="card-title">{stats.completed}</h2></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Dashboard;
