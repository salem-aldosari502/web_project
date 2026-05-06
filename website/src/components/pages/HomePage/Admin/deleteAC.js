import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './deleteac.css';

const API = 'http://localhost:5001/api';
const token = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

function DeleteAc() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [foundUser, setFoundUser] = useState(null);
  const [reason, setReason] = useState('');
  const [feedback, setFeedback] = useState({ type: '', text: '' });
  const [deleting, setDeleting] = useState(false);

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
    setFoundUser(null);
    const found = users.find(
      (u) => u.email.toLowerCase() === searchEmail.trim().toLowerCase()
    );
    if (!found) {
      setFeedback({ type: 'error', text: 'No user found with that email address.' });
      return;
    }
    setFoundUser(found);
  };

  const handleDelete = async () => {
    if (!foundUser) return;
    if (!window.confirm(`Permanently delete "${foundUser.name}"? This cannot be undone.`)) return;

    setDeleting(true);
    setFeedback({ type: '', text: '' });
    try {
      const res = await fetch(`${API}/users/${foundUser._id}`, {
        method: 'DELETE',
        headers: authHeader(),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      setFeedback({ type: 'success', text: `Account for "${foundUser.name}" has been deleted.` });
      setFoundUser(null);
      setSearchEmail('');
      setReason('');
      setUsers((prev) => prev.filter((u) => u._id !== foundUser._id));
    } catch (err) {
      setFeedback({ type: 'error', text: `Delete failed: ${err.message}` });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="ud-page">
      <div className="ud-shell">
        <div className="ud-header">
          <div>
            <span className="ud-badge">Admin Panel</span>
            <h1>Delete Account</h1>
            <p>Remove user accounts permanently from the system.</p>
          </div>
          <Link to="/admin" className="ud-back-btn">← Back to Dashboard</Link>
        </div>

        {/* Search card */}
        <div className="ud-card">
          <div className="ud-card-top">
            <div>
              <h2>Find Account to Delete</h2>
              <span>Permanent action — cannot be undone</span>
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

          <form onSubmit={handleFind}>
            <div className="sm-grid">
              <div className="sm-field">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="user@example.com"
                  value={searchEmail}
                  onChange={(e) => { setSearchEmail(e.target.value); setFoundUser(null); }}
                  required
                  list="delete-email-list"
                />
                <datalist id="delete-email-list">
                  {users.map((u) => (
                    <option key={u._id} value={u.email}>{u.name}</option>
                  ))}
                </datalist>
              </div>

              <div className="sm-field sm-field-full">
                <label>Reason for Deletion</label>
                <textarea
                  placeholder="Why is this account being deleted?"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>
            </div>

            <div className="sm-actions">
              <Link to="/admin" className="sm-btn sm-btn-secondary">Cancel</Link>
              <button type="submit" className="sm-btn sm-btn-secondary" disabled={loadingUsers}>
                {loadingUsers ? 'Loading...' : 'Find User'}
              </button>
            </div>
          </form>

          {/* User preview */}
          {foundUser && (
            <div style={{
              marginTop: 20, padding: '16px 20px', borderRadius: 16,
              border: '1px solid #E24B4A', background: '#FFF5F5',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>{foundUser.name}</p>
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: '#555' }}>{foundUser.email}</p>
                  <p style={{ margin: '2px 0 0', fontSize: 13, color: '#888' }}>
                    Role: {foundUser.role || 'user'} &nbsp;·&nbsp;
                    Joined: {foundUser.createdAt ? new Date(foundUser.createdAt).toLocaleDateString() : '—'}
                  </p>
                </div>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  style={{
                    padding: '11px 22px', borderRadius: 14, border: 'none',
                    background: '#E24B4A', color: '#fff', fontWeight: 700,
                    fontSize: 14, cursor: deleting ? 'not-allowed' : 'pointer',
                    opacity: deleting ? 0.7 : 1,
                  }}
                >
                  {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeleteAc;
