import React, { lazy, Suspense } from 'react';
import { Offcanvas, OffcanvasBody, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsGearFill, BsGlobe, BsPower } from 'react-icons/bs';
import { Link } from 'react-router-dom';

// Simple, working imports
import logoImg2 from '@/assets/images/py_circle_logo.png';
import AppMenu from '@/components/admin/AppMenu';
import { useAuthContext } from '@/context/useAuthContext';
import { useLayoutContext } from '@/context/useLayoutContext';
import useViewPort from '@/hooks/useViewPort';

const NavbarTopbar = lazy(() => import('@/components/adminLayoutComponents/NavbarTopbar'));

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AdminLayout Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#ffe6e6', border: '1px solid #ff9999' }}>
          <h2>AdminLayout Error</h2>
          <p>Error: {this.state.error?.message}</p>
          <button onClick={() => window.location.reload()}>Reload Page</button>
        </div>
      );
    }

    return this.props.children;
  }
}

const AdminLayout = ({ children }) => {
  console.log('🏠 AdminLayout - Start rendering');
  
  try {
    // Safe hook calls with debugging
    console.log('🏠 Getting viewport...');
    const { width } = useViewPort();
    console.log('🏠 Viewport width:', width);

    console.log('🏠 Getting layout context...');
    const { appMenuControl } = useLayoutContext();
    console.log('🏠 App menu control:', appMenuControl);

    console.log('🏠 Getting auth context...');
    const { logout, user } = useAuthContext();
    console.log('🏠 Auth - User:', user, 'Logout function:', typeof logout);

    const handleLogout = () => {
      try {
        console.log('🏠 Logout clicked');
        logout();
      } catch (error) {
        console.error('🏠 Logout error:', error);
      }
    };

    const SettingsMenu = () => (
      <div className="admin-settings-menu">
        <div className="d-flex align-items-center justify-content-between text-primary-hover">
          <OverlayTrigger overlay={<Tooltip id="tooltip-settings">Settings</Tooltip>}>
            <Link className="h5 mb-0 text-white" to="/admin/admin-settings">
              <BsGearFill />
            </Link>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip id="tooltip-home">Home</Tooltip>}>
            <Link className="h5 mb-0 text-white" to="/">
              <BsGlobe />
            </Link>
          </OverlayTrigger>
          <OverlayTrigger overlay={<Tooltip id="tooltip-signout">Sign out</Tooltip>}>
            <Link className="h5 mb-0 text-white" onClick={handleLogout} to="/auth/admin-login">
              <BsPower />
            </Link>
          </OverlayTrigger>
        </div>
      </div>
    );

    console.log('🏠 AdminLayout - Rendering layout');

    return (
      <ErrorBoundary>
        <main>
          <nav className="navbar sidebar navbar-expand-xl navbar-dark bg-theme-secondary">
            <div className="d-flex align-items-center">
              <Link className="navbar-brand m-0" to="/">
                <img 
                  className="navbar-admin-logo" 
                  src={logoImg2} 
                  alt="logo"
                  onError={(e) => {
                    console.error('Logo failed to load');
                    e.target.style.display = 'none';
                  }}
                />
              </Link>
            </div>
            
            {width >= 1200 ? (
              <div className="sidebar-content d-flex flex-column bg-theme-secondary">
                <div className="sidebar-menu-container">
                  <div className="px-3">
                    <Suspense fallback={<div style={{ color: 'white', padding: '10px' }}>Loading Menu...</div>}>
                      <AppMenu />
                    </Suspense>
                  </div>
                </div>
                <div className="admin-settings-wrapper">
                  <SettingsMenu />
                </div>
              </div>
            ) : (
              <Offcanvas 
                className="sidebar-offcanvas h-100" 
                show={appMenuControl?.open || false} 
                placement="start" 
                onHide={appMenuControl?.toggle || (() => {})}
              >
                <OffcanvasBody className="d-flex flex-column bg-theme-secondary p-0">
                  <div className="sidebar-menu-container">
                    <div className="px-3">
                      <Suspense fallback={<div style={{ color: 'white', padding: '10px' }}>Loading Menu...</div>}>
                        <AppMenu />
                      </Suspense>
                    </div>
                  </div>
                  <div className="admin-settings-wrapper">
                    <SettingsMenu />
                  </div>
                </OffcanvasBody>
              </Offcanvas>
            )}
          </nav>
          <div className="page-content">
            <Suspense fallback={<div style={{ padding: '10px' }}>Loading Navbar...</div>}>
              <NavbarTopbar />
            </Suspense>
            <div className="page-content-wrapper border m-0 p-0">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </div>
        </main>
      </ErrorBoundary>
    );

  } catch (error) {
    console.error('🏠 AdminLayout Error:', error);
    return (
      <div style={{ padding: '20px', background: '#ffe6e6', border: '1px solid #ff9999' }}>
        <h2>AdminLayout Render Error</h2>
        <p>Error: {error.message}</p>
        <pre>{error.stack}</pre>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
};

export default AdminLayout;