import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './scss/App.scss';
import LoginScreen from './LoginScreen';
import AdminDashboard from './AdminDashboard';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginScreen />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
