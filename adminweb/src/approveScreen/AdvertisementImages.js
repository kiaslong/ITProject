import React, { useState, useEffect } from 'react';
import { Card, Button, ListGroup, ListGroupItem, Image, Container, Row, Col, Modal, Form, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    expireDate: new Date(),
  });
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedPromotion, setExpandedPromotion] = useState(null);
  const [imageModal, setImageModal] = useState({ show: false, imageUrl: '' });

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
      toast.success('Quảng cáo đã được xóa thành công!');
    } catch (error) {
      console.error('Failed to delete promotion', error);
      toast.error('Không thể xóa quảng cáo!');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPromotion({ ...newPromotion, [name]: value });
  };

  const handleDateChange = (date) => {
    setNewPromotion({ ...newPromotion, expireDate: date });
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
    
    // Validate expiration date
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day
    if (newPromotion.expireDate <= today) {
      toast.error('Ngày hết hạn phải lớn hơn ngày hiện tại!');
      return;
    }

    const formData = new FormData();
    formData.append('promoCode', newPromotion.promoCode);
    formData.append('discount', newPromotion.discount);
    formData.append('makeApply', newPromotion.makeApply || '');
    formData.append('modelApply', newPromotion.modelApply || '');
    formData.append('expireDate', newPromotion.expireDate.toISOString());
    if (file) {
      formData.append('file', file);
    }

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
        expireDate: new Date(),
      });
      setFile(null);
      setFilePreview(null);
      toast.success('Quảng cáo đã được thêm thành công!');
    } catch (error) {
      console.error('Failed to add promotion', error);
      toast.error('Không thể thêm quảng cáo!');
    } finally {
      setIsAdding(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setPromotionToDelete(null);
    setFilePreview(null);
  };

  const toggleExpand = (id) => {
    setExpandedPromotion(expandedPromotion === id ? null : id);
  };

  const handleImageClick = (imageUrl) => {
    setImageModal({ show: true, imageUrl });
  };

  const closeImageModal = () => {
    setImageModal({ show: false, imageUrl: '' });
  };

  return (
    <Container className="mt-4">
      <ToastContainer />
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
                  <ListGroupItem 
                    key={promotion.id} 
                    className="mb-3"
                    onClick={() => toggleExpand(promotion.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">{promotion.promoCode}</h5>
                        <p className="mb-1"><strong>Định lượng giảm:</strong> {promotion.discount}</p>
                      </div>
                      <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(promotion.id); }}>Xóa</Button>
                    </div>
                    {expandedPromotion === promotion.id && (
                      <div className="mt-3">
                        <p><strong>Nhà sản xuất áp dụng:</strong> {promotion.makeApply || 'Tất cả'}</p>
                        <p><strong>Mẫu áp dụng:</strong> {promotion.modelApply || 'Tất cả'}</p>
                        <p><strong>Hết hạn:</strong> {new Date(promotion.expireDate).toLocaleDateString()}</p>
                        {promotion.promotionImageUrl && (
                          <Image 
                            src={promotion.promotionImageUrl} 
                            alt="Promotion" 
                            className="img-thumbnail" 
                            style={{ width: '200px', height: '200px', cursor: 'pointer' }} 
                            onClick={(e) => { e.stopPropagation(); handleImageClick(promotion.promotionImageUrl); }} 
                          />
                        )}
                      </div>
                    )}
                  </ListGroupItem>
                ))}
              </ListGroup>
              <Button variant="primary" onClick={() => setShowModal(true)}>Thêm quảng cáo</Button>
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
              <Form.Group controlId="promoCode" className="mb-3">
                <Form.Label>Mã giảm giá (nếu là % thêm chữ P ví dụ LK hay là LKP) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="promoCode"
                  value={newPromotion.promoCode}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="discount" className="mb-3">
                <Form.Label>Định lượng giảm giá (ví dụ 20 hoặc 20%) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="discount"
                  value={newPromotion.discount}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="makeApply" className="mb-3">
                <Form.Label>Nhà sản xuất áp dụng <span className="text-danger">{newPromotion.modelApply ? '*' : ''}</span></Form.Label>
                <Form.Control
                  as="select"
                  name="makeApply"
                  value={newPromotion.makeApply}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn nhà sản xuất</option>
                  {Object.keys(makesAndModels).map(make => (
                    <option key={make} value={make}>{make}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              {newPromotion.makeApply && (
                <Form.Group controlId="modelApply" className="mb-3">
                  <Form.Label>Mẫu áp dụng</Form.Label>
                  <Form.Control
                    as="select"
                    name="modelApply"
                    value={newPromotion.modelApply}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn mẫu</option>
                    {makesAndModels[newPromotion.makeApply].map(model => (
                      <option key={model} value={model}>{model}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              )}
              <Form.Group controlId="expireDate" className="mb-3">
                <Form.Label>Ngày hết hạn <span className="text-danger">*</span></Form.Label>
                <DatePicker
                  selected={newPromotion.expireDate}
                  onChange={handleDateChange}
                  dateFormat="dd/MM/yyyy"
                  className="form-control"
                  required
                  minDate={new Date()}
                />
              </Form.Group>
              <Form.Group controlId="promotionImageUrl" className="mb-3">
                <Form.Label>Link ảnh</Form.Label>
                <Form.Control type="file" name="file" onChange={handleFileChange} />
              </Form.Group>
              {filePreview && (
                <div className="mt-3">
                  <p>Ảnh xem trước:</p>
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
            <Button variant="primary" onClick={handleAddPromotion} disabled={isAdding}>
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

      <Modal show={imageModal.show} onHide={closeImageModal}>
        <Modal.Header closeButton>
          <Modal.Title>Xem ảnh trước</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Image src={imageModal.imageUrl} alt="Preview" className="img-thumbnail" style={{ width: '100%', height: 'auto' }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdvertisementImages;
