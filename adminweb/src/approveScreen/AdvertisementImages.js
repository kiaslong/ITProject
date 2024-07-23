import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, ListGroupItem, Image, Container, Row, Col, Modal, Form, Spinner } from 'react-bootstrap';
import makesAndModels from './json/carBrandsAndModels.json'; // Adjust the path if necessary
import api from '../api';
import './scss/AdvertisementImages.scss';

const AdvertisementImages = () => {
  const [promotions, setPromotions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [newPromotion, setNewPromotion] = useState({
    promoCode: '',
    discount: '',
    makeApply: '',
    modelApply: '',
    promotionImageUrl: '',
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    const token = localStorage.getItem('access_token');
    try {
      const response = await api.get('/promotion', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPromotions(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch promotions', error);
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setPromotionToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    const token = localStorage.getItem('access_token');
    try {
      await api.delete(`/promotion/${promotionToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPromotions(promotions.filter(promotion => promotion.id !== promotionToDelete));
      setShowModal(false);
      setPromotionToDelete(null);
    } catch (error) {
      console.error('Failed to delete promotion', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion({ ...newPromotion, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleAddPromotion = async () => {
    const token = localStorage.getItem('access_token');
    const formData = new FormData();
    formData.append('promoCode', newPromotion.promoCode);
    formData.append('discount', newPromotion.discount);
    formData.append('makeApply', newPromotion.makeApply || '');
    formData.append('modelApply', newPromotion.modelApply || '');
    formData.append('file', file);

    try {
      setIsAdding(true);
      const response = await api.post('/promotion', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      setPromotions([...promotions, response.data]);
      setShowModal(false);
      setNewPromotion({
        promoCode: '',
        discount: '',
        makeApply: '',
        modelApply: '',
        promotionImageUrl: '',
      });
      setFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error('Failed to add promotion', error);
    } finally {
      setIsAdding(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPromotionToDelete(null);
    setFilePreview(null);
  };

  return (
    <Container className="mt-4">
      {loading && (
        <div className="loading-overlay">
          <Spinner animation="border" variant="primary" />
        </div>
      )}
      <Row>
        <Col>
          <Card className="m-3">
            <Card.Header className="bg-primary text-white">Quảng cáo hình ảnh</Card.Header>
            <Card.Body>
              <ListGroup>
                {promotions.map(promotion => (
                  <ListGroupItem key={promotion.id} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{promotion.promoCode}</h5>
                        <p className="mb-1"><strong>Discount:</strong> {promotion.discount}</p>
                        <Image src={promotion.promotionImageUrl} alt="Promotion" className="img-thumbnail" style={{ width: '100px', height: '100px' }} />
                      </div>
                      <Button variant="danger" onClick={() => handleDelete(promotion.id)}>Delete</Button>
                    </div>
                  </ListGroupItem>
                ))}
              </ListGroup>
              <Button variant="primary" onClick={() => setShowModal(true)}>Add Promotion</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{promotionToDelete ? 'Xác nhận' : 'Thêm khuyến mãi'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {promotionToDelete ? (
            'Bạn có chắc chắn muốn xóa quảng cáo này?'
          ) : (
            <Form>
              <Form.Group controlId="promoCode">
                <Form.Label>Promo Code</Form.Label>
                <Form.Control
                  type="text"
                  name="promoCode"
                  value={newPromotion.promoCode}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="discount">
                <Form.Label>Discount</Form.Label>
                <Form.Control
                  type="text"
                  name="discount"
                  value={newPromotion.discount}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="makeApply">
                <Form.Label>Make Apply</Form.Label>
                <Form.Control
                  as="select"
                  name="makeApply"
                  value={newPromotion.makeApply}
                  onChange={handleInputChange}
                >
                  <option value="">Select Make</option>
                  {Object.keys(makesAndModels).map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              {newPromotion.makeApply && (
                <Form.Group controlId="modelApply">
                  <Form.Label>Model Apply</Form.Label>
                  <Form.Control
                    as="select"
                    name="modelApply"
                    value={newPromotion.modelApply}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Model</option>
                    {makesAndModels[newPromotion.makeApply].map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
              <Form.Group controlId="promotionImageUrl">
                <Form.Label>Image URL</Form.Label>
                <Form.Control type="file" name="file" onChange={handleFileChange} />
              </Form.Group>
              {filePreview && (
                <div className="mt-3">
                  <p>Image Preview:</p>
                  <Image src={filePreview} alt="Preview" className="img-thumbnail" style={{ width: '200px', height: '200px' }} />
                </div>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Hủy
          </Button>
          {promotionToDelete ? (
            <Button variant="danger" onClick={confirmDelete}>
              Xóa
            </Button>
          ) : (
            <Button variant="primary" onClick={handleAddPromotion}>
              {isAdding && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="ml-2"
                />
              )}
              Thêm
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdvertisementImages;
