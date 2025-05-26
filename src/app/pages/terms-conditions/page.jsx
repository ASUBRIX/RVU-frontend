import { Container, Spinner, Alert } from "react-bootstrap";
import TopNavigationBar from "@/components/TopNavigationBar";
import Footer from "@/components/Footer";
import HeroImage from "./components/HeroImage";
import { useState, useEffect } from 'react';
import httpClient from '../../../helpers/httpClient';

const TermsAndConditions = () => {
  const [termsContent, setTermsContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTermsAndConditions = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get('/api/admin/legal');
        if (response.data && response.data.content) {
          setTermsContent(response.data.content);
        } else {
          setError('Could not load terms and conditions content');
        }
      } catch (err) {
        console.error('Error fetching terms and conditions:', err);
        setError('Failed to load terms and conditions. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTermsAndConditions();
  }, []);

  return (
    <>
      <TopNavigationBar />
      <HeroImage/>
      <Container className="my-5">
        <h3 className="mb-4">Terms and Conditions</h3>
        
        {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" role="status" variant="primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading terms and conditions...</p>
          </div>
        ) : error ? (
          <Alert variant="danger">
            {error}
          </Alert>
        ) : (
          <div 
            dangerouslySetInnerHTML={{ __html: termsContent }} 
            className="terms-conditions-content"
          />
        )}
      </Container>
      <Footer className="custom-footer" />
    </>
  );
};

export default TermsAndConditions;
