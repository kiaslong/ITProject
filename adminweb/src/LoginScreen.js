import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './scss/LoginScreen.scss';
import logo from './assets/lkrentlogo.png'; // Correct path to the image

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === 'admin' && password === 'admin123') {
      navigate('/admin');
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="LKRent Logo" className="logo" />
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginScreen;
