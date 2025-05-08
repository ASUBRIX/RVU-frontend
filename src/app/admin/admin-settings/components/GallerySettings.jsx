import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Modal, Image, Tabs, Tab } from 'react-bootstrap';
import { FaImages, FaUpload, FaTrash, FaPlus, FaCog } from 'react-icons/fa';
import { BsFullscreen } from 'react-icons/bs';
import GlightBox from '@/components/GlightBox';
import 'glightbox/dist/css/glightbox.min.css';

// Import images properly
import event11 from '@/assets/images/event/11.jpg';
import event12 from '@/assets/images/event/12.jpg';
import event13 from '@/assets/images/event/13.jpg';
import event14 from '@/assets/images/event/14.jpg';
import event15 from '@/assets/images/event/15.jpg';
import event16 from '@/assets/images/event/16.jpg';
import event17 from '@/assets/images/event/17.jpg';

const GallerySettings = () => {
  const [activeTab, setActiveTab] = useState('configuration');
  const [galleryConfig, setGalleryConfig] = useState({
    title: 'Our Best Moments',
    layout: 'mixed', // mixed, grid, masonry
    maxImages: 6,
    allowVideoEmbeds: true,
    showFullscreenIcon: true,
    galleryType: 'event', // event, portfolio, team, etc.
    imageQuality: 'high',
    lightboxEnabled: true
  });

  const [images, setImages] = useState([
    { id: 1, src: event11, name: '11.jpg' },
    { id: 2, src: event12, name: '12.jpg' },
    { id: 3, src: event13, name: '13.jpg' },
    { id: 4, src: event14, name: '14.jpg' },
    { id: 5, src: event15, name: '15.jpg' },
    { id: 6, src: event16, name: '16.jpg' },
    { id: 7, src: event17, name: '17.jpg' },
  ]);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;
    setGalleryConfig(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      src: URL.createObjectURL(file),
      name: file.name,
      file: file
    }));
    setSelectedFiles([...selectedFiles, ...newImages]);
  };

  const removeSelectedFile = (id) => {
    setSelectedFiles(selectedFiles.filter(file => file.id !== id));
  };

  const confirmUpload = () => {
    // TODO: Implement actual upload logic
    const uploadedImages = selectedFiles.map(file => ({
      id: file.id,
      src: file.src,
      name: file.name
    }));
    
    setImages([...images, ...uploadedImages]);
    setSelectedFiles([]);
    setShowUploadModal(false);
  };

  const removeImage = (id) => {
    // TODO: Implement actual image removal logic
    setImages(images.filter(img => img.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement save logic for gallery settings
    console.log('Gallery Settings Saved:', galleryConfig);
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title className="d-flex align-items-center">
          <FaImages className="me-2" />
          Gallery Management
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Tabs 
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="configuration" title={<><FaCog className="me-2" />Configuration</>}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gallery Title</Form.Label>
                    <Form.Control 
                      type="text" 
                      name="title"
                      value={galleryConfig.title}
                      onChange={handleConfigChange}
                      placeholder="Enter gallery title"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gallery Type</Form.Label>
                    <Form.Select 
                      name="galleryType"
                      value={galleryConfig.galleryType}
                      onChange={handleConfigChange}
                    >
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
                    <Form.Select 
                      name="layout"
                      value={galleryConfig.layout}
                      onChange={handleConfigChange}
                    >
                      <option value="mixed">Mixed Layout</option>
                      <option value="grid">Grid Layout</option>
                      <option value="masonry">Masonry Layout</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Max Number of Images</Form.Label>
                    <Form.Control 
                      type="number" 
                      name="maxImages"
                      value={galleryConfig.maxImages}
                      onChange={handleConfigChange}
                      min={1}
                      max={12}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      name="allowVideoEmbeds"
                      label="Allow Video Embeds"
                      checked={galleryConfig.allowVideoEmbeds}
                      onChange={handleConfigChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      name="showFullscreenIcon"
                      label="Show Fullscreen Icon"
                      checked={galleryConfig.showFullscreenIcon}
                      onChange={handleConfigChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Check 
                      type="checkbox"
                      name="lightboxEnabled"
                      label="Enable Lightbox Viewer"
                      checked={galleryConfig.lightboxEnabled}
                      onChange={handleConfigChange}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Image Quality</Form.Label>
                    <Form.Select 
                      name="imageQuality"
                      value={galleryConfig.imageQuality}
                      onChange={handleConfigChange}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              <Button variant="primary" type="submit" className="mt-3">
                Save Gallery Settings
              </Button>
            </Form>
          </Tab>
          
          <Tab eventKey="images" title={<><FaImages className="me-2" />Images</>}>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Uploaded Images</h5>
              <Button 
                variant="success" 
                onClick={() => setShowUploadModal(true)}
              >
                <FaPlus className="me-2" /> Add Images
              </Button>
            </div>
            <Row className="g-4">
              {images.map((image) => (
                <Col key={image.id} xs={6} md={4} lg={3} className="position-relative">
                  <Card className="overflow-hidden">
                    <div className="card-overlay-hover position-relative">
                      <img 
                        src={image.src} 
                        className="img-fluid rounded-3" 
                        alt={image.name}
                      />
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="position-absolute top-0 end-0 m-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(image.id);
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    <GlightBox 
                      className="card-element-hover position-absolute w-100 h-100" 
                      data-glightbox 
                      data-gallery="gallery-admin" 
                      href={image.src}
                    >
                      <BsFullscreen
                        size={30}
                        className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1"
                      />
                    </GlightBox>
                  </Card>
                  <p className="text-center mt-2 text-truncate">{image.name}</p>
                </Col>
              ))}
            </Row>
          </Tab>
        </Tabs>
      </Card.Body>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control 
              type="file" 
              multiple 
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Form.Group>

          {selectedFiles.length > 0 && (
            <Row className="g-4 mb-3">
              {selectedFiles.map((file) => (
                <Col key={file.id} xs={6} md={4} lg={3} className="position-relative">
                  <Card className="overflow-hidden">
                    <div className="card-overlay-hover">
                      <img 
                        src={file.src} 
                        className="img-fluid rounded-3" 
                        alt={file.name}
                      />
                      <Button 
                        variant="danger" 
                        size="sm" 
                        className="position-absolute top-0 end-0 m-2"
                        onClick={() => removeSelectedFile(file.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                    <GlightBox 
                      className="card-element-hover position-absolute w-100 h-100" 
                      data-glightbox 
                      data-gallery="gallery-upload" 
                      href={file.src}
                    >
                      <BsFullscreen
                        size={30}
                        className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1"
                      />
                    </GlightBox>
                  </Card>
                  <p className="text-center mt-2 text-truncate">{file.name}</p>
                </Col>
              ))}
            </Row>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={confirmUpload}
            disabled={selectedFiles.length === 0}
          >
            Upload Images
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default GallerySettings;