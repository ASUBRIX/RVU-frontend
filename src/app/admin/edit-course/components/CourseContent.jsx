import { useState } from 'react'
import { Button, Card, Form, Modal, Breadcrumb, Dropdown, Nav, Tab, Offcanvas } from 'react-bootstrap'
import {
  FiFolder,
  FiVideo,
  FiFileText,
  FiImage,
  FiArchive,
  FiPlus,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiMove,
  FiDownload,
  FiUpload,
  FiLink,
  FiX,
  FiArrowLeft,
} from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

const CourseContent = ({ setActiveStep, setProgress }) => {
  const navigate = useNavigate()
  const [contents, setContents] = useState([
    {
      id: '1',
      type: 'folder',
      name: 'Bank Exams',
      isFree: false,
      items: [
        {
          id: '1-1',
          type: 'video',
          name: 'Welcome Video',
          duration: '5:30',
          isPreview: true,
          isFree: false,
        },
        {
          id: '1-2',
          type: 'document',
          name: 'Course Overview',
          size: '1.2 MB',
          isFree: false,
        },
      ],
    },
  ])

  const [currentPath, setCurrentPath] = useState([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [drawerMode, setDrawerMode] = useState(null) // 'new-folder', 'folder-content', 'add-content'
  const [contentType, setContentType] = useState(null)
  const [contentName, setContentName] = useState('')
  const [contentFile, setContentFile] = useState(null)
  const [contentUrl, setContentUrl] = useState('')
  const [isFreeContent, setIsFreeContent] = useState(false)
  const [activeTab, setActiveTab] = useState('content')
  const [selectedFolder, setSelectedFolder] = useState(null)

  // New state for video modules
  const [videoModules, setVideoModules] = useState([])
  const [showVideoModuleDrawer, setShowVideoModuleDrawer] = useState(false)
  const [moduleName, setModuleName] = useState('')
  const [chapters, setChapters] = useState([])
  const [currentChapter, setCurrentChapter] = useState({
    name: '',
    videoUrl: '',
    videoFile: null,
    isFree: false,
  })

  // Add new state for drawer folder navigation
  const [drawerPath, setDrawerPath] = useState([])
  const [drawerContents, setDrawerContents] = useState([])

  // Add new state for tracking selected content
  const [selectedContent, setSelectedContent] = useState(null)

  // Get current folder contents
  const getCurrentContents = () => {
    let current = contents
    for (const folderId of currentPath) {
      const folder = current.find((item) => item.id === folderId)
      if (folder && folder.items) {
        current = folder.items
      }
    }
    return current
  }

  // Function to get current folder contents in drawer
  const getCurrentDrawerContents = () => {
    let current = drawerContents
    for (const folderId of drawerPath) {
      const folder = current.find((item) => item.id === folderId)
      if (folder && folder.items) {
        current = folder.items
      }
    }
    return current
  }

  // Add content to current folder
  const addContent = (type, name, file = null, url = null) => {
    const newContent = {
      id: Date.now().toString(),
      type,
      name,
      file,
      url,
      items: type === 'folder' ? [] : undefined,
      isFree: isFreeContent,
    }

    if (currentPath.length === 0) {
      setContents([...contents, newContent])
    } else {
      const updateNestedContent = (items, path, newItem) => {
        return items.map((item) => {
          if (item.id === path[0]) {
            if (path.length === 1) {
              return {
                ...item,
                items: [...(item.items || []), newItem],
              }
            }
            return {
              ...item,
              items: updateNestedContent(item.items || [], path.slice(1), newItem),
            }
          }
          return item
        })
      }

      setContents(updateNestedContent(contents, currentPath, newContent))
    }
  }

  // Function to add content in drawer
  const addDrawerContent = (type, name, parentPath) => {
    const newContent = {
      id: Date.now().toString(),
      type,
      name,
      items: type === 'folder' ? [] : undefined,
      isFree: isFreeContent,
    }

    if (parentPath.length === 0) {
      setDrawerContents([...drawerContents, newContent])
    } else {
      const updateNestedContent = (items, path, newItem) => {
        return items.map((item) => {
          if (item.id === path[0]) {
            if (path.length === 1) {
              return {
                ...item,
                items: [...(item.items || []), newItem],
              }
            }
            return {
              ...item,
              items: updateNestedContent(item.items || [], path.slice(1), newItem),
            }
          }
          return item
        })
      }

      setDrawerContents(updateNestedContent(drawerContents, parentPath, newContent))
    }
  }

  const handleContentSubmit = () => {
    if (contentName.trim()) {
      const newContent = {
        type: contentType,
        name: contentName,
        url: contentUrl,
        isFree: isFreeContent,
        items: contentType === 'folder' ? [] : undefined,
      }

      // If we're editing, update the existing content
      const currentContents = getCurrentContents()
      const existingContent = currentContents.find((c) => c.id === selectedContent?.id)

      if (existingContent) {
        // Update existing content
        const updatedContents = currentContents.map((content) =>
          content.id === existingContent.id ? { ...existingContent, ...newContent } : content,
        )

        if (currentPath.length === 0) {
          setContents(updatedContents)
        } else {
          const updateNestedContent = (items, path, updatedItems) => {
            return items.map((item) => {
              if (item.id === path[0]) {
                if (path.length === 1) {
                  return {
                    ...item,
                    items: updatedItems,
                  }
                }
                return {
                  ...item,
                  items: updateNestedContent(item.items || [], path.slice(1), updatedItems),
                }
              }
              return item
            })
          }
          setContents(updateNestedContent(contents, currentPath, updatedContents))
        }
      } else {
        // Add new content
        const brandNewContent = {
          ...newContent,
          id: Date.now().toString(),
        }

        if (currentPath.length === 0) {
          setContents([...contents, brandNewContent])
        } else {
          const updateNestedContent = (items, path, newItem) => {
            return items.map((item) => {
              if (item.id === path[0]) {
                if (path.length === 1) {
                  return {
                    ...item,
                    items: [...(item.items || []), newItem],
                  }
                }
                return {
                  ...item,
                  items: updateNestedContent(item.items || [], path.slice(1), newItem),
                }
              }
              return item
            })
          }
          setContents(updateNestedContent(contents, currentPath, brandNewContent))
        }
      }

      setContentName('')
      setContentFile(null)
      setContentUrl('')
      setContentType(null)
      setIsFreeContent(false)
      setSelectedContent(null)
      setShowDrawer(false)
    }
  }

  const handleFolderClick = (folderId) => {
    setCurrentPath([...currentPath, folderId])
    setSelectedFolder(folderId)
    setShowDrawer(true)
    setDrawerMode('folder-content')
  }

  const navigateBack = () => {
    setCurrentPath(currentPath.slice(0, -1))
  }

  const getBreadcrumbItems = () => {
    let items = [{ id: null, name: 'Contents' }]
    let path = []

    for (const folderId of currentPath) {
      path.push(folderId)
      let current = contents
      for (const id of path) {
        const folder = current.find((item) => item.id === id)
        if (folder) {
          items.push({ id: folder.id, name: folder.name })
          current = folder.items || []
        }
      }
    }

    return items
  }

  const getContentIcon = (type) => {
    switch (type) {
      case 'folder':
        return <FiFolder className="text-warning" />
      case 'video':
        return <FiVideo className="text-primary" />
      case 'document':
        return <FiFileText className="text-info" />
      case 'image':
        return <FiImage className="text-success" />
      case 'archive':
        return <FiArchive className="text-secondary" />
      case 'link':
        return <FiLink className="text-primary" />
      default:
        return <FiFileText className="text-muted" />
    }
  }

  const handleAddChapter = () => {
    if (currentChapter.name && (currentChapter.videoUrl || currentChapter.videoFile)) {
      setChapters([...chapters, { ...currentChapter, id: Date.now().toString() }])
      setCurrentChapter({
        name: '',
        videoUrl: '',
        videoFile: null,
        isFree: false,
      })
    }
  }

  const handleRemoveChapter = (chapterId) => {
    setChapters(chapters.filter((chapter) => chapter.id !== chapterId))
  }

  const handleAddVideoModule = () => {
    if (moduleName && chapters.length > 0) {
      const moduleToUpdate = videoModules.find((m) => m.moduleName === moduleName)

      if (moduleToUpdate) {
        // Update existing module
        setVideoModules(
          videoModules.map((module) =>
            module.id === moduleToUpdate.id
              ? {
                  ...module,
                  moduleName,
                  chapters: chapters.map((chapter) => ({
                    ...chapter,
                    videoSource: chapter.videoFile ? URL.createObjectURL(chapter.videoFile) : chapter.videoUrl,
                    videoType: chapter.videoFile ? 'upload' : 'youtube',
                  })),
                }
              : module,
          ),
        )
      } else {
        // Add new module
        const newModule = {
          id: Date.now().toString(),
          moduleName,
          chapters: chapters.map((chapter) => ({
            ...chapter,
            videoSource: chapter.videoFile ? URL.createObjectURL(chapter.videoFile) : chapter.videoUrl,
            videoType: chapter.videoFile ? 'upload' : 'youtube',
          })),
        }
        setVideoModules([...videoModules, newModule])
      }

      setModuleName('')
      setChapters([])
      setCurrentChapter({
        name: '',
        videoUrl: '',
        videoFile: null,
        isFree: false,
      })
      setShowVideoModuleDrawer(false)
    }
  }

  const handleContentAction = (action, contentId, parentId = null, e) => {
    e.stopPropagation()

    let content
    if (parentId) {
      // If it's a chapter in a video module
      const module = videoModules.find((m) => m.id === parentId)
      if (module) {
        content = module.chapters.find((ch) => ch.id === contentId)
        if (content) {
          setModuleName(module.moduleName)
          setChapters(module.chapters)
          setShowVideoModuleDrawer(true)
          return
        }
      }
    } else {
      // Regular content or folder
      content = getCurrentContents().find((item) => item.id === contentId)
      if (!content) return

      // Set content details for editing
      setSelectedContent(content)
      setContentName(content.name)
      setContentType(content.type)
      setContentUrl(content.url || '')
      setIsFreeContent(content.isFree)
      setContentFile(null) // Reset file input

      // Show the appropriate drawer
      setShowDrawer(true)
      setDrawerMode(content.type === 'folder' ? 'new-folder' : 'folder-content')
    }
  }

  // Helper function to update all nested contents' free status
  const updateAllNestedContentsFreeStatus = (items, freeStatus) => {
    return items.map((item) => ({
      ...item,
      isFree: freeStatus,
      items: item.items ? updateAllNestedContentsFreeStatus(item.items, freeStatus) : undefined,
    }))
  }

  // Video module actions
  const handleModuleAction = (action, moduleId, e) => {
    e.stopPropagation()

    const module = videoModules.find((m) => m.id === moduleId)
    if (!module) return

    setModuleName(module.moduleName)
    setChapters(module.chapters)
    setShowVideoModuleDrawer(true)
  }

  const handleDeleteContent = (contentId) => {
    const currentContents = getCurrentContents()
    const updatedContents = currentContents.filter((content) => content.id !== contentId)

    if (currentPath.length === 0) {
      setContents(updatedContents)
    } else {
      const updateNestedContent = (items, path, updatedItems) => {
        return items.map((item) => {
          if (item.id === path[0]) {
            if (path.length === 1) {
              return {
                ...item,
                items: updatedItems,
              }
            }
            return {
              ...item,
              items: updateNestedContent(item.items || [], path.slice(1), updatedItems),
            }
          }
          return item
        })
      }
      setContents(updateNestedContent(contents, currentPath, updatedContents))
    }

    // Close drawer and reset states
    setShowDrawer(false)
    setContentName('')
    setContentFile(null)
    setContentUrl('')
    setContentType(null)
    setIsFreeContent(false)
    setSelectedContent(null)
  }

  const ContentActions = ({ content, parentId = null }) => (
    <div onClick={(e) => e.stopPropagation()} className="ms-auto">
      <Dropdown align="end">
        <Dropdown.Toggle variant="link" className="p-0 text-muted">
          <FiMoreVertical />
        </Dropdown.Toggle>
        <Dropdown.Menu className="shadow-sm border-0">
          <Dropdown.Item onClick={(e) => handleContentAction('edit', content.id, parentId, e)}>
            <FiEdit2 className="me-2" /> Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={(e) => handleContentAction('toggleFree', content.id, parentId, e)}>
            <FiDownload className="me-2" /> {content.isFree ? 'Make Premium' : 'Make Free'}
          </Dropdown.Item>
          <Dropdown.Item onClick={(e) => handleContentAction('delete', content.id, parentId, e)} className="text-danger">
            <FiTrash2 className="me-2" /> Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )

  const ModuleActions = ({ module }) => (
    <div onClick={(e) => e.stopPropagation()} className="ms-auto">
      <Dropdown align="end">
        <Dropdown.Toggle variant="link" className="p-0 text-muted">
          <FiMoreVertical />
        </Dropdown.Toggle>
        <Dropdown.Menu className="shadow-sm border-0">
          <Dropdown.Item onClick={(e) => handleModuleAction('edit', module.id, e)}>
            <FiEdit2 className="me-2" /> Edit
          </Dropdown.Item>
          <Dropdown.Item onClick={(e) => handleModuleAction('toggleFree', module.id, e)}>
            <FiDownload className="me-2" />
            {module.chapters.every((ch) => ch.isFree) ? 'Make Premium' : 'Make Free'}
          </Dropdown.Item>
          <Dropdown.Item onClick={(e) => handleModuleAction('delete', module.id, e)} className="text-danger">
            <FiTrash2 className="me-2" /> Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )

  const renderDrawerContent = () => {
    if (drawerMode === 'new-folder') {
      return (
        <>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>{contentName ? 'Edit Folder' : 'Create New Folder'}</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Folder Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter folder name"
                  value={contentName}
                  onChange={(e) => setContentName(e.target.value)}
                  className=" border-1"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="make-folder-free"
                  label="Make this folder and its contents free"
                  checked={isFreeContent}
                  onChange={(e) => setIsFreeContent(e.target.checked)}
                />
              </Form.Group>
              <div className="d-flex gap-2">
                <Button
                  variant="light"
                  className="w-50 rounded-2"
                  onClick={() => {
                    setShowDrawer(false)
                    setContentName('')
                    setIsFreeContent(false)
                  }}>
                  Cancel
                </Button>
                <Button variant="primary" className="w-50 rounded-2" onClick={handleContentSubmit} disabled={!contentName}>
                  {contentName ? 'Update Folder' : 'Create Folder'}
                </Button>
              </div>
              {selectedContent && (
                <div className="mt-4 pt-4 border-top">
                  <Button variant="outline-danger" className="w-100 rounded-2" onClick={() => handleDeleteContent(selectedContent.id)}>
                    <FiTrash2 className="me-2" /> Delete Folder
                  </Button>
                </div>
              )}
            </Form>
          </Offcanvas.Body>
        </>
      )
    }

    if (drawerMode === 'folder-content') {
      return (
        <>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title className="d-flex align-items-center">
              {contentType ? (contentName ? 'Edit Content' : 'Add Content') : 'Folder Contents'}
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            {!contentType ? (
              <Button variant="primary" className="w-100 rounded-2 mb-3" onClick={() => setDrawerMode('add-content')}>
                <FiPlus className="me-2" /> Add Content
              </Button>
            ) : (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter title"
                    value={contentName}
                    onChange={(e) => setContentName(e.target.value)}
                    className=" border-1"
                  />
                </Form.Group>

                {contentType === 'folder' ? null : contentType === 'link' ? (
                  <Form.Group className="mb-3">
                    <Form.Label>URL</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter URL"
                      value={contentUrl}
                      onChange={(e) => setContentUrl(e.target.value)}
                      className=" border-1"
                    />
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Label>File</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={(e) => setContentFile(e.target.files?.[0])}
                      className=" border-1"
                      accept={
                        contentType === 'video'
                          ? 'video/*'
                          : contentType === 'image'
                            ? 'image/*'
                            : contentType === 'archive'
                              ? '.zip,.rar,.7z'
                              : '*/*'
                      }
                    />
                    {contentName && !contentFile && <small className="text-muted d-block mt-1">Leave empty to keep the existing file</small>}
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="make-content-free"
                    label="Make this content free"
                    checked={isFreeContent}
                    onChange={(e) => setIsFreeContent(e.target.checked)}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button
                    variant="light"
                    className="w-50 rounded-2"
                    onClick={() => {
                      setContentType(null)
                      setContentName('')
                      setContentFile(null)
                      setContentUrl('')
                      setIsFreeContent(false)
                      setShowDrawer(false)
                    }}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    className="w-50 rounded-2"
                    onClick={handleContentSubmit}
                    disabled={!contentName || (contentType === 'link' ? !contentUrl : !contentFile && !contentName)}>
                    {contentName ? 'Update Content' : 'Add Content'}
                  </Button>
                </div>

                {selectedContent && (
                  <div className="mt-4 pt-4 border-top">
                    <Button variant="outline-danger" className="w-100 rounded-2" onClick={() => handleDeleteContent(selectedContent.id)}>
                      <FiTrash2 className="me-2" /> Delete Content
                    </Button>
                  </div>
                )}
              </Form>
            )}
          </Offcanvas.Body>
        </>
      )
    }

    if (drawerMode === 'add-content') {
      return (
        <>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Add Content</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-grid gap-2">
              <Button
                variant="outline-primary"
                className="text-start"
                onClick={() => {
                  setContentType('folder')
                  setDrawerMode('folder-content')
                }}>
                <FiFolder className="me-2" /> New Folder
              </Button>
              <Button
                variant="outline-primary"
                className="text-start"
                onClick={() => {
                  setContentType('video')
                  setDrawerMode('folder-content')
                }}>
                <FiVideo className="me-2" /> Upload Video
              </Button>
              <Button
                variant="outline-primary"
                className="text-start"
                onClick={() => {
                  setContentType('document')
                  setDrawerMode('folder-content')
                }}>
                <FiFileText className="me-2" /> Add Document
              </Button>
              <Button
                variant="outline-primary"
                className="text-start"
                onClick={() => {
                  setContentType('image')
                  setDrawerMode('folder-content')
                }}>
                <FiImage className="me-2" /> Add Image
              </Button>
              <Button
                variant="outline-primary"
                className="text-start"
                onClick={() => {
                  setContentType('archive')
                  setDrawerMode('folder-content')
                }}>
                <FiArchive className="me-2" /> Add Zip File
              </Button>
              <Button
                variant="outline-primary"
                className="text-start"
                onClick={() => {
                  setContentType('link')
                  setDrawerMode('folder-content')
                }}>
                <FiLink className="me-2" /> Add External Link
              </Button>
            </div>
          </Offcanvas.Body>
        </>
      )
    }
  }

  return (
    <div>
      {/* Content Drawer */}
      <Offcanvas
        show={showDrawer}
        onHide={() => {
          setShowDrawer(false)
          setDrawerMode(null)
          setContentType(null)
          setContentName('')
          setContentFile(null)
          setContentUrl('')
          setIsFreeContent(false)
        }}
        placement="end"
        style={{ width: '600px' }}>
        {renderDrawerContent()}
      </Offcanvas>

      {/* Video Module Drawer */}
      <Offcanvas show={showVideoModuleDrawer} onHide={() => setShowVideoModuleDrawer(false)} placement="end" style={{ width: '600px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Add Video Module</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>Module Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter module name"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                className=" border-1"
              />
            </Form.Group>

            <div className="mb-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h6 className="mb-0">Chapters</h6>
                <small className="text-muted">{chapters.length} chapter(s)</small>
              </div>

              {/* Added Chapters List */}
              {chapters.map((chapter, index) => (
                <Card key={chapter.id} className="mb-2 border-0 bg-light">
                  <Card.Body className="py-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{chapter.name}</h6>
                        <small className="text-muted">
                          {chapter.videoFile ? 'Uploaded Video' : 'YouTube URL'}
                          {chapter.isFree && <span className="badge bg-success ms-2">Free</span>}
                        </small>
                      </div>
                      <Button
                        variant="link"
                        className="text-danger p-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveChapter(chapter.id)
                        }}>
                        <FiTrash2 />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}

              {/* Add New Chapter Form */}
              <Card className="border-0 bg-light mt-3">
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Chapter Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter chapter name"
                      value={currentChapter.name}
                      onChange={(e) =>
                        setCurrentChapter({
                          ...currentChapter,
                          name: e.target.value,
                        })
                      }
                      className=" border-1"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Upload Video</Form.Label>
                    <Form.Control
                      type="file"
                      accept="video/*"
                      onChange={(e) => {
                        setCurrentChapter({
                          ...currentChapter,
                          videoFile: e.target.files?.[0],
                          videoUrl: '',
                        })
                      }}
                      className=" border-1"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Or Add YouTube URL</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter YouTube video URL"
                      value={currentChapter.videoUrl}
                      onChange={(e) => {
                        setCurrentChapter({
                          ...currentChapter,
                          videoUrl: e.target.value,
                          videoFile: null,
                        })
                      }}
                      className=" border-1"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="make-chapter-free"
                      label="Make this chapter free"
                      checked={currentChapter.isFree}
                      onChange={(e) =>
                        setCurrentChapter({
                          ...currentChapter,
                          isFree: e.target.checked,
                        })
                      }
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    className="rounded-2 px-4"
                    onClick={handleAddChapter}
                    disabled={!currentChapter.name || (!currentChapter.videoFile && !currentChapter.videoUrl)}>
                    Add Chapter
                  </Button>
                </Card.Body>
              </Card>
            </div>

            <Button variant="primary" className="w-100 rounded-2" onClick={handleAddVideoModule} disabled={!moduleName || chapters.length === 0}>
              Save Module
            </Button>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Content Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Breadcrumb className="mb-0">
            {getBreadcrumbItems().map((item, index) => (
              <Breadcrumb.Item
                key={index}
                active={index === getBreadcrumbItems().length - 1}
                onClick={() => {
                  if (index === 0) {
                    setCurrentPath([])
                  } else {
                    setCurrentPath(currentPath.slice(0, index))
                  }
                }}
                style={{ cursor: 'pointer' }}>
                {item.name}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </div>
        <div className="d-flex gap-2">
          <Button variant="primary" className="rounded-pill d-flex align-items-center" onClick={() => setShowVideoModuleDrawer(true)}>
            <FiPlus className="me-2" /> Add Video Module
          </Button>
          <Button
            variant="primary"
            className="rounded-pill d-flex align-items-center"
            onClick={() => {
              setShowDrawer(true)
              setDrawerMode('add-content')
            }}>
            <FiPlus className="me-2" /> Add Content
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="content">Course Content</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="videos">Video Modules</Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content>
          <Tab.Pane eventKey="content">
            {/* Content List */}
            <div className="content-list bg-light rounded-3 p-3">
              {currentPath.length > 0 && (
                <div className="d-flex align-items-center mb-3">
                  <Button variant="link" className="p-0 text-dark d-flex align-items-center" onClick={navigateBack}>
                    <FiArrowLeft size={20} className="me-2" />
                    <span>Back</span>
                  </Button>
                </div>
              )}
              {getCurrentContents().map((content) => (
                <Card
                  key={content.id}
                  className="border-0 bg-white mb-2 cursor-pointer"
                  onClick={() => {
                    if (content.type === 'folder') {
                      handleFolderClick(content.id)
                    }
                  }}>
                  <Card.Body className="py-2 px-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center flex-grow-1">
                        <div className="me-3">{getContentIcon(content.type)}</div>
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center">
                            <h6 className="mb-0">{content.name}</h6>
                            {content.isFree && <span className="badge bg-success ms-2">Free</span>}
                          </div>
                          {content.type === 'folder' && content.items && <small className="text-muted">{content.items.length} item(s)</small>}
                          {content.type === 'link' && <small className="text-muted d-block">{content.url}</small>}
                        </div>
                      </div>
                      <Button
                        variant="link"
                        className="p-0 text-primary"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleContentAction('edit', content.id, null, e)
                        }}>
                        <FiEdit2 size={18} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}

              {getCurrentContents().length === 0 && (
                <div className="text-center text-muted py-5">
                  <p>No contents added yet</p>
                </div>
              )}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="videos">
            <div className="video-modules-list">
              {videoModules.map((module) => (
                <div key={module.id} className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <h4 className="mb-0">
                      {module.moduleName} ({module.chapters.length} lectures)
                    </h4>
                    <Button variant="link" className="p-0 ms-3 text-primary" onClick={(e) => handleModuleAction('edit', module.id, e)}>
                      <FiEdit2 size={18} />
                    </Button>
                  </div>
                  <div className="bg-light rounded-3 p-3">
                    {module.chapters.map((chapter, index) => (
                      <Card key={chapter.id} className="border-0 bg-white mb-2">
                        <Card.Body className="py-2 px-3">
                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center flex-grow-1">
                              <div className="me-3">
                                <FiVideo className="text-primary" />
                              </div>
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center">
                                  <h6 className="mb-0">{chapter.name}</h6>
                                  {chapter.isFree && <span className="badge bg-success ms-2">Free</span>}
                                </div>
                                <small className="text-muted d-block">{chapter.videoType === 'upload' ? 'Uploaded Video' : 'YouTube Video'}</small>
                              </div>
                            </div>
                            <Button
                              variant="link"
                              className="p-0 text-primary"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleContentAction('edit', chapter.id, module.id)
                              }}>
                              <FiEdit2 size={18} />
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}

              {videoModules.length === 0 && (
                <div className="text-center text-muted py-5">
                  <p>No video modules added yet</p>
                </div>
              )}
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button variant="light" className="px-4  border-theme-secondary text-theme-secondary" onClick={() => setActiveStep(2)}>
          Previous
        </Button>

        <div className="d-flex gap-3">
          <Button
            variant="light"
            className="px-4 border-theme-secondary text-theme-secondary"
            onClick={() => {
              if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                navigate('/admin/all-courses')
              }
            }}>
            Cancel
          </Button>
          <Button
            variant="light"
            className="px-4 bg-theme-secondary text-white"
            onClick={() => {
              setProgress(100)
              setActiveStep(3)
            }}>
            Finish
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CourseContent
