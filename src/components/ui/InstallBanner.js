import React, { useState, useEffect } from 'react';
import '../../styles/components/InstallBanner.css';

const InstallBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if the app is already installed
    const isInStandaloneMode = () => {
      return (window.matchMedia('(display-mode: standalone)').matches) || 
             (window.navigator.standalone) || 
             document.referrer.includes('android-app://');
    };

    if (isInStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    // Check if user has previously closed the banner
    const bannerClosed = localStorage.getItem('installBannerClosed');
    if (bannerClosed === 'true') {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      
      // Store the event for later use
      setDeferredPrompt(e);
      
      // Show the banner after a short delay
      setTimeout(() => {
        setShowBanner(true);
      }, 2000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowBanner(false);
      setDeferredPrompt(null);
      console.log('PWA was installed');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the deferred prompt variable
      setDeferredPrompt(null);
    });

    // Hide the banner
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
    // Save to localStorage that user closed the banner
    localStorage.setItem('installBannerClosed', 'true');
  };

  if (!showBanner || isInstalled) {
    return null;
  }

  return (
    <div className="install-banner">
      <div className="install-banner-icon">
        <i className='bx bx-download'></i>
      </div>
      <div className="install-banner-content">
        <div className="install-banner-title">Install Yogee App</div>
        <div className="install-banner-text">Add to your home screen for a better experience</div>
      </div>
      <div className="install-banner-actions">
        <button className="install-button" onClick={handleInstall}>
          Install
        </button>
        <button className="close-banner" onClick={handleClose}>
          <i className='bx bx-x'></i>
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;
