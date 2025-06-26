import { footerLinks } from '@/assets/data/footer-items';
import playStore from '@/assets/images/client/app-store.svg';
import googlePlay from '@/assets/images/client/google-play.svg';
import pylogo from '@/assets/images/logo.png';
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
  
  const footerStyles = {
    footerMain: {
      backgroundColor: '#0e0a38',
      color: '#ffffff',
      textAlign: 'left'
    },
    logoImageFooter: {
      marginLeft: '0',
      objectFit: 'contain',
      display: 'block',
      maxWidth: '189px',
      textAlign: 'left'
    },
    logoColumn: {
      textAlign: 'left',
      paddingLeft: '0',
      marginLeft: '0',
      display: 'block'
    },
    termsLink: {
      whiteSpace: 'nowrap',
      wordBreak: 'keep-all',
      color: '#ffffff'
    },
    logoLink: {
      display: 'block',
      marginRight: '0',
      marginLeft: '0',
      textAlign: 'left',
      width: 'fit-content',
      float: 'none'
    },
    logoDescription: {
      textAlign: 'left',
      marginTop: '1rem',
      marginBottom: '1rem',
      color: '#e0e0e0'
    },
    socialLinks: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: '1rem',
      textAlign: 'left'
    },
    footerContainer: {
      paddingLeft: '0',
      paddingRight: '15px'
    },
    footerRow: {
      marginLeft: '0',
      paddingLeft: '0'
    },
    footerText: {
      color: '#e0e0e0'
    },
    footerLink: {
      color: '#e0e0e0',
      textDecoration: 'none'
    },
    navLink: {
      color: '#e0e0e0',
      padding: '0.25rem 0',
      textDecoration: 'none'
    },
    footerHr: {
      borderColor: 'rgba(255, 255, 255, 0.2)',
      margin: '2rem 0 0 0'
    },
    copyrightText: {
      color: '#e0e0e0'
    },
    copyrightLink: {
      color: '#ffffff',
      textDecoration: 'none'
    }
  };

  const defaultSettings = {
    site_name: 'Royal Victorian University',
    site_email: 'official@rvu.in',
    site_phone: '(+374) 55 42 43 14',
    site_address: '5 Momik St, Yeghegnadzor 3601, Republic of Armenia',
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
    <footer className={clsx('pt-5', className)} style={footerStyles.footerMain}>
      <Container style={footerStyles.footerContainer}>
        <Row className="g-4" style={footerStyles.footerRow}>
          {/* Logo section - explicitly kept on left */}
          <Col lg={3} className="ps-0 pe-3" style={footerStyles.logoColumn}>
            <div style={{ textAlign: 'left', width: '100%' }}>
              <Link className="me-0 d-block" to="/" style={footerStyles.logoLink}>
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
                'Royal Victorian University in Yeghegnadzor, Armenia offers prestigious education with diverse degree programs and linguistic courses, including German language.dhuyugam Academy embarked on a resolute mission to deliver top-notch education for a spectrum of competitive examinations'}
            </p>
            <div style={footerStyles.socialLinks}>
              <ul className="list-inline mb-0 mt-3" style={{ margin: '0', padding: '0', textAlign: 'left' }}>
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
            </div>
          </Col>

          {/* Footer Links */}
          <Col lg={5}>
            <Row className="g-4">
              {footerLinks.slice(0, 2).map((link, idx) => (
                <Col xs={6} md={4} key={idx}>
                  <h5 
                    className="mb-2 mb-md-4" 
                    style={{
                      color: '#ffffff',
                      fontWeight: '600',
                      fontSize: '1.25rem',
                      lineHeight: '1.2',
                      marginBottom: '1rem',
                      textDecoration: 'none',
                      filter: 'none',
                      opacity: '1',
                      textShadow: 'none',
                      fontFamily: 'inherit',
                      fontStyle: 'normal',
                      letterSpacing: 'normal',
                      textTransform: 'none',
                      WebkitTextFillColor: '#ffffff',
                      WebkitTextStroke: 'none'
                    }}
                  >
                    {link.title}
                  </h5>
                  <ul className="nav flex-column">
                    {link.items.map((item, idx) => (
                      <li className="nav-item" key={idx}>
                        <Link 
                          className="nav-link" 
                          to={item.link ?? ''}
                          style={{
                            ...footerStyles.navLink,
                            ...(item.name === 'Terms and Conditions' ? footerStyles.termsLink : {})
                          }}
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
            <h5 
              className="mb-2 mb-md-4" 
              style={{
                color: '#ffffff',
                fontWeight: '600',
                fontSize: '1.25rem',
                lineHeight: '1.2',
                marginBottom: '1rem',
                textDecoration: 'none',
                filter: 'none',
                opacity: '1',
                textShadow: 'none',
                fontFamily: 'inherit',
                fontStyle: 'normal',
                letterSpacing: 'normal',
                textTransform: 'none',
                WebkitTextFillColor: '#ffffff',
                WebkitTextStroke: 'none'
              }}
            >
              Contact
            </h5>
            <p className="mb-2" style={footerStyles.footerText}>{settings.site_address}</p>
            <p className="mb-0" style={footerStyles.footerText}>
              Contact Number: <span className="h6 fw-light ms-1" style={footerStyles.footerText}>{settings.site_phone}</span>
            </p>
            <p className="mb-0" style={footerStyles.footerText}>
              Email: <span className="h6 fw-light ms-1" style={footerStyles.footerText}>{settings.site_email}</span>
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

        <hr className="mt-4 mb-0" style={footerStyles.footerHr} />
        <div className="py-3">
          <Container className="px-0">
            <div className="d-flex justify-content-center py-3">
              <div className="text-center" style={footerStyles.copyrightText}>
                Powered by{' '}
                <Link to="https://asubrix.com/" target="_blank" style={footerStyles.copyrightLink}>
                  Asubrix International Pvt Ltd
                </Link>{' '}
                 © Royal Victorian University 2025. All rights reserved
              </div>
            </div>
          </Container>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;