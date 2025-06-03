import Footer from '@/components/Footer';
import PageMetaData from '@/components/PageMetaData';
import TopNavigationBar from '@/components/TopNavigationBar';
import HeroImage from './components/HeroImage';
import InstructorLists from './components/InstructorLists';

const Instructors = () => (
  <>
    <PageMetaData title="Instructor List" />
    <TopNavigationBar />
    <main>
      <HeroImage />
      <InstructorLists />
    </main>
    <Footer className="bg-light" />
  </>
);

export default Instructors;
