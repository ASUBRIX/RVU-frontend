import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import AppProvidersWrapper from './components/wrappers/AppProvidersWrapper'
import AppRouter from './routes/router'
import ContactForm from '@/components/PopUpForm'
import '@/assets/scss/style.scss'
import WhatsAppButton from '@/components/WhatsAppButton'
import { AuthProvider } from './context/useAuthContext'

function App() {
  const [showContactForm, setShowContactForm] = useState(false)
  const location = useLocation()

  // Exclude admin dashboard and admin login page
  const isAdminRoute = (
    location.pathname.startsWith('/admin') ||
    location.pathname === '/auth/admin-login'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', 'light')
    const hasFormBeenShown = sessionStorage.getItem('contactFormShown')
    if (!hasFormBeenShown && !isAdminRoute) {
      setShowContactForm(true)
      sessionStorage.setItem('contactFormShown', 'true')
    }
  }, [isAdminRoute])

  return (
    <AppProvidersWrapper>
      {/* Show contact/WhatsApp only if NOT admin route/login */}
      {!isAdminRoute && (
        <>
          <ContactForm show={showContactForm} handleClose={() => setShowContactForm(false)} />
          <WhatsAppButton />
        </>
      )}
      <AppRouter />
    </AppProvidersWrapper>
  )
}

export default App
