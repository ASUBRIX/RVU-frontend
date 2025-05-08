import { Card, CardBody, CardHeader, Col, Collapse, Row, Button } from 'react-bootstrap';
import { Fragment, useState } from 'react';
import { FaAngleDown, FaAngleUp, FaFolder, FaFilePdf } from 'react-icons/fa';

const Materials = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border rounded-3">
      <CardHeader className="border-bottom">
        <h3 className="mb-0">Materials</h3>
      </CardHeader>
      <CardBody>
        <Row className="g-4">
          {/* Folders Section */}
          <Col xs={12}>
            <h5 className="mb-4">Folders</h5>
            {[
              { name: 'FOUNDATION BATCH', details: '37 video(s), 92 file(s), 4 test(s)' },
              { name: 'NCERT CRASH COURSE', details: '315 video(s), 88 file(s), 56 test(s)' }
            ].map((folder, idx) => (
              <Fragment key={idx}>
                <div className="d-flex align-items-center mb-3">
                  <FaFolder className="text-warning me-2" size={24} />
                  <div>
                    <h6 className="mb-0">{folder.name}</h6>
                    <p className="text-muted small mb-0">{folder.details}</p>
                  </div>
                </div>
              </Fragment>
            ))}
          </Col>

          {/* PDF Files Section */}
          <Col xs={12}>
            <h5 className="mb-4">PDF Files</h5>
            {['SS_All_In_One_v1.pdf', 'UPSC Foundation Schedule_v3.pdf'].map((file, idx) => (
              <div key={idx} className="d-flex align-items-center mb-3">
                <FaFilePdf className="text-danger me-2" size={24} />
                <span>{file}</span>
              </div>
            ))}
          </Col>

          {/* Collapsible PDFs Section */}
          <Collapse in={isOpen}>
            <div>
              {['Extra_Materials_v1.pdf', 'Practice_Questions_v2.pdf'].map((file, idx) => (
                <div key={idx} className="d-flex align-items-center mb-3">
                  <FaFilePdf className="text-danger me-2" size={24} />
                  <span>{file}</span>
                </div>
              ))}
            </div>
          </Collapse>

          {/* Toggle Button */}
          <a
            onClick={() => setIsOpen(!isOpen)}
            className="mb-0 mt-4 btn-more d-flex align-items-center justify-content-center"
            href="#collapseMaterials"
            role="button"
          >
            See
            <span className="mx-1">
              {isOpen ? (
                <>
                  less materials <FaAngleUp className="ms-1" />
                </>
              ) : (
                <>
                  more materials <FaAngleDown className="ms-1" />
                </>
              )}
            </span>
          </a>
        </Row>
      </CardBody>
    </Card>
  );
};

export default Materials;
