import React, { useState, useEffect } from 'react';
import PageMetaData from '@/components/PageMetaData';
import { Row, Container, Spinner } from 'react-bootstrap';
import EditProfile from './components/EditProfile';
import EmailChange from './components/EmailChange';
import LinkedAccount from './components/LinkedAccount';
import PasswordChange from './components/PasswordChange';
import SocialMedia from './components/SocialMedia';
import TopNavigationBar from '@/components/TopNavigationBar';

const EditProfilePage = () => {
  return (
    <Container>
      <PageMetaData title="Edit Profile" />
      <EditProfile />
      <Row className="g-4 mt-3">
        {/* <EmailChange />
        <PasswordChange /> */}
      </Row>
    </Container>
  );
};

export default EditProfilePage;
