import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './userdata.css';

const users = [
  { id: 1, name: 'Ahmed Ali', email: 'ahmed@example.com', date: '2026-04-18', status: 'Active' },
  { id: 2, name: 'Sara Khaled', email: 'sara@example.com', date: '2026-04-17', status: 'Pending' },
  { id: 3, name: 'Mohammed Naser', email: 'mohammed@example.com', date: '2026-04-16', status: 'Active' },
  { id: 4, name: 'Fatima Hasan', email: 'fatima@example.com', date: '2026-04-15', status: 'Blocked' },
  { id: 5, name: 'Ali يوسف', email: 'ali@example.com', date: '2026-04-14', status: 'Active' }
];

function UserData() {
  const [search, setSearch] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email} ${user.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="ud-page">
      <div className="ud-shell">
        <div className="ud-header">
          <div>
            <span className="ud-badge">Admin Panel</span>
            <h1>Users Data</h1>
            <p>Manage user records with a cleaner and more modern table layout.</p>
          </div>

          <Link to="/" className="ud-back-btn">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="ud-stats">
          <div className="ud-stat-card">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>

          <div className="ud-stat-card">
            <span>Active</span>
            <strong>{users.filter((u) => u.status === 'Active').length}</strong>
          </div>

          <div className="ud-stat-card">
            <span>Pending</span>
            <strong>{users.filter((u) => u.status === 'Pending').length}</strong>
          </div>
        </div>

        <div className="ud-card">
          <div className="ud-card-top">
            <div>
              <h2>User Directory</h2>
              <span>Search, view, and review user information</span>
            </div>

            <div className="ud-search-box">
              <input
                type="text"
                placeholder="Search name, email, or status..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ud-table-wrap">
            <table className="ud-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td>#{user.id}</td>
                      <td>
                        <div className="ud-user-cell">
                          <div className="ud-avatar">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.date}</td>
                      <td>
                        <span
                          className={`ud-status ${
                            user.status === 'Active'
                              ? 'ud-status-active'
                              : user.status === 'Pending'
                              ? 'ud-status-pending'
                              : 'ud-status-blocked'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="ud-empty">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserData;