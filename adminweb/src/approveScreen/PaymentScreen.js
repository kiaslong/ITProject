import React, { useState } from 'react';
import { Table, Button, FormControl, InputGroup, Container, Row, Col } from 'react-bootstrap';
import '../scss/PaymentScreen.scss'; // Import the new PaymentScreen.scss file

const PaymentScreen = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      orderId: 'ORD001',
      userId: 'USER001',
      fullName: 'Nguyễn Văn A',
      status: 'PENDING',
      totalPrice: '2,300,000 VND'
    },
    {
      id: 2,
      orderId: 'ORD002',
      userId: 'USER002',
      fullName: 'Trần Thị B',
      status: 'COMPLETED',
      totalPrice: '1,500,000 VND'
    },
    {
      id: 3,
      orderId: 'ORD003',
      userId: 'USER003',
      fullName: 'Lê Thị C',
      status: 'FAILED',
      totalPrice: '3,750,000 VND'
    },
    {
      id: 4,
      orderId: 'ORD004',
      userId: 'USER004',
      fullName: 'Phạm Văn D',
      status: 'REFUNDED',
      totalPrice: '2,850,000 VND'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  const handleUpdateStatus = (paymentId, newStatus) => {
    setPayments(payments.map(payment => payment.id === paymentId ? { ...payment, status: newStatus } : payment));
  };

  const filteredPayments = payments.filter(payment => 
    payment.orderId.includes(searchTerm) || payment.userId.includes(searchTerm)
  );

  const nonCompletedPayments = filteredPayments.filter(payment => payment.status !== 'COMPLETED');
  const completedPayments = filteredPayments.filter(payment => payment.status === 'COMPLETED');

  return (
    <Container className="mt-4 payment-screen">
      <h3 className="text-center mb-4">Quản lý Thanh toán</h3>
      <Row className="justify-content-center mb-4">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text id="search-icon"><i className="bi bi-search"></i></InputGroup.Text>
            <FormControl
              type="text"
              placeholder="Tìm kiếm theo Mã Đơn hàng hoặc Mã Người dùng"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col className="text-center">
          <Button onClick={() => setShowCompleted(!showCompleted)}>
            {showCompleted ? 'Hiển thị các Đơn hàng khác' : 'Hiển thị Đơn hàng đã hoàn thành'}
          </Button>
        </Col>
      </Row>
      <Table striped bordered hover responsive className="text-center">
        <thead className="table-light">
          <tr>
            <th>Mã Đơn hàng</th>
            <th>Mã Người dùng</th>
            <th>Tên Người dùng</th>
            <th>Trạng thái Thanh toán</th>
            <th>Tổng giá</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {(showCompleted ? completedPayments : nonCompletedPayments).map(payment => (
            <tr key={payment.id}>
              <td>{payment.orderId}</td>
              <td>{payment.userId}</td>
              <td>{payment.fullName}</td>
              <td>{payment.status}</td>
              <td>{payment.totalPrice}</td>
              <td>
                {payment.status !== 'COMPLETED' && payment.status !== 'CANCELED' && (
                  <>
                    <Button
                      variant="success"
                      onClick={() => handleUpdateStatus(payment.id, 'COMPLETED')}
                      className="me-2"
                    >
                      Xác nhận
                    </Button>
                    
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default PaymentScreen;
