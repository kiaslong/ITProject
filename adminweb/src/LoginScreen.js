import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';
import './scss/LoginScreen.scss';
import logo from './assets/lkrentlogo.png'; // Correct path to the image

const LoginScreen = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      
      const response = await api.post('/admin/login', { password });
      if (response.data.access_token) {
        // Store the token in localStorage or any state management solution
        localStorage.setItem('access_token', response.data.access_token);
        navigate('/admin');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid password');
      } else {
        console.error('Login error', error);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src={logo} alt="LKRent Logo" className="logo" />
        <h2>Login</h2>
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
