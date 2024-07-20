import React, { useState } from 'react';
import { Card, Button, ListGroup, ListGroupItem, Badge, Container, Row, Col, Modal, FormControl, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const RentalCars = () => {
  const [cars, setCars] = useState([
    {
      id: 1,
      licensePlate: '29A-12345',
      company: 'Toyota',
      model: 'Camry',
      year: 2019,
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Gasoline',
      images: [{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s" }],
      documents: [{ uri: "https://bizweb.dktcdn.net/100/415/690/files/giay-to-xe-o-to-gom-nhung-gi-1.png?v=1677634176713" }],
      description: 'A comfortable and fuel-efficient car.',
      price: '500,000 VND',
      promotion: 'Có',
    },
    {
      id: 2,
      licensePlate: '30B-67890',
      company: 'Honda',
      model: 'Civic',
      year: 2018,
      seats: 5,
      transmission: 'Manual',
      fuel: 'Gasoline',
      images: [{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s" }],
      documents: [{ uri: 'https://bizweb.dktcdn.net/100/415/690/files/giay-to-xe-o-to-gom-nhung-gi-1.png?v=1677634176713' }],
      description: 'A stylish and reliable car.',
      price: '450,000 VND',
      promotion: 'Không',
    },
    {
      id: 3,
      licensePlate: '31C-54321',
      company: 'Ford',
      model: 'Focus',
      year: 2020,
      seats: 5,
      transmission: 'Automatic',
      fuel: 'Diesel',
      images: [{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s" }],
      documents: [{ uri: 'https://bizweb.dktcdn.net/100/415/690/files/giay-to-xe-o-to-gom-nhung-gi-1.png?v=1677634176713' }],
      description: 'A powerful and spacious car.',
      price: '600,000 VND',
      promotion: 'Có',
    },
  ]);

  const [acceptedCars, setAcceptedCars] = useState([]);
  const [showAccepted, setShowAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAccept = (id) => {
    const car = cars.find(car => car.id === id);
    if (car) {
      setAcceptedCars([...acceptedCars, car]);
      setCars(cars.filter(car => car.id !== id));
    }
  };

  const handleCancel = (id) => {
    const car = acceptedCars.find(car => car.id === id);
    if (car) {
      setCars([...cars, car]);
      setAcceptedCars(acceptedCars.filter(car => car.id !== id));
    }
  };

  const handleDelete = (id) => {
    setCarToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setAcceptedCars(acceptedCars.filter(car => car.id !== carToDelete));
    setShowModal(false);
    setCarToDelete(null);
  };

  const filteredCars = showAccepted
    ? acceptedCars.filter(car =>
        car.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.licensePlate.includes(searchQuery)
      )
    : cars.filter(car =>
        car.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.licensePlate.includes(searchQuery)
      );

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Button variant="info" onClick={() => setShowAccepted(!showAccepted)}>
            {showAccepted ? 'Xem xe đăng ký' : 'Xem xe đã chấp nhận'}
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <InputGroup className="mb-3">
          <InputGroup.Text id="search-icon"><i className="bi bi-search"></i></InputGroup.Text>
            <FormControl
              placeholder="Tìm kiếm theo tên công ty hoặc biển số xe"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header className={showAccepted ? 'bg-success text-white' : 'bg-primary text-white'}>
              {showAccepted ? 'Xe đã chấp nhận' : 'Xe đăng ký cho thuê'}
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {filteredCars.length === 0 ? (
                  <ListGroupItem>Không có xe nào.</ListGroupItem>
                ) : (
                  filteredCars.map(car => (
                    <ListGroupItem key={car.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">{car.company} {car.model} <Badge bg="info">{car.year}</Badge></h5>
                          <p className="mb-1"><strong>Biển số xe:</strong> {car.licensePlate}</p>
                          <p className="mb-1"><strong>Số chỗ ngồi:</strong> {car.seats}</p>
                          <p className="mb-1"><strong>Hộp số:</strong> {car.transmission}</p>
                          <p className="mb-1"><strong>Nhiên liệu:</strong> {car.fuel}</p>
                          <p className="mb-1"><strong>Giá cho thuê:</strong> {car.price}</p>
                          <p className="mb-1"><strong>Khuyến mãi:</strong> {car.promotion}</p>
                          <p className="mb-1"><strong>Mô tả:</strong> {car.description}</p>
                        </div>
                        <div className="d-flex">
                          {showAccepted ? (
                            <>
                              <Button variant="danger" className="me-2" onClick={() => handleDelete(car.id)}>Delete</Button>
                              <Button variant="warning" onClick={() => handleCancel(car.id)}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              <Button variant="success" className="me-2" onClick={() => handleAccept(car.id)}>Accept</Button>
                              <Button variant="danger" onClick={() => handleDelete(car.id)}>Cancel</Button>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="mt-3">
                        <strong>Hình ảnh:</strong>
                        <div className="d-flex flex-wrap">
                          {car.images.map((image, index) => (
                            <img key={index} src={image.uri} alt="Car" className="img-thumbnail me-2" style={{ width: '100px' }} />
                          ))}
                        </div>
                      </div>
                      <div className="mt-3">
                        <strong>Giấy tờ:</strong>
                        <div className="d-flex flex-wrap">
                          {car.documents.map((document, index) => (
                            <img key={index} src={document.uri} alt="Document" className="img-thumbnail me-2" style={{ width: '100px' }} />
                          ))}
                        </div>
                      </div>
                    </ListGroupItem>
                  ))
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa xe này?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RentalCars;
