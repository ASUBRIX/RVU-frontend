import { footerLinks } from '@/assets/data/footer-items';
import playStore from '@/assets/images/client/app-store.svg';
import googlePlay from '@/assets/images/client/google-play.svg';
import pylogo from '@/assets/images/puthuyougam_logo.png';
import '@/assets/scss/style.scss';
import clsx from 'clsx';
import { Col, Container, Row } from 'react-bootstrap';
import { FaFacebookF, FaInstagram, FaTelegramPlane, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { getWebsiteSettingsPublic } from '@/helpers/user/websiteSettingsUserApi';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL;
let settingsCache = null;

const Footer = ({ className }) => {
  // Inline styles for footer
  const footerStyles = {
    logoImageFooter: {
      marginLeft: 0,
      objectFit: 'contain',
      display: 'block'
    },
    logoColumn: {
      textAlign: 'left',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start'
    },
    termsLink: {
      whiteSpace: 'nowrap',
      wordBreak: 'keep-all'
    },
    logoLink: {
      display: 'inline-block',
      marginRight: 0,
      alignSelf: 'flex-start'
    },
    logoDescription: {
      textAlign: 'left',
      marginTop: '1rem',
      marginBottom: '1rem'
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: '1rem'
    }
  };

  const defaultSettings = {
    site_name: 'Pudhuyugam Academy',
    site_email: 'official@pudhuyugamacademy.in',
    site_phone: '9488722512, 6381048227',
    site_address: '4, Hari Garderns, Ramanuja Nagar, Uppilipayam Post, Coimbatore - 641 015',
    site_logo: pylogo,
    facebook_url: 'https://www.facebook.com/people/Pudhuyugamacademy/61553787314656/',
    youtube_url: 'https://www.youtube.com/@PudhuyugamAcademy',
    telegram_url: 'https://t.me/pudhuyugam',
    instagram_url: 'https://www.instagram.com/pudhuyugamacademy/'
  };

  const [settings, setSettings] = useState(settingsCache || defaultSettings);
  const [isLoading, setIsLoading] = useState(!settingsCache);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (hasFetchedRef.current || settingsCache) return;

    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        hasFetchedRef.current = true;

        const response = await getWebsiteSettingsPublic();
        if (response) {
          const processedData = { ...response };
          if (processedData.site_logo && processedData.site_logo.startsWith('/')) {
            processedData.site_logo = `${BACKEND_URL}${processedData.site_logo}`;
          }

          const newSettings = {
            ...defaultSettings,
            ...processedData,
            site_logo: processedData.site_logo || pylogo
            // ❌ do NOT set copyright_text
          };

          setSettings(newSettings);
          settingsCache = newSettings;
        }
      } catch (error) {
        console.error('Error fetching website settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <footer className={clsx('pt-5', className)}>
      <Container>
        <Row className="g-4">
          {/* Logo section - explicitly kept on left */}
          <Col lg={3} style={footerStyles.logoColumn}>
            <Link className="me-0" to="/" style={footerStyles.logoLink}>
              <img
                className="light-mode-item logo-image-footer"
                width={189}
                height={40}
                src={settings.site_logo}
                alt={settings.site_name}
                style={footerStyles.logoImageFooter}
                onError={(e) => { e.target.src = pylogo; }}
              />
            </Link>
            <p className="my-3" style={footerStyles.logoDescription}>
              {settings.site_description ||
                'Pudhuyugam Academy embarked on a resolute mission to deliver top-notch education for a spectrum of competitive examinations'}
            </p>
            <div style={footerStyles.socialLinks}>
              <ul className="list-inline mb-0 mt-3" style={{ margin: 0, padding: 0 }}>
              {settings.facebook_url && (
                <li className="list-inline-item">
                  <a
                    className="btn btn-white btn-sm shadow px-2 text-facebook"
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebookF className="fa-fw" />
                  </a>
                </li>
              )}
              {settings.instagram_url && (
                <li className="list-inline-item">
                  <a
                    className="btn btn-white btn-sm shadow px-2 text-instagram"
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="fa-fw" />
                  </a>
                </li>
              )}
              {settings.telegram_url && (
                <li className="list-inline-item">
                  <a
                    className="btn btn-white btn-sm shadow px-2 text-telegram"
                    href={settings.telegram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTelegramPlane className="fa-fw" />
                  </a>
                </li>
              )}
              {settings.youtube_url && (
                <li className="list-inline-item">
                  <a
                    className="btn btn-white btn-sm shadow px-2 text-youtube"
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaYoutube className="fa-fw" />
                  </a>
                </li>
              )}
            </ul>
            </div>
          </Col>

          {/* Footer Links */}
          <Col lg={5}>
            <Row className="g-4">
              {footerLinks.slice(0, 2).map((link, idx) => (
                <Col xs={6} md={4} key={idx}>
                  <h5 className="mb-2 mb-md-4">{link.title}</h5>
                  <ul className="nav flex-column">
                    {link.items.map((item, idx) => (
                      <li className="nav-item" key={idx}>
                        <Link 
                          className="nav-link" 
                          to={item.link ?? ''}
                          style={item.name === 'Terms and Conditions' ? footerStyles.termsLink : {}}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Col>
              ))}
            </Row>
          </Col>

          {/* Contact section */}
          <Col lg={4}>
            <h5 className="mb-2 mb-md-4">Contact</h5>
            <p className="mb-2">{settings.site_address}</p>
            <p className="mb-0">
              Contact Number: <span className="h6 fw-light ms-1">{settings.site_phone}</span>
            </p>
            <p className="mb-0">
              Email: <span className="h6 fw-light ms-1">{settings.site_email}</span>
            </p>
            <Row className="g-2 mt-2">
              <Col xs={6} sm={4} md={3} lg={6}>
                <span role="button">
                  <img height={45} width={145} className="w-auto" src={googlePlay} alt="google-play" />
                </span>
              </Col>
              <Col xs={6} sm={4} md={3} lg={6}>
                <span role="button">
                  <img height={45} width={145} className="w-auto" src={playStore} alt="app-store" />
                </span>
              </Col>
            </Row>
          </Col>
        </Row>

        <hr className="mt-4 mb-0" />
        <div className="py-3">
          <Container className="px-0">
            <div className="d-flex justify-content-center py-3">
              <div className="text-body text-primary-hover text-center">
                Powered by{' '}
                <Link to="https://asubrix.com/" target="_blank" className="text-body">
                  Asubrix International Pvt Ltd
                </Link>{' '}
                 © Pudhuyugam Academy 2025. All rights reserved
              </div>
            </div>
          </Container>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;