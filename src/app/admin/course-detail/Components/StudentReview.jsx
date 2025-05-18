import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { getCourseById, getCourseReviews } from '@/helpers/courseApi';
import { useParams } from 'react-router-dom';

const StudentReview = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getCourseReviews(id);
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };
    fetchReviews();
  }, [id]);

  return (
    <Col xs={12}>
      <Card className="bg-transparent border">
        <CardHeader className="bg-light border-bottom">
          <h5 className="mb-0">Students all Reviews</h5>
        </CardHeader>
        <CardBody className="pb-0">
          <div className="table-responsive border-0">
            <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
              <thead>
                <tr>
                  <th scope="col" className="border-0 rounded-start">Student Name</th>
                  <th scope="col" className="border-0">Date</th>
                  <th scope="col" className="border-0">Rating</th>
                  <th scope="col" className="border-0 rounded-end">Action</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((item, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="d-flex align-items-center position-relative">
                        <div className="avatar avatar-xs mb-2 mb-md-0">
                          <img src={item.avatar} className="rounded-circle" alt="avatar" />
                        </div>
                        <div className="mb-0 ms-2">
                          <h6 className="mb-0">
                            <a href="#" className="stretched-link">{item.name}</a>
                          </h6>
                        </div>
                      </div>
                    </td>
                    <td className="text-center text-sm-start">
                      <h6 className="mb-0">{new Date(item.date).toLocaleDateString()}</h6>
                    </td>
                    <td>
                      <ul className="list-inline mb-0">
                        {[...Array(Math.floor(item.rating))].map((_, i) => (
                          <li key={i} className="list-inline-item me-1 small">
                            <FaStar size={14} className="text-warning" />
                          </li>
                        ))}
                        {!Number.isInteger(item.rating) && (
                          <li className="list-inline-item me-1 small">
                            <FaStar className="text-warning" size={14} />
                          </li>
                        )}
                      </ul>
                    </td>
                    <td>
                      <button className="btn btn-sm btn-info-soft me-1">View</button>
                      <button className="btn btn-sm btn-danger-soft">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default StudentReview;
