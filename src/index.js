import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';
import AdminApp from './AdminApp';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {process.env.REACT_APP_ADMIN_MODE === 'true' ? <AdminApp /> : <App />}
  </React.StrictMode>
);

serviceWorkerRegistration.register();
reportWebVitals();
