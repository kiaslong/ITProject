import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Form, InputGroup, Spinner } from 'react-bootstrap';
import '../scss/Users.scss';
import api from "../api";
import Notification from '../components/Notification';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((variant, message) => {
    const id = new Date().getTime();
    setNotifications(prevNotifications => [...prevNotifications, { id, variant, message }]);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await api.get('/auth/unverified-phone-users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
      addNotification('danger', 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleVerifyPhoneNumber = async (userId, phoneNumber) => {
    try {
      setVerifying(true);
      const token = localStorage.getItem("access_token");
      await api.post('/auth/verify-phone-number', 
        { phoneNumber }, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      fetchUsers(); // Refresh the list after verification
      addNotification('success', 'Phone number successfully verified');
    } catch (error) {
      console.error('Failed to verify phone number', error);
      addNotification('danger', 'Failed to verify phone number');
    } finally {
      setVerifying(false);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="users-container">
      <div>
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            variant={notification.variant}
            message={notification.message}
            onClose={() => setNotifications(notifications.filter(n => n.id !== notification.id))}
          />
        ))}
      </div>
      <h3>Danh sách người dùng</h3>
      <InputGroup className="mb-3">
        <InputGroup.Text id="search-icon"><i className="bi bi-search"></i></InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      <Button variant="primary" onClick={fetchUsers} className="mb-3">
        {loading ? <Spinner animation="border" size="sm" /> : 'Refresh List'}
      </Button>
      <Table striped bordered hover responsive className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ và tên</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>
                <Button 
                  variant="success" 
                  onClick={() => handleVerifyPhoneNumber(user.id, user.phoneNumber)}
                  disabled={verifying}
                >
                  {verifying ? <Spinner animation="border" size="sm" /> : 'Verify Phone Number'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
