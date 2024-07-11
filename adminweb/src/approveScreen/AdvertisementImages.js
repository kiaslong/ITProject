import React, { useState } from 'react';
import { Card, Button, ListGroup, ListGroupItem, Image, Container, Row, Col, Modal } from 'react-bootstrap';

const AdvertisementImages = () => {
  const [promotions, setPromotions] = useState([
    {
      id: "1",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
      promotionText: "Khuyến mãi 30% phí cho thuê xe Mercedes",
      discountText: "30%",
    },
    {
      id: "2",
      imageUrl:
        "https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/BMW-2-Series-Gran-Coupe-271220221147.jpg&w=872&h=578&q=75&c=1",
      promotionText: "Khuyến mãi 20% phí cho thuê xe BMW",
      discountText: "20%",
    },
    {
      id: "3",
      imageUrl:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQmIwj74aj-4g71TjdSxaNpLMTTO9CpBiUm5A&s",
      promotionText: "Khuyến mãi thêm 10% cho người mới thuê xe lần đầu",
      discountText: "10%",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);

  const handleDelete = (id) => {
    setPromotionToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setPromotions(promotions.filter(promotion => promotion.id !== promotionToDelete));
    setShowModal(false);
    setPromotionToDelete(null);
  };

  return (
    <Container className="mt-4">
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
                        <h5 className="mb-1">{promotion.promotionText}</h5>
                        <p className="mb-1"><strong>Discount:</strong> {promotion.discountText}</p>
                        <Image src={promotion.imageUrl} alt="Promotion" className="img-thumbnail" style={{ width: '100px', height: '100px' }} />
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa quảng cáo này?</Modal.Body>
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

export default AdvertisementImages;
