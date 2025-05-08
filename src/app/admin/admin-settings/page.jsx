/**
 * SCSS file: src/assets/scss/components/_admin-settings.scss
 */

import AllSettings from './components/AllSettings';
import PageMetaData from '@/components/PageMetaData';

const AdminSettingsPage = () => {
  return (
    <>
      <PageMetaData title="Admin Settings" />
      <AllSettings/>
    </>
  );
};

export default AdminSettingsPage;
