import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auth.css';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("token", data.token); 
                localStorage.setItem("user", JSON.stringify(data.user));// Save the VIP Pass
                navigate("/dashboard");
            } else {
                alert(data.message || "Login failed");
            }
        } catch (err) {
            alert("Server error. Is your backend running?");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleLogin}>
                <h2>Login</h2>
                <input type="email" placeholder="Email" required onChange={e => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" required onChange={e => setPassword(e.target.value)} />
                <button type="submit">Enter Vault</button>
                <button style={{marginTop: '15px', fontSize: '14px'}}>
                    Don't have an account? <a href="/">Sign up</a>
                </button>
            </form>
            
        </div>
    );
}

export default Login;