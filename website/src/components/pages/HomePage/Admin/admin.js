import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './admin.css';
NODE_TLS_REJECT_UNAUTHORIZED
function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);
  const [msgFilter, setMsgFilter] = useState('all');

  const quickActions = [
    { title: 'Edit User', description: 'Modify user accounts', link: '/edituser', icon: '✎' },
    { title: 'Delete Account', description: 'Remove user accounts', link: '/delete', icon: '✕' },
    { title: 'Send Message', description: 'Message users directly', link: '/sendmessage', icon: '✉' },
    { title: 'User Data', description: 'View all users', link: '/userdata', icon: '☰' },
  ];

  const fetchUsers = async () => {
    const controller = new AbortController();
    const { signal } = controller;
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found. Please log in again.');
        setUsers([]);
        setLoading(false);
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/all`, {
        signal,
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Access denied');
        setUsers([]);
        return;
      }
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please try again.');
      } else {
        setError(`Failed to fetch users: ${err.message}`);
      }
      setUsers([]);
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) return;
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch {
      // ignore silently
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchMessages();
  }, []);

  const handleReply = async (id) => {
    if (!replyText.trim()) return;
    setReplyLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${id}/reply`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ adminReply: replyText }),
      });
      if (!response.ok) {
        const data = await response.json();
        window.alert(data.message || 'Reply failed');
        return;
      }
      setReplyText('');
      setSelectedMsg(null);
      fetchMessages();
    } catch {
      window.alert('Reply failed. Please try again.');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleIgnore = async (id) => {
    if (!window.confirm('Mark this message as ignored?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${id}/ignore`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedMsg(null);
      fetchMessages();
    } catch {
      window.alert('Failed to ignore message.');
    }
  };

  const handleDeleteMsg = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedMsg(null);
      fetchMessages();
    } catch {
      window.alert('Failed to delete message.');
    }
  };

  const openMessage = async (msg) => {
    setSelectedMsg(msg);
    setReplyText('');
    if (msg.status === 'unread') {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${process.env.REACT_APP_API_URL}/api/messages/${msg._id}/read`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchMessages();
      } catch {
        // ignore
      }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Delete user?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const data = await response.json();
          window.alert(data.message || 'Delete failed');
          return;
        }
        fetchUsers();
      } catch {
        window.alert('Delete failed');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const now = new Date();
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const activeNowCount = users.length;
  const newThisMonthCount = users.filter((u) => {
    if (!u.createdAt) return false;
    const d = new Date(u.createdAt);
    return d >= startOfThisMonth && d <= now;
  }).length;

  const unreadCount = messages.filter((m) => m.status === 'unread').length;
  const messagesSentCount = messages.filter((m) => m.direction === 'out').length;

  const filteredMessages = messages.filter((m) => {
    if (msgFilter === 'all') return true;
    return m.status === msgFilter;
  });

  const statusColor = (status) => {
    if (status === 'unread') return '#000';
    if (status === 'replied') return '#444';
    if (status === 'ignored') return '#888';
    return '#222';
  };

  const statusBg = (status) => {
    if (status === 'unread') return '#000';
    if (status === 'replied') return '#444';
    if (status === 'ignored') return '#ccc';
    return '#e9ecef';
  };

  const statusText = (status) => {
    if (status === 'unread') return '#fff';
    if (status === 'replied') return '#fff';
    if (status === 'ignored') return '#555';
    return '#000';
  };

  return (
    <div className="ud-page">
      <div className="ud-shell">

        {/* Header */}
        <div className="ud-header">
          <div>
            <span className="ud-badge">Admin Panel</span>
            <h1>Dashboard</h1>
            <p>Welcome back! Here's what's happening today.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="ud-stats">
          <div className="ud-stat-card">
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
          <div className="ud-stat-card">
            <span>Active Now</span>
            <strong>{activeNowCount}</strong>
          </div>
          <div className="ud-stat-card">
            <span>New This Month</span>
            <strong>{newThisMonthCount}</strong>
          </div>
          <div className="ud-stat-card">
            <span>Messages Sent</span>
            <strong>{messagesSentCount}</strong>
          </div>
        </div>

        {/* Quick Actions */}
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

        {/* ── User Messages Panel ────────────────────────────────────────── */}
        <div className="ud-card" style={{ marginTop: '2rem' }}>
          <div className="ud-card-top">
            <div>
              <h2>
                User Messages
                {unreadCount > 0 && (
                  <span style={{
                    marginLeft: '10px',
                    background: '#000',
                    color: '#fff',
                    borderRadius: '99px',
                    fontSize: '12px',
                    padding: '2px 10px',
                    fontWeight: 600,
                  }}>
                    {unreadCount} unread
                  </span>
                )}
              </h2>
              <span>Messages submitted by users</span>
            </div>
            {/* Filter tabs */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['all', 'unread', 'read', 'replied', 'ignored'].map((f) => (
                <button
                  key={f}
                  onClick={() => setMsgFilter(f)}
                  style={{
                    padding: '4px 12px',
                    borderRadius: '99px',
                    border: '1px solid',
                    borderColor: msgFilter === f ? '#000' : '#ccc',
                    background: msgFilter === f ? '#000' : 'transparent',
                    color: msgFilter === f ? '#fff' : '#555',
                    fontSize: '12px',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {messagesLoading ? (
            <p style={{ padding: '1rem', color: '#888' }}>Loading messages...</p>
          ) : filteredMessages.length === 0 ? (
            <p style={{ padding: '1rem', color: '#888' }}>No messages found.</p>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>

              {/* Message list */}
              <div style={{ flex: '1', minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredMessages.map((msg) => (
                  <div
                    key={msg._id}
                    onClick={() => openMessage(msg)}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '10px',
                      border: `1px solid ${selectedMsg?._id === msg._id ? '#000' : '#dee2e6'}`,
                      background: selectedMsg?._id === msg._id ? '#f0f0f0' : '#fff',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <strong style={{ fontSize: '14px' }}>{msg.senderName}</strong>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '99px',
                        background: statusBg(msg.status),
                        color: statusText(msg.status),
                        fontWeight: 500,
                        textTransform: 'capitalize',
                      }}>
                        {msg.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#555', marginBottom: '2px' }}>{msg.subject}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {msg.senderEmail} · {new Date(msg.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message detail / reply panel */}
              {selectedMsg && (
                <div style={{
                  flex: '1.4',
                  minWidth: 0,
                  border: '1px solid #dee2e6',
                  borderRadius: '12px',
                  padding: '20px',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '16px' }}>{selectedMsg.subject}</h3>
                      <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#555' }}>
                        From: <strong>{selectedMsg.senderName}</strong> &lt;{selectedMsg.senderEmail}&gt;
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#888' }}>
                        {new Date(selectedMsg.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedMsg(null)}
                      style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#555' }}
                    >✕</button>
                  </div>

                  {/* Message body */}
                  <div style={{
                    background: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    color: '#000',
                  }}>
                    {selectedMsg.body}
                  </div>

                  {/* Previous reply if exists */}
                  {selectedMsg.adminReply && (
                    <div style={{
                      background: '#f0f0f0',
                      borderLeft: '3px solid #000',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      fontSize: '13px',
                      color: '#000',
                    }}>
                      <strong>Your previous reply:</strong>
                      <p style={{ margin: '6px 0 0', whiteSpace: 'pre-wrap' }}>{selectedMsg.adminReply}</p>
                      <span style={{ fontSize: '11px', color: '#555' }}>
                        Sent: {new Date(selectedMsg.repliedAt).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Reply box — hidden if already ignored */}
                  {selectedMsg.status !== 'ignored' && (
                    <>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your reply..."
                        rows={4}
                        style={{
                          width: '100%',
                          borderRadius: '8px',
                          border: '1px solid #dee2e6',
                          padding: '10px 12px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                          background: '#fff',
                          color: '#000',
                        }}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => handleReply(selectedMsg._id)}
                          disabled={replyLoading || !replyText.trim()}
                          style={{
                            flex: 1,
                            padding: '10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: '#000',
                            color: '#fff',
                            fontWeight: 600,
                            fontSize: '14px',
                            cursor: replyLoading || !replyText.trim() ? 'not-allowed' : 'pointer',
                            opacity: replyLoading || !replyText.trim() ? 0.6 : 1,
                          }}
                        >
                          {replyLoading ? 'Sending...' : '✉ Send Reply'}
                        </button>
                        <button
                          onClick={() => handleIgnore(selectedMsg._id)}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '8px',
                            border: '1px solid #aaa',
                            background: 'transparent',
                            color: '#555',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          Ignore
                        </button>
                        <button
                          onClick={() => handleDeleteMsg(selectedMsg._id)}
                          style={{
                            padding: '10px 18px',
                            borderRadius: '8px',
                            border: '1px solid #E24B4A',
                            background: 'transparent',
                            color: '#E24B4A',
                            fontSize: '14px',
                            cursor: 'pointer',
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}

                  {/* Ignored state actions */}
                  {selectedMsg.status === 'ignored' && (
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleDeleteMsg(selectedMsg._id)}
                        style={{
                          padding: '10px 18px',
                          borderRadius: '8px',
                          border: '1px solid #E24B4A',
                          background: 'transparent',
                          color: '#E24B4A',
                          fontSize: '14px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Users */}
        <div className="ud-card" style={{ marginTop: '2rem' }}>
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
                {users.slice(-4).reverse().map((user) => (
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
                      <span className="ud-status ud-status-active">Active</span>
                      <button
                        onClick={() => deleteUser(user._id || user.id)}
                        className="delete-btn"
                      >
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