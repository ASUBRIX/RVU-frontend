import Footer from '@/components/Footer';
import Hero from './components/Hero';
import PageMetaData from '@/components/PageMetaData';
import ActionBox from './components/ActionBox';
import Courses from './components/Courses';
import PageBanner from './components/PageBanner';
import TopNavigationBar from '@/components/TopNavigationBar';
const CourseGrid2 = () => {
  return <>
      <PageMetaData title="Course Grid2" />
      <TopNavigationBar />
      <main>
        <Hero/>
        {/* <PageBanner /> */}
        <Courses />
        {/* <ActionBox /> */}
      </main>
      <Footer className="custom-footer"/>
    </>;
};
export default CourseGrid2;
