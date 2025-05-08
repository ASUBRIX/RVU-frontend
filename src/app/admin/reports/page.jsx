/**
 * SCSS file: src/assets/scss/components/admin/reports.scss
 */

import PageMetaData from '@/components/PageMetaData';
import { Navigate, Route, Routes } from 'react-router-dom';
import CourseReports from './courses/page';
import PaymentReports from './payments/page';

const ReportsPage = () => {
  return (
    <>
      <PageMetaData title="Reports & Analytics" />
      <Routes>
        <Route index element={<Navigate to="courses" replace />} />
        <Route path="courses" element={<CourseReports />} />
        <Route path="payments" element={<PaymentReports />} />
      </Routes>
    </>
  );
};

export default ReportsPage; 