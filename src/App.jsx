import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppProvidersWrapper from "./components/wrappers/AppProvidersWrapper";
import AppRouter from "./routes/router";
import ContactForm from "@/components/PopUpForm"; 
import "@/assets/scss/style.scss";
import WhatsAppButton from "@/components/WhatsAppButton";
import {AuthProvider} from "./context/useAuthContext";


function App() {
  const [showContactForm, setShowContactForm] = useState(false);
  const location = useLocation();

  // Check if current path is admin related
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    // Set light theme on document
    document.documentElement.setAttribute('data-bs-theme', 'light');
    
    // Only show contact form if not on admin path and hasn't been shown before
    const hasFormBeenShown = sessionStorage.getItem("contactFormShown");
    if (!hasFormBeenShown && !isAdminPath) {
      setShowContactForm(true);
      sessionStorage.setItem("contactFormShown", "true"); 
    }
  }, [isAdminPath]);

  return (
    <AppProvidersWrapper>
      <AuthProvider>    
          {!isAdminPath && (
        <>
          <ContactForm show={showContactForm} handleClose={() => setShowContactForm(false)} />
          <WhatsAppButton />
        </>
      )}
      <AppRouter />
      </AuthProvider>

    </AppProvidersWrapper>
  );
}

export default App;
