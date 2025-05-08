import TestDetails from './components/TestDetails'
import TopNavigationBar from '@/components/TopNavigationBar'
import Footer from '@/components/Footer'

const FreeTestDetails = () => {
  return (
    <>
      <TopNavigationBar />
      <main>
        <TestDetails />
      </main>
      <Footer className="custom-footer"/>
    </>
  )
}

export default FreeTestDetails
