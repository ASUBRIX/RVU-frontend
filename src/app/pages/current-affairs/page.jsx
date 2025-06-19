import React, { useEffect, useState } from 'react';
import CurrentAffairPost from './components/CurrentAffairsPost';
import './components/currentAffairs.scss';
import Footer from '@/components/Footer';
import TopNavigationBar from '@/components/TopNavigationBar';
import CurrentAffairsHeroImage from './components/HeroImage';
import { fetchAllCurrentAffairs } from '@/helpers/userCurrentAffairsApi';

const CurrentAffairs = () => {
  const [affairs, setAffairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllCurrentAffairs()
      .then((data) => {
        setAffairs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <TopNavigationBar />
        <CurrentAffairsHeroImage />
        <div className="current-affairs-page container py-5 text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        <Footer className="custom-footer" />
      </>
    );
  }

  if (affairs.length === 0) {
    return (
      <>
        <TopNavigationBar />
        <CurrentAffairsHeroImage />
        <div className="current-affairs-page container py-5 text-center">
          <p>No current affairs found.</p>
        </div>
        <Footer className="custom-footer" />
      </>
    );
  }

  return (
    <>
      <TopNavigationBar />
      <CurrentAffairsHeroImage />
      <div className="current-affairs-page container py-5">

        <div className="row g-4 mb-5">
          {affairs.map((affair) => (
            <div key={affair.id} className="col-lg-4 col-md-6">
              <CurrentAffairPost affair={affair} />
            </div>
          ))}
        </div>
      </div>
      <Footer className="custom-footer" />
    </>
  );
};

export default CurrentAffairs;
