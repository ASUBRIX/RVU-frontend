import React, { useEffect, useState } from 'react';
import { getGalleryImages } from '@/helpers/galleryApi';
import { Card, Col, Container, Row } from 'react-bootstrap';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  getGalleryImages()
    .then((data) => {
      // Add this to debug if it's not working:
      console.log('API gallery data:', data);
      if (Array.isArray(data)) {
        setImages(data);
      } else if (Array.isArray(data?.rows)) {
        setImages(data.rows);
      } else {
        setImages([]);
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, []);



  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (images.length === 0) {
    return (
      <Container className="py-5 text-center">
        <p>No gallery images found.</p>
      </Container>
    );
  }

  return (
    <section className="pt-0 pt-md-5">
      <Container>
        <Row className="mb-3 mb-sm-4">
          <Col xs={12} className="mx-auto text-center">
            <h2 className="fs-1 fw-bold">
              <span className="position-relative z-index-9">Our Best</span>&nbsp;
              <span className="position-relative z-index-1">Moments</span>
            </h2>
          </Col>
        </Row>
        <Row className="g-4">
          {images.map(img => (
            <Col key={img.id} md={4} sm={6} xs={12}>
              <Card className="overflow-hidden shadow h-100">
                <div className="card-overlay-hover">
                  <img
                    src={img.image_url}
                    className="rounded-3 img-fluid w-100"
                    alt={img.name || 'Gallery image'}
                    style={{ objectFit: 'cover', height: 250 }}
                  />
                </div>
              
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Gallery;
