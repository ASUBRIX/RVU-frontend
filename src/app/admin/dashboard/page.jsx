/**
 * SCSS file: src/assets/scss/components/admin/dashboard.scss
 */

import PageMetaData from '@/components/PageMetaData'
import { Col, Row } from 'react-bootstrap'
import Counter from './components/Counter'
import Earnings from './components/Earnings'
import LatestEnquiries from './components/LatestEnquiries'
const AdminDashboardPage = () => {
  return (
    <>
      <PageMetaData title="Admin Dashboard" />
      <Row className="px-4 mt-4">
        <Col xs={12} className=" mb-3">
          <h1 className="h3 mb-2 mb-sm-0">Dashboard</h1>
        </Col>
      </Row>
      <Counter />
      <Row className="g-4 mb-4 px-4">
        <Earnings />
        <LatestEnquiries />
      </Row>
    </>
  )
}
export default AdminDashboardPage
