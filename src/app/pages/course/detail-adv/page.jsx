import Footer from '@/components/Footer';
import PageMetaData from '@/components/PageMetaData';
import CourseDetails from './components/CourseDetails';
import TopNavigationBar from './components/TopNavigationBar';
const CourseAdvanceDetails = () => {
  return <>
      <PageMetaData title="Course Advance" />
      <TopNavigationBar />
      <main>
        <CourseDetails />
      </main>
      <Footer className="bg-light" />
    </>;
};
export default CourseAdvanceDetails;
