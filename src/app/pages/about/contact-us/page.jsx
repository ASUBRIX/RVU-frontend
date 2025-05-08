import Footer from '@/components/Footer'
import PageMetaData from '@/components/PageMetaData'
import ContactCards from './components/ContactCards'
import ContactFormAndMap from './components/ContactFormAndMap'
import TopNavigationBar from '@/components/TopNavigationBar'
import HeroImage from './components/HeroImage'
const ContactUs = () => {
  return (
    <>
      <PageMetaData title="Contact Us" />
      <TopNavigationBar />
      <main>
        <HeroImage/>
        <ContactFormAndMap />
      </main>
      <Footer className="custom-footer" style={{ marginTop: 0, paddingTop: 0 }} />
    </>
  )
}
export default ContactUs
