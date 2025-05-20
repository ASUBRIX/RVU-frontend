import { useEffect, useState } from 'react';
import { Button, Breadcrumb, Offcanvas, Form, Tab, Nav } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { getCourseContentById } from '../../../../helpers/courseContentApi';

const CourseContent = ({ setActiveStep, setProgress, stepperInstance }) => {
  const { id } = useParams();
  const [contents, setContents] = useState([]);
  const [videoModules, setVideoModules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showDrawer, setShowDrawer] = useState(false);
  const [showVideoDrawer, setShowVideoDrawer] = useState(false);
  const [newContent, setNewContent] = useState({ name: '', type: 'video', isFree: false });
  const [newVideoModule, setNewVideoModule] = useState({ moduleName: '', chapters: [] });
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const fetchCourseContent = async () => {
      try {
        const res = await getCourseContentById(id);
        setContents(res.data?.contents || []);
        setVideoModules(res.data?.videoModules || []);
      } catch (error) {
        console.error('Failed to load course content:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseContent();
  }, [id]);

  const handleAddContent = () => {
    if (!newContent.name) return;
    setContents([...contents, { ...newContent, id: Date.now().toString() }]);
    setNewContent({ name: '', type: 'video', isFree: false });
    setShowDrawer(false);
  };

  const handleAddVideoModule = () => {
    if (!newVideoModule.moduleName || newVideoModule.chapters.length === 0) return;
    setVideoModules([...videoModules, { ...newVideoModule, id: Date.now().toString() }]);
    setNewVideoModule({ moduleName: '', chapters: [] });
    setShowVideoDrawer(false);
  };

  const handleAddChapter = () => {
    const chapter = {
      id: Date.now().toString(),
      name: `Chapter ${newVideoModule.chapters.length + 1}`,
      videoType: 'upload',
      isFree: false
    };
    setNewVideoModule({ ...newVideoModule, chapters: [...newVideoModule.chapters, chapter] });
  };

  const handleFinish = () => {
    setProgress(100);
    setActiveStep(4);
    stepperInstance?.next();
  };

  if (loading) return <p>Loading course content...</p>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Breadcrumb className="mb-0">
          <Breadcrumb.Item active>Course Content</Breadcrumb.Item>
        </Breadcrumb>
        <div className="d-flex gap-2">
          <Button onClick={() => setShowDrawer(true)}><FiPlus /> Add Content</Button>
          <Button onClick={() => setShowVideoDrawer(true)}><FiPlus /> Video Module</Button>
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Nav variant="tabs" className="mb-3">
          <Nav.Item><Nav.Link eventKey="content">Contents</Nav.Link></Nav.Item>
          <Nav.Item><Nav.Link eventKey="videos">Video Modules</Nav.Link></Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="content">
            {contents.length ? (
              <ul>{contents.map(c => <li key={c.id}>{c.name} ({c.type}) {c.isFree && ' - Free'}</li>)}</ul>
            ) : <p>No contents available.</p>}
          </Tab.Pane>
          <Tab.Pane eventKey="videos">
            {videoModules.length ? (
              <ul>
                {videoModules.map(m => (
                  <li key={m.id}>
                    {m.moduleName} ({m.chapters.length} lectures)
                    <ul>{m.chapters.map(ch => <li key={ch.id}>{ch.name}</li>)}</ul>
                  </li>
                ))}
              </ul>
            ) : <p>No video modules available.</p>}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      <div className="d-flex justify-content-between mt-4">
        <Button variant="light" onClick={() => setActiveStep(2)}>Previous</Button>
        <Button variant="primary" onClick={handleFinish}>Finish</Button>
      </div>
    </div>
  );
};

export default CourseContent;
