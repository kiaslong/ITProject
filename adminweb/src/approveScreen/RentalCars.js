import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  ListGroup,
  ListGroupItem,
  Badge,
  Container,
  Row,
  Col,
  Modal,
  FormControl,
  InputGroup,
  Pagination,
  Spinner,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api";
import Notification from "../components/Notification";

const RentalCars = () => {
  const [cars, setCars] = useState([]);
  const [showAccepted, setShowAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [carToDelete, setCarToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [expandedCards, setExpandedCards] = useState({});
  const [imageModal, setImageModal] = useState({ show: false, src: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const carsPerPage = 5;
  const placeholder = require("../assets/placeholder.png");

  const addNotification = useCallback((variant, message) => {
    const id = new Date().getTime();
    setNotifications((prevNotifications) => [
      ...prevNotifications,
      { id, variant, message },
    ]);
  }, []);

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const endpoint = showAccepted ? "/car/info-verified" : "/car/info";
      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCars(response.data);
    } catch (err) {
      addNotification(
        "danger",
        "Failed to fetch cars. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [showAccepted, addNotification]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleAccept = async (id) => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("access_token");
      await api.patch(
        "/car/verify",
        {
          carId: id,
          isCarVerified: true,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCars((prevCars) => prevCars.filter((car) => car.id !== id));
      addNotification("success", "Car accepted successfully!");
    } catch (err) {
      addNotification(
        "danger",
        "Failed to verify car. Please try again later."
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = (id) => {
    setCarToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem("access_token");
      await api.delete(`/car/${carToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCars((prevCars) => prevCars.filter((car) => car.id !== carToDelete));
      addNotification("success", "Car deleted successfully!");
    } catch (err) {
      addNotification(
        "danger",
        "Failed to delete car. Please try again later."
      );
    } finally {
      setShowModal(false);
      setCarToDelete(null);
      setActionLoading(false);
    }
  };

  const handleImageClick = useCallback((src) => {
    setImageModal({ show: true, src });
  }, []);

  const handleCardExpand = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getPaginatedCars = useCallback(() => {
    const startIndex = (currentPage - 1) * carsPerPage;
    return cars.slice(startIndex, startIndex + carsPerPage);
  }, [cars, currentPage]);

  const filteredCars = useCallback(() => {
    return getPaginatedCars().filter(
      (car) =>
        car.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.licensePlate.includes(searchQuery)
    );
  }, [getPaginatedCars, searchQuery]);

  const totalPages = Math.ceil(cars.length / carsPerPage);

  const renderCarDetails = useCallback(
    (car) => (
      <>
        <p className="mb-1">
          <strong>Số chỗ ngồi:</strong> {car.numberOfSeats}
        </p>
        <p className="mb-1">
          <strong>Hộp số:</strong> {car.transmission}
        </p>
        <p className="mb-1">
          <strong>Nhiên liệu:</strong> {car.fuelType}
        </p>
        <p className="mb-1">
          <strong>Giá cho thuê:</strong> {car.price} VND
        </p>
        <p className="mb-1">
          <strong>Khuyến mãi:</strong> {car.allowApplyPromo ? "Có" : "Không"}
        </p>
        <p className="mb-1">
          <strong>Mô tả:</strong> {car.description}
        </p>
        <p className="mb-1">
          <strong>Chủ xe:</strong> {car.owner.name}
        </p>
        <p className="mb-1">
          <strong>Tỉ lệ phản hồi:</strong> {car.owner.responseRate}%
        </p>
        <p className="mb-1">
          <strong>Tỉ lệ chấp nhận:</strong> {car.owner.approvalRate}%
        </p>
        <p className="mb-1">
          <strong>Thời gian phản hồi:</strong> {car.owner.responseTime} giờ
        </p>
        {!showAccepted && (
          <>
            <p className="mb-1">
              <strong>Ảnh đại diện chủ xe</strong>
            </p>
            <img
              src={car.owner.avatar || placeholder}
              alt="Owner Avatar"
              className="img-thumbnail me-2"
              style={{ width: "100px" }}
              onClick={(e) => {
                e.stopPropagation();
                handleImageClick(car.owner.avatar || placeholder);
              }}
            />
            <div className="mt-3">
            <strong>Hình ảnh:</strong>
<div className="d-flex flex-wrap mb-2">
  {car.carImages &&
    Object.values(car.carImages).concat(car.thumbImage).map((image, index, array) => {
      const isThumbImage = index === array.length - 1; // Check if it's the thumb image
      return (
        <div key={index} className="d-flex align-items-center me-2">
          {isThumbImage && (
            <span className="me-2">Hình đại diện xe:</span>
          )}
          <img
            src={image}
            alt={`Car ${index + 1}`}
            className="img-thumbnail"
            style={{ width: '100px' }}
            onClick={(e) => {
              e.stopPropagation();
              handleImageClick(image);
            }}
          />
        </div>
      );
    })}
</div>

              <strong>Giấy tờ xe:</strong>
              <div className="d-flex flex-wrap">
                {car.carPapers &&
                  Object.values(car.carPapers).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Car Paper ${index + 1}`}
                      className="img-thumbnail me-2"
                      style={{ width: "100px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageClick(image);
                      }}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </>
    ),
    [showAccepted, handleImageClick, placeholder]
  );

  return (
    <Container className="mt-4">
      <div>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            variant={notification.variant}
            message={notification.message}
            onClose={() =>
              setNotifications((notifications) =>
                notifications.filter((n) => n.id !== notification.id)
              )
            }
          />
        ))}
      </div>
      {(loading || actionLoading) && (
        <div className="d-flex justify-content-center mb-4">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}
      <Row className="mb-3">
        <Col>
          <Button variant="info" onClick={() => setShowAccepted(!showAccepted)}>
            {showAccepted ? "Xem xe đăng ký" : "Xem xe đã chấp nhận"}
          </Button>
        </Col>
        <Col className="text-end">
          <Button variant="primary" onClick={fetchCars}>
            Tải lại
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <InputGroup className="mb-3">
            <InputGroup.Text id="search-icon">
              <i className="bi bi-search"></i>
            </InputGroup.Text>
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
            <Card.Header
              className={
                showAccepted ? "bg-success text-white" : "bg-primary text-white"
              }
            >
              {showAccepted ? "Xe đã chấp nhận" : "Xe đăng ký cho thuê"}
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {filteredCars().length === 0 ? (
                  <ListGroupItem>Không có xe nào.</ListGroupItem>
                ) : (
                  filteredCars().map((car) => (
                    <ListGroupItem
                      key={car.id}
                      className="mb-3"
                      onClick={() => handleCardExpand(car.id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">
                            {car.make} {car.model}{" "}
                            <Badge bg="info">{car.year}</Badge>
                          </h5>
                          <p className="mb-1">
                            <strong>Biển số xe:</strong> {car.licensePlate}
                          </p>
                          {expandedCards[car.id] && renderCarDetails(car)}
                        </div>
                        <div className="d-flex">
                          {showAccepted ? (
                            <Button
                              variant="danger"
                              className="me-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(car.id);
                              }}
                            >
                              Xóa
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="success"
                                className="me-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAccept(car.id);
                                }}
                              >
                                Accept
                              </Button>
                              <Button
                                variant="danger"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(car.id);
                                }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}
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
      <Row>
        <Col>
          <Pagination className="d-flex justify-content-center">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
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

      <Modal
        show={imageModal.show}
        onHide={() => setImageModal({ show: false, src: "" })}
      >
        <Modal.Header closeButton>
          <Modal.Title>Hình ảnh</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageModal.src} alt="Preview" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setImageModal({ show: false, src: "" })}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RentalCars;
