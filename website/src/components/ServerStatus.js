import React, { useState, useEffect } from 'react';

function ServerStatus({ children }) {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:5001/health', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (err) {
        setServerStatus('offline');
      }
    };

    checkServer();

    const interval = setInterval(checkServer, 30000);

    return () => clearInterval(interval);
  }, []);

  if (serverStatus === 'offline') {
    return (
      <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0f172a',
            backgroundImage: 'url("../../../images/Hero_Background.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99
      }}>
        <div style={{textAlign: "center", padding: "40px"}}>
          <h1 style={{
            color: '#ff7a00',
            fontSize: '3.5rem',
            fontWeight: 'bold',
            marginBottom: '20px',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)'
          }}
          >
            ⚠️ Server Issue</h1>
          <p style={{
            color: "white",
            fontSize: "1.8rem",
            marginBottom: "30px"
          }}>
            We're having trouble connecting to the server.</p>
          <p style={{color: 'rgba(255,255,255,0.8)',fontSize: '1.3rem'}}>
            Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return children;
}

export default ServerStatus;
