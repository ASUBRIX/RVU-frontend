import { Container, Spinner, Alert } from 'react-bootstrap'
import TopNavigationBar from '@/components/TopNavigationBar'
import Footer from '@/components/Footer'
import HeroImage from './components/HeroImage'
import { useState, useEffect } from 'react'
import httpClient from '../../../helpers/httpClient'

const PrivacyPolicy = () => {
  const [policyContent, setPolicyContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        setLoading(true)
        const response = await httpClient.get('/api/legal/privacy')
        if (response.data && response.data.content) {
          setPolicyContent(response.data.content)
        } else {
          setError('Could not load privacy policy content')
        }
      } catch (err) {
        console.error('Error fetching privacy policy:', err)
        setError('Failed to load privacy policy. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchPrivacyPolicy()
  }, [])

  return (
    <>
      <TopNavigationBar />
      <HeroImage/>
      <Container className="my-5">
        <h3 className="mb-4">Privacy Policy</h3>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading privacy policy...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">
            {error}
          </Alert>
        ) : (
          <div 
            dangerouslySetInnerHTML={{ __html: policyContent }} 
            className="privacy-policy-content"
          />
        )}
      </Container>
      <Footer className="custom-footer" />
    </>
  )
}

export default PrivacyPolicy
