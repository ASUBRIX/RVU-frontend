import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Container, Collapse, NavItem, Button, Dropdown } from 'react-bootstrap'
import LogoBox from '@/components/LogoBox'
import useScrollEvent from '@/hooks/useScrollEvent'
import useToggle from '@/hooks/useToggle'
import { useAuthContext } from '../context/useAuthContext'
import { ChevronDown } from 'react-bootstrap-icons'
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
    { label: 'Free Test', path: '/free-test' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'Trending Topics', path: '/current-affairs' }, // alternative wording
    { label: 'Contact', path: '/contact-us' },
  ]

  return (
    <header
      className={clsx('navbar-light navbar-sticky custom-navbar', {
        'navbar-sticky-on': scrollY >= 400,
      })}
    >
      <nav className="navbar navbar-expand-xl z-index-2 py-0">
        <Container fluid className="px-2 px-xl-4">
          {/* Logo left */}
          <div className="d-flex align-items-center" style={{ marginLeft: 6 }}>
            <LogoBox height={60} width={160} />
          </div>
          {/* Toggler for mobile */}
          <button
            onClick={toggle}
            className="navbar-toggler ms-2 custom-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
            aria-controls="navbarCollapse"
            aria-expanded={isOpen}
            aria-label="Toggle navigation">
            <span className="navbar-toggler-animation">
              <span />
              <span />
              <span />
            </span>
          </button>
          {/* Menus and right actions */}
          <Collapse in={isOpen || window.innerWidth >= 1200} className="navbar-collapse">
            <div className="d-flex align-items-center">
              {/* Menus */}
              <ul className="navbar-nav mb-2 mb-lg-0 d-flex flex-row flex-nowrap">
                {menus.map(({ label, path }, idx) => (
                  <NavItem key={idx} className="flex-shrink-0">
                    <Link className="nav-link custom-nav-link" to={path}>
                      {label}
                    </Link>
                  </NavItem>
                ))}
              </ul>
              {/* Right actions */}
              <div className="d-flex align-items-center ms-2">
                {!user ? (
                  <>
                    <Button
                      as={Link}
                      to="/auth"
                      variant="outline-primary"
                      className="ms-1 rounded-pill shadow-sm custom-btn custom-register-btn"
                      style={{ minWidth: 120 }}
                    >
                      Register Now
                    </Button>
                    <Button
                      as={Link}
                      to="/auth/email-login"
                      variant="outline-primary"
                      className="ms-2 rounded-pill shadow-sm custom-btn custom-signin-btn"
                      style={{ minWidth: 100 }}
                    >
                      Sign In
                    </Button>
                  </>
                ) : (
                  <Dropdown align="end">
                    <Dropdown.Toggle
                      variant="outline-primary"
                      id="dropdown-profile"
                      className="fw-semibold d-flex align-items-center rounded-pill custom-profile-dropdown"
                      style={{ fontSize: 17, border: 0 }}
                    >
                      Hi, {user.first_name}
                      <ChevronDown size={18} className="ms-1" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item as={Link} to="/student/dashboard">Dashboard</Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={logout}>Sign Out</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </Collapse>
        </Container>
      </nav>
    </header>
  )
}

export default TopNavigationBar
