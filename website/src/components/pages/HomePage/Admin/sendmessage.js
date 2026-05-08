import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './sendmessage.css';

const API = `${process.env.REACT_APP_API_URL}`;

function SendMessage() {
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: ''
  });

  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  const [allMessages, setAllMessages] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({ subject: '', body: '' });
  const [savingEdit, setSavingEdit] = useState(false);

  const token = () => localStorage.getItem('token');
  const authHeader = () => ({ Authorization: `Bearer ${token()}` });

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(`${API}/messages`, { headers: authHeader() });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAllMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      setFeedback({ type: 'error', text: `Could not load messages: ${err.message}` });
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: '', text: '' });

    if (!formData.email.trim() || !formData.message.trim()) {
      setFeedback({ type: 'error', text: 'Recipient email and message are required' });
      return;
    }

    setSending(true);
    try {
      const res = await fetch(`${API}/messages/admin-send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          recipientEmail: formData.email.trim(),
          subject: formData.subject.trim(),
          body: formData.message
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      setFeedback({ type: 'success', text: 'Message sent.' });
      setFormData({ email: '', subject: '', message: '' });
      fetchMessages();
    } catch (err) {
      setFeedback({ type: 'error', text: `Send failed: ${err.message}` });
    } finally {
      setSending(false);
    }
  };

  const startEdit = (msg) => {
    setEditing(msg);
    setEditForm({ subject: msg.subject || '', body: msg.body || '' });
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSavingEdit(true);
    try {
      const res = await fetch(`${API}/messages/${editing._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader() },
        body: JSON.stringify({
          subject: editForm.subject,
          body: editForm.body
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
      setEditing(null);
      fetchMessages();
    } catch (err) {
      setFeedback({ type: 'error', text: `Update failed: ${err.message}` });
    } finally {
      setSavingEdit(false);
    }
  };

  const removeMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const res = await fetch(`${API}/messages/${id}`, {
        method: 'DELETE',
        headers: authHeader()
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `HTTP ${res.status}`);
      }
      fetchMessages();
    } catch (err) {
      setFeedback({ type: 'error', text: `Delete failed: ${err.message}` });
    }
  };

  const sentMessages = allMessages.filter((m) => m.direction === 'out');
  const inboxMessages = allMessages.filter((m) => m.direction === 'in');

  return (
    <div className="ud-page">
      <div className="ud-shell">
        <div className="ud-header">
          <div>
            <span className="ud-badge">Admin Panel</span>
            <h1>Send Message</h1>
            <p>Send announcements, replies, or direct messages to users.</p>
          </div>
          <Link to="/admin" className="ud-back-btn">← Back to Dashboard</Link>
        </div>

        <div className="ud-card">
          <div className="ud-card-top">
            <div>
              <h2>Compose Message</h2>
              <span>Quick and clean message form</span>
            </div>
          </div>

          {feedback.text && (
            <div
              style={{
                margin: '0 0 12px 0',
                padding: '10px 14px',
                borderRadius: 8,
                background: feedback.type === 'success' ? '#E8F7EF' : '#FBE9E9',
                color:      feedback.type === 'success' ? '#0F6B3A' : '#9C2A2A',
                fontSize: 14
              }}
            >
              {feedback.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="sm-grid">
              <div className="sm-field">
                <label>Recipient Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter user email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="sm-field">
                <label>Subject</label>
                <input
                  type="text"
                  name="subject"
                  placeholder="Enter subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="sm-field sm-field-full">
                <label>Message</label>
                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="sm-actions">
              <button
                type="button"
                className="sm-btn sm-btn-secondary"
                onClick={() => setFormData({ email: '', subject: '', message: '' })}
              >
                Clear
              </button>
              <button type="submit" className="sm-btn sm-btn-primary" disabled={sending}>
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>

        <div className="ud-card" style={{ marginTop: '2rem' }}>
          <div className="ud-card-top">
            <div>
              <h2>Sent Messages</h2>
              <span>Messages you sent to users — click edit to change them</span>
            </div>
          </div>
          {loadingList ? (
            <p style={{ padding: '1rem' }}>Loading…</p>
          ) : sentMessages.length === 0 ? (
            <p style={{ padding: '1rem', color: '#777' }}>No messages sent yet.</p>
          ) : (
            <div className="ud-table-wrap">
              <table className="ud-table">
                <thead>
                  <tr>
                    <th>To</th>
                    <th>Subject</th>
                    <th>Body</th>
                    <th>Sent</th>
                    <th style={{ width: 170 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sentMessages.map((m) => (
                    <tr key={m._id}>
                      <td>{m.recipientEmail || '—'}</td>
                      <td>{m.subject}</td>
                      <td style={{ maxWidth: 320, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.body}
                      </td>
                      <td>{new Date(m.createdAt).toLocaleString()}</td>
                      <td>
                        <button className="sm-btn sm-btn-secondary" onClick={() => startEdit(m)} style={{ padding: '6px 12px', fontSize: 13 }}>
                          Edit
                        </button>
                        <button onClick={() => removeMessage(m._id)} className="delete-btn" style={{ marginLeft: 8 }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="ud-card" style={{ marginTop: '2rem' }}>
          <div className="ud-card-top">
            <div>
              <h2>Inbox (from users)</h2>
              <span>Messages submitted via the contact form — edit or delete</span>
            </div>
          </div>
          {loadingList ? (
            <p style={{ padding: '1rem' }}>Loading…</p>
          ) : inboxMessages.length === 0 ? (
            <p style={{ padding: '1rem', color: '#777' }}>No inbox messages yet.</p>
          ) : (
            <div className="ud-table-wrap">
              <table className="ud-table">
                <thead>
                  <tr>
                    <th>From</th>
                    <th>Subject</th>
                    <th>Body</th>
                    <th>Status</th>
                    <th>Received</th>
                    <th style={{ width: 170 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inboxMessages.map((m) => (
                    <tr key={m._id}>
                      <td>{m.senderName} <br /><small style={{ color: '#888' }}>{m.senderEmail}</small></td>
                      <td>{m.subject}</td>
                      <td style={{ maxWidth: 280, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {m.body}
                      </td>
                      <td><span className="ud-status ud-status-active">{m.status}</span></td>
                      <td>{new Date(m.createdAt).toLocaleString()}</td>
                      <td>
                        <button className="sm-btn sm-btn-secondary" onClick={() => startEdit(m)} style={{ padding: '6px 12px', fontSize: 13 }}>
                          Edit
                        </button>
                        <button onClick={() => removeMessage(m._id)} className="delete-btn" style={{ marginLeft: 8 }}>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editing && (
          <div
            onClick={() => setEditing(null)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: '#fff', borderRadius: 12, padding: 24,
                maxWidth: 560, width: '92%', boxShadow: '0 10px 40px rgba(0,0,0,0.25)'
              }}
            >
              <h3 style={{ marginTop: 0 }}>Edit Message</h3>
              <div className="sm-field" style={{ marginBottom: 12 }}>
                <label>Subject</label>
                <input
                  type="text"
                  value={editForm.subject}
                  onChange={(e) => setEditForm((p) => ({ ...p, subject: e.target.value }))}
                />
              </div>
              <div className="sm-field" style={{ marginBottom: 12 }}>
                <label>Body</label>
                <textarea
                  rows={6}
                  value={editForm.body}
                  onChange={(e) => setEditForm((p) => ({ ...p, body: e.target.value }))}
                />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button className="sm-btn sm-btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
                <button className="sm-btn sm-btn-primary" onClick={saveEdit} disabled={savingEdit}>
                  {savingEdit ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SendMessage;
