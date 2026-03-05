import React, { useState, useEffect } from 'react';
import './CookiesBanner.css';

function CookiesBanner() {
  const [visible, setVisible] = useState(false);
  const [selectedCookies, setSelectedCookies] = useState({
    necessary: true,
    marketing: false,
    functional: false,
    analytics: false
  });

  useEffect(() => {
    // Verificar si ya aceptó cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    setSelectedCookies({
      necessary: true,
      marketing: true,
      functional: true,
      analytics: true
    });
    savePreferences({
      necessary: true,
      marketing: true,
      functional: true,
      analytics: true
    });
  };

  const handleSavePreferences = () => {
    savePreferences(selectedCookies);
  };

  const savePreferences = (preferences) => {
    localStorage.setItem('cookiesAccepted', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setVisible(false);
  };

  const toggleCookie = (type) => {
    if (type === 'necessary') return; // Necessary siempre true
    setSelectedCookies({
      ...selectedCookies,
      [type]: !selectedCookies[type]
    });
  };

  if (!visible) return null;

  return (
    <div className="cookies-overlay">
      <div className="cookies-banner">
        <div className="cookies-header">
          <h2>ACERCA DE LAS COOKIES EN ESTE SITIO</h2>
        </div>
        
        <div className="cookies-content">
          <p>
            Para optimizar y mejorar continuamente nuestro sitio web, utilizamos cookies de uso exclusivo de nosotros. 
            Con su consentimiento, utilizamos cookies adicionales y otras tecnologías similares para fines de análisis, 
            marketing, personalización de anuncios e integración de contenido externo.
          </p>
          <p>
            Al hacer esto, aceptas que las cookies también permiten la transferencia de tus datos personales a 
            terceros países (UE, USA, China y Singapur). Puedes obtener más información sobre las cookies que se 
            utilizarán y podrás otorgar tu consentimiento individualmente. Puedes retirar tu consentimiento en 
            cualquier momento.
          </p>
          
          <div className="cookies-links">
            <a href="/privacidad">Política de privacidad</a>
            <span className="separator">|</span>
            <a href="/legal">Aviso legal</a>
            <span className="separator">|</span>
            <a href="/opciones">Opciones</a>
          </div>

          <div className="cookies-options">
            <div className="cookie-option">
              <input 
                type="checkbox" 
                id="necessary" 
                checked={selectedCookies.necessary}
                disabled={true}
              />
              <label htmlFor="necessary">Necesario</label>
            </div>

            <div className="cookie-option">
              <input 
                type="checkbox" 
                id="marketing" 
                checked={selectedCookies.marketing}
                onChange={() => toggleCookie('marketing')}
              />
              <label htmlFor="marketing">Marketing</label>
            </div>

            <div className="cookie-option">
              <input 
                type="checkbox" 
                id="functional" 
                checked={selectedCookies.functional}
                onChange={() => toggleCookie('functional')}
              />
              <label htmlFor="functional">Funcional</label>
            </div>

            <div className="cookie-option">
              <input 
                type="checkbox" 
                id="analytics" 
                checked={selectedCookies.analytics}
                onChange={() => toggleCookie('analytics')}
              />
              <label htmlFor="analytics">Análisis</label>
            </div>
          </div>

          <div className="cookies-actions">
            <button className="btn-save" onClick={handleSavePreferences}>
              GUARDAR SERVICIOS
            </button>
            <button className="btn-accept-all" onClick={handleAcceptAll}>
              ACEPTAR TODO
            </button>
          </div>
        </div>

        <div className="cookies-footer">
          <p>FALL/WINTER 2026</p>
        </div>
      </div>
    </div>
  );
}

export default CookiesBanner;