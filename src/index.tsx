import App from 'App';
import { createRoot } from 'react-dom/client';
import { PrimeReactProvider } from 'primereact/api';
import { BrowserRouter } from 'react-router-dom';
import { LoadingProvider } from 'core/loading/LoadingContext';
import './assets/scss/main.scss';

import reportWebVitals from './reportWebVitals';

const container = document.getElementById('app');
const root = createRoot(container!);
root.render(
  <PrimeReactProvider>
    <LoadingProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LoadingProvider>
  </PrimeReactProvider>
);

reportWebVitals();
