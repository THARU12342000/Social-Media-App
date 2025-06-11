import React from 'react';

export default function Home() {
  const username = localStorage.getItem('username');

  return (
    <div>
      <nav style={{ backgroundColor: '#eee', padding: '10px' }}>
        <h3>Hi, {username} 👋</h3>
      </nav>
      <h2>Welcome to the Social Media App Home Page!</h2>
      <p>You are logged in.</p>
    </div>
  );
}
