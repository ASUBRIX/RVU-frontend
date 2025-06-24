import React, { lazy, Suspense } from 'react';
import { Offcanvas, OffcanvasBody, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { BsGearFill, BsGlobe, BsPower } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import logoImg2 from '@/assets/images/py_circle_logo.png';
import AppMenu from '@/components/admin/AppMenu';
import { useAuthContext } from '@/context/useAuthContext';
import { useLayoutContext } from '@/context/useLayoutContext';
import useViewPort from '@/hooks/useViewPort';
const NavbarTopbar = lazy(() => import('@/components/adminLayoutComponents/NavbarTopbar'));

const AdminLayout = ({ children }) => {
  const { width } = useViewPort();
  const { appMenuControl } = useLayoutContext();
  const { logout } = useAuthContext();

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
          <Link className="h5 mb-0 text-white" onClick={logout} to="/auth/admin-login">
            <BsPower />
          </Link>
        </OverlayTrigger>
      </div>
    </div>
  );

  return (
    <main>
      <nav className="navbar sidebar navbar-expand-xl navbar-dark bg-theme-secondary">
        <div className="d-flex align-items-center">
          <Link className="navbar-brand m-0" to="/">
            <img className="navbar-admin-logo" src={logoImg2} alt="logo" />
          </Link>
        </div>
        
        {width >= 1200 ? (
          <div className="sidebar-content d-flex flex-column bg-theme-secondary">
            <div className="sidebar-menu-container">
              <div className="px-3">
                <Suspense fallback={<div>Loading...</div>}>
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
            onHide={appMenuControl?.toggle}
          >
            <OffcanvasBody className="d-flex flex-column bg-theme-secondary p-0">
              <div className="sidebar-menu-container">
                <div className="px-3">
                  <Suspense fallback={<div>Loading...</div>}>
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
        <Suspense fallback={<div>Loading...</div>}>
          <NavbarTopbar />
        </Suspense>
        <div className="page-content-wrapper border m-0 p-0">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AdminLayout;