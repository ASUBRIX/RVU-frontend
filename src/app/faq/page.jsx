import PageMetaData from '@/components/PageMetaData';
import FaqBanner from './components/FaqBanner';
import FaqContent from './components/FaqContent';
import Footer from '@/components/Footer';
import TopNavigationBar from '@/components/TopNavigationBar';
const FaqPage = () => {
  return <>
      <PageMetaData title="Faq" />
      <TopNavigationBar />
      <main>
        <FaqBanner />
        <FaqContent />
      </main>
      <Footer className="custom-footer" />
    </>;
};
export default FaqPage;
