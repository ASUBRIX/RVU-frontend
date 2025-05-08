import { useState } from 'react'
import { Button, Card, Form, Modal } from 'react-bootstrap'
import { BsPencilSquare, BsTrash, BsEye } from 'react-icons/bs'
import { FiSearch } from 'react-icons/fi'
import { FaPlus } from 'react-icons/fa'

const BannerSettings = () => {
  const [banners, setBanners] = useState([
    {
      id: 1,
      title: 'Banner One',
      image: '/path/to/banner1.jpg',
      link: '#',
      description: 'Main homepage banner',
    },
    {
      id: 2,
      title: 'Banner Two',
      image: '/path/to/banner2.jpg',
      link: '#',
      description: 'Secondary promotional banner',
    },
  ])

  const [showModal, setShowModal] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const handleAddBanner = () => {
    setSelectedBanner(null)
    setShowModal(true)
  }

  const handleEditBanner = (banner) => {
    setSelectedBanner(banner)
    setShowModal(true)
  }

  const handleViewBanner = (banner) => {
    console.log('Viewing banner:', banner)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedBanner(null)
  }

  const filteredBanners = banners.filter(
    (banner) =>
      banner.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      banner.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
        <div>
          <h4 className="mb-0">Banner Management</h4>
          <p className="text-muted mb-0">Manage website banners and promotional content</p>
        </div>
        <Button className="btn-add-content d-flex align-items-center" onClick={handleAddBanner}>
          <FaPlus className="me-2" />
          Add New Banner
        </Button>
      </div>

      {/* Search and Sort */}
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
        <div className="col-md-4">
          <div className="d-flex align-items-center justify-content-end">
            <label className="me-2 text-nowrap fw-medium">Sort by:</label>
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="form-select"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title</option>
            </Form.Select>
          </div>
        </div>
      </div>

      {/* Table */}
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
              {filteredBanners.map((banner) => (
                <tr key={banner.id}>
                  <td>{banner.title}</td>
                  <td>{banner.description}</td>
                  <td>
                    <div className="d-flex justify-content-end gap-2">
                      <Button variant="light" size="sm" className="action-btn" onClick={() => handleViewBanner(banner)}>
                        <BsEye />
                      </Button>
                      <Button variant="light" size="sm" className="action-btn" onClick={() => handleEditBanner(banner)}>
                        <BsPencilSquare />
                      </Button>
                      <Button variant="light" size="sm" className="action-btn text-danger">
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

      {/* Banner Modal  */}
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
                defaultValue={selectedBanner?.title}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image (1126px x 400px) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                required={!selectedBanner}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link</Form.Label>
              <Form.Control
                type="url"
                placeholder="Enter banner link"
                defaultValue={selectedBanner?.link}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter banner description"
                defaultValue={selectedBanner?.description}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary">
            {selectedBanner ? 'Update Banner' : 'Add Banner'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default BannerSettings
