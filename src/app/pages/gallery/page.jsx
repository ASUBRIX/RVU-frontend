import TopNavigationBar from '@/components/TopNavigationBar';
import HeroImage from './components/HeroImage';
import Gallery from './components/Gallery';
import Footer from '@/components/Footer';

const GalleryPage = () => {
  return (
    <>
      <TopNavigationBar />
      <main>
        <HeroImage />
        <Gallery />
      </main>
      <Footer className="custom-footer" />
    </>
  );
};

export default GalleryPage;
