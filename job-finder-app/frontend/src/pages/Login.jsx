import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token); // Token save kar lo
      localStorage.setItem("role", res.data.user.role); // Role bhi save kar lo
      alert(`Welcome ${res.data.user.name}!`);
      navigate("/"); // Home page par bhejo
      window.location.reload(); // Navbar refresh karne ke liye
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleLogin} className="job-form">
        <h2>🔑 Login</h2>
        <input type="email" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;