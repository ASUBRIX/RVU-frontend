import React, { useState, useEffect, useCallback, memo } from 'react';
import { Card, Form, Button, Alert, Spinner, Badge, Modal, Row, Col } from 'react-bootstrap';
import { 
  FaPlus, 
  FaTrash, 
  FaArrowUp, 
  FaArrowDown, 
  FaFileAlt, 
  FaVideo, 
  FaQuestionCircle, 
  FaTasks,
  FaEye,
  FaEdit,
  FaCloudUploadAlt
} from 'react-icons/fa';

const CourseContent = memo(({ 
  setActiveStep,
  setProgress,
  courseName,
  courseId,
  isNewCourse,
  courseCreated 
}) => {
  // Content state
  const [courseContent, setCourseContent] = useState({
    sections: [],
    totalDuration: 0
  });
  
  // UI state
  const [activeTab, setActiveTab] = useState('sections');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('section'); // section, lesson, quiz, assignment

  // Load existing course content
  useEffect(() => {
    if (courseId && !isNewCourse) {
      loadCourseContent();
    } else {
      // Initialize with empty content for new course
      setCourseContent({
        sections: [],
        totalDuration: 0
      });
    }
  }, [courseId, isNewCourse]);

  const loadCourseContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock course content
      const mockContent = {
        sections: [
          {
            id: 1,
            title: 'Introduction',
            description: 'Course introduction and overview',
            order: 1,
            lessons: [
              {
                id: 1,
                title: 'Welcome to the Course',
                type: 'video',
                duration: 300,
                videoUrl: 'https://example.com/video1.mp4',
                description: 'Course introduction video'
              },
              {
                id: 2,
                title: 'Course Materials',
                type: 'document',
                documentUrl: 'https://example.com/materials.pdf',
                description: 'Downloadable course materials'
              }
            ]
          }
        ],
        totalDuration: 300
      };
      
      setCourseContent(mockContent);
    } catch (error) {
      console.error('Failed to load course content:', error);
      setError('Failed to load course content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Section management
  const addSection = useCallback(() => {
    const newSection = {
      id: Date.now(),
      title: '',
      description: '',
      order: courseContent.sections.length + 1,
      lessons: [],
      isNew: true
    };
    
    setCourseContent(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    
    setEditingItem(newSection);
    setModalType('section');
    setShowAddModal(true);
  }, [courseContent.sections.length]);

  const updateSection = useCallback((sectionId, updates) => {
    setCourseContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    }));
  }, []);

  const removeSection = useCallback((sectionId) => {
    if (window.confirm('Are you sure you want to delete this section and all its content?')) {
      setCourseContent(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId)
      }));
    }
  }, []);

  const moveSection = useCallback((sectionId, direction) => {
    setCourseContent(prev => {
      const sections = [...prev.sections];
      const currentIndex = sections.findIndex(s => s.id === sectionId);
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      
      if (targetIndex >= 0 && targetIndex < sections.length) {
        [sections[currentIndex], sections[targetIndex]] = [sections[targetIndex], sections[currentIndex]];
        
        // Update order
        sections.forEach((section, index) => {
          section.order = index + 1;
        });
      }
      
      return { ...prev, sections };
    });
  }, []);

  // Lesson management
  const addLesson = useCallback((sectionId, lessonType = 'video') => {
    const newLesson = {
      id: Date.now(),
      title: '',
      type: lessonType,
      description: '',
      duration: 0,
      order: courseContent.sections.find(s => s.id === sectionId)?.lessons.length + 1 || 1,
      isNew: true
    };
    
    setEditingItem({ ...newLesson, sectionId });
    setModalType('lesson');
    setShowAddModal(true);
  }, [courseContent.sections]);

  const updateLesson = useCallback((sectionId, lessonId, updates) => {
    setCourseContent(prev => ({
      ...prev,
      sections: prev.sections.map(section =>
        section.id === sectionId
          ? {
              ...section,
              lessons: section.lessons.map(lesson =>
                lesson.id === lessonId ? { ...lesson, ...updates } : lesson
              )
            }
          : section
      )
    }));
  }, []);

  const removeLesson = useCallback((sectionId, lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      setCourseContent(prev => ({
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                lessons: section.lessons.filter(lesson => lesson.id !== lessonId)
              }
            : section
        )
      }));
    }
  }, []);

  const moveLesson = useCallback((sectionId, lessonId, direction) => {
    setCourseContent(prev => ({
      ...prev,
      sections: prev.sections.map(section => {
        if (section.id === sectionId) {
          const lessons = [...section.lessons];
          const currentIndex = lessons.findIndex(l => l.id === lessonId);
          const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
          
          if (targetIndex >= 0 && targetIndex < lessons.length) {
            [lessons[currentIndex], lessons[targetIndex]] = [lessons[targetIndex], lessons[currentIndex]];
            
            // Update order
            lessons.forEach((lesson, index) => {
              lesson.order = index + 1;
            });
          }
          
          return { ...section, lessons };
        }
        return section;
      })
    }));
  }, []);

  // Save course content
  const saveCourseContent = async () => {
    try {
      setSaving(true);
      setError(null);
      
      // Validate content
      if (courseContent.sections.length === 0) {
        throw new Error('Please add at least one section to your course');
      }
      
      const hasContent = courseContent.sections.some(section => section.lessons.length > 0);
      if (!hasContent) {
        throw new Error('Please add at least one lesson to your course');
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSuccessMessage('Course content saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  // Handle modal save
  const handleModalSave = useCallback((data) => {
    if (modalType === 'section') {
      if (editingItem.isNew) {
        updateSection(editingItem.id, data);
      } else {
        updateSection(editingItem.id, data);
      }
    } else if (modalType === 'lesson') {
      if (editingItem.isNew) {
        setCourseContent(prev => ({
          ...prev,
          sections: prev.sections.map(section =>
            section.id === editingItem.sectionId
              ? {
                  ...section,
                  lessons: [...section.lessons, { ...editingItem, ...data }]
                }
              : section
          )
        }));
      } else {
        updateLesson(editingItem.sectionId, editingItem.id, data);
      }
    }
    
    setShowAddModal(false);
    setEditingItem(null);
  }, [modalType, editingItem, updateSection, updateLesson]);

  // Calculate total duration
  const totalDuration = courseContent.sections.reduce((total, section) => 
    total + section.lessons.reduce((sectionTotal, lesson) => 
      sectionTotal + (lesson.duration || 0), 0
    ), 0
  );

  // Format duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h6 className="text-muted">Loading course content...</h6>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-2">Course Content</h4>
          <p className="text-muted mb-0">
            Structure your course with sections and lessons
          </p>
        </div>
        
        {/* Stats */}
        <div className="text-end">
          <small className="text-muted d-block">
            {courseContent.sections.length} sections • {formatDuration(totalDuration)} total
          </small>
          {courseContent.sections.length > 0 && (
            <small className="text-primary">
              {courseContent.sections.reduce((total, s) => total + s.lessons.length, 0)} lessons
            </small>
          )}
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <Alert variant="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      {/* Course not created warning */}
      {isNewCourse && !courseCreated && (
        <Alert variant="info" className="mb-4">
          <strong>New Course:</strong> Complete the basic information and pricing steps first before adding content.
          <div className="mt-2">
            <Button 
              variant="outline-info" 
              size="sm"
              onClick={() => setActiveStep(1)}
            >
              Go to Basic Information
            </Button>
          </div>
        </Alert>
      )}

      {/* Content Structure */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Course Structure</h5>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={addSection}
              disabled={saving}
            >
              <FaPlus className="me-2" />
              Add Section
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {courseContent.sections.length === 0 ? (
            <div className="text-center py-5">
              <div className="mb-4">
                <FaFileAlt size={48} className="text-muted" />
              </div>
              <h6 className="text-muted mb-3">No content added yet</h6>
              <p className="text-muted mb-4">
                Start by adding your first section to organize your course content
              </p>
              <Button variant="primary" onClick={addSection}>
                <FaPlus className="me-2" />
                Add Your First Section
              </Button>
            </div>
          ) : (
            <div className="course-structure">
              {courseContent.sections.map((section, sectionIndex) => (
                <div key={section.id} className="section-item border-bottom">
                  {/* Section Header */}
                  <div className="p-4 bg-light border-start border-primary border-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center mb-2">
                          <Badge bg="primary" className="me-2">
                            Section {sectionIndex + 1}
                          </Badge>
                          <h6 className="mb-0">
                            {section.title || 'Untitled Section'}
                          </h6>
                        </div>
                        {section.description && (
                          <p className="text-muted small mb-0">{section.description}</p>
                        )}
                        <small className="text-muted">
                          {section.lessons.length} lesson{section.lessons.length !== 1 ? 's' : ''} • 
                          {formatDuration(section.lessons.reduce((total, lesson) => total + (lesson.duration || 0), 0))}
                        </small>
                      </div>
                      
                      {/* Section Actions */}
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => {
                            setEditingItem(section);
                            setModalType('section');
                            setShowAddModal(true);
                          }}
                          title="Edit section"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveSection(section.id, 'up')}
                          disabled={sectionIndex === 0}
                          title="Move up"
                        >
                          <FaArrowUp />
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => moveSection(section.id, 'down')}
                          disabled={sectionIndex === courseContent.sections.length - 1}
                          title="Move down"
                        >
                          <FaArrowDown />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => removeSection(section.id)}
                          title="Delete section"
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Add Lesson Buttons */}
                    <div className="mt-3 d-flex gap-2">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => addLesson(section.id, 'video')}
                      >
                        <FaVideo className="me-1" />
                        Video
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => addLesson(section.id, 'document')}
                      >
                        <FaFileAlt className="me-1" />
                        Document
                      </Button>
                      <Button
                        variant="outline-info"
                        size="sm"
                        onClick={() => addLesson(section.id, 'quiz')}
                      >
                        <FaQuestionCircle className="me-1" />
                        Quiz
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        onClick={() => addLesson(section.id, 'assignment')}
                      >
                        <FaTasks className="me-1" />
                        Assignment
                      </Button>
                    </div>
                  </div>

                  {/* Lessons */}
                  {section.lessons.length > 0 && (
                    <div className="lessons-list">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="lesson-item p-3 border-bottom">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center flex-grow-1">
                              <div className="me-3">
                                {lesson.type === 'video' && <FaVideo className="text-primary" />}
                                {lesson.type === 'document' && <FaFileAlt className="text-secondary" />}
                                {lesson.type === 'quiz' && <FaQuestionCircle className="text-info" />}
                                {lesson.type === 'assignment' && <FaTasks className="text-warning" />}
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1">
                                  {lesson.title || `Untitled ${lesson.type}`}
                                </h6>
                                {lesson.description && (
                                  <p className="text-muted small mb-1">{lesson.description}</p>
                                )}
                                <small className="text-muted">
                                  {lesson.type} • {formatDuration(lesson.duration || 0)}
                                </small>
                              </div>
                            </div>
                            
                            {/* Lesson Actions */}
                            <div className="d-flex gap-1">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => {
                                  setEditingItem({ ...lesson, sectionId: section.id });
                                  setModalType('lesson');
                                  setShowAddModal(true);
                                }}
                                title="Edit lesson"
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => moveLesson(section.id, lesson.id, 'up')}
                                disabled={lessonIndex === 0}
                                title="Move up"
                              >
                                <FaArrowUp />
                              </Button>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => moveLesson(section.id, lesson.id, 'down')}
                                disabled={lessonIndex === section.lessons.length - 1}
                                title="Move down"
                              >
                                <FaArrowDown />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => removeLesson(section.id, lesson.id)}
                                title="Delete lesson"
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {section.lessons.length === 0 && (
                    <div className="p-4 text-center text-muted">
                      <p className="mb-0">No lessons in this section yet</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button 
          variant="outline-secondary" 
          onClick={() => setActiveStep(2)}
          disabled={saving}
        >
          Previous: Pricing
        </Button>
        
        <div className="d-flex gap-2">
          <Button 
            variant="outline-primary" 
            onClick={saveCourseContent}
            disabled={saving || courseContent.sections.length === 0}
          >
            {saving ? (
              <>
                <Spinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              'Save Content'
            )}
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setProgress(90);
              setActiveStep(4);
            }}
            disabled={saving || courseContent.sections.length === 0}
          >
            Next: Settings
          </Button>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <ContentModal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        type={modalType}
        data={editingItem}
        onSave={handleModalSave}
      />
    </div>
  );
});

