import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/dasboard.css'; // Make sure the path is correct

function Dashboard() {
    const [resources, setResources] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showProfile, setShowProfile] = useState(false); // 1. State for Profile Dropdown
    const [filter, setFilter] = useState("All"); 
    const [formData, setFormData] = useState({ title: '', link: '', category: '', description: '' });
    
    const navigate = useNavigate();

    // 2. Safely get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user")) || { name: "User", role: "Developer" };

    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/resources/all", {
            headers: { "Authorization": token }
        });
        const data = await res.json();
        setResources(data);
    };

    const handleAddResource = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/resources/add", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": token 
            },
            body: JSON.stringify(formData)
        });

        if (res.ok) {
            setShowModal(false);
            fetchResources();
            setFormData({ title: '', link: '', category: '', description: '' });
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const filteredResources = filter === "All" 
        ? resources 
        : resources.filter(r => r.category === filter);

    return (
        <div className="main-wrapper">
            <aside className="sidebar">
                <div className="logo-container">DEVSTACK</div>
                <nav>
                    <button className={filter === "All" ? "active" : ""} onClick={() => setFilter("All")}>Home</button>
                    <button className={filter === "Documentation" ? "active" : ""} onClick={() => setFilter("Documentation")}>Documentation</button>
                    <button className={filter === "Codes" ? "active" : ""} onClick={() => setFilter("Codes")}>Codes</button>
                    <button className={filter === "Errors" ? "active" : ""} onClick={() => setFilter("Errors")}>Errors</button>
                </nav>
                
                <button className="add-btn" onClick={() => setShowModal(true)}>+ Add New</button>
                {/* Logout button removed from here as per your request */}
            </aside>

            <main className="content-area">
                {/* 3. NEW HEADER with Profile Section */}
                <header className="content-header">
                    <div className="profile-section" onClick={() => setShowProfile(!showProfile)}>
                        <span className="user-name">{user.name}</span>
                        <div className="profile-icon">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        
                        {/* 4. Dropdown Menu */}
                        {showProfile && (
                            <div className="profile-dropdown">
                                <p><strong>Role:</strong> {user.role}</p>
                                <p><strong>Status:</strong> {user.qualification || user.jobTitle || "Active"}</p>
                                <hr style={{ border: '0.5px solid #313a4a', margin: '10px 0' }} />
                                <button onClick={handleLogout} className="dropdown-logout">Logout</button>
                            </div>
                        )}
                    </div>
                </header>

                <div className="dash-container">
                    <div className="resource-grid">
                        {filteredResources.length > 0 ? (
                            filteredResources.map((r) => (
                                <div className="resource-card" key={r._id}>
                                    <span className="card-tag">{r.category}</span>
                                    <h3 className="card-title">{r.title}</h3>
                                    <p className="card-desc">{r.description}</p>
                                    <a href={r.link} target="_blank" rel="noreferrer" className="card-link">View Link</a>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: '#a3a3a3' }}>No resources found in this category.</p>
                        )}
                    </div>
                </div>
            </main>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Resource</h3>
                        <form onSubmit={handleAddResource}>
                            <input placeholder="Title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                            <input placeholder="URL (https://...)" required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} />
                            
                            <select 
                                required 
                                className="modal-input" 
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value})}
                                style={{ width: '100%', marginBottom: '15px', padding: '10px', background: '#141b2d', color: 'white', border: '1px solid #313a4a', borderRadius: '6px' }}
                            >
                                <option value="">Select Category</option>
                                <option value="Documentation">Documentation</option>
                                <option value="Codes">Codes</option>
                                <option value="Errors">Errors</option>
                            </select>

                            <textarea placeholder="Short Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            <button type="submit" className="add-btn">Save to Vault</button>
                            <button type="button" onClick={() => setShowModal(false)} style={{background: 'none', color: 'white', marginTop: '10px', cursor: 'pointer'}}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Dashboard;