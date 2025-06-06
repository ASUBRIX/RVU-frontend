import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { FaImages, FaTrash, FaPlus, FaCog, FaEdit } from 'react-icons/fa';
import { BsFullscreen } from 'react-icons/bs';
import GlightBox from '@/components/GlightBox';
import 'glightbox/dist/css/glightbox.min.css';
import { uploadGalleryImages, getGalleryImages, deleteGalleryImage } from '@/helpers/galleryApi';

const GallerySettings = () => {
  const [activeTab, setActiveTab] = useState('images');
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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null);

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
    if (window.confirm('Are you sure you want to delete this image?')) {
      try {
        await deleteGalleryImage(id);
        setImages(prev => prev.filter(img => img.id !== id));
      } catch (err) {
        console.error('Failed to delete image', err);
      }
    }
  };

  const handleEditImage = (image) => {
    setEditingImage(image);
    setShowEditModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Gallery Settings Saved:', galleryConfig);
  };

  // Custom styles for the hover effect
  const imageCardStyle = {
    cursor: 'pointer',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
  };

  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    borderRadius: '0.375rem'
  };

  const overlayVisibleStyle = {
    ...overlayStyle,
    opacity: 1
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <Card.Title className="d-flex align-items-center">
          <FaImages className="me-2" /> Gallery Management
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col className="text-start">
            <Button variant={activeTab === 'images' ? 'primary' : 'outline-primary'} onClick={() => setActiveTab('images')}>
              <FaImages className="me-2" /> Images
            </Button>
          </Col>
          <Col className="text-end">
            <Button variant={activeTab === 'configuration' ? 'primary' : 'outline-primary'} onClick={() => setActiveTab('configuration')}>
              <FaCog className="me-2" /> Configuration
            </Button>
          </Col>
        </Row>

        {activeTab === 'images' && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5>Uploaded Images</h5>
              <Button variant="success" onClick={() => setShowUploadModal(true)}>
                <FaPlus className="me-2" /> Add Images
              </Button>
            </div>
            <Row className="g-4">
              {images.map((image) => (
                <Col key={image.id} xs={6} md={4} lg={3}>
                  <Card 
                    className="overflow-hidden position-relative border-0 shadow-sm"
                    style={imageCardStyle}
                    onMouseEnter={() => setHoveredImage(image.id)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    <div className="position-relative">
                      <img 
                        src={image.image_url} 
                        className="img-fluid w-100" 
                        alt={image.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      
                      {/* Overlay with Edit and Delete buttons */}
                      <div 
                        style={hoveredImage === image.id ? overlayVisibleStyle : overlayStyle}
                      >
                        <Button 
                          variant="warning" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditImage(image);
                          }}
                          title="Edit Image"
                        >
                          <FaEdit />
                        </Button>
                        
                        <Button 
                          variant="light" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center"
                          style={{ 
                            width: '40px', 
                            height: '40px', 
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)'
                          }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Add fullscreen functionality here
                            window.open(image.image_url, '_blank');
                          }}
                          title="View Fullscreen"
                        >
                          <BsFullscreen />
                        </Button>
                        
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="d-flex align-items-center justify-content-center"
                          style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                          title="Delete Image"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Image name */}
                    <Card.Body className="p-2">
                      <p className="text-center mb-0 text-truncate small">{image.name}</p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        )}

        {activeTab === 'configuration' && (
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
            <Button type="submit" variant="primary">Save Gallery Settings</Button>
          </Form>
        )}
      </Card.Body>

      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Upload Images</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Images</Form.Label>
            <Form.Control
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Form.Group>
          
          {selectedFiles.length > 0 && (
            <>
              <h6>Selected Images:</h6>
              <Row className="g-3">
                {selectedFiles.map((file) => (
                  <Col key={file.id} xs={6} md={4}>
                    <Card>
                      <img src={file.src} className="img-fluid" alt={file.name} style={{ height: '100px', objectFit: 'cover' }} />
                      <Card.Body className="p-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <small className="text-truncate">{file.name}</small>
                          <Button variant="outline-danger" size="sm" onClick={() => removeSelectedFile(file.id)}>
                            <FaTrash />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmUpload} disabled={selectedFiles.length === 0}>
            Upload Images
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingImage && (
            <>
              <img src={editingImage.image_url} className="img-fluid mb-3" alt={editingImage.name} />
              <Form.Group className="mb-3">
                <Form.Label>Image Name</Form.Label>
                <Form.Control
                  type="text"
                  value={editingImage.name}
                  onChange={(e) => setEditingImage({...editingImage, name: e.target.value})}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Alt Text</Form.Label>
                <Form.Control
                  type="text"
                  value={editingImage.alt_text || ''}
                  onChange={(e) => setEditingImage({...editingImage, alt_text: e.target.value})}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={() => {
            // Add save functionality here
            console.log('Saving image:', editingImage);
            setShowEditModal(false);
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default GallerySettings;