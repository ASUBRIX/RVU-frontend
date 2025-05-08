import Footer from '@/components/Footer'
import TopNavigationBar from '@/components/TopNavigationBar'
import FreeTestsList from './components/FreeTestsList'
import Hero from './components/Hero'

const FreeTest = () => {
  return (
    <>
      <TopNavigationBar />
      <main>
        <Hero/>
        <FreeTestsList />
      </main>
      <Footer className="custom-footer"/>
    </>
  )
}

export default FreeTest
