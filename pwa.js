// PWA Registration and Installation Script

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch((error) => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

// Variables to store install prompt
let deferredPrompt;
const installButton = document.getElementById('install-app');
const installBanner = document.getElementById('install-banner');

// Hide install button initially
if (installButton) {
  installButton.style.display = 'none';
}

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  // Prevent Chrome 67 and earlier from automatically showing the prompt
  e.preventDefault();
  
  // Stash the event so it can be triggered later
  deferredPrompt = e;
  
  // Show the install button
  if (installButton) {
    installButton.style.display = 'block';
    
    // Add click event to install button
    installButton.addEventListener('click', () => {
      // Hide the install button
      installButton.style.display = 'none';
      
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
        deferredPrompt = null;
      });
    });
  }
  
  // Show the install banner if it exists
  if (installBanner) {
    installBanner.style.display = 'flex';
    
    // Add click event to close button
    const closeButton = installBanner.querySelector('.close-banner');
    if (closeButton) {
      closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        installBanner.style.display = 'none';
        
        // Save to localStorage that user closed the banner
        localStorage.setItem('installBannerClosed', 'true');
      });
    }
    
    // Add click event to install button in banner
    const bannerInstallButton = installBanner.querySelector('.install-button');
    if (bannerInstallButton) {
      bannerInstallButton.addEventListener('click', () => {
        // Hide the banner
        installBanner.style.display = 'none';
        
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
          deferredPrompt = null;
        });
      });
    }
  }
});

// Check if app is installed
window.addEventListener('appinstalled', () => {
  // Hide the install button and banner
  if (installButton) {
    installButton.style.display = 'none';
  }
  
  if (installBanner) {
    installBanner.style.display = 'none';
  }
  
  // Clear the deferred prompt variable
  deferredPrompt = null;
  
  // Log the installation
  console.log('PWA was installed');
});

// Function to check if the app is in standalone mode (installed)
function isInStandaloneMode() {
  return (window.matchMedia('(display-mode: standalone)').matches) || 
         (window.navigator.standalone) || 
         document.referrer.includes('android-app://');
}

// Add standalone class to body if in standalone mode
if (isInStandaloneMode()) {
  document.body.classList.add('standalone-mode');
}

// Check connection status
function updateOnlineStatus() {
  const statusIndicator = document.getElementById('connection-status');
  if (statusIndicator) {
    if (navigator.onLine) {
      statusIndicator.textContent = 'Online';
      statusIndicator.classList.remove('offline');
      statusIndicator.classList.add('online');
    } else {
      statusIndicator.textContent = 'Offline';
      statusIndicator.classList.remove('online');
      statusIndicator.classList.add('offline');
    }
  }
}

// Add event listeners for online/offline events
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

// Initial check
document.addEventListener('DOMContentLoaded', updateOnlineStatus);
