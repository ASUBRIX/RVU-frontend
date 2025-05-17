import { useEffect, useState } from 'react'
import { Button, Breadcrumb, Offcanvas, Form, Card, Dropdown, Tab, Nav } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { FiMoreVertical, FiEdit2, FiPlus, FiTrash2, FiVideo } from 'react-icons/fi'
import { getCourseContentById } from '../../../../helpers/courseContentApi'

const CourseContent = ({ setActiveStep, setProgress }) => {
  const navigate = useNavigate()
  const { id } = useParams()

  const [contents, setContents] = useState([])
  const [videoModules, setVideoModules] = useState([])
  const [loading, setLoading] = useState(true)

  const [showDrawer, setShowDrawer] = useState(false)
  const [showVideoDrawer, setShowVideoDrawer] = useState(false)
  const [newContent, setNewContent] = useState({ name: '', type: 'video', isFree: false })
  const [newVideoModule, setNewVideoModule] = useState({ moduleName: '', chapters: [] })
  const [activeTab, setActiveTab] = useState('content')

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const res = await getCourseContentById(id)
        setContents(res.data?.contents || [])
        setVideoModules(res.data?.videoModules || [])
      } catch (error) {
        console.error('Failed to load course content:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourseContent()
  }, [id])

  const handleAddContent = () => {
    if (!newContent.name) return
    setContents([...contents, { ...newContent, id: Date.now().toString() }])
    setNewContent({ name: '', type: 'video', isFree: false })
    setShowDrawer(false)
  }

  const handleAddVideoModule = () => {
    if (!newVideoModule.moduleName || newVideoModule.chapters.length === 0) return
    setVideoModules([...videoModules, { ...newVideoModule, id: Date.now().toString() }])
    setNewVideoModule({ moduleName: '', chapters: [] })
    setShowVideoDrawer(false)
  }

  const handleAddChapter = () => {
    const chapter = { id: Date.now().toString(), name: `Chapter ${newVideoModule.chapters.length + 1}`, videoType: 'upload', isFree: false }
    setNewVideoModule({ ...newVideoModule, chapters: [...newVideoModule.chapters, chapter] })
  }

  if (loading) {
    return <p>Loading course content...</p>
  }

  return (
    <div>
      <Offcanvas show={showDrawer} onHide={() => setShowDrawer(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Content</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control value={newContent.name} onChange={(e) => setNewContent({ ...newContent, name: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select value={newContent.type} onChange={(e) => setNewContent({ ...newContent, type: e.target.value })}>
                <option value="video">Video</option>
                <option value="document">Document</option>
              </Form.Select>
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Free"
              checked={newContent.isFree}
              onChange={(e) => setNewContent({ ...newContent, isFree: e.target.checked })}
            />
            <Button className="mt-3" onClick={handleAddContent}>Add</Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <Offcanvas show={showVideoDrawer} onHide={() => setShowVideoDrawer(false)} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Video Module</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Module Name</Form.Label>
              <Form.Control value={newVideoModule.moduleName} onChange={(e) => setNewVideoModule({ ...newVideoModule, moduleName: e.target.value })} />
            </Form.Group>
            <Button onClick={handleAddChapter} className="mb-3">Add Chapter</Button>
            <ul>
              {newVideoModule.chapters.map((chapter) => (
                <li key={chapter.id}>{chapter.name}</li>
              ))}
            </ul>
            <Button className="mt-3" onClick={handleAddVideoModule}>Add Module</Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <Breadcrumb className="mb-0">
          <Breadcrumb.Item active>Course Content</Breadcrumb.Item>
        </Breadcrumb>
        <div className="d-flex gap-2">
          <Button onClick={() => setShowVideoDrawer(true)}><FiPlus /> Video Module</Button>
          <Button onClick={() => setShowDrawer(true)}><FiPlus /> Add Content</Button>
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="content">Contents</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="videos">Video Modules</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="content">
            <div className="mb-4">
              {contents.length === 0 ? (
                <p className="text-muted">No contents available.</p>
              ) : (
                <ul className="ps-3">
                  {contents.map((content) => (
                    <li key={content.id}>
                      <strong>{content.name}</strong> ({content.type}){' '}
                      {content.isFree && <span className="badge bg-success ms-2">Free</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="videos">
            <div className="mb-4">
              {videoModules.length === 0 ? (
                <p className="text-muted">No video modules available.</p>
              ) : (
                <ul className="ps-3">
                  {videoModules.map((module) => (
                    <li key={module.id}>
                      <strong>{module.moduleName}</strong> ({module.chapters.length} lecture(s))
                      <ul className="ps-3 mt-2">
                        {module.chapters.map((chapter) => (
                          <li key={chapter.id}>
                            {chapter.name} - {chapter.videoType}{' '}
                            {chapter.isFree && <span className="badge bg-success ms-2">Free</span>}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="light" onClick={() => setActiveStep(2)}>
          Previous
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            setProgress(100)
            setActiveStep(3)
          }}>
          Finish
        </Button>
      </div>
    </div>
  )
}

export default CourseContent