// Content Modal Component
const ContentModal = ({ show, onHide, type, data, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 0,
    videoUrl: '',
    documentUrl: '',
    ...data
  });

  useEffect(() => {
    if (data) {
      setFormData({
        title: '',
        description: '',
        duration: 0,
        videoUrl: '',
        documentUrl: '',
        ...data
      });
    }
  }, [data]);

  const handleSave = () => {
    if (!formData.title.trim()) {
      alert('Title is required');
      return;
    }
    
    onSave(formData);
    onHide();
  };

  const isSection = type === 'section';
  const isLesson = type === 'lesson';

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {data?.isNew ? 'Add' : 'Edit'} {isSection ? 'Section' : 'Lesson'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder={`Enter ${type} title`}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder={`Enter ${type} description`}
            />
          </Form.Group>

          {isLesson && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Type</Form.Label>
                    <Form.Select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="video">Video</option>
                      <option value="document">Document</option>
                      <option value="quiz">Quiz</option>
                      <option value="assignment">Assignment</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Duration (minutes)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={Math.floor((formData.duration || 0) / 60)}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        duration: parseInt(e.target.value || 0) * 60 
                      }))}
                    />
                  </Form.Group>
                </Col>
              </Row>

              {formData.type === 'video' && (
                <Form.Group className="mb-3">
                  <Form.Label>Video URL</Form.Label>
                  <Form.Control
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, videoUrl: e.target.value }))}
                    placeholder="https://example.com/video.mp4"
                  />
                </Form.Group>
              )}

              {formData.type === 'document' && (
                <Form.Group className="mb-3">
                  <Form.Label>Document</Form.Label>
                  <div className="border rounded p-3 text-center">
                    <FaCloudUploadAlt size={32} className="text-muted mb-2" />
                    <p className="mb-0 text-muted">Click to upload document</p>
                    <input type="file" className="d-none" accept=".pdf,.doc,.docx,.ppt,.pptx" />
                  </div>
                </Form.Group>
              )}
            </>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save {isSection ? 'Section' : 'Lesson'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

CourseContent.displayName = 'CourseContent';

export default CourseContent;