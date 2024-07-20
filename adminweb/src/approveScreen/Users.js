import React, { useState } from 'react';
import { Table, Form, InputGroup } from 'react-bootstrap';
import '../scss/Users.scss';

const Users = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample fake data
  const users = [
    {
      id: 1,
      email: 'user1@example.com',
      phoneNumber: '123456789',
      gender: 'Nam',
      fullName: 'User One',
      dateOfBirth: '1990-01-01',
      drivingLicenseVerified: true,
      emailVerified: true,
      phoneNumberVerified: true,
      numberOfSuccessRentals: 5,
      rewardPoints: 100,
    },
    {
      id: 2,
      email: 'user2@example.com',
      phoneNumber: '987654321',
      gender: 'Nữ',
      fullName: 'User Two',
      dateOfBirth: '1992-02-02',
      drivingLicenseVerified: false,
      emailVerified: true,
      phoneNumberVerified: false,
      numberOfSuccessRentals: 2,
      rewardPoints: 50,
    },
    // Add more fake users here
  ];

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="users-container">
      <h3>Danh sách người dùng</h3>
      <InputGroup className="mb-3">
        <InputGroup.Text id="search-icon"><i className="bi bi-search"></i></InputGroup.Text>
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên, email, hoặc số điện thoại"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </InputGroup>
      <Table striped bordered hover responsive className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Giới tính</th>
            <th>Họ tên</th>
            <th>Ngày sinh</th>
            <th>Giấy phép lái xe</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Thuê xe thành công</th>
            <th>Điểm thưởng</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.gender}</td>
              <td>{user.fullName}</td>
              <td>{new Date(user.dateOfBirth).toLocaleDateString()}</td>
              <td>{user.drivingLicenseVerified ? 'Có' : 'Không'}</td>
              <td>{user.emailVerified ? 'Có' : 'Không'}</td>
              <td>{user.phoneNumberVerified ? 'Có' : 'Không'}</td>
              <td>{user.numberOfSuccessRentals}</td>
              <td>{user.rewardPoints}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;
