import element3Img from '@/assets/images/element/03.svg';
import PageMetaData from '@/components/PageMetaData';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import SignUpForm from './components/SingUpForm';


const SignUpPage = () => {
  return <>
      <PageMetaData title="Sign-Up" />
      <AuthLayout>
        <Col xs={12} lg={6} className="m-auto">
          <Row className="my-5">
            <Col sm={10} xl={8} className="m-auto">
              <img src={element3Img} className="w-auto h-40px mb-2 ms-0" alt="element" />
              <h2>Sign up for your account!</h2>
              <p className="lead mb-4">Nice to see you! Please Sign up with your account.</p>
              <SignUpForm />

              <div className="mt-4 text-center">
                <span>
                  Already have an account?<Link to="/auth/sign-in"> Sign in here</Link>
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </AuthLayout>
    </>;
};
export default SignUpPage;
