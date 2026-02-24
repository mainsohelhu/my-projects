import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import JobList from "./pages/JobList.jsx";
import JobPost from "./pages/JobPost.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import './App.css';

function App() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <Router>
      <div className="container">
        <nav className="navbar">
          <Link to="/" className="nav-link">🔍 Jobs</Link>
          
          {/* Sirf Recruiter ko Post Job dikhega */}
          {token && role === "recruiter" && (
            <Link to="/post" className="nav-link">➕ Post Job</Link>
          )}

          {!token ? (
            <>
              <Link to="/login" className="nav-link">🔑 Login</Link>
              <Link to="/signup" className="nav-link">📝 Signup</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="nav-link" style={{background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444'}}>
              🚪 Logout
            </button>
          )}
        </nav>

        <Routes>
          <Route path="/" element={<JobList />} />
          <Route path="/post" element={token && role === "recruiter" ? <JobPost /> : <Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;