import avatar1 from '@/assets/images/avatar/01.jpg';
import patternImg from '@/assets/images/pattern/04.png';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { BsPatchCheckFill } from 'react-icons/bs';
import { FaSlidersH } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import httpClient from '@/helpers/httpClient';
import { useAuthContext } from '@/context/useAuthContext';

// Backend base URL - adjust this to match your backend server
const BACKEND_URL = 'http://localhost:3000';

const Banner = ({
  toggleOffCanvas
}) => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  // Helper function to convert relative path to absolute URL
  const getFullImageUrl = (path) => {
    if (!path) return avatar1;
    if (path.startsWith('http')) return path;
    if (path.startsWith('/')) return `${BACKEND_URL}${path}`;
    return `${BACKEND_URL}/${path}`;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get('/api/students/profile', {
          headers: {
            'auth_key': user?.token
          }
        });
        
        if (response.data) {
          setProfileData(response.data);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  return <section className="pt-0">
      <Container fluid className="px-0">
        <div className="bg-blue h-100px h-md-200px rounded-0" style={{
        background: `url(${patternImg}) no-repeat center center`,
        backgroundSize: 'cover'
      }}></div>
      </Container>
      <Container className="mt-n4">
        <Row>
          <Col xs={12}>
            <Card className="bg-transparent card-body p-0">
              <Row className="d-flex justify-content-between">
                <Col xs={'auto'} className="mt-4 mt-md-0">
                  <div className="avatar avatar-xxl mt-n3">
                    {loading ? (
                      <Spinner animation="border" role="status" className="m-3">
                        <span className="visually-hidden">Loading...</span>
                      </Spinner>
                    ) : (
                      <img 
                        className="avatar-img rounded-circle border-white border-3 shadow" 
                        src={profileData?.profile_picture ? getFullImageUrl(profileData.profile_picture) : avatar1} 
                        alt="avatar"
                        onError={(e) => { e.target.src = avatar1 }}
                      />
                    )}
                  </div>
                </Col>
                <Col className="d-md-flex justify-content-between align-items-center mt-4">
                  {loading ? (
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  ) : (
                    <div>
                      <h1 className="my-1 fs-4">
                        {profileData ? `${profileData.first_name || ''} ${profileData.last_name || ''}` : 'Student Name'} <BsPatchCheckFill className="text-info small" />
                      </h1>
                      <ul className="list-inline mb-0">
                        <li className="list-inline-item h6 fw-light me-3 mb-1 mb-sm-0">
                          {profileData?.email || 'user@mail.com'}
                        </li>
                      </ul>
                    </div>
                  )}
                </Col>
              </Row>
            </Card>
            <hr className="d-xl-none" />
            <Col xs={12} xl={3} className="d-flex justify-content-between align-items-center">
              <a className="h6 mb-0 fw-bold d-xl-none" href="#">
                Menu
              </a>
              <button onClick={toggleOffCanvas} className="btn btn-primary d-xl-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasSidebar" aria-controls="offcanvasSidebar">
                <FaSlidersH />
              </button>
            </Col>
          </Col>
        </Row>
      </Container>
    </section>;
};
export default Banner;
