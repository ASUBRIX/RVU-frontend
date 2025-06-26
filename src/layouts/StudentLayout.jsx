import { lazy, Suspense } from 'react'
import { Col, Collapse, Container, Offcanvas, OffcanvasBody, OffcanvasHeader, OffcanvasTitle, Row } from 'react-bootstrap'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { FaSignOutAlt } from 'react-icons/fa'
import { BsLock } from 'react-icons/bs'
import { STUDENT_MENU_ITEMS } from '@/assets/data/menu-items'
import Preloader from '@/components/Preloader'
import useViewPort from '@/hooks/useViewPort'
import useToggle from '@/hooks/useToggle'
import { useAuthContext } from '@/context/useAuthContext'

const Banner = lazy(() => import('@/components/StudentLayoutComponents/Banner'))
const TopNavigationBar = lazy(() => import('@/components/TopNavigationBar'))

const StudentLayout = ({ children }) => {
  const { width } = useViewPort()
  const { isTrue: isOffCanvasMenuOpen, toggle: toggleOffCanvasMenu } = useToggle()

  return (
    <>
      <div className="navigation-wrapper">
        <Suspense fallback={null}>
          <TopNavigationBar />
        </Suspense>
      </div>

      <main>
        <section className="pt-0">
          <Container>
            <Row>
              <Col xl={3} className="mb-3 mb-xl-0 mt-4">
                {width >= 1200 ? (
                  <VerticalMenu />
                ) : (
                  <Offcanvas show={isOffCanvasMenuOpen} placement="end" onHide={toggleOffCanvasMenu}>
                    <OffcanvasHeader className="bg-light" closeButton>
                      <OffcanvasTitle>My profile</OffcanvasTitle>
                    </OffcanvasHeader>
                    <OffcanvasBody className="p-3 p-xl-0">
                      <VerticalMenu />
                    </OffcanvasBody>
                  </Offcanvas>
                )}
              </Col>
              <Col xl={9}>
                <Suspense fallback={<Preloader />}>{children}</Suspense>
              </Col>
            </Row>
          </Container>
        </section>
      </main>

      <style jsx='true'>{`
        .navigation-wrapper {
          position: relative;
          z-index: 10;
          box-shadow: 0 4px 10px rgba(237, 21, 90, 0.1);
          background: white;
          border-bottom: 1px solid rgba(237, 21, 90, 0.08);
        }
        
        .navigation-wrapper::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 0;
          right: 0;
          height: 10px;
          background: linear-gradient(180deg, rgba(237, 21, 90, 0.05) 0%, transparent 100%);
          pointer-events: none;
        }
        
        main {
          position: relative;
          z-index: 1;
          background: #fafafa;
          min-height: calc(100vh - 90px);
        }
        
        section {
          padding-top: 2rem !important;
        }
      `}</style>
    </>
  )
}

const VerticalMenu = () => {
  const { pathname } = useLocation()
  const { isTrue: isOpen, toggle } = useToggle()
  const { removeSession } = useAuthContext()

  return (
    <div className="bg-dark border rounded-3 pb-0 p-3 w-100">
      <div className="list-group list-group-dark list-group-borderless collapse-list">
        {STUDENT_MENU_ITEMS.map(({ label, url, icon }, idx) => {
          const Icon = icon
          return (
            <Link className={clsx('list-group-item icons-center', { active: pathname === url })} to={url || ''} key={idx}>
              {Icon && <Icon className="me-2" />}
              {label}
            </Link>
          )
        })}
        
        <button
          className="list-group-item text-danger bg-danger-soft-hover"
          onClick={removeSession}
          style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
          <FaSignOutAlt className="fa-fw me-2" />
          Sign Out
        </button>
      </div>
    </div>
  )
}

export default StudentLayout