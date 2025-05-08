import clsx from 'clsx'
import { Link } from 'react-router-dom'
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  Container,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavItem,
} from 'react-bootstrap'
import { BsBell, BsGridFill, BsHeart } from 'react-icons/bs'
import { FaChevronDown, FaSearch } from 'react-icons/fa'
import LogoBox from '@/components/LogoBox'
import ProfileDropdown from '@/components/TopNavbar/components/ProfileDropdown'
import useScrollEvent from '@/hooks/useScrollEvent'
import useToggle from '@/hooks/useToggle'
import avatar3 from '@/assets/images/avatar/03.jpg'

const NotificationDropdown = () => {
  return (
    <Dropdown className="nav-item ms-2 ms-sm-3">
      <DropdownToggle
        className="btn btn-light btn-round arrow-none mb-0"
        as="a"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-auto-close="outside">
        <BsBell className="fa-fw" />
      </DropdownToggle>
      <span className="notif-badge animation-blink" />
      <DropdownMenu className="dropdown-animation dropdown-menu-end dropdown-menu-size-md p-0 shadow-lg border-0">
        <Card className="bg-transparent">
          <CardHeader className="bg-transparent border-bottom py-4 d-flex justify-content-between align-items-center">
            <h6 className="m-0">
              Notifications <span className="badge bg-danger bg-opacity-10 text-danger ms-2">2 new</span>
            </h6>
            <a className="small" href="#">
              Clear all
            </a>
          </CardHeader>
          <CardBody className="p-0">
            <ul className="list-group list-unstyled list-group-flush">
              <li>
                <a href="#" className="list-group-item-action border-0 border-bottom d-flex p-3">
                  <div className="me-3">
                    <div className="avatar avatar-md">
                      <img className="avatar-img rounded-circle" src={avatar3} alt="avatar" />
                    </div>
                  </div>
                  <div>
                    <h6 className="mb-1">Update v2.3 completed successfully</h6>
                    <p className="small text-body m-0">What&apos;s new! Find out about new features</p>
                    <small className="text-body">5 min ago</small>
                  </div>
                </a>
              </li>
            </ul>
          </CardBody>
          <CardFooter className="bg-transparent border-0 py-3 text-center position-relative">
            <Link to="" className="stretched-link">
              See all incoming activity
            </Link>
          </CardFooter>
        </Card>
      </DropdownMenu>
    </Dropdown>
  )
}

const TopNavigationBar = () => {
  const { scrollY } = useScrollEvent()
  const { isTrue: isOpen, toggle } = useToggle()
  const { isTrue: isOpenCategory, toggle: toggleCategory } = useToggle()
  return (
    <>
      <header
        className={clsx('navbar-light navbar-sticky', {
          'navbar-sticky-on': scrollY >= 400,
        })}>
        <nav className="navbar navbar-expand-xl z-index-9">
          <Container>
            <LogoBox height={36} width={170} />
            <button
              onClick={toggle}
              className="navbar-toggler ms-auto"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
              aria-controls="navbarCollapse"
              aria-expanded="false"
              aria-label="Toggle navigation">
              <span className="navbar-toggler-animation">
                <span />
                <span />
                <span />
              </span>
            </button>
            <Collapse in={isOpen} className="navbar-collapse">
              <div>
                <ul className="navbar-nav navbar-nav-scroll ms-auto">
                  <NavItem>
                    <Link className="nav-link" to="/academy/home">
                      Home
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link className="nav-link" to="/pages/about/about-us">
                      About
                    </Link>
                  </NavItem>
                  <NavItem>
                    <Link className="nav-link" to="/pages/about/contact-us">
                      Contact
                    </Link>
                  </NavItem>
                </ul>
              </div>
            </Collapse>
            <ul className="nav flex-row align-items-center list-unstyled ms-xl-auto">
              <NotificationDropdown />
              <ProfileDropdown className="nav-item ms-3" />
            </ul>
          </Container>
        </nav>
      </header>
    </>
  )
}

export default TopNavigationBar
