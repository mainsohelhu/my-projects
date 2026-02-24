import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "seeker" });
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Account ban gaya! Ab Login karo. 🚀");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Kuch galti hui hai!");
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSignup} className="job-form">
        <h2>📝 Create Account</h2>
        <input type="text" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        <input type="email" placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        
        <label style={{fontWeight: 'bold', marginBottom: '-10px'}}>I am a:</label>
        <select 
          style={{padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0'}}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
        >
          <option value="seeker">🔍 Job Seeker</option>
          <option value="recruiter">🏢 Recruiter</option>
        </select>

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;