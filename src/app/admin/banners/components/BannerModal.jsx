/**
 * Component SCSS:
 * - Banner styles: src/assets/scss/components/_banner-management.scss
 * - Modal styles: src/assets/scss/components/_general.scss
 */

import { Button, Form, Modal } from 'react-bootstrap';

const BannerModal = ({ show, onHide, banner = null }) => {
  const isEditing = !!banner;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{isEditing ? 'Edit Banner' : 'Add New Banner'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter banner title"
              defaultValue={banner?.title}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Image (1126px x 400px) <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              required={!isEditing}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Link</Form.Label>
            <Form.Control
              type="url"
              placeholder="Enter banner link"
              defaultValue={banner?.link}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter banner description"
              defaultValue={banner?.description}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary">
          {isEditing ? 'Update Banner' : 'Add Banner'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BannerModal;
