import pymainlogo from '@/assets/images/logo-puthuyugham.png';
import '@/assets/scss/style.scss'; // Ensure the main SCSS file is imported
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import httpClient from '../helpers/httpClient';

// Backend base URL - adjust this to match your backend server
const BACKEND_URL = 'https://server.pudhuyugamacademy.com';

// Create a cache to store the logo URL between re-renders
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
    // Only fetch if we haven't already fetched in this session
    if (hasFetchedRef.current || logoCache.url) {
      return;
    }
    
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        hasFetchedRef.current = true;
        
        const response = await httpClient.get('/api/admin/settings');
        
        if (response.data) {
          // Update logo from API data
          if (response.data.site_logo) {
            const logoPath = response.data.site_logo;
            
            // Convert relative path to absolute URL if it's a relative path
            let fullLogoUrl = logoPath;
            if (logoPath.startsWith('/')) {
              fullLogoUrl = `${BACKEND_URL}${logoPath}`;
            }
            
            // Update state and cache
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