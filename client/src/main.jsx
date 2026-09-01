import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import AppFrame from './AppFrame.jsx';
import './style.css';
createRoot(document.querySelector('#root')).render(
  // <AppFrame>
  <App />
  // </AppFrame>
);
