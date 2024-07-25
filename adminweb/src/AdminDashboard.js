import React from 'react';
import { Container, Row, Col, Nav, Tab, Button } from 'react-bootstrap';
import './scss/AdminDashboard.scss';
import ApproveProfiles from './approveScreen/ApproveDrivingLicense';
import RentalCars from './approveScreen/RentalCars';
import RevenueStatistics from './statisticsScreen/RevenueStatistics';
import AdvertisementImages from './approveScreen/AdvertisementImages';
import Users from './approveScreen/Users';
import { useNavigate } from 'react-router-dom';
import logo2 from './assets/lkrentlogo.png'; // Ensure the path to the logo is correct

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('access_token');
    // Navigate to the login page
    navigate('/');
  };

  return (
    <Container fluid className="admin-container">
      <Tab.Container defaultActiveKey="revenue-statistics">
        <Row>
          <Col sm={3} className="nav-column">
            <div className="logo-container">
              <img src={logo2} alt="LKRent Logo" className="logo2" />
              <h5 className="logo-text">LKRENTAPP</h5>
            </div>
            <Nav variant="pills" className="flex-column custom-nav-pills">
              <Nav.Item>
                <Nav.Link eventKey="revenue-statistics">
                  <i className="bi bi-bar-chart-line"></i> Thống kê doanh thu
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="approve-profiles">
                  <i className="bi bi-file-earmark-check"></i> Duyệt hồ sơ bằng lái xe
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="rental-cars">
                  <i className="bi bi-car-front"></i> Xe đăng ký cho thuê
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="advertisement-images">
                  <i className="bi bi-images"></i> Quảng cáo và ưu đãi
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="users">
                  <i className="bi bi-people"></i> Người dùng
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <div className="logout-container">
              <Button variant="danger" className="logout-button" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </Col>
          <Col sm={9} className="tab-content-container">
            <Tab.Content>
              <Tab.Pane eventKey="revenue-statistics" className="fade">
                <RevenueStatistics />
              </Tab.Pane>
              <Tab.Pane eventKey="approve-profiles" className="fade">
                <ApproveProfiles />
              </Tab.Pane>
              <Tab.Pane eventKey="rental-cars" className="fade">
                <RentalCars />
              </Tab.Pane>
              <Tab.Pane eventKey="advertisement-images" className="fade">
                <AdvertisementImages />
              </Tab.Pane>
              <Tab.Pane eventKey="users" className="fade">
                <Users />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;
