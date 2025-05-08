import { supportRequestsData } from '@/assets/data/products';
import { colorVariants } from '@/context/constants';
import { timeSince } from '@/utils/date';
import { Card, CardBody, CardHeader, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Fragment, useMemo } from 'react';

const EnquiryCard = ({
  description,
  name,
  time,
  image
}) => {
  // Keep the color consistent for each user by using name as seed
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
  // Sort enquiries by time (newest first)
  const latestEnquiries = useMemo(() => {
    return [...supportRequestsData]
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5); // Show only the 5 most recent
  }, [supportRequestsData]);

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
          {latestEnquiries.length === 0 ? (
            <p className="text-center text-muted my-3">No enquiries available</p>
          ) : (
            latestEnquiries.map((item, idx) => (
              <Fragment key={idx}>
                <EnquiryCard {...item} />
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