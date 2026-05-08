import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './edituser.css';

const API = `${process.env.REACT_APP_API_URL}/api`;
const token = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

function EditUser() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    role: 'user',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(`${API}/users/all`, { headers: authHeader() });
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  const handleFind = (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });
    const found = users.find(
      (u) => u.email.toLowerCase() === searchEmail.trim().toLowerCase()
    );
    if (!found) {
      setFeedback({ type: 'error', text: 'No user found with that email address.' });
      setSelectedUser(null);
      return;
    }
    setSelectedUser(found);
    setFormData({
      name: found.name || '',
      email: found.email || '',
      phone: found.phone || '',
      gender: found.gender || '',
      role: found.role || 'user',
      password: '',
      confirmPassword: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    setFeedback({ type: '', text: '' });

    if (formData.password && formData.password !== formData.confirmPassword) {
      setFeedback({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    const body = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      gender: formData.gender,
      role: formData.role,
    };
    if (formData.password) body.password = formData.password;

    setSaving(true);
    try {
      const res = await fetch(`${API}/users/${selectedUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      setFeedback({ type: 'success', text: 'User updated successfully.' });
      setSelectedUser(data);
      setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));

      const listRes = await fetch(`${API}/users/all`, { headers: authHeader() });
      const list = await listRes.json();
      setUsers(Array.isArray(list) ? list : []);
    } catch (err) {
      setFeedback({ type: 'error', text: `Update failed: ${err.message}` });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ud-page">
      <div className="ud-shell">
        <div className="ud-header">
          <div>
            <span className="ud-badge">Admin Panel</span>
            <h1>Edit User</h1>
            <p>Search for a user by email, then modify their account details.</p>
          </div>
          <Link to="/admin" className="ud-back-btn">← Back to Dashboard</Link>
        </div>

        <div className="ud-card" style={{ marginBottom: '1.5rem' }}>
          <div className="ud-card-top">
            <div>
              <h2>Find User</h2>
              <span>Enter the email address of the user to edit</span>
            </div>
          </div>
          <form onSubmit={handleFind} style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
            <div className="sm-field" style={{ flex: 1 }}>
              <label>User Email</label>
              <input
                type="email"
                placeholder="user@example.com"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                required
                list="user-email-list"
              />
              <datalist id="user-email-list">
                {users.map((u) => (
                  <option key={u._id} value={u.email}>{u.name}</option>
                ))}
              </datalist>
            </div>
            <button type="submit" className="sm-btn sm-btn-primary" disabled={loadingUsers}>
              {loadingUsers ? 'Loading...' : 'Find User'}
            </button>
          </form>
          {feedback.text && !selectedUser && (
            <div style={{
              marginTop: 12, padding: '10px 14px', borderRadius: 8,
              background: feedback.type === 'success' ? '#E8F7EF' : '#FBE9E9',
              color: feedback.type === 'success' ? '#0F6B3A' : '#9C2A2A', fontSize: 14,
            }}>
              {feedback.text}
            </div>
          )}
        </div>

        {selectedUser && (
          <div className="ud-card">
            <div className="ud-card-top">
              <div>
                <h2>Edit: {selectedUser.name}</h2>
                <span>Update account details below. Leave password blank to keep it unchanged.</span>
              </div>
            </div>

            {feedback.text && (
              <div style={{
                marginBottom: 16, padding: '10px 14px', borderRadius: 8,
                background: feedback.type === 'success' ? '#E8F7EF' : '#FBE9E9',
                color: feedback.type === 'success' ? '#0F6B3A' : '#9C2A2A', fontSize: 14,
              }}>
                {feedback.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="sm-grid">
                <div className="sm-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="sm-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="sm-field">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="sm-field">
                  <label>Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    style={{
                      width: '100%', border: '1px solid #dee2e6', background: '#fff',
                      borderRadius: 16, padding: '14px 16px', fontSize: 15, color: '#000',
                      outline: 'none',
                    }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="sm-field">
                  <label>New Password</label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Leave blank to keep current"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <div className="sm-field">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Repeat new password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>

                <div className="sm-field sm-field-full">
                  <label>Gender</label>
                  <div className="ud-gender-group">
                    {['Male', 'Female'].map((g) => (
                      <label key={g} className="ud-radio-label">
                        <input
                          type="radio"
                          name="gender"
                          value={g}
                          checked={formData.gender === g}
                          onChange={handleChange}
                        />
                        <span className="ud-radio-custom"></span>
                        {g}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sm-actions">
                <button
                  type="button"
                  className="sm-btn sm-btn-secondary"
                  onClick={() => { setSelectedUser(null); setFeedback({ type: '', text: '' }); }}
                >
                  Cancel
                </button>
                <button type="submit" className="sm-btn sm-btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditUser;
