import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Register.css';

const Register = () => {
  // Updated form state with customer/manager roles
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'customer' // Changed default from 'employee' to 'customer'
  });
  const navigate = useNavigate();

  // Registration API handler
  const handleRegister = async () => {
    try {
      await axios.post('https://customerservicefeedback.onrender.com/api/auth/register', form);
      toast.success('Registered successfully! Redirecting to login...', {
        position: 'top-right',
        autoClose: 3000,
      });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      toast.error(`❌ ${err.response?.data?.message || 'Registration failed'}`, {
        position: 'top-right',
        autoClose: 4000,
      });
    }
  };

  return (
    <motion.div
      className="register-container"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Home navigation */}
      <button className="home-button" onClick={() => navigate('/')}>🏠 Home</button>
      <ToastContainer />
      <h2 className="register-title">Create your account</h2>
      <p className="register-subtitle">Join our Customer Feedback System</p>
      
      {/* Form Inputs */}
      <input
        className="register-input"
        placeholder="Full Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="register-input"
        type="email"
        placeholder="Email Address"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="register-input"
        type="password"
        placeholder="Password (min 6 characters)"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      
      {/* Updated role selection for Customer Feedback System */}
      <select
        className="register-input"
        value={form.role}
        onChange={(e) => setForm({ ...form, role: e.target.value })}
      >
        <option value="customer">User</option>
        <option value="manager">Admin</option>
      </select>
      
      <button className="register-button" onClick={handleRegister}>
        Register
      </button>


      
      
    </motion.div>
  );
};

export default Register;
