import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../context/AuthContext';
import Default_Avatar from "../../../../images/Default_Avatar.png";
import './profilePage.css';

function ProfilePage({ user, setUser }) {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);

  const [avatarSrc, setAvatarSrc] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    const savedAvatar = localStorage.getItem(`profileAvatar_${user?.id}`);
    if (savedAvatar) {
      setAvatarSrc(savedAvatar);
    }
  }, [user?.id]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;
        setAvatarPreview(imageSrc);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
        if (avatarPreview) {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5001/api/users/${user.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({ avatar: avatarPreview })
            });

            if (response.ok) {
              localStorage.setItem(`profileAvatar_${user?.id}`, avatarPreview);
              setAvatarSrc(avatarPreview);
              setAvatarPreview(null);
              window.location.reload();
            } else {
              alert('Failed to save avatar');
            }
          } catch (err) {
            alert('Error saving avatar: ' + err.message);
          }
        }

  };

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5001/api/users/${user.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        }
      } catch (err) {
        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          alert('⚠️ Server is currently offline. Please try again later.');
        } else {
          console.error('Error fetching user:', err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user?.id]);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate('/home');
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/users/${user.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        alert("Account deleted successfully.");
        handleLogout();
      } else {
        const err = await response.json();
        alert("Error: " + err.message);
      }
    } catch (err) {
      alert("Connection error.");
    }

  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      if (response.ok) {
        setSuccess('Password changed successfully!');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowChangePassword(false);
      } else {
        const err = await response.json();
        setError(err.message);
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateGender = async (gender) => {
    if (!userData) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gender })
      });
      if (response.ok) {
        const updated = await response.json();
        setUserData(updated);
      }

    } catch (err) {
      console.error('Error updating gender:', err);
    }
  };

  if (!user) {
    return (
      <section className="login-card profile-card">
        <div className="profile-container">
          <h2>Profile</h2>
          <p>No user data found. Please sign up or log in.</p>
          <button onClick={() => navigate('/signup')} className="pr-btn">Sign Up</button>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="login-card profile-card">
        <div className="profile-container">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  const formatBirthdate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <section className="profile-card">
      <div className="profile-container">
        <h2>My Profile</h2>
        
        <div style={{ textAlign: 'center', marginBottom: '30px', position: 'relative' }}>

          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img 
              src={userData?.avatar || avatarPreview || avatarSrc || Default_Avatar}
              alt="Profile Avatar"
              className="profile-avatar rounded-circle"
              style={{ width: '120px', height: '120px', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', cursor: 'pointer' }}

              onClick={handleImageClick}
            />
            <div className="avatar-overlay" style={{
              position: 'absolute',
              bottom: '8px',
              right: '8px',
              width: '28px',
              height: '28px',
              background: 'rgba(255,122,0,0.9)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
            }}

            onClick={handleImageClick}
            title="Change photo"
            >
              +
            </div>
          </div>
          {avatarPreview && (
            <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={handleSaveAvatar}
                className="confirm-btn"
                style={{ padding: '8px 20px', fontSize: '0.85rem', minWidth: '100px' }}
              >
                Save
              </button>
              <button 
                onClick={() => setAvatarPreview(null)}
                className="cancel-btn"
                style={{ padding: '8px 20px', fontSize: '0.85rem', minWidth: '100px' }}
              >
                Cancel
              </button>

            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            style={{ display: 'none' }}
          />
          <small style={{ color: '#a3a1a1', marginTop: '8px', display: 'block' }}>Click + to change profile picture</small>
        </div>


        
        <div className="profile-info">  

          <div className="profile-info-row">
            <span className="profile-label">Name:</span>
            <span className="profile-value">{userData?.name || 'N/A'}</span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">Email:</span>
            <span className="profile-value">{userData?.email || 'N/A'}</span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">Password:</span>
            <span className="profile-value">
              {'••••••••••'}
            </span>
          </div>


          <div className="password-section">
            {!showChangePassword ? (
              <button 
                onClick={() => setShowChangePassword(true)}
                className='confirm-btn'
                style={{alignItems: "center"}}
              >
                Change Password
              </button>
            ) : (
              <div className="password-popup">
                <label>New Password:</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                />
                <label>Confirm Password:</label>
                <input 
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm new password"
                />

                {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
                {success && <p style={{ color: '#4ade80' }}>{success}</p>}
                <div className="password-buttons">
                  <button 
                    onClick={handleChangePassword}
                    disabled={saving}
                    className="confirm-btn"
                  >
                    {saving ? 'Saving...' : 'Confirm'}
                  </button>
                  <button 
                    onClick={() => {
                      setShowChangePassword(false);
                      setNewPassword('');
                      setConfirmNewPassword('');
                      setError('');
                      setSuccess('');
                    }}
                    className="cancel-btn"
                  >
                    Cancel
                  </button>
                </div>

              </div>
            )}
          </div>

          <div className="profile-info-row">
            <span className="profile-label">Birthdate:</span>
            <span className="profile-value">{formatBirthdate(userData?.birth)}</span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">Gender:</span>
            <span className="profile-value">
              <div className="form-check">
                <label className="form-check-label" style={{paddingRight: "10px"}}>
                  <input
                    type="radio"
                    name="gender"
                    value="Male"
                    checked={userData?.gender === 'Male'}
                    onChange={() => handleUpdateGender('Male')}
                    className="form-check-input"
                  /> Male
                </label>

                <label className="form-check-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Female"
                    checked={userData?.gender === 'Female'}
                    onChange={() => handleUpdateGender('Female')}
                    className="form-check-input"
                  /> Female
                </label>
              </div>
            </span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">Phone:</span>
            <span className="profile-value">+965 {userData?.phone || 'N/A'}</span>
          </div>

          <div className="profile-info-row">
            <span className="profile-label">Role:</span>
            <span className="profile-value">{userData?.role || 'user'}</span>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="profile-logout-btn">Logout</button>
          <button 
            onClick={handleDelete} 
            className="profile-delete-btn"
          >
            Delete Account
          </button>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;

