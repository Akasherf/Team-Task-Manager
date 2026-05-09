import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <div className="container mt-4">
        <h1 className="text-center mb-4">Team Task Manager</h1>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<h2 className="text-center mt-5">Dashboard (Coming Soon)</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
