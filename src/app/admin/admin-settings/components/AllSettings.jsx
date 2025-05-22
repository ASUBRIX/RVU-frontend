import { Col, Nav, Row, Tab } from 'react-bootstrap'
import { FaCog, FaGlobe, FaLock, FaSearch, FaShieldAlt, FaUserLock, FaImages } from 'react-icons/fa'
import { BsUiRadiosGrid } from 'react-icons/bs'
import WebsiteSettings from './WebsiteSettings'
import TermsConditions from './TermsConditions'
import PrivacyPolicy from './PrivacyPolicy'
import MailConfig from './MailConfig'
import UserRoles from './UserRoles'
import SeoSettings from './SeoSettings'
import BannerSettings from './BannerSettings'
import GallerySettings from './GallerySettings'

const AllSettings = () => {
  return (
    <>
      <Row>
        <Col xs={12} className="mb-3 py-4 px-5">
          <h1 className="h3 mb-2 mb-sm-0">Admin Settings</h1>
        </Col>
      </Row>
      <Row className="g-4 px-4">
        <Col xs={12}>
          <Tab.Container defaultActiveKey="tab-1">
            <Row>
              <Col xl={3}>
                <Nav variant="pills" className="flex-column bg-theme-secondary rounded p-3">
                  <Nav.Item>
                    <Nav.Link eventKey="tab-1">
                      <FaGlobe className="me-2" />
                      Website Settings
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-7">
                      <BsUiRadiosGrid className="me-2" />
                      Banners
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-8">
                      <FaImages className="me-2" />
                      Gallery
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-2">
                      <FaShieldAlt className="me-2" />
                      Terms & Conditions
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-3">
                      <FaLock className="me-2" />
                      Privacy Policy
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-4">
                      <FaCog className="me-2" />
                      Mail Configurations
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="tab-5">
                      <FaUserLock className="me-2" />
                      Roles & Permission
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Col>
              <Col xl={9}>
                <Tab.Content>
                  <Tab.Pane eventKey="tab-1">
                    <WebsiteSettings />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-2">
                    <TermsConditions />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-3">
                    <PrivacyPolicy />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-4">
                    <MailConfig />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-5">
                    <UserRoles />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-6">
                    <SeoSettings />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-7">
                    <BannerSettings />
                  </Tab.Pane>
                  <Tab.Pane eventKey="tab-8">
                    <GallerySettings />
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </Col>
      </Row>
    </>
  )
}

export default AllSettings