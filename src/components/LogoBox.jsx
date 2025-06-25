import pymainlogo from '@/assets/images/logo.png';
import '@/assets/scss/style.scss';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../helpers/httpClient';


const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;

let logoCache = {
  url: null,
  name: ''
};

const LogoBox = ({ height, width }) => {
  const [siteLogo, setSiteLogo] = useState(logoCache.url || pymainlogo);
  const [siteName, setSiteName] = useState(logoCache.name || '');
  const [isLoading, setIsLoading] = useState(!logoCache.url);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current || logoCache.url) {
      return;
    }
    
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        hasFetchedRef.current = true;
        
        const response = await httpClient.get('/api/admin/settings');
        
        if (response.data) {
          if (response.data.site_logo) {
            const logoPath = response.data.site_logo;
            
            let fullLogoUrl = logoPath;
            if (logoPath.startsWith('/')) {
              fullLogoUrl = `${BACKEND_URL}${logoPath}`;
            }
            
            setSiteLogo(fullLogoUrl);
            logoCache.url = fullLogoUrl;
          }
          
          if (response.data.site_name) {
            setSiteName(response.data.site_name);
            logoCache.name = response.data.site_name;
          }
        }
      } catch (error) {
        console.error('Error fetching site logo:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <Link className="navbar-brand" to="/">
      <img 
        className="light-mode-item navbar-brand-item logo-image"
        src={siteLogo} 
        alt={siteName || 'logo'}
        height={height}
        width={width}
        style={{ objectFit: 'contain' }}
        onError={(e) => {
          e.target.src = pymainlogo;
        }}
      />
    </Link>
  );
};

export default LogoBox;