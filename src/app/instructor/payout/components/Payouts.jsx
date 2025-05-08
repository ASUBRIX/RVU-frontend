import ChoicesFormInput from '@/components/form/ChoicesFormInput';
import { Card, CardBody, CardHeader, Col, FormControl, Row } from 'react-bootstrap';
import { FaAngleLeft, FaAngleRight, FaSearch } from 'react-icons/fa';
const Payouts = () => {
  return <Card className="bg-transparent border rounded-3">
      <CardHeader className="bg-transparent border-bottom">
        <h3 className="mb-0">Payment History</h3>
      </CardHeader>
      <CardBody>
        <Row className="g-3 align-items-center justify-content-between mb-4">
          <Col md={8}>
            <form className="rounded position-relative">
              <FormControl className="form-control pe-5 bg-transparent" type="search" placeholder="Search" aria-label="Search" />
              <button className="bg-transparent p-2 position-absolute top-50 end-0 translate-middle-y border-0 text-primary-hover text-reset" type="submit">
                <FaSearch className="fas fa-search fs-6 " />
              </button>
            </form>
          </Col>
          <Col md={3}>
            <form>
              <ChoicesFormInput className="form-select js-choice border-0 z-index-9 bg-transparent" aria-label=".form-select-sm">
                <option>Sort by</option>
                <option>Newest</option>
                <option>Oldest</option>
              </ChoicesFormInput>
            </form>
          </Col>
        </Row>
        <div className="table-responsive border-0">
          <table className="table table-dark-gray align-middle p-4 mb-0 table-hover">
            <thead>
              <tr>
                <th scope="col" className="border-0 rounded-start">
                  Transaction ID
                </th>
                <th scope="col" className="border-0">
                  Amount
                </th>
                <th scope="col" className="border-0">
                  Status
                </th>
                <th scope="col" className="border-0 rounded-end">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <h6 className="mt-2 mt-lg-0 mb-0">
                    <a href="#">#102356</a>
                  </h6>
                </td>
                <td>
                ₹3,999
                  <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare">
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Commission</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="me-4 small">Us royalty withholding</span>
                        <span className="text-danger small">-₹0.00</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Earning</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                    </li>
                  </ul>
                </td>
                <td className="text-center text-sm-start">
                  <span className="badge bg-success bg-opacity-10 text-success">Paid</span>
                </td>
                <td>18/1/2023</td>
              </tr>
              <tr>
                <td>
                  <h6 className="mt-2 mt-lg-0 mb-0">
                    <a href="#">#102589</a>
                  </h6>
                </td>
                <td>
                ₹4,875
                  <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare1">
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Commission</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="me-4 small">Us royalty withholding</span>
                        <span className="text-danger small">-₹0.00</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Earning</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                    </li>
                  </ul>
                </td>
                <td className="text-center text-sm-start">
                  <span className="badge bg-success bg-opacity-10 text-success">Paid</span>
                </td>
                <td>12/1/2023</td>
              </tr>
              <tr>
                <td>
                  <h6 className="mt-2 mt-lg-0 mb-0">
                    <a href="#">#108645</a>
                  </h6>
                </td>
                <td>
                ₹1,800
                  <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare2">
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Commission</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="me-4 small">Us royalty withholding</span>
                        <span className="text-danger small">-₹0.00</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Earning</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                    </li>
                  </ul>
                </td>
                <td className="text-center text-sm-start">
                  <span className="badge bg-danger bg-opacity-10 text-danger">Cancelled </span>
                </td>
                <td>22/1/2023</td>
              </tr>
              <tr>
                <td>
                  <h6 className="mt-2 mt-lg-0 mb-0">
                    <a href="#">#108645</a>
                  </h6>
                </td>
                <td>
                ₹6,800
                  <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare3">
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Commission</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="me-4 small">Us royalty withholding</span>
                        <span className="text-danger small">-₹0.00</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Earning</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                    </li>
                  </ul>
                </td>
                <td className="text-center text-sm-start">
                  <span className="badge bg-success bg-opacity-10 text-success">Paid</span>
                </td>
                <td>28/1/2023</td>
              </tr>
              <tr>
                <td>
                  <h6 className="mt-2 mt-lg-0 mb-0">
                    <a href="#">#108645</a>
                  </h6>
                </td>
                <td>
                ₹3,576
                  <ul className="dropdown-menu dropdown-w-sm dropdown-menu-end min-w-auto shadow rounded" aria-labelledby="dropdownShare4">
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Commission</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="me-4 small">Us royalty withholding</span>
                        <span className="text-danger small">-₹0.00</span>
                      </div>
                      <hr className="my-1" />
                    </li>
                    <li>
                      <div className="d-flex justify-content-between">
                        <span className="small">Earning</span>
                        <span className="h6 mb-0 small">₹86</span>
                      </div>
                    </li>
                  </ul>
                </td>
                <td className="text-center text-sm-start">
                  <span className="badge bg-orange bg-opacity-10 text-orange">Pending</span>
                </td>
                <td>12/1/2023</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="d-sm-flex justify-content-sm-between align-items-sm-center mt-4 mt-sm-3">
          <p className="mb-0 text-center text-sm-start">Showing 1 to 8 of 20 entries</p>
          <nav className="d-flex justify-content-center mb-0" aria-label="navigation">
            <ul className="pagination pagination-sm pagination-primary-soft d-inline-block d-md-flex rounded mb-0">
              <li className="page-item mb-0">
                <a className="page-link" href="#" tabIndex={-1}>
                  <FaAngleLeft className="fas fa-angle-left" />
                </a>
              </li>
              <li className="page-item mb-0">
                <a className="page-link" href="#">
                  1
                </a>
              </li>
              <li className="page-item mb-0 active">
                <a className="page-link" href="#">
                  2
                </a>
              </li>
              <li className="page-item mb-0">
                <a className="page-link" href="#">
                  3
                </a>
              </li>
              <li className="page-item mb-0">
                <a className="page-link" href="#">
                  <FaAngleRight className="fas fa-angle-right" />
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </CardBody>
    </Card>;
};
export default Payouts;
