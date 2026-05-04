import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './admin.css';

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const quickActions = [
    { title: 'Edit User', description: 'Modify user accounts', link: '/edituser', icon: '✎' },
    { title: 'Delete Account', description: 'Remove user accounts', link: '/delete', icon: '✕' },
    { title: 'Send Message', description: 'Message users directly', link: '/sendmessage', icon: '✉' },
    { title: 'User Data', description: 'View all users', link: '/userdata', icon: '☰' }
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5001/api/users/all', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    // eslint-disable-next-line no-restricted-globals, no-alert
    if (confirm('Delete user?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5001/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        fetchUsers();
      } catch (err) {
        // eslint-disable-next-line no-alert
        alert('Delete failed');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="ud-page">
      <div className="ud-shell">
        <div className="ud-header">
          <div>
            <span className="ud-badge">Admin Panel</span>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
        </div>

        <div className="ud-stats">
          <div className="ud-stat-card">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="ud-stat-card">
            <span>Active Now</span>
            <strong>89</strong>
          </div>
          <div className="ud-stat-card">
            <span>New This Month</span>
            <strong>142</strong>
          </div>
          <div className="ud-stat-card">
            <span>Messages Sent</span>
            <strong>3,842</strong>
          </div>
        </div>

        <div className="admin-quick-actions">
          <h2>Quick Actions</h2>
          <div className="admin-actions-grid">
            {quickActions.map((action, index) => (
              <Link to={action.link} key={index} className="admin-action-card">
                <div className="admin-action-icon">{action.icon}</div>
                <div>
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="ud-card">
          <div className="ud-card-top">
            <div>
              <h2>Recent Users</h2>
              <span>Latest registered accounts</span>
            </div>
            <Link to="/userdata" className="admin-view-all">View All →</Link>
          </div>

          <div className="ud-table-wrap">
            <table className="ud-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(-4).slice().reverse().map((user) => (
                  <tr key={user._id || user.id}>
                    <td>
                      <div className="ud-user-cell">
                        <div className="ud-avatar">
                          {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        {user.name || user.email}
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>{user.role || 'user'}</td>
                    <td>
                      <span className={`ud-status ud-status-active`}>
                        Active
                      </span>
                      <button onClick={() => deleteUser(user._id || user.id)} className="delete-btn">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;