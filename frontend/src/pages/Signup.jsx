import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

function Signup() {
    const [formData, setFormData] = useState({
        name: '', email: '', password: '', role: '', qualification: '', jobTitle: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("https://devstack-api-shi6.onrender.com/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
        });
        if (res.ok) {
            alert("Signup successful!");
            navigate("/login");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                <input placeholder="Full Name" required onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="email" placeholder="Email" required onChange={e => setFormData({...formData, email: e.target.value})} />
                <input type="password" placeholder="Password" required onChange={e => setFormData({...formData, password: e.target.value})} />
                
                <select required onChange={e => setFormData({...formData, role: e.target.value})}>
                    <option value="">I am a...</option>
                    <option value="student">Student</option>
                    <option value="worker">Worker</option>
                </select>

                {/* Conditional Fields */}
                {formData.role === 'student' && (
                    <input placeholder="Highest Qualification" required onChange={e => setFormData({...formData, qualification: e.target.value})} />
                )}

                {formData.role === 'worker' && (
                    <input placeholder="Current Job Title" required onChange={e => setFormData({...formData, jobTitle: e.target.value})} />
                )}

                <button type="submit">Sign Up</button>
                <button style={{marginTop: '15px', fontSize: '14px'}}>
                 <a href="/login">login</a>
                </button>
            </form>
        </div>
    );
}

export default Signup;
