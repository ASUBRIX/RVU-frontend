import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Modal, Tabs, Tab } from 'react-bootstrap';
import { FaImages, FaTrash, FaPlus, FaCog } from 'react-icons/fa';
import { BsFullscreen } from 'react-icons/bs';
import GlightBox from '@/components/GlightBox';
import 'glightbox/dist/css/glightbox.min.css';
import { uploadGalleryImages, getGalleryImages, deleteGalleryImage } from '@/helpers/galleryApi';

const GallerySettings = () => {
  const [activeTab, setActiveTab] = useState('configuration');
  const [galleryConfig, setGalleryConfig] = useState({
    title: 'Our Best Moments',
    layout: 'mixed',
    maxImages: 6,
    allowVideoEmbeds: true,
    showFullscreenIcon: true,
    galleryType: 'event',
    imageQuality: 'high',
    lightboxEnabled: true
  });
  const [images, setImages] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
     const imgs = await getGalleryImages();
setImages(imgs);

    } catch (err) {
      console.error('Failed to fetch images', err);
    }
  };

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGalleryConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file, index) => ({
      id: Date.now() + index,
      src: URL.createObjectURL(file),
      name: file.name,
      file
    }));
    setSelectedFiles(prev => [...prev, ...previews]);
  };

  const removeSelectedFile = (id) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== id));
  };

  const confirmUpload = async () => {
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('images', file.file));
      const { data } = await uploadGalleryImages(formData);
      setImages(prev => [...prev, ...data]);
      setSelectedFiles([]);
      setShowUploadModal(false);
    } catch (err) {
      console.error('Failed to upload images', err);
    }
  };

  const removeImage = async (id) => {
    try {
      await deleteGalleryImage(id);
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (err) {
      console.error('Failed to delete image', err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Gallery Settings Saved:', galleryConfig);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title className="d-flex align-items-center">
          <FaImages className="me-2" /> Gallery Management
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
          <Tab eventKey="configuration" title={<><FaCog className="me-2" />Configuration</>}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gallery Title</Form.Label>
                    <Form.Control name="title" value={galleryConfig.title} onChange={handleConfigChange} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gallery Type</Form.Label>
                    <Form.Select name="galleryType" value={galleryConfig.galleryType} onChange={handleConfigChange}>
                      <option value="event">Event Gallery</option>
                      <option value="portfolio">Portfolio</option>
                      <option value="team">Team Photos</option>
                      <option value="product">Product Gallery</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Layout Style</Form.Label>
                    <Form.Select name="layout" value={galleryConfig.layout} onChange={handleConfigChange}>
                      <option value="mixed">Mixed Layout</option>
                      <option value="grid">Grid Layout</option>
                      <option value="masonry">Masonry Layout</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Number of Images</Form.Label>
                    <Form.Control name="maxImages" type="number" value={galleryConfig.maxImages} min={1} max={12} onChange={handleConfigChange} />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Check name="allowVideoEmbeds" label="Allow Video Embeds" checked={galleryConfig.allowVideoEmbeds} onChange={handleConfigChange} />
              <Form.Check name="showFullscreenIcon" label="Show Fullscreen Icon" checked={galleryConfig.showFullscreenIcon} onChange={handleConfigChange} />
              <Form.Check name="lightboxEnabled" label="Enable Lightbox Viewer" checked={galleryConfig.lightboxEnabled} onChange={handleConfigChange} />
              <Form.Group className="mb-3 mt-3">
                <Form.Label>Image Quality</Form.Label>
                <Form.Select name="imageQuality" value={galleryConfig.imageQuality} onChange={handleConfigChange}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Form.Group>
              <Button type="submit">Save Gallery Settings</Button>
            </Form>
          </Tab>

          <Tab eventKey="images" title={<><FaImages className="me-2" />Images</>}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Uploaded Images</h5>
              <Button variant="success" onClick={() => setShowUploadModal(true)}>
                <FaPlus className="me-2" /> Add Images
              </Button>
            </div>
            <Row className="g-4">
              {images.map((image) => (
                <Col key={image.id} xs={6} md={4} lg={3} className="position-relative">
                  <Card className="overflow-hidden">
                    <div className="card-overlay-hover position-relative">
                      <img src={image.image_url} className="img-fluid rounded-3" alt={image.name} />
                      <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-2" onClick={() => removeImage(image.id)}>
                        <FaTrash />
                      </Button>
                    </div>
                    <GlightBox className="card-element-hover position-absolute w-100 h-100" data-glightbox data-gallery="gallery-admin" href={image.image_url}>
                      <BsFullscreen size={30} className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1" />
                    </GlightBox>
                  </Card>
                  <p className="text-center mt-2 text-truncate">{image.name}</p>
                </Col>
              ))}
            </Row>
          </Tab>
        </Tabs>
      </Card.Body>

      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control type="file" multiple accept="image/*" onChange={handleImageUpload} />
          </Form.Group>
          <Row className="g-4 mb-3">
            {selectedFiles.map((file) => (
              <Col key={file.id} xs={6} md={4} lg={3} className="position-relative">
                <Card className="overflow-hidden">
                  <div className="card-overlay-hover">
                    <img src={file.src} className="img-fluid rounded-3" alt={file.name} />
                    <Button variant="danger" size="sm" className="position-absolute top-0 end-0 m-2" onClick={() => removeSelectedFile(file.id)}>
                      <FaTrash />
                    </Button>
                  </div>
                  <GlightBox className="card-element-hover position-absolute w-100 h-100" data-glightbox data-gallery="gallery-upload" href={file.src}>
                    <BsFullscreen size={30} className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1" />
                  </GlightBox>
                </Card>
                <p className="text-center mt-2 text-truncate">{file.name}</p>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={confirmUpload} disabled={selectedFiles.length === 0}>Upload Images</Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default GallerySettings;