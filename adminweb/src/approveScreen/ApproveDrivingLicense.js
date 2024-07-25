import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button, ListGroup, ListGroupItem, Image, Container, Row, Col, Modal, FormControl, InputGroup, Spinner } from 'react-bootstrap';
import api from '../api';
import Notification from '../components/Notification'; // Import the Notification component

const ApproveDrivingLicense = () => {
  const [profiles, setProfiles] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedProfile, setExpandedProfile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [notifications, setNotifications] = useState([]); // State to manage notifications

  const addNotification = useCallback((variant, message) => {
    const id = new Date().getTime();
    setNotifications(prevNotifications => [...prevNotifications, { id, variant, message }]);
  }, []);

  const fetchUnverifiedProfiles = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await api.get('/auth/unverified-driving-licenses', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfiles(response.data);
    } catch (error) {
      console.error('Error fetching unverified profiles:', error);
      addNotification('danger', 'Error fetching unverified profiles. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [addNotification]);

  useEffect(() => {
    fetchUnverifiedProfiles();
  }, [fetchUnverifiedProfiles]);

  const handleAccept = async (id) => {
    const profile = profiles.find((profile) => profile.id === id);
    if (profile) {
      if (profile.drivingLicenseExpireDate && validateDate(profile.drivingLicenseExpireDate)) {
        try {
          await updateDrivingLicenseDetails(profile.id, { drivingLicenseVerified: true, drivingLicenseExpireDate: profile.drivingLicenseExpireDate });
          setProfiles(profiles.filter((p) => p.id !== id));
          addNotification('success', 'Profile accepted successfully!');
        } catch (error) {
          addNotification('danger', 'Failed to accept profile. Please try again.');
        }
      } else {
        addNotification('danger', 'Invalid or missing expiration date. Please enter a valid date in dd/mm/yyyy format.');
      }
    }
  };

  const handleDelete = (id) => {
    setProfileToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/auth/${profileToDelete}/delete-profile`);
      setProfiles(profiles.filter((profile) => profile.id !== profileToDelete));
      addNotification('success', 'Profile deleted successfully.');
    } catch (error) {
      console.error('Error deleting profile:', error);
      addNotification('danger', 'Failed to delete profile. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setProfileToDelete(null);
    }
  };

  const handleExpand = (id) => {
    setExpandedProfile(expandedProfile === id ? null : id);
  };

  const handleImageClick = (imageUrl) => {
    setPreviewImageUrl(imageUrl);
    setShowImageModal(true);
  };

  const handleExpireDateChange = (e, id) => {
    const date = e.target.value;
    setProfiles(profiles.map((profile) =>
      profile.id === id ? { ...profile, drivingLicenseExpireDate: date } : profile
    ));
  };

  const handleExpireDateBlur = async (e, id) => {
    const date = e.target.value;
    if (date.trim() === '') {
      addNotification('danger', 'Expiration date cannot be empty.');
      return;
    }
    if (!validateDate(date)) {
      addNotification('danger', 'Invalid date format. Please use dd/mm/yyyy.');
      return;
    }
    try {
      await updateDrivingLicenseDetails(id, { drivingLicenseExpireDate: date });
      addNotification('success', 'Expiration date updated successfully!');
    } catch (error) {
      addNotification('danger', 'Failed to update expiration date. Please try again.');
    }
  };

  const updateDrivingLicenseDetails = async (id, details) => {
    const token = localStorage.getItem('access_token');
    const response = await api.put(`/auth/${id}/update-driving-license-details`, details, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status !== 200) {
      throw new Error('Failed to update driving license details');
    }

    return response.data;
  };

  const validateDate = (date) => {
    const regex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    return regex.test(date);
  };

  const filteredProfiles = profiles.filter(
    (profile) =>
      profile.drivingLicenseFullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.drivingLicenseNumber?.includes(searchQuery)
  );

  return (
    <Container className="mt-4">
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
      {loading ? (
        <Row>
          <Col className="text-center">
            <Spinner animation="border" variant="primary" />
          </Col>
        </Row>
      ) : (
        <>
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
            <Col xs="auto">
              <Button variant="primary" onClick={fetchUnverifiedProfiles}>Tải lại</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Card className="mb-4">
                <Card.Header className='bg-primary text-white'>
                  Hồ sơ chờ duyệt
                </Card.Header>
                <Card.Body>
                  <ListGroup>
                    {filteredProfiles.length === 0 ? (
                      <ListGroupItem>Không có hồ sơ nào.</ListGroupItem>
                    ) : (
                      filteredProfiles.map(profile => (
                        <ListGroupItem key={profile.id} className="mb-3" onClick={() => handleExpand(profile.id)} style={{ cursor: 'pointer' }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h5 className="mb-1">{profile.drivingLicenseFullName || 'N/A'}</h5>
                              <p className="mb-1"><strong>Số giấy phép lái xe:</strong> {profile.drivingLicenseNumber || 'N/A'}</p>
                              <p className="mb-1"><strong>Ngày sinh:</strong> {profile.drivingLicenseDOB ? new Date(profile.drivingLicenseDOB).toLocaleDateString() : 'N/A'}</p>
                              {expandedProfile === profile.id && (
                                <div className="mt-3">
                                  <strong>Hình ảnh:</strong>
                                  <div className="d-flex flex-wrap">
                                    {profile.drivingLicenseUrl ? (
                                      <Image
                                        src={profile.drivingLicenseUrl}
                                        alt="Profile"
                                        className="img-thumbnail me-2"
                                        style={{ width: '100px', cursor: 'pointer' }}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleImageClick(profile.drivingLicenseUrl);
                                        }}
                                      />
                                    ) : (
                                      <p>Không có hình ảnh</p>
                                    )}
                                  </div>
                                  <div className="mt-3">
                                    <strong>Ngày hết hạn giấy phép lái xe:</strong>
                                    <FormControl
                                      type="text"
                                      placeholder="dd/mm/yyyy"
                                      value={profile.drivingLicenseExpireDate || ''}
                                      onChange={(e) => handleExpireDateChange(e, profile.id)}
                                      onBlur={(e) => handleExpireDateBlur(e, profile.id)}
                                      onClick={(e) => e.stopPropagation()}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="d-flex">
                              <Button variant="success" className="me-2" onClick={(e) => { e.stopPropagation(); handleAccept(profile.id); }}>Accept</Button>
                              <Button variant="danger" onClick={(e) => { e.stopPropagation(); handleDelete(profile.id); }}>Cancel</Button>
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

          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Xác nhận</Modal.Title>
            </Modal.Header>
            <Modal.Body>Bạn có chắc chắn muốn xóa hồ sơ này?</Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Hủy
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Xóa
              </Button>
            </Modal.Footer>
          </Modal>

          <Modal show={showImageModal} onHide={() => setShowImageModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Xem trước hình ảnh</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <Image src={previewImageUrl} alt="Preview" fluid />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowImageModal(false)}>
                Đóng
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default ApproveDrivingLicense;
