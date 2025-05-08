import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Footer from '@/components/Footer'
import TopNavigationBar from '@/components/TopNavigationBar'
import HeroImage from './components/HeroImage'

const GalleryPage = () => {
  return (
    <>
      <TopNavigationBar />
      <main>
        
        {/* <Hero /> */}
        <HeroImage/>
        <Gallery />
      </main>
      <Footer className="custom-footer"/>
    </>
  )
}

export default GalleryPage
