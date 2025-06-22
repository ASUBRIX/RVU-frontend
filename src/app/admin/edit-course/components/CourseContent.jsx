import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Safe import with fallback
const CourseContent = ({ 
  setActiveStep,
  setProgress,
  courseName,
  setCourseName,
  courseId: propsCourseId 
}) => {
  // Initialize state with safe defaults
  const [courseContent, setCourseContent] = useState({
    contents: [],
    videoModules: []
  });
  
  const [courseDetails, setCourseDetails] = useState({
    title: '',
    description: '',
    category: '',
    level: 'beginner'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingCourse, setSavingCourse] = useState(false);
  const [activeTab, setActiveTab] = useState('content');

  // Safe parameter extraction
  const params = useParams() || {};
  const location = useLocation() || {};
  const navigate = useNavigate();
  
  // Safe courseId extraction
  const courseId = propsCourseId || 
                   params.courseId || 
                   params.id ||
                   '';

  const isNewCourse = !courseId || courseId === 'new' || courseId === 'create';

  // Safe API functions with fallbacks
  const getCourseContentById = async (id) => {
    console.log('Mock: Fetching course content for ID:', id);
    return { contents: [], videoModules: [] };
  };

  const upsertCourseContent = async (id, data) => {
    console.log('Mock: Saving course content for ID:', id, data);
    return { message: 'Success' };
  };

  const getEmptyCourseContent = () => {
    return { contents: [], videoModules: [] };
  };

  const fetchCourseContent = async () => {
    try {
      setLoading(true);
      setError(null);

      if (isNewCourse) {
        setCourseContent(getEmptyCourseContent());
        return;
      }

      if (!courseId || courseId.trim() === '') {
        throw new Error('Invalid course ID');
      }

      const data = await getCourseContentById(courseId);
      setCourseContent(data || getEmptyCourseContent());
    } catch (error) {
      console.error('Failed to load course content:', error);
      setError(error.message || 'Failed to load course content. Please try again.');
      setCourseContent(getEmptyCourseContent());
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourseDetails = async () => {
    try {
      setSavingCourse(true);
      setError(null);

      if (!courseDetails.title.trim()) {
        throw new Error('Course title is required');
      }
      if (!courseDetails.description.trim()) {
        throw new Error('Course description is required');
      }

      if (setCourseName) {
        setCourseName(courseDetails.title);
      }

      console.log('Course details to save:', courseDetails);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Course saved successfully!');
      
      if (setActiveStep) {
        setActiveStep(4);
      }
      
    } catch (error) {
      console.error('Failed to save course:', error);
      setError(error.message || 'Failed to save course details. Please try again.');
    } finally {
      setSavingCourse(false);
    }
  };

  const handleCourseDetailChange = (field, value) => {
    setCourseDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveCourseContent = async (updatedContent) => {
    if (isNewCourse) {
      setError('Please save the course first before adding content.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await upsertCourseContent(courseId, updatedContent);
      setCourseContent(updatedContent);
      
      console.log('Course content saved successfully');
    } catch (error) {
      console.error('Failed to save course content:', error);
      setError('Failed to save course content. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Content management functions
  const addContent = () => {
    try {
      const newContent = {
        id: Date.now(),
        type: 'text',
        order: (courseContent.contents?.length || 0) + 1,
        content: '',
        documentUrl: '',
        documentName: ''
      };
      
      setCourseContent(prev => ({
        ...prev,
        contents: [...(prev.contents || []), newContent]
      }));
    } catch (error) {
      console.error('Error adding content:', error);
      setError('Failed to add content');
    }
  };

  const updateContent = (index, field, value) => {
    try {
      setCourseContent(prev => ({
        ...prev,
        contents: (prev.contents || []).map((content, i) => 
          i === index ? { ...content, [field]: value } : content
        )
      }));
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const handleFileUpload = (index, event) => {
    try {
      const file = event.target.files?.[0];
      if (file) {
        const fileUrl = URL.createObjectURL(file);
        updateContent(index, 'documentUrl', fileUrl);
        updateContent(index, 'documentName', file.name);
        console.log('File attached:', file.name);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const removeDocument = (index) => {
    try {
      updateContent(index, 'documentUrl', '');
      updateContent(index, 'documentName', '');
    } catch (error) {
      console.error('Error removing document:', error);
    }
  };

  const removeContent = (index) => {
    try {
      setCourseContent(prev => ({
        ...prev,
        contents: (prev.contents || []).filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing content:', error);
    }
  };

  const moveContent = (index, direction) => {
    try {
      setCourseContent(prev => {
        const newContents = [...(prev.contents || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newContents.length) {
          [newContents[index], newContents[targetIndex]] = [newContents[targetIndex], newContents[index]];
        }
        
        return {
          ...prev,
          contents: newContents
        };
      });
    } catch (error) {
      console.error('Error moving content:', error);
    }
  };

  // Video module management functions
  const addVideoModule = () => {
    try {
      const newModule = {
        id: Date.now(),
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
        order: (courseContent.videoModules?.length || 0) + 1,
        thumbnail: ''
      };
      
      setCourseContent(prev => ({
        ...prev,
        videoModules: [...(prev.videoModules || []), newModule]
      }));
    } catch (error) {
      console.error('Error adding video module:', error);
      setError('Failed to add video module');
    }
  };

  const updateVideoModule = (index, field, value) => {
    try {
      setCourseContent(prev => ({
        ...prev,
        videoModules: (prev.videoModules || []).map((module, i) => 
          i === index ? { ...module, [field]: value } : module
        )
      }));
    } catch (error) {
      console.error('Error updating video module:', error);
    }
  };

  const removeVideoModule = (index) => {
    try {
      setCourseContent(prev => ({
        ...prev,
        videoModules: (prev.videoModules || []).filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing video module:', error);
    }
  };

  const moveVideoModule = (index, direction) => {
    try {
      setCourseContent(prev => {
        const newModules = [...(prev.videoModules || [])];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex >= 0 && targetIndex < newModules.length) {
          [newModules[index], newModules[targetIndex]] = [newModules[targetIndex], newModules[index]];
        }
        
        return {
          ...prev,
          videoModules: newModules
        };
      });
    } catch (error) {
      console.error('Error moving video module:', error);
    }
  };

  useEffect(() => {
    try {
      fetchCourseContent();
    } catch (error) {
      console.error('Error in fetchCourseContent useEffect:', error);
    }
  }, [courseId]);

  useEffect(() => {
    try {
      if (courseName && courseName !== courseDetails.title) {
        setCourseDetails(prev => ({
          ...prev,
          title: courseName
        }));
      }
    } catch (error) {
      console.error('Error updating course details:', error);
    }
  }, [courseName]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center p-4">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <div>Loading course content...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="course-content-container">
      {error && (
        <div className="alert alert-danger">
          <strong>Error: </strong>{error}
        </div>
      )}

      {/* Course Details Section */}
      <div className="card border mb-4">
        <div className="card-header border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Course Details</h4>
            <span className="badge border text-muted">Step 3: Content</span>
          </div>
        </div>
        
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Course Title *</label>
              <input
                type="text"
                className="form-control"
                value={courseDetails.title}
                onChange={(e) => handleCourseDetailChange('title', e.target.value)}
                placeholder="Enter course title"
                required
              />
            </div>
            
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={courseDetails.category}
                onChange={(e) => handleCourseDetailChange('category', e.target.value)}
              >
                <option value="">Select category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="data-science">Data Science</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="col-12">
              <label className="form-label">Course Description *</label>
              <textarea
                className="form-control"
                value={courseDetails.description}
                onChange={(e) => handleCourseDetailChange('description', e.target.value)}
                placeholder="Enter course description"
                rows={4}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Level</label>
              <select
                className="form-select"
                value={courseDetails.level}
                onChange={(e) => handleCourseDetailChange('level', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content and Video Modules Tabs */}
      <div className="card border mb-4">
        <div className="card-header border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Course Materials</h4>
          </div>
          
          {/* Tab Navigation */}
          <div className="mt-3">
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'content' ? 'active' : ''}`}
                  onClick={() => setActiveTab('content')}
                  type="button"
                >
                  <i className="fas fa-file-text me-2"></i>
                  Course Content
                  {(courseContent.contents?.length || 0) > 0 && (
                    <span className="badge bg-primary ms-2">{courseContent.contents.length}</span>
                  )}
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'videos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('videos')}
                  type="button"
                >
                  <i className="fas fa-video me-2"></i>
                  Video Modules
                  {(courseContent.videoModules?.length || 0) > 0 && (
                    <span className="badge bg-info ms-2">{courseContent.videoModules.length}</span>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="card-body">
          {/* Course Content Tab */}
          {activeTab === 'content' && (
            <div className="tab-content-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Course Content</h5>
                <button 
                  className="btn btn-outline-success btn-sm"
                  onClick={addContent}
                >
                  <i className="fas fa-plus me-2"></i>
                  Add Content
                </button>
              </div>

              {(courseContent.contents?.length || 0) === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="fas fa-file-text fa-3x text-muted"></i>
                  </div>
                  <p className="text-muted mb-3">No content added yet</p>
                  <button 
                    className="btn btn-success"
                    onClick={addContent}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Add Your First Content
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {(courseContent.contents || []).map((content, index) => (
                    <div key={content.id || index} className="col-12">
                      <div className="card border">
                        <div className="card-header">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <span className="badge bg-primary me-2">#{index + 1}</span>
                              <select
                                className="form-select form-select-sm"
                                style={{width: 'auto'}}
                                value={content.type || 'text'}
                                onChange={(e) => updateContent(index, 'type', e.target.value)}
                              >
                                <option value="text">Text</option>
                                <option value="video">Video</option>
                                <option value="document">Document</option>
                                <option value="quiz">Quiz</option>
                                <option value="assignment">Assignment</option>
                              </select>
                            </div>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => moveContent(index, 'up')}
                                disabled={index === 0}
                                title="Move up"
                              >
                                <i className="fas fa-arrow-up"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => moveContent(index, 'down')}
                                disabled={index === (courseContent.contents?.length || 0) - 1}
                                title="Move down"
                              >
                                <i className="fas fa-arrow-down"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeContent(index)}
                                title="Remove"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-12">
                              <label className="form-label">Content</label>
                              <textarea
                                className="form-control"
                                value={content.content || ''}
                                onChange={(e) => updateContent(index, 'content', e.target.value)}
                                placeholder="Enter your content here..."
                                rows={4}
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Attach Document (optional)</label>
                              <input
                                type="file"
                                className="form-control"
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xls,.xlsx"
                                onChange={(e) => handleFileUpload(index, e)}
                              />
                              {content.documentUrl && (
                                <div className="mt-2">
                                  <small className="text-muted">
                                    <i className="fas fa-file me-1"></i>
                                    Attached: {content.documentName || 'Document'}
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger ms-2"
                                      onClick={() => removeDocument(index)}
                                    >
                                      <i className="fas fa-times"></i>
                                    </button>
                                  </small>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Video Modules Tab */}
          {activeTab === 'videos' && (
            <div className="tab-content-section">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">Video Modules</h5>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={addVideoModule}
                >
                  <i className="fas fa-video me-2"></i>
                  Add Video Module
                </button>
              </div>

              {(courseContent.videoModules?.length || 0) === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="fas fa-video fa-3x text-muted"></i>
                  </div>
                  <p className="text-muted mb-3">No video modules added yet</p>
                  <button 
                    className="btn btn-primary"
                    onClick={addVideoModule}
                  >
                    <i className="fas fa-video me-2"></i>
                    Add Your First Video Module
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {(courseContent.videoModules || []).map((module, index) => (
                    <div key={module.id || index} className="col-12">
                      <div className="card border">
                        <div className="card-header">
                          <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                              <span className="badge bg-info me-2">Module #{index + 1}</span>
                            </div>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => moveVideoModule(index, 'up')}
                                disabled={index === 0}
                                title="Move up"
                              >
                                <i className="fas fa-arrow-up"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => moveVideoModule(index, 'down')}
                                disabled={index === (courseContent.videoModules?.length || 0) - 1}
                                title="Move down"
                              >
                                <i className="fas fa-arrow-down"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeVideoModule(index)}
                                title="Remove"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <label className="form-label">Video Title</label>
                              <input
                                type="text"
                                className="form-control"
                                value={module.title || ''}
                                onChange={(e) => updateVideoModule(index, 'title', e.target.value)}
                                placeholder="Video title"
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Duration</label>
                              <input
                                type="text"
                                className="form-control"
                                value={module.duration || ''}
                                onChange={(e) => updateVideoModule(index, 'duration', e.target.value)}
                                placeholder="e.g., 15:30"
                              />
                            </div>
                            <div className="col-12">
                              <label className="form-label">Description</label>
                              <textarea
                                className="form-control"
                                value={module.description || ''}
                                onChange={(e) => updateVideoModule(index, 'description', e.target.value)}
                                placeholder="Video description"
                                rows={2}
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Video URL</label>
                              <input
                                type="url"
                                className="form-control"
                                value={module.videoUrl || ''}
                                onChange={(e) => updateVideoModule(index, 'videoUrl', e.target.value)}
                                placeholder="https://..."
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Thumbnail URL (optional)</label>
                              <input
                                type="url"
                                className="form-control"
                                value={module.thumbnail || ''}
                                onChange={(e) => updateVideoModule(index, 'thumbnail', e.target.value)}
                                placeholder="https://..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => setActiveStep && setActiveStep(2)}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Previous
        </button>
        
        <div className="d-flex gap-2">
          <button
            onClick={handleSaveCourseDetails}
            disabled={savingCourse || !courseDetails.title.trim() || !courseDetails.description.trim()}
            className="btn btn-primary d-flex align-items-center"
          >
            {savingCourse ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Save & Continue
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseContent;