import { Card, Col, Row } from 'react-bootstrap'
import { FaChartLine, FaGraduationCap, FaMoneyBillWave, FaUsers } from 'react-icons/fa'

const SummaryTile = ({ icon: Icon, title, value, color }) => (
  <Card className="shadow-sm border-0 h-100">
    <Card.Body>
      <div className="d-flex align-items-center">
        <span className={`icon-lg bg-${color} bg-opacity-10 text-${color} rounded-3 mb-0`}>
          <Icon />
        </span>
        <div className="ms-3">
          <h6 className="mb-0">{title}</h6>
          <h4 className="mb-0 mt-2">{value}</h4>
        </div>
      </div>
    </Card.Body>
  </Card>
)

const CommonSummaryTiles = () => (
  <Row className="g-4 mb-5">
    <Col sm={6} xl={3}>
      <SummaryTile icon={FaGraduationCap} title="Total Courses" value="245" color="primary" />
    </Col>
    <Col sm={6} xl={3}>
      <SummaryTile icon={FaUsers} title="Total Students" value="2.5K" color="info" />
    </Col>
    <Col sm={6} xl={3}>
      <SummaryTile icon={FaChartLine} title="Active Students" value="1.2K" color="success" />
    </Col>
    <Col sm={6} xl={3}>
      <SummaryTile icon={FaMoneyBillWave} title="Total Revenue" value="$75,000" color="warning" />
    </Col>
  </Row>
)

export const CourseSummaryTiles = CommonSummaryTiles
export const PaymentSummaryTiles = CommonSummaryTiles
