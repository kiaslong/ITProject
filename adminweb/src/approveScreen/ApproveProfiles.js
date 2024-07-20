import React, { useState } from 'react';
import { Card, Button, ListGroup, ListGroupItem, Image, Container, Row, Col, Modal, FormControl, InputGroup } from 'react-bootstrap';

const ApproveProfiles = () => {
  const [profiles, setProfiles] = useState([
    {
      id: 1,
      fullName: 'Nguyễn Văn A',
      licenseNumber: '123456789',
      birthDate: '01/01/1990',
      images: [
        'https://danchoioto.vn/wp-content/uploads/2021/07/khi-tham-gia-giao-nguoi-lai-xe-bat-buoc-phai-mang-day-du-cac-loai-giay-to-xe-o-to.jpeg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcWynTSH-TTIalRmDFnKzgZyZYrUGhDE--0w&s'
      ],
    },
    {
      id: 2,
      fullName: 'Trần Thị B',
      licenseNumber: '987654321',
      birthDate: '15/05/1985',
      images: [
        'https://danchoioto.vn/wp-content/uploads/2021/07/khi-tham-gia-giao-nguoi-lai-xe-bat-buoc-phai-mang-day-du-cac-loai-giay-to-xe-o-to.jpeg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcWynTSH-TTIalRmDFnKzgZyZYrUGhDE--0w&s'
      ],
    },
    {
      id: 3,
      fullName: 'Lê Văn C',
      licenseNumber: '112233445',
      birthDate: '20/08/1992',
      images: [
        'https://danchoioto.vn/wp-content/uploads/2021/07/khi-tham-gia-giao-nguoi-lai-xe-bat-buoc-phai-mang-day-du-cac-loai-giay-to-xe-o-to.jpeg',
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcWynTSH-TTIalRmDFnKzgZyZYrUGhDE--0w&s'
      ],
    },
  ]);

  const [acceptedProfiles, setAcceptedProfiles] = useState([]);
  const [showAccepted, setShowAccepted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAccept = (id) => {
    const profile = profiles.find(profile => profile.id === id);
    if (profile) {
      setAcceptedProfiles([...acceptedProfiles, profile]);
      setProfiles(profiles.filter(profile => profile.id !== id));
    }
  };

  const handleCancel = (id) => {
    const profile = acceptedProfiles.find(profile => profile.id === id);
    if (profile) {
      setProfiles([...profiles, profile]);
      setAcceptedProfiles(acceptedProfiles.filter(profile => profile.id !== id));
    }
  };

  const handleDelete = (id) => {
    setProfileToDelete(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    setAcceptedProfiles(acceptedProfiles.filter(profile => profile.id !== profileToDelete));
    setShowModal(false);
    setProfileToDelete(null);
  };

  const filteredProfiles = showAccepted
    ? acceptedProfiles.filter(profile =>
        profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.licenseNumber.includes(searchQuery)
      )
    : profiles.filter(profile =>
        profile.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.licenseNumber.includes(searchQuery)
      );

  return (
    <Container className="mt-4">
      <Row>
        <Col>
          <Button variant="info" onClick={() => setShowAccepted(!showAccepted)}>
            {showAccepted ? 'Xem hồ sơ chờ duyệt' : 'Xem hồ sơ đã chấp nhận'}
          </Button>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col>
          <InputGroup className="mb-3">
          <InputGroup.Text id="search-icon"><i className="bi bi-search"></i></InputGroup.Text>
            <FormControl
              placeholder="Tìm kiếm theo tên hoặc số giấy phép"
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
              {showAccepted ? 'Hồ sơ đã chấp nhận' : 'Hồ sơ chờ duyệt'}
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {filteredProfiles.length === 0 ? (
                  <ListGroupItem>Không có hồ sơ nào.</ListGroupItem>
                ) : (
                  filteredProfiles.map(profile => (
                    <ListGroupItem key={profile.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h5 className="mb-1">{profile.fullName}</h5>
                          <p className="mb-1"><strong>Số giấy phép lái xe:</strong> {profile.licenseNumber}</p>
                          <p className="mb-1"><strong>Ngày sinh:</strong> {profile.birthDate}</p>
                          <div className="mt-3">
                            <strong>Hình ảnh:</strong>
                            <div className="d-flex flex-wrap">
                              {profile.images.map((image, index) => (
                                <Image key={index} src={image} alt="Profile" className="img-thumbnail me-2" style={{ width: '100px' }} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex">
                          {showAccepted ? (
                            <>
                              <Button variant="danger" className="me-2" onClick={() => handleDelete(profile.id)}>Delete</Button>
                              <Button variant="warning" onClick={() => handleCancel(profile.id)}>Cancel</Button>
                            </>
                          ) : (
                            <>
                              <Button variant="success" className="me-2" onClick={() => handleAccept(profile.id)}>Accept</Button>
                              <Button variant="danger" onClick={() => handleDelete(profile.id)}>Cancel</Button>
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

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa hồ sơ này?</Modal.Body>
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

export default ApproveProfiles;
