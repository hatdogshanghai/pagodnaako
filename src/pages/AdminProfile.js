import React, { useState } from 'react';
import './AdminProfile.css';

const AdminProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@yogee.com',
    role: 'Administrator',
    joined: 'January 1, 2025',
  });

  return (
    <div className="profile-container">
      <header className="header">
        <h1>Admin Profile</h1>
      </header>

      <main className="profile-main">
        <div className="profile-card">
          <img
            src="/admin-avatar.png"
            alt="Admin Avatar"
            className="profile-avatar"
          />
          <h2>{profile.name}</h2>
          <p>Email: {profile.email}</p>
          <p>Role: {profile.role}</p>
          <p>Joined: {profile.joined}</p>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 Yogee. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminProfile;