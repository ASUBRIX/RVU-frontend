import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import '@/assets/scss/components/_whatsapp.scss';

const WhatsAppButton = () => {
  return (
    <a
      href="https://wa.me/+919488722512" 
      className="whatsapp-button"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FaWhatsapp className="whatsapp-icon" />
    </a>
  );
};

export default WhatsAppButton;