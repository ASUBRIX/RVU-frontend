import { useEffect, useState } from 'react';
import { Button, Card, Form, Modal, Spinner } from 'react-bootstrap';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { FiSearch } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import {fetchBanners,createBanner,updateBanner,deleteBanner} from '@/helpers/bannerApi';

const BannerSettings = () => {
  const [banners, setBanners] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState(null);

  const loadBanners = async () => {
    try {
      const { data } = await fetchBanners({ search: searchQuery, sort: sortBy });
      setBanners(data);
    } catch (err) {
      console.error('Failed to load banners:', err);
    }
  };

  useEffect(() => {
    loadBanners();
  }, [searchQuery, sortBy]);

  const handleAddBanner = () => {
    setSelectedBanner(null);
    setTitle('');
    setLink('');
    setDescription('');
    setImageFile(null);
    setShowModal(true);
  };

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner);
    setTitle(banner.title);
    setLink(banner.link || '');
    setDescription(banner.description || '');
    setImageFile(null);
    setShowModal(true);
  };

  const handleSaveBanner = async () => {
    if (!title) return alert('Title is required');
    const formData = new FormData();
    formData.append('title', title);
    formData.append('link', link);
    formData.append('description', description);
    if (imageFile) formData.append('image', imageFile);

    try {
      setLoading(true);
      if (selectedBanner) {
        await updateBanner(selectedBanner.id, formData);
      } else {
        console.log('formData values:');
for (let pair of formData.entries()) {
  console.log(pair[0]+ ':', pair[1]);
}

        
        await createBanner(formData);
        
      }
      setShowModal(false);
      loadBanners();
    } catch (err) {
      console.error('Failed to save banner:', err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteBanner = (banner) => {
    setBannerToDelete(banner);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!bannerToDelete) return;
    try {
      await deleteBanner(bannerToDelete.id);
      loadBanners();
    } catch (err) {
      console.error('Failed to delete banner:', err);
    } finally {
      setShowConfirmModal(false);
      setBannerToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBanner(null);
  };

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">Banner Management</h4>
          <p className="text-muted mb-0">Manage website banners and promotional content</p>
        </div>
        <Button className="btn-add-content d-flex align-items-center" onClick={handleAddBanner}>
          <FaPlus className="me-2" /> Add New Banner
        </Button>
      </div>

      <div className="row g-3 align-items-center mb-3">
        <div className="col-md-8">
          <div className="search-input">
            <div className="input-group">
              <span className="input-group-text border-end-0">
                <FiSearch className="text-muted" />
              </span>
              <Form.Control
                type="text"
                placeholder="Search banners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-start-0 ps-0 rounded-end"
              />
            </div>
          </div>
        </div>
        <div className="col-md-4 d-flex justify-content-end">
          <Form.Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-auto"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Title</option>
          </Form.Select>
        </div>
      </div>

      <Card className="border-0">
        <Card.Body className="p-0">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td>{banner.title}</td>
                  <td>{banner.description}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <Button variant="light" size="sm" className="action-btn" onClick={() => handleEditBanner(banner)}>
                        <BsPencilSquare />
                      </Button>
                      <Button variant="light" size="sm" className="action-btn text-danger" onClick={() => confirmDeleteBanner(banner)}>
                        <BsTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedBanner ? 'Edit Banner' : 'Add New Banner'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter banner title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Image <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                required={!selectedBanner}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter banner link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter banner description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveBanner} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : selectedBanner ? 'Update Banner' : 'Add Banner'}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the banner <strong>{bannerToDelete?.title}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BannerSettings;


