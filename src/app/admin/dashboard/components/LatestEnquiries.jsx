import { colorVariants } from '@/context/constants';
import { timeSince } from '@/utils/date';
import { Card, CardBody, CardHeader, Col, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Fragment, useMemo, useEffect, useState } from 'react';
import httpClient from '@/helpers/httpClient';

const EnquiryCard = ({ description, name, time, image }) => {
  const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colorIndex = nameHash % colorVariants.length;
  const avatarColor = colorVariants[colorIndex];

  return (
    <div className="d-flex justify-content-between position-relative">
      <div className="d-sm-flex">
        <div className="avatar avatar-md flex-shrink-0">
          {image ? (
            <img className="avatar-img rounded-circle" src={image} alt={`${name}'s avatar`} />
          ) : (
            <div className={`avatar-img rounded-circle bg-${avatarColor} bg-opacity-10`}>
              <span className={`position-absolute top-50 text-${avatarColor} start-50 translate-middle fw-bold`}>
                {name.charAt(0)}
              </span>
            </div>
          )}
        </div>
        <div className="ms-0 ms-sm-2 mt-2 mt-sm-0">
          <h6 className="mb-0">
            <a href="#" className="stretched-link">
              {name}
            </a>
          </h6>
          <p className="mb-0">{description}</p>
          <span className="small">{timeSince(time)} ago</span>
        </div>
      </div>
    </div>
  );
};

const LatestEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnquiries = async () => {
      try {
        const res = await httpClient.get('/api/admin/enquiries');
        setEnquiries(res.data);
      } catch (error) {
        console.error('Failed to fetch enquiries:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEnquiries();
  }, []);

  const latestEnquiries = useMemo(() => {
    return [...enquiries]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [enquiries]);

  return (
    <Col xxl={4}>
      <Card className="shadow h-100">
        <CardHeader className="border-bottom d-flex justify-content-between align-items-center p-4">
          <h5 className="card-header-title">Latest Enquiries</h5>
          <Link to="/enquiries/all" className="btn btn-link p-0 mb-0">
            View all
          </Link>
        </CardHeader>
        <CardBody className="p-4">
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : latestEnquiries.length === 0 ? (
            <p className="text-center text-muted my-3">No enquiries available</p>
          ) : (
            latestEnquiries.map((item, idx) => (
              <Fragment key={item.id}>
                <EnquiryCard
                  name={item.name}
                  description={item.message || item.subject || '—'}
                  time={item.created_at}
                  image={null}
                />
                {idx < latestEnquiries.length - 1 && <hr />}
              </Fragment>
            ))
          )}
        </CardBody>
      </Card>
    </Col>
  );
};

export default LatestEnquiries;
