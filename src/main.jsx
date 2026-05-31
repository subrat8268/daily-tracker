import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import useTrackerStore from './store/useTrackerStore';

// Boot: hydrate store from Supabase on app start
useTrackerStore.getState().loadFromCloud();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
