import Footer from '@/components/Footer'
import PageMetaData from '@/components/PageMetaData'
import TopNavigationBar from '@/components/TopNavigationBar'
import PopularCourses from './components/PopularCourses'
import AboutAndNoticeBoard from './components/AboutAndNoticeBoard'
import EnrolledCourses from './components/EnrolledCourses'
import FeaturedCourses from './components/FeaturedCourses'
import HeroSlider from './components/HeroSlider'
import OfferCourses from './components/OfferCourses'
import Testimonials from './components/Testimonials'

const AcademicHome = () => {
  return (
    <>
      <PageMetaData title="Academy" />
      <TopNavigationBar />
      <main>
        <HeroSlider />
        <AboutAndNoticeBoard/>
        <OfferCourses />
        <EnrolledCourses />
        <FeaturedCourses />
        <PopularCourses />
        <Testimonials />
      </main>
      <Footer className="custom-footer" />
    </>
  )
}
export default AcademicHome