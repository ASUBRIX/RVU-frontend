import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Container, Collapse, NavItem, Dropdown } from 'react-bootstrap'
import LogoBox from '@/components/LogoBox'
import useScrollEvent from '@/hooks/useScrollEvent'
import useToggle from '@/hooks/useToggle'
import { useAuthContext } from '../context/useAuthContext'
import { PersonCircle, Person, BoxArrowRight, PencilSquare, BoxArrowInRight, DoorOpen } from 'react-bootstrap-icons'
import './TopNavigationBar.css'

const TopNavigationBar = () => {
  const { scrollY } = useScrollEvent()
  const { isTrue: isOpen, toggle } = useToggle()
  const { user, logout } = useAuthContext()

  const menus = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about-us' },
    { label: 'Our Team', path: '/our-team' },
    { label: 'Courses', path: '/courses' },
    { label: 'Test', path: '/free-test' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'Current Affairs', path: '/current-affairs' },
    { label: 'Contact', path: '/contact-us' },
  ]

  return (
    <header
      className={clsx('navbar-light navbar-sticky custom-navbar', {
        'navbar-sticky-on': scrollY >= 400,
      })}>
      <nav className="navbar navbar-expand-xl z-index-2 py-0">
        <Container fluid className="px-2 px-xl-4">
          {/* Logo Section - Left Side */}
          <div className="d-flex align-items-center">
            <LogoBox height={120} width={300} />
          </div>

          {/* Mobile Toggle Button */}
          <button onClick={toggle} className="navbar-toggler ms-auto custom-toggler" type="button" aria-expanded={isOpen} aria-label="Toggle navigation">
            <span className="navbar-toggler-animation">
              <span />
              <span />
              <span />
            </span>
          </button>

          {/* Navigation Menu and User Dropdown */}
          <Collapse in={isOpen || window.innerWidth >= 1200} className="navbar-collapse">
            <div className="d-flex align-items-center w-100">
              {/* Navigation Menu - Left Side after Logo */}
              <ul className="navbar-nav mb-2 mb-lg-0 d-flex flex-row flex-nowrap ms-4">
                {menus.map(({ label, path }, idx) => (
                  <NavItem key={idx} className="flex-shrink-0">
                    <Link className="nav-link custom-nav-link" to={path}>
                      {label}
                    </Link>
                  </NavItem>
                ))}
              </ul>

              {/* User Dropdown - Left Side with margin */}
              <div className="d-flex align-items-center position-relative ms-6 me-7">
                <Dropdown className="centered-avatar-dropdown">
                  <Dropdown.Toggle variant="light" id="dropdown-avatar" className="avatar-toggle-button">
                    <PersonCircle size={38} color="#ed155a" />
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="custom-user-dropdown">
                    {!user ? (
                      <>
                        <Dropdown.Item as={Link} to="/auth" className="d-flex align-items-center gap-2">
                          <PencilSquare size={18} className="text-muted" />
                          Register
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to="/auth/mobile-login" className="d-flex align-items-center gap-2">
                          <BoxArrowInRight size={18} className="text-muted" />
                          Sign In
                        </Dropdown.Item>
                      </>
                    ) : (
                      <>
                        <div className="dropdown-user-header d-flex align-items-center px-3 py-2">
                          <PersonCircle size={36} color="#ed155a" />
                          <span className="ms-2 fw-semibold text-dark">{user.first_name}</span>
                        </div>
                        <hr className="single-divider" />
                        <Dropdown.Item as={Link} to="/student/edit-profile" className="d-flex align-items-center gap-2">
                          <Person size={18} color="#6c757d" />
                          Dashboard
                        </Dropdown.Item>
                        <Dropdown.Item onClick={logout} className="d-flex align-items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#6c757d"
                            strokeWidth="2">
                            <path d="M12 2v6" strokeLinecap="round" />
                            <path d="M5.64 5.64a9 9 0 1 0 12.72 0" strokeLinecap="round" />
                          </svg>
                          Sign Out
                        </Dropdown.Item>
                      </>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Collapse>
        </Container>
      </nav>
    </header>
  )
}

export default TopNavigationBar