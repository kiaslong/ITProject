import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, FormControl, InputGroup, Container, Row, Col, Spinner } from 'react-bootstrap';
import '../scss/PaymentScreen.scss'; // Import the new PaymentScreen.scss file
import api from '../api';
import Notification from '../components/Notification'; // Import the Notification component

const PaymentScreen = () => {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPending, setShowPending] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((variant, message) => {
    const id = new Date().getTime();
    setNotifications(prevNotifications => {
      if (!prevNotifications.some(n => n.message === message)) {
        return [...prevNotifications, { id, variant, message }];
      }
      return prevNotifications;
    });
  }, []);

  const fetchPayments = async (state) => {
    const token = localStorage.getItem('access_token');
    setLoading(true);
    try {
      const endpoint = state === 'PENDING' ? 'order/pending' : 'order/completed';
      const response = await api.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const paymentsWithUserInfo = await Promise.all(
        response.data.map(async (payment) => {
          try {
            const userResponse = await api.get(`auth/${payment.userId}/info`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            return {
              ...payment,
              fullName: userResponse.data.fullName,
              phoneNumber: userResponse.data.phoneNumber
            };
          } catch (userError) {
            console.error(`Failed to fetch user info for user ID: ${payment.userId}`, userError);
            return payment;
          }
        })
      );

      setPayments(paymentsWithUserInfo);
      addNotification('success', 'Fetched payments successfully');
    } catch (error) {
      console.error('Failed to fetch payments', error);
      addNotification('danger', 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(showPending ? 'PENDING' : 'COMPLETED');
  }, [showPending]);

  const handleUpdateStatus = async (paymentId, newStatus) => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found');
      return;
    }

    try {
      await api.patch(`order/${paymentId}/paymentState`, { paymentState: newStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPayments(payments.map(payment => payment.id === paymentId ? { ...payment, paymentState: newStatus } : payment));
      addNotification('success', 'Payment status updated successfully');
    } catch (error) {
      console.error('Failed to update payment status', error);
      addNotification('danger', 'Failed to update payment status');
    }
  };

  const filteredPayments = payments.filter(payment => 
    payment.id.toString().includes(searchTerm) || payment.userId.includes(searchTerm)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Container className="mt-4 payment-screen">
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
      <h3 className="text-center mb-4">Quản lý Thanh toán</h3>
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text id="search-icon"><i className="bi bi-search"></i></InputGroup.Text>
            <FormControl
              type="text"
              placeholder="Tìm kiếm theo Mã Đơn hàng hoặc Mã Người dùng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="text-center">
          <Button onClick={() => setShowPending(!showPending)}>
            {showPending ? 'Hiển thị Đơn hàng đã thanh toán' : 'Hiển thị Đơn hàng chưa thanh toán'}
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive className="text-center">
        <thead className="table-light">
          <tr>
            <th>Mã Đơn hàng</th>
            <th>Mã Người dùng</th>
            <th>Tên Người dùng</th>
            <th>SĐT Người dùng</th>
            <th>Trạng thái Thanh toán</th>
            <th>Tổng giá</th>
            {showPending && <th>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {currentItems.map(payment => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.userId}</td>
              <td>{payment.fullName}</td>
              <td>{payment.phoneNumber}</td>
              <td>{payment.paymentState}</td>
              <td>{payment.totalPrice}</td>
              {showPending && (
                <td>
                  {payment.paymentState !== 'COMPLETED' && payment.paymentState !== 'CANCELED' && (
                    <Button
                      variant="success"
                      onClick={() => handleUpdateStatus(payment.id, 'COMPLETED')}
                      className="me-2"
                    >
                      Xác nhận
                    </Button>
                  )}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>
      <Row className="justify-content-center mt-4">
        <Col md={8} className="text-center">
          {Array.from({ length: totalPages }, (_, index) => (
            <Button
              key={index}
              onClick={() => paginate(index + 1)}
              className="me-2"
              variant={currentPage === index + 1 ? 'primary' : 'secondary'}
            >
              {index + 1}
            </Button>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentScreen;
