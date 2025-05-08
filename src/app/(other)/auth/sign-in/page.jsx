import PageMetaData from '@/components/PageMetaData';
import { Col, Row } from 'react-bootstrap';

import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import SignIn from './components/SignIn';
const SignInPage = () => {
  return <>
      <PageMetaData title="Sign-In" />
      <AuthLayout>
        <Col xs={12} lg={6} className="m-auto">
          <Row className="my-5">
            <Col sm={10} xl={8} className="m-auto">
              <span className="mb-0 fs-1">👋</span>
              <h1 className="fs-2">Login into Pudhuyugam!</h1>
              <p className="lead mb-4">Nice to see you! Please log in with your account.</p>
              <SignIn />

              <div className="mt-4 text-center">
                <span>
                  Don&apos;t have an account? <Link to="/auth/sign-up">Signup here</Link>
                </span>
              </div>
            </Col>
          </Row>
        </Col>
      </AuthLayout>
    </>;
};
export default SignInPage;
