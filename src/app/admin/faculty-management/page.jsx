import React from 'react';
import PageMetaData from '@/components/PageMetaData';
import FacultyManagement from './components/FacultyManagement'; 

const FacultyManagementPage = () => {
  return (
    <>
      <PageMetaData title="Faculty Management" />
      <FacultyManagement />
    </>
  );
};

export default FacultyManagementPage;
