import React from 'react';
import { Card, Button } from 'react-bootstrap';

const UploadedImages = () => {
  return (
    <Card>
      <Card.Header>Hình ảnh đã upload</Card.Header>
      <Card.Body>
        <Card.Text>List of uploaded images will be displayed here.</Card.Text>
        <Button variant="primary">View Images</Button>
      </Card.Body>
    </Card>
  );
};

export default UploadedImages;
