import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('MEMBER');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8084/api/auth/signup', {
                name, email, password, role
            });
            navigate('/login');
        } catch (err) {
            setError('Error during signup. Please try again.');
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow-sm mt-5">
                    <div className="card-body">
                        <h3 className="card-title text-center mb-4">Sign Up</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSignup}>
                            <div className="mb-3">
                                <label>Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label>Email</label>
                                <input 
                                    type="email" 
                                    className="form-control" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label>Password</label>
                                <input 
                                    type="password" 
                                    className="form-control" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label>Role</label>
                                <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="MEMBER">Member</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="btn btn-success w-100">Sign Up</button>
                        </form>
                        <div className="text-center mt-3">
                            <Link to="/login">Already have an account? Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
