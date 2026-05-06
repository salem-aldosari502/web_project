import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './userdata.css';

function UserData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5001/api/users/all', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const d = await res.json();
          setError(d.message || 'Access denied');
          return;
        }
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError('Failed to load users: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter((u) =>
      `${u.name} ${u.email} ${u.role || 'user'}`.toLowerCase().includes(q)
    );
  }, [search, users]);

  const activeCount = users.filter((u) => u.role !== 'blocked').length;
  const adminCount = users.filter((u) => u.role === 'admin').length;

  if (loading) return <div className="ud-page"><div className="ud-shell"><p>Loading users...</p></div></div>;
  if (error) return <div className="ud-page"><div className="ud-shell"><p style={{ color: 'red' }}>Error: {error}</p></div></div>;

  return (
    <div className="ud-page">
      <div className="ud-shell">
        <div className="ud-header">
          <div>
            <span className="ud-badge">Admin Panel</span>
            <h1>Users Data</h1>
            <p>View and manage all registered user accounts.</p>
          </div>
          <Link to="/admin" className="ud-back-btn">← Back to Dashboard</Link>
        </div>

        <div className="ud-stats">
          <div className="ud-stat-card">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="ud-stat-card">
            <span>Regular Users</span>
            <strong>{activeCount - adminCount}</strong>
          </div>
          <div className="ud-stat-card">
            <span>Admins</span>
            <strong>{adminCount}</strong>
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
                placeholder="Search name, email, or role..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="ud-table-wrap">
            <table className="ud-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Gender</th>
                  <th>Joined</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="ud-user-cell">
                          <div className="ud-avatar">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <span>{user.name}</span>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || '—'}</td>
                      <td>{user.gender || '—'}</td>
                      <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}</td>
                      <td>
                        <span className={`ud-status ${user.role === 'admin' ? 'ud-status-pending' : 'ud-status-active'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="ud-empty">No users found.</td>
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
