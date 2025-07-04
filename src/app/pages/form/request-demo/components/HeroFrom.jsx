import client2 from '@/assets/images/client/android.svg';
import client1 from '@/assets/images/client/coca-cola.svg';
import client3 from '@/assets/images/client/envato.svg';
import client6 from '@/assets/images/client/google.svg';
import client7 from '@/assets/images/client/linkedin.svg';
import client4 from '@/assets/images/client/microsoft.svg';
import client5 from '@/assets/images/client/netflix.svg';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import TextFormInput from '@/components/form/TextFormInput';
import TinySlider from '@/components/TinySlider';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FaCheckCircle } from 'react-icons/fa';
import * as yup from 'yup';
import { Col, Container, Row } from 'react-bootstrap';
const HeroFrom = () => {
  const clients = [client1, client2, client3, client4, client5, client6, client7];
  const clientSliderSettings = {
    arrowKeys: true,
    gutter: 80,
    autoplayButton: false,
    autoplayTimeout: 2000,
    autoplayButtonOutput: false,
    nested: 'inner',
    autoplay: true,
    controls: false,
    edgePadding: 2,
    mouseDrag: true,
    items: 3,
    nav: false,
    responsive: {
      1: {
        items: 2
      },
      576: {
        items: 2
      },
      768: {
        items: 3
      },
      992: {
        items: 3
      },
      1200: {
        items: 3
      }
    }
  };
  const contactFormSchema = yup.object({
    name: yup.string().required('Please enter your first name'),
    lname: yup.string().required('Please enter your last name'),
    email: yup.string().email('Please enter valid email').required('Please enter your email'),
    phoneNo: yup.number().required('Please enter your phone number'),
    city: yup.string().required('Please enter your city'),
    flanguage: yup.string().required('Please enter your language'),
    note: yup.string().required('Please enter your note')
  });
  const {
    control,
    handleSubmit
  } = useForm({
    resolver: yupResolver(contactFormSchema)
  });
  return <section className="pt-4 pt-sm-5">
      <Container>
        <Row className="g-4 g-md-5 justify-content-between">
          <Col lg={6} className="mb-5 mb-lg-0">
            <h1>Request a Demo</h1>
            <p className="mb-5">
              Let&apos;s find out the demo. The 1-hour demo will provide Happiness prosperous impression had conviction For every delay in their
              Extremity now, strangers
            </p>
            <h4 className="mb-3">What you will get inside the demo?</h4>
            <ul className="list-group list-group-borderless mt-3 mb-sm-5">
              <li className="list-group-item h6 fw-light d-flex">
                <FaCheckCircle className="fa-fw text-success me-2" />
                An overview of the platform and its features
              </li>
              <li className="list-group-item h6 fw-light d-flex">
                <FaCheckCircle className="fa-fw text-success me-2" />
                Share few success stories with you
              </li>
              <li className="list-group-item h6 fw-light d-flex">
                <FaCheckCircle className="fa-fw text-success me-2" />
                Actionable learning functionality
              </li>
              <li className="list-group-item h6 fw-light d-flex">
                <FaCheckCircle className="fa-fw text-success me-2" />
                No communication gap
              </li>
              <li className="list-group-item h6 fw-light d-flex">
                <FaCheckCircle className="fa-fw text-success me-2" />
                Better addressable of group level issue
              </li>
              <li className="list-group-item h6 fw-light d-flex">
                <FaCheckCircle className="fa-fw text-success me-2" />
                Unlimited access to 5K+ Courses
              </li>
            </ul>
            <Row className="justify-content-center">
              <h5 className="mb-3">Trusted by</h5>
              <Col md={12}>
                <div className="tiny-slider arrow-round">
                  <TinySlider settings={clientSliderSettings} data-arrow="false" data-dots="false" data-gutter={80} data-items={3} data-items-sm={2} data-autoplay={2000}>
                    {clients.map((client, idx) => <div className="item" key={idx}>

                        <img className="grayscale" src={client} alt="client-logo" />
                      </div>)}
                  </TinySlider>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={6} className="mb-5">
            <div className="bg-dark rounded-3 p-4 p-sm-5 position-relative">
              <figure className="position-absolute top-0 start-50 translate-middle w-100 mt-n1">
                <svg enableBackground="new 0 0 420.7 53.6" version="1.1" viewBox="0 0 420.7 53.6" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                  <path className="fill-dark" d="m325.3 53.6v-48.4h-14.5l0.5 4v3.1l-1.6 3.2 0.2 0.1c3.7 0 6.8 3 6.8 6.8 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-1.7 0.7-3.3 1.7-4.5h-0.2l0.3-0.1c0.5-0.6 1.1-1 1.8-1.4l-1.3-2.7-2.6-0.5v-6.4l-1.8-1.6h-9.5v4h-2.5v1.8l1.4 1.7-1.4 1.4 3.4 1.4-4 0.6c2.3 1.1 4 3.4 4 6.2 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-3.2 2.2-5.9 5.2-6.6l-1.8-2.9 1.9-4.3-0.1-3.3h-17.3v2.5l-6.6 2.2v3.2l2 2.4h-0.1c3.3 0.5 5.8 3.3 5.8 6.7 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-1.7 0.6-3.2 1.7-4.4l-0.2-3.1-2.3-0.6v-5.4h1.6v-3.5h-10.6l-3.7 3.8v7.2l-0.9 0.2c2.1 1.2 3.5 3.3 3.5 5.9 0 3.7-3 6.8-6.8 6.8s-6.8-3-6.8-6.8c0-1.7 0.7-3.3 1.8-4.5v-10l-1.2-2.5h-15.6v1.6l-2.7 1.3-1.3 3.2 4 3.6v1.1c2.5 1 4.2 3.4 4.2 6.3 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-2.5 1.4-4.7 3.5-5.9l-1.7-0.3 0.2-1.2h2.4v-2.3l-9.4-7.4h-11.8l-0.9 0.7 1.6 3.2v3.1l-1.6 2.2v1l0.2 0.1c3.7 0 6.8 3 6.8 6.8 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-1.7 0.7-3.3 1.7-4.5h-0.2l0.3-0.1c0.5-0.6 1.1-1 1.8-1.4l-1.3-2.7-2.6-0.5v-6.4l-1.7-1.6h-9.5v4h-2.7v1.8l1.4 1.7-0.4 2.6-1.6 0.9c2.3 1.1 4 3.4 4 6.2 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-3.2 2.2-5.9 5.2-6.6l-1.8-2.9 1.9-4.3-0.1-3.3h-25.3v2.6l2.9 2.6v3l1.9 2.5c1.8 0.7 3.3 2 4 3.8 0.4 0.8 0.6 1.7 0.6 2.7 0 3.7-3 6.8-6.8 6.8-2.8 0-5.3-1.8-6.3-4.2-0.4-0.8-0.6-1.7-0.6-2.7 0-2 0.9-3.7 2.2-5h-0.2l0.2-0.8-2.4-1.6v-3l0.8-1.6 0.5-5.2h-10.7l-3.9 4v7.2l-0.9 0.2c2.1 1.2 3.5 3.3 3.5 5.9 0 3.7-3 6.8-6.8 6.8s-6.8-3-6.8-6.8c0-1.7 0.7-3.3 1.8-4.5v-10l-1.3-2.7h-15.5v1.7l-2.7 1.3-1.3 3.2 4 3.6v1.1c2.5 1 4.2 3.4 4.2 6.3 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-2.5 1.4-4.7 3.5-5.9l-1.7-0.3 0.2-1.2h2.4v-2.3l-9.6-7.6h-11.3l-1.3 0.9 1.6 3.2v3.1l-1.6 2.2v1l0.2 0.1c3.7 0 6.8 3 6.8 6.8s-3 6.8-6.8 6.8c-3.7 0-6.8-3-6.8-6.8 0-1.7 0.7-3.3 1.7-4.5h-0.2l0.3-0.1c0.5-0.6 1.1-1 1.8-1.4l-1.3-2.7-2.6-0.5v-6.3l-2-1.7h-9.3v4.3h-2.7v1.8l1.4 1.7-2 3.4c2.3 1.1 4 3.4 4 6.2 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-3.2 2.2-5.9 5.2-6.6l-1.6-2.8 1.9-4.3-0.2-3.7h-21.5l-1.6 1.1 1.6 3.2v3.1l-1.6 2.2v1l0.2 0.1c3.7 0 6.8 3 6.8 6.8 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-1.7 0.7-3.3 1.7-4.5h-0.2l0.3-0.1c0.5-0.6 1.1-1 1.8-1.4l-1.3-2.7-2.6-0.5v-6.4l-2.1-2h-7.6v48.3h325.3z" />
                  <path className="fill-dark" d="m420.8 50.9c0.2-0.7 0.3-1.4 0.4-2.1-0.5-3.7-0.4-7.7-0.2-11.7-0.2-2.6-0.4-5.2-0.4-7.7 0-7.6 0.7-15.2 0.6-22.8 0-0.5 0.1-0.9 0.2-1.3h-6l-3.9 4v7.2l-0.9 0.2c2.1 1.2 3.5 3.3 3.5 5.9 0 3.7-3 6.8-6.8 6.8s-6.8-3-6.8-6.8c0-1.7 0.7-3.3 1.8-4.5v-10l-1.3-2.9h-15.5v1.8l-2.7 1.3-1.3 3.2 4 3.6v1.1c2.5 1 4.2 3.4 4.2 6.3 0 3.7-3 6.8-6.8 6.8s-6.8-3-6.8-6.8c0-2.5 1.4-4.7 3.5-5.9l-1.7-0.3 0.2-1.2h2.4v-2.3l-9.6-7.6h-11.3l-1.3 0.9 1.6 3.2v3.1l-1.6 2.2v1l0.2 0.1c3.7 0 6.8 3 6.8 6.8s-3 6.8-6.8 6.8c-3.7 0-6.8-3-6.8-6.8 0-1.7 0.7-3.3 1.7-4.5h-0.2l0.3-0.1c0.5-0.6 1.1-1 1.8-1.4l-1.3-2.7-2.6-0.5v-6.3l-2-1.7h-9.3v4.3h-2.7v1.8l1.4 1.7-2 3.4c2.3 1.1 4 3.4 4 6.2 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-3.2 2.2-5.9 5.2-6.6l-1.8-2.9 1.9-4.3-0.2-3.7h-21.3l-1.6 1.1 1.6 3.2v3.1l-1.6 2.2v1l0.2 0.1c3.7 0 6.8 3 6.8 6.8 0 3.7-3 6.8-6.8 6.8-3.7 0-6.8-3-6.8-6.8 0-1.7 0.7-3.3 1.7-4.5h-0.2l0.3-0.1c0.5-0.6 1.1-1 1.8-1.4l-1.3-2.7-2.6-0.5v-6.3l-2.2-1.9h-7.6v48.3h128.2c-0.2-0.8-0.3-1.7-0.1-2.7z" />
                </svg>
              </figure>
              <figure className="w-100 position-absolute top-100 start-50 translate-middle">
                <svg enableBackground="new 0 0 607.7 74.6" version="1.1" viewBox="0 0 607.7 74.6" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                  <path className="fill-dark" d="m594.7-522.8c-3.3-1.3-4.9 1.8-5.3 3.2 0-0.2 0.1-0.5 0.1-0.8-3.9 2.7-9.3-5.1-11.1 0.3 5.2-1.3-8.7 3.6-9.8-0.9-3.6-7.5-7.8-8.8-13.5-2.5-2.4-4.6-13.7-0.7-13-5.1-3.7 0.9-10.7-0.3-22.2-0.2-9.1 2.6-14.4 0-21.9 0-4.2 0.3-8.3-5.9-12.5 0.1-4.2-2.2-8.6 3.5-11.5-3-1.1 1.3-0.8-3-2.1-3.9-3.2 1.1-12.3-0.1-16.1-1.2-9-2.7-17.9-0.7-26.9 0-4.4 3.3-8.9 3.2-13.3 0-5.9-1.5-11.6-6.3-17.5-1.4-5.4-6-9.7 4.5-14.1 1.4-2.4 2.6-5.4-4.8-8 2.8-5.5-2.2-8.9-2.6-13.7 1.9-3 3.1-3.8 7.3-8 3.2-3.6-4.3-5.4-5.3-8.3 2.8-1.5 2.3-2.5 4.5-4.2 2.7-4.2-0.6-12.7-0.3-17 0-7.2-8-14.3-1.1-21.5 0-5.5-10.9-11-3.5-16.5 0-2.7-2.8-7 2.7-9.6 0.2-3-6.9-1.6-6-4.1-2.6-3.9-3.4-7.7-0.3-12.5-6.5-4.3-2.4-7.5-2.8-12-1.7-5.8-0.1-10.5-0.1-16.1-2.7-4.7-6.2-8 2.4-11.5-2.8-1.7 2.8-3 0.7-4.7-3.7-5.1-9.4-10.8-1.2-17.6-6.9-9.8-5.8-19.1 6.1-28.7 1.5-4 3.3-9.6 2.2-13.1 0.6-4.6-3.8-8.2 5.9-12.4 8.7-4.5-4.8-8.5-0.1-13.5 2.9-5.6 3.4-6.9 8.5-10.7 7.2-4.5 9-13.2 2.7-19.4 2.1-9.2-3-17.3 8.2-26.1-1.3-5.2-0.3-7.1 6.9-11.7-1.9-5.1 0.7-9.3-3.4-13.2-1-6.6 2.5-5.1-0.2-8.4 1.3-3.1 1.6-7.6 6.3-10.8 1.4-6.1 4-16.9 7.2-16.4 5.8-5.7 1.9-8.7-4.4-11.2-6.5 0-3-1-4-2.8-4.1-0.3 328.4-0.3 209.6-0.3 595.9 0.6 6.6 9.4-1.2 9.5 1.4 1.8 0 4.7 10.9 6.7 3.2 6.2 5.1 10.5 1.6 14.9 1.2 6.1 11.7 7.8 4.5 15 0.3 5-12.8 9.3-3.4 12.7-1.7 2-1.2 3.6 0.4 3.8-1.5 1 6 4 14.8 4.4-5.1-0.4-2.6-0.7-4.3-1-5.3 0.5 0.9 1.3 1.9 2.6 2.9 1 2.6 5.9 3.3 6.4-1.1 5.8-0.8 8.5-6.1 11.2-6.5 2.5-9.2 3.8 4 7.7-4.5 3.4-3.9 5.2-4.2 8.3-2.7 1.9-0.4 3.7-3.6 5.6-1.1 2.3-0.4 3.3-6.5 5.9-3.8 2.8 7.6 4.2-3.8 6.6 1.3 2.5 6.1 5.1 3.5 7.7 0.7 2.7 5.4 5-7.9 7.7 1.1 2.4-2.8 4.1-6.4 6.2 2.8 4.7-1.2 10 0.5 15.5 7.9 4.8 0.7 9.8 9.6 14.8 0.3 5 5.7 10-5 14.9-0.4 5.4-5.3 10.9 0.3 16.3 0 6 8.7 9.7 15.5 14.7 5.2 3.7 4.8 6.9 13.2 11.6 3.9 2 7.5 4.5 2.5 6.5 0.2 3.6-1.6 6.3-6.2 10-3.2 7.1 10.8 14.4-4.4 21.5 0.1 1.7 2.5 3.5-3.8 5.2 0.1 3.7 1.3 6.8 3.9 10.3-3 2.5-0.8 5.3-0.3 7.8 0 4.4-1.7 8.5-1.9 12.8-1.6 6 2.7 10.6-6.1 16.1 3.5 4.1 3.5 8.4 9.1 13 5.7 3.1 0.7 5.7-0.4 8.8 0.6 5.2 3.5 9 7.9 14.3 2.3 4.8-0.3 8.9-7 13.5 1.2 7.3 0.6 14.4 9.7 22 1.8 5.3 0.2 10.5-14.1 15.8 0.1 6.7 0.5 12.4 0.2 18.7-7.7 2.7 3.4 5.3 3.4 8-1.4 3.2 6.5 4.5-3 7.4-4.3 1.1-4.5 3.1 3.8 4.3-0.6 2.5 3 4.8-7.8 7.3-2.4 3.7 0.2 7.9-1.4 11.7-0.3 5.8-4.3 11.6 8.3 17.4 0 6.3-1.1 12 1.5 18.3-1.5 1.9-5.7 4.3-3.2 5.9-0.6 1.8-0.8 1-4.5 3.3-4 2.8-0.6 7.8-1.7 10.5 0.1 3.2-0.2 6.5 1.6 9.7 0 3.2 6.3 5.3 4.3 10.6 0.1 1.9 2.3 6.1-1.2 6.4-1.6 2.5 0.8 6.4 4.6 6.6 0.3 0.3-2.4 4.3 8.9 7 6.8 3.4 6.1 4.7-1 6.9 1.7 0 0.7 0.9 6.2 3.3 0.7-1.1 9.3 1-4.3 1.3 1.8 6.1 12.4 7.9 18.4 14.7 11.7 4.2 4.4 5-4.7 8.4 3.5 4.7-4.1 7.6-1 11.8 1.8l0.9 0.9v-597.7c-9.4-3.4-13.5-4.1-13 1.1z" />
                </svg>
              </figure>
              <figure className="position-absolute top-0 end-0 mt-5 me-5">
                <svg width="38.4px" height="42.4px">
                  <path className="fill-info" d="M23.5,32.8c2.7-1.6,5.1-3.1,7.4-4.5c0.6-0.4,1.2-0.3,1.5,0.3c1.8,4.1,3.7,8.1,4.7,12.5c0,0.1,0,0.1,0,0.2 c-0.6,0.8-1.4,0.7-2.1,0.2c-2.8-1.8-5.5-3.8-8.4-5.4c-4-2.3-6.6-6-9.5-9.4c-2.7-3.2-5.4-6.6-8-9.9c-0.8-1-1.5-1.9-1.7-3.2 C12.7,20,17.9,26.6,23.5,32.8z M30.9,29.3c-2.3,1.3-4.5,2.4-6.4,4.3c2.3,1.5,4.4,2.9,6.5,4.3c0.9-0.9,1.7-1.7,2.6-2.4 C32.7,33.4,31.9,31.5,30.9,29.3z M35,40.5c0-1.6-0.5-2.8-1.2-4.1c-0.7,0.8-1.2,1.4-1.9,2.2C33,39.3,33.9,39.8,35,40.5z" />
                  <path className="fill-info" d="M8,13c1.6-2,4.1-3,6-5c-0.4-0.4-0.8-0.8-1.1-1.1C11,8.3,9.3,9.4,7.6,10.7c-0.9,0.7-1.8,1.4-1.4,3.1 c-2.6-2.1-4.8-4-5.1-7.2C0.9,4.7,1.7,3.1,3.3,2c1.6-1.2,3.4-1.4,5.2-0.5c2.1,1.1,3.7,2.9,5.2,4.6c0.5,0.6,0.8,1.4,1.8,1.4 c0.2,0,0.4,0.3,0.5,0.4c4.8,6,9.7,12,13.6,18.6c0.2,0.3,0.3,0.7,0.5,1c-0.1,0.1-0.2,0.1-0.3,0.2c-0.4-0.5-0.9-0.9-1.2-1.4 c-1.9-2.6-3.6-5.4-5.5-7.9c-2.3-3-4.6-5.9-7-8.8c-1-1.2-1.1-1.2-2.4-0.1c-1.5,1.2-3.1,2.4-4.7,3.6c-0.2,0.2-0.5,0.2-0.8,0.3 C8.1,13.2,8,13.1,8,13z M12.1,5.8C10.7,4,9.5,3.1,8.2,2.4C6.5,1.6,4.9,1.7,3.4,3.1C2.2,4.2,1.7,5.6,2.2,7.3c0.5,1.8,1.5,3.2,3.1,4.3 C7.3,9.4,10.2,8.3,12.1,5.8z" />
                </svg>
              </figure>
              <div className="position-absolute bottom-0 end-0 mb-n5 w-100">
                <svg enableBackground="new 0 0 223 134" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                  <path className="fill-white" d="m216.6 78.7c-1.8-0.3-4.1 0.1-5.9 0.3-2.4 0.2-4.8 0.7-7.1 0.9-1.6 0.1-3.1 0.2-4.6 0.3-1.8 0.1-3.7 0.1-5.6 0.1-1.3-0.1-2.6-0.1-3.9-0.1-2.5 0-4.9-0.3-7.3-0.4-2.3-0.1-4.5 0.5-6.8 0.5-4 0.1-8.6-0.3-12.2 1.6-0.2 0.1-0.2 0.5-0.1 0.6 0.6 1.1 2.6 1.6 3.7 2 0.3 0.1 0.7 0.3 1 0.3 0.9 0.6 1.8 1.2 2.8 1.8 0.7 0.5 1.5 0.8 2.2 1.2 0.1 0.1 0.3 0.2 0.4 0.3 0.3 0.2 1 0.4 1.2 0.7 0.3 0.5 0 1.6-0.1 2.1-0.3 1.3-0.6 2.5-0.8 3.8-0.3 2.1-1 4.1-1.5 6-0.1 0.1-0.3 0.3-0.4 0.5-0.3 0.4 0.1 0.8 0.5 0.7v0.2c0 0.2 0.4 0.1 0.5 0 0.2-0.1 0.3-0.3 0.5-0.4s0.3-0.2 0.5-0.3c2-0.8 4-1.5 5.8-2.6 0.7 1.4 1.4 2.9 2 4.3 0.5 1.1 1.4 3.1 2.9 3.2 1.8 0.1 3.8-2.6 5.1-3.7 2.1-1.6 4.4-3.1 6.5-4.7 3.9-2.8 7.7-5.7 11.4-8.8 0.9-0.8 1.4-1.8 2.3-2.6 1-1 2.2-1.6 3.3-2.4 0.9-0.7 1.5-1.5 2.2-2.3 0.7-0.7 1.6-1.5 2.1-2.5-0.2-0.3-0.3-0.6-0.6-0.6zm-46.5 7 0.6 0.3 0.9 0.6c-0.6-0.3-1.1-0.6-1.5-0.9zm2.4 0.6c-0.7-0.7-1.2-1-2.1-1.4-1.2-0.5-2.6-1-3.8-1.4h-0.1c-0.3-0.2-0.7-0.4-1-0.5-0.5-0.3-1.5-0.4-0.9-0.9 0.2-0.1 0.7-0.1 0.9-0.2 1.2-0.3 2.4-0.5 3.7-0.7 2.6-0.1 5.2 0.1 7.5-0.1 1.2-0.1 2.3-0.2 3.5-0.3h1.9 0.1c0.7 0 1.4 0.1 2.2 0.1 1.9 0.2 3.8 0.1 5.7 0.2 4.3 0.1 8.4 0.1 12.7-0.3 2.1-0.2 4.2-0.5 6.3-0.7 1.2-0.1 2.3-0.2 3.5-0.2-0.5 0.1-1 0.3-1.5 0.3-1.8 0.3-3.5 0.6-5.2 0.9-3.4 0.4-6.8 0.9-10.1 1.6-3.4 0.7-6.8 1.5-10.3 2.2-3.7 0.7-7 2.4-10.7 3.3-0.1-0.1-0.2-0.1-0.3-0.1-0.6-0.9-1.2-1.1-2-1.8zm1.5 9.8c0.1-0.5 0.3-0.9 0.4-1.3 0.3-1.1 0.4-2.3 0.6-3.5 0.1-0.8 0.4-1.6 0.4-2.5 0 0 0-0.1 0.1-0.1 0.3-0.2 1.8-0.3 2-0.3 1.4-0.4 2.9-1 4.3-1.5 1.2-0.5 2.5-0.9 3.8-1.2 3.3-0.7 6.5-1.3 9.8-2.2 3.5-0.9 7.1-1.2 10.7-1.7 1.6-0.2 3.3-0.5 4.9-0.8 1-0.2 2-0.5 3.1-0.7-0.6 0.3-1.2 0.7-1.9 1-1.2 0.5-2.4 0.8-3.6 1.2-2.5 1.1-4.8 2.5-7.1 3.8-1 0.4-2 0.8-3.1 1.2-2.2 0.9-4.3 1.8-6.4 2.7-1.5 0.6-3.1 1.1-4.6 1.8-1.1 0.5-2.2 1-3.3 1.5-0.2 0.1-0.5 0.2-0.7 0.3-0.5 0.2-1 0.4-1.4 0.5-1.1 0.3-2.4 0.6-3.3 1.1-0.1-0.1-0.3-0.1-0.4 0.1-1.3 0.9-2.6 2-3.8 2.9-0.3 0.3-0.7 0.5-1 0.8 0.1-0.8 0.3-1.9 0.5-3.1zm4.7 1.9c-1.4 0.8-3.1 1.4-4.6 2 0.1-0.2 0.3-0.3 0.3-0.4 0.3-0.2 0.5-0.3 0.7-0.5 1-0.9 2.1-1.8 3.2-2.6 0.2 0.5 0.4 0.9 0.6 1.4-0.1 0.1-0.2 0.1-0.2 0.1zm34.9-16.3c-0.5 0.4-0.9 0.9-1.3 1.2l-0.4 0.4c-0.2 0.1-0.3 0.3-0.5 0.4-1 0.7-2 1.4-2.9 2.2-0.5 0.5-0.9 1-1.2 1.5-1 0.9-1.9 1.8-2.9 2.6-0.8 0.6-1.6 1.2-2.3 1.8-1.6 1.4-3.4 2.7-5.2 4-3.3 2.4-6.7 4.6-9.8 7.3-0.7 0.5-1.2 1-1.9 1.6-0.7 0.4-1.3 0.5-2-0.1-0.2-0.3-0.3-0.7-0.4-0.9-0.5-1-1-2-1.4-3-0.7-1.6-1.2-3.3-2.3-4.6 1.4-0.8 3.4-1 4.8-1.6s2.8-1.5 4.3-2l9.6-3.6c2.9-1.2 5.4-2.7 8.2-4.1 0.1-0.1 0.3-0.1 0.4-0.1 1.7-0.7 3.3-1.6 5-2.3 0.7-0.3 1.4-0.5 2.1-0.8 0.1-0.1 0.3-0.2 0.5-0.3l-0.4 0.4z" />
                  <path className="fill-white" d="m89.1 0c-0.5 0-1 0.1-1.4 0.3-0.3 0.1-0.5 0.3-0.8 0.3-0.3 0.1-0.6 0-0.9 0.1-0.1 0-0.3 0.2-0.3 0.3v0.2c-0.1 0.5 0.7 0.8 0.9 0.3 0.4-0.1 0.7 0 1.1-0.2 0.5-0.3 0.9-0.4 1.4-0.4 0.6 0 0.6-0.9 0-0.9z" />
                  <path className="fill-white" d="m77.1 0.9c-0.7 0-1.4-0.1-2.2-0.1-0.6 0-1.4 0-1.8 0.5s0.3 1.1 0.7 0.7c0.3-0.3 1.2-0.2 1.6-0.2 0.5 0 1.1 0.1 1.6 0.1 0.7-0.1 0.7-1 0.1-1z" />
                  <path className="fill-white" d="m65.5 1.5h-2.9c-0.6 0-0.6 0.9 0 0.9h2.9c0.6 0 0.6-0.9 0-0.9z" />
                  <path className="fill-white" d="m55.7 2.1c-0.9-0.3-2.7-0.7-3.1 0.5-0.1 0.6 0.7 0.8 0.9 0.3 0.1-0.4 1.7 0 2 0.1 0.5 0.2 0.7-0.6 0.2-0.9z" />
                  <path className="fill-white" d="m46.1 2.7c-0.7 0-1.3-0.1-2 0s-1.2 0.4-1.8 0.4-0.6 0.9 0 0.9 1.1-0.2 1.6-0.3c0.7-0.2 1.4-0.1 2.2-0.1 0.6 0.1 0.6-0.9 0-0.9z" />
                  <path className="fill-white" d="m35 4.5c-1 0.4-2.3 0.6-3.1 1.4-0.5 0.4 0.2 1 0.7 0.7 0.7-0.7 1.8-0.9 2.7-1.2 0.5-0.3 0.3-1.1-0.3-0.9z" />
                  <path className="fill-white" d="m24 9c-0.6 0.5-1.6 0.6-1.8 1.4-0.1 0.6 0.7 0.8 0.9 0.3 0.1-0.3 0.5-0.4 0.7-0.5 0.3-0.2 0.7-0.3 0.9-0.5 0.4-0.4-0.3-1.1-0.7-0.7z" />
                  <path className="fill-white" d="m15.7 15c-0.3 0.5-0.5 0.9-0.7 1.4-0.2 0.6-0.5 1.1-0.7 1.7-0.1 0.6 0.8 0.9 0.9 0.3 0.1-0.5 0.4-1 0.6-1.5s0.3-0.9 0.7-1.4-0.4-1-0.8-0.5z" />
                  <path className="fill-white" d="m10.6 23.6c-0.3-0.1-0.5 0.1-0.6 0.3-0.3 0.7-0.5 1.3-0.5 2 0 0.6 0.9 0.6 0.9 0 0-0.7 0.1-1.2 0.4-1.8 0.2-0.1 0-0.4-0.2-0.5z" />
                  <path className="fill-white" d="m6.4 36.1v2.6c0 0.6 0.9 0.6 0.9 0v-2.6c0-0.6-0.9-0.6-0.9 0z" />
                  <path className="fill-white" d="m7.1 45.8c-0.1-0.3 0-0.7 0-1 0-0.6-0.9-0.6-0.9 0 0 0.3-0.1 0.7 0 1 0.1 0.4 0.3 0.7 0.2 1-0.1 0.6 0.9 0.6 0.9 0 0.1-0.3-0.1-0.6-0.2-1z" />
                  <path className="fill-white" d="m8.7 57.4c-0.4-0.7-0.6-1.6-1.1-2.2-0.4-0.5-1 0.2-0.7 0.7 0.5 0.6 0.7 1.4 1 2 0.2 0.5 1.1 0 0.8-0.5z" />
                  <path className="fill-white" d="m13.3 63.9c-0.8-0.8-1.4-1.6-2.4-2.2-0.5-0.3-1 0.5-0.5 0.8 0.9 0.5 1.5 1.3 2.2 2 0.5 0.4 1.1-0.2 0.7-0.6z" />
                  <path className="fill-white" d="m20.9 69.2c-0.5-0.1-1-0.4-1.5-0.7-0.5-0.2-0.9-0.5-1.2-0.9-0.4-0.4-1 0.3-0.7 0.7 0.4 0.4 0.9 0.8 1.4 1 0.6 0.3 1.1 0.7 1.8 0.7 0.5 0.2 0.7-0.7 0.2-0.8z" />
                  <path className="fill-white" d="m31.1 72c-0.2 0-0.3-0.1-0.5-0.1-0.2-0.1-0.4 0-0.6-0.1-0.5-0.1-1-0.3-1.3-0.5-0.5-0.4-1.1 0.3-0.7 0.7 0.5 0.4 1 0.6 1.5 0.7 0.3 0.1 0.5 0 0.8 0.1s0.5 0.2 0.8 0.2c0.6-0.2 0.6-1.1 0-1z" />
                  <path className="fill-white" d="m36.2 74.5c-0.1 0-0.3-0.2-0.3-0.3-0.1-0.1-0.3-0.3-0.4-0.5-0.4-0.4-1 0.2-0.7 0.7 0.4 0.4 0.7 0.9 1.4 1 0.3 0 0.5-0.2 0.5-0.5-0.1-0.2-0.3-0.4-0.5-0.4z" />
                  <path className="fill-white" d="m46.7 80.6c-0.3 0-0.7-0.5-0.9-0.7-0.4-0.3-0.9-0.4-1.3-0.7-0.5-0.4-1.1 0.3-0.7 0.7 0.5 0.4 1.1 0.5 1.6 0.9 0.4 0.3 0.7 0.7 1.2 0.7 0.7 0.1 0.7-0.8 0.1-0.9z" />
                  <path className="fill-white" d="m54.3 86.1c-0.4-0.4-0.7-0.8-1-1.2-0.3-0.5-1.2 0-0.8 0.5 0.3 0.4 0.5 0.8 0.9 1.1 0.2 0.2 0.7 0.5 0.7 0.7 0.1 0.6 1 0.6 0.9 0-0.1-0.5-0.3-0.8-0.7-1.1z" />
                  <path className="fill-white" d="m60.3 93.1c0.1 0 0-0.1-0.1-0.1-0.1-0.1-0.1-0.1-0.1-0.2-0.1-0.2-0.3-0.3-0.5-0.5-0.3-0.3-0.7-0.7-0.7-1.2-0.1-0.6-1-0.3-0.9 0.3s0.5 1.1 0.9 1.5c0.2 0.2 0.4 0.4 0.5 0.7s0.3 0.4 0.6 0.5c0.6 0 0.9-0.8 0.3-1z" />
                  <path className="fill-white" d="m64.9 100.9v-0.9c0-0.6-0.9-0.6-0.9 0 0 0.5-0.1 0.9 0.1 1.4 0.1 0.1 0.1 0.3 0.3 0.3h0.2c0.3 0.1 0.5-0.1 0.6-0.3 0-0.2-0.2-0.4-0.3-0.5z" />
                  <path className="fill-white" d="m66.5 110.5c-0.5-0.4 0.1-1.7 0.1-2.2 0.1-0.6-0.9-0.6-0.9 0-0.1 0.9-0.7 2.2 0.1 2.9 0.5 0.3 1.1-0.3 0.7-0.7z" />
                  <path className="fill-white" d="m64.2 116.7c-0.4 0.7-0.8 1.2-0.9 2-0.1 0.6 0.8 0.9 0.9 0.3 0.1-0.7 0.5-1.2 0.8-1.8 0.3-0.5-0.4-1-0.8-0.5z" />
                  <path className="fill-white" d="m59.6 126.6c-0.1-0.3-0.4-0.3-0.7-0.2s-0.6 0.3-0.9 0.4-0.4 0.3-0.3 0.6 0.3 0.3 0.6 0.3c0.4-0.1 0.8-0.3 1.2-0.5 0.2 0 0.2-0.4 0.1-0.6z" />
                  <path className="fill-white" d="m48.5 127.2c-0.8 0.1-1.6 0.2-2.3 0.2-0.6 0-0.6 0.9 0 0.9 0.8 0 1.6-0.1 2.3-0.2 0.6-0.1 0.6-1 0-0.9z" />
                  <path className="fill-white" d="m40.9 126.6c-0.3-0.3-0.5-0.5-0.8-0.7-0.1-0.1-0.3-0.1-0.5-0.2s-0.3-0.1-0.4-0.1c-0.4-0.5-1 0.2-0.7 0.7 0.3 0.3 0.6 0.3 0.9 0.4s0.6 0.4 0.8 0.7c0.4 0.3 1.1-0.3 0.7-0.8z" />
                  <path className="fill-white" d="m38.9 127.3c-0.3-0.5-0.7-0.9-1.1-1.4-0.4-0.4-1 0.2-0.7 0.7 0.4 0.4 0.7 0.7 1 1.2s1.1 0 0.8-0.5z" />
                  <path className="fill-white" d="m33.7 119.8c-0.1-0.1-0.3-0.3-0.3-0.5 0-0.6-0.9-0.6-0.9 0 0 0.5 0.3 0.9 0.6 1.2 0.4 0.3 1.1-0.3 0.6-0.7z" />
                  <path className="fill-white" d="m34.2 110c0 0.1-0.3 0.3-0.3 0.3-0.1 0.1-0.3 0.3-0.4 0.5-0.2 0.4-0.3 0.8-0.3 1.2-0.1 0.6 0.9 0.6 0.9 0 0.1-0.5 0.2-0.9 0.5-1.2s0.5-0.5 0.5-1c0.1-0.4-0.8-0.4-0.9 0.2z" />
                  <path className="fill-white" d="m40.8 103.2c-0.5 0.1-0.9 0.5-1.3 0.7-0.5 0.3-0.8 0.7-1 1.2-0.3 0.5 0.5 1 0.8 0.5 0.2-0.4 0.5-0.7 0.8-0.9 0.4-0.3 0.8-0.6 1.2-0.7 0.1 0 0.3-0.2 0.3-0.3s0-0.1 0.1-0.2c0.1-0.5-0.7-0.8-0.9-0.3z" />
                  <path className="fill-white" d="m49.4 100.3c-0.7-0.1-1.4 0.1-2 0.3-0.6 0.1-1 0.3-1.4 0.7-0.4 0.5 0.3 1.1 0.7 0.7s0.8-0.5 1.3-0.5c0.5-0.1 1-0.2 1.6-0.2 0.4-0.1 0.4-1-0.2-1z" />
                  <path className="fill-white" d="m57 100.4c-0.8-0.6-1.7-0.7-2.6-0.8-0.6 0-0.6 0.9 0 0.9 0.7 0 1.4 0.1 2 0.5 0.4 0.4 1-0.3 0.6-0.6z" />
                  <path className="fill-white" d="m66.5 103.9c-1.1-0.3-2.1-0.9-3.3-0.9-0.6 0.1-0.6 1 0 0.9 1.1-0.1 2 0.6 3 0.9 0.6 0 0.8-0.8 0.3-0.9z" />
                  <path className="fill-white" d="m79.7 109.4c-0.6-0.7-1.1-1.4-1.8-2-0.8-0.6-1.6-0.9-2.5-1.3-0.5-0.3-1 0.5-0.5 0.8 0.8 0.4 1.6 0.7 2.3 1.1 0.7 0.5 1.2 1.3 1.8 2 0.5 0.5 1.1-0.1 0.7-0.6z" />
                  <path className="fill-white" d="m87 114.4c-0.6-0.1-1.2-0.7-1.6-1.1s-1 0.2-0.7 0.7c0.6 0.6 1.3 1.3 2.2 1.4 0.7 0 0.7-1 0.1-1z" />
                  <path className="fill-white" d="m97.7 120.6c-0.8-0.8-1.6-1.4-2.6-1.8-0.9-0.4-1.6-0.9-2.6-0.9-0.6 0-0.6 0.9 0 0.9 1.6 0 3.5 1.4 4.5 2.4 0.5 0.5 1.1-0.1 0.7-0.6z" />
                  <path className="fill-white" d="m108.9 123.7c-0.5 0-1-0.3-1.5-0.4-0.4-0.1-1 0.1-1.4-0.1-0.5-0.4-1 0.3-0.7 0.7 0.5 0.5 1 0.4 1.6 0.4 0.7 0 1.2 0.5 1.9 0.4 0.7-0.2 0.8-1.1 0.1-1z" />
                  <path className="fill-white" d="m118.2 126c-0.5 0-1 0.1-1.5 0s-0.9-0.3-1.3-0.4c-0.5-0.2-0.8 0.7-0.3 0.9 1 0.4 2 0.5 3.1 0.5 0.6-0.1 0.6-1 0-1z" />
                  <path className="fill-white" d="m125.5 124c-0.5 0.5-1 0.8-1.7 0.9-0.6 0.1-0.3 1 0.3 0.9 0.8-0.2 1.5-0.6 2.1-1.2 0.4-0.4-0.3-1-0.7-0.6z" />
                  <path className="fill-white" d="m128.7 117c-0.5 0.5-0.4 1.2-0.4 1.8-0.1 0.8-0.6 1.4-0.6 2.3 0 0.6 0.9 0.6 0.9 0 0-0.7 0.4-1.2 0.5-1.8 0.1-0.5-0.1-1.3 0.2-1.6 0.4-0.4-0.2-1.1-0.6-0.7z" />
                  <path className="fill-white" d="m130.1 112c-0.3-0.5-0.1-1.2-0.3-1.8-0.1-0.3-0.1-0.7-0.3-0.9-0.1-0.3-0.3-0.6-0.4-1-0.1-0.6-1-0.3-0.9 0.3 0.1 0.3 0.3 0.6 0.4 0.9 0.1 0.4 0.3 0.8 0.3 1.2 0.2 0.7 0.1 1.2 0.4 1.8 0.2 0.6 1 0.1 0.8-0.5z" />
                  <path className="fill-white" d="m127.7 104.9c-0.2-0.5-0.4-1.1-0.3-1.6 0.1-0.6-0.9-0.6-0.9 0-0.1 0.7 0.2 1.5 0.5 2.2 0.2 0.4 1-0.1 0.7-0.6z" />
                  <path className="fill-white" d="m131 96.8c-0.3 0.3-0.7 0.3-0.9 0.5-0.4 0.2-0.7 0.5-1 0.9-0.4 0.4 0.3 1 0.7 0.7 0.3-0.3 0.6-0.6 0.9-0.8 0.3-0.1 0.7-0.3 1-0.5 0.4-0.5-0.3-1.2-0.7-0.8z" />
                  <path className="fill-white" d="m136.4 96c-0.6 0-0.6 0.9 0 0.9 0.5 0 0.9-0.1 1.4-0.1 0.3 0 0.6 0 0.9 0.1 0.1 0 0.2 0.1 0.3 0.1h0.1c0.1 0.5 0.9 0.5 0.9-0.1-0.1-1.4-2.9-0.9-3.6-0.9z" />
                  <path className="fill-white" d="m144.9 99.2c-0.5-0.3-1 0.5-0.5 0.8 0.7 0.5 2.5 1.1 2.3 2.2-0.1 0.6 0.8 0.9 0.9 0.3 0.3-1.7-1.6-2.5-2.7-3.3z" />
                  <path className="fill-white" d="m156.6 106c-1.5-0.1-2.9-0.5-4.3-1-0.5-0.2-0.8 0.7-0.3 0.9 1.4 0.5 2.9 1 4.6 1 0.6 0 0.6-0.9 0-0.9z" />
                  <path className="fill-white" d="m163 104.9c-0.4 0-0.7-0.1-1.1 0-0.3 0.1-0.7 0.3-1 0.2-0.6-0.1-0.6 0.9 0 0.9 0.3 0 0.7-0.1 1-0.2 0.4-0.1 0.8 0 1.1 0 0.6 0 0.6-0.9 0-0.9z" />
                  <path className="fill-white" d="m168.1 103.9c0.5-0.1 0.5-0.9-0.1-0.9-0.5 0-0.9 0.4-1.2 0.7-0.1 0.2-0.3 0.4-0.3 0.7s0.3 0.5 0.5 0.6c0.3 0.1 0.5-0.1 0.6-0.3 0-0.1 0-0.3-0.1-0.4l0.2-0.2c0.1-0.1 0.1-0.1 0.2-0.1 0.1-0.1 0.1-0.1 0.2-0.1z" />
                </svg>
              </div>
              <h3 className="mb-3 text-white">Fill out the form below</h3>
              <form className="row g-3 position-relative" onSubmit={handleSubmit(() => {})}>
                <TextFormInput name="name" label="First name *" control={control} containerClassName="col-md-6 bg-dark-input" />
                <TextFormInput name="lname" label="Last name *" control={control} containerClassName="col-md-6 bg-dark-input" />
                <TextFormInput name="email" label="Email *" control={control} containerClassName="col-md-6 bg-dark-input" />
                <TextFormInput name="phoneNo" label="Phone number *" control={control} containerClassName="col-md-6 bg-dark-input" />
                <TextFormInput name="city" label="City *" control={control} containerClassName="col-md-6 bg-dark-input" />
                <TextFormInput name="flanguage" label="First language *" control={control} containerClassName="col-md-6 bg-dark-input" />
                <TextAreaFormInput rows={3} name="note" label="Additional note(s)" control={control} containerClassName="col-md-6 bg-dark-input w-100" />
                <Col xs={12} className="bg-dark-input">
                  <div className="d-grid">
                    <button className="btn btn-lg btn-primary">Request a demo</button>
                  </div>
                  <p className="mb-0 text-white text-opacity-50 small">
                    Field required with <span className="text-danger fw-bold">*</span> are required to complete the demo request
                  </p>
                </Col>
              </form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>;
};
export default HeroFrom;
