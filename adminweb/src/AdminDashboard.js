import React from 'react';
import { Container, Row, Col, Nav, Tab, Button } from 'react-bootstrap';
import './scss/AdminDashboard.scss';
import UploadedImages from './components/UploadedImages';
import ApproveProfiles from './approveScreen/ApproveProfiles';
import RentalCars from './approveScreen/RentalCars';
import RevenueStatistics from './statisticsScreen/RevenueStatistics';
import AdvertisementImages from './approveScreen/AdvertisementImages';
import { useNavigate } from 'react-router-dom';
import logo2 from './assets/lkrentlogo.png'; // Ensure the path to the logo is correct

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform logout logic here (e.g., clearing authentication tokens)
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
                <Nav.Link eventKey="revenue-statistics">Thống kê doanh thu</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="uploaded-images">Hình ảnh đã upload</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="approve-profiles">Duyệt hồ sơ bằng lái xe</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="rental-cars">Xe đăng ký cho thuê</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="advertisement-images">Quảng cáo hình ảnh</Nav.Link>
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
              <Tab.Pane eventKey="revenue-statistics">
                <RevenueStatistics />
              </Tab.Pane>
              <Tab.Pane eventKey="uploaded-images">
                <UploadedImages />
              </Tab.Pane>
              <Tab.Pane eventKey="approve-profiles">
                <ApproveProfiles />
              </Tab.Pane>
              <Tab.Pane eventKey="rental-cars">
                <RentalCars />
              </Tab.Pane>
              <Tab.Pane eventKey="advertisement-images">
                <AdvertisementImages />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;
