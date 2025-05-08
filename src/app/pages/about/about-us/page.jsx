import Footer from '@/components/Footer';
import PageMetaData from '@/components/PageMetaData';
import About from './components/About';
import Hero from './components/Hero';
import TopNavigationBar from '@/components/TopNavigationBar';
import HeroImage from './components/HeroImage';
const AboutUs = () => {
  return <>
      <PageMetaData title="About Us" />
      <TopNavigationBar />
      <main>
        <HeroImage/>
        <Hero />
        <About />
      </main>
      <Footer className="custom-footer" />
    </>;
};
export default AboutUs;
