import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './theme';
import { ChakraProvider } from '@chakra-ui/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
const testing = false;
const stripePK = testing ? "pk_test_KBiqNpseXjnKYpbwJIp7jj2r" : "pk_live_kmyrC0tniX7VdVIpYSFpdiDb";
const stripePromise = loadStripe(stripePK)
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ChakraProvider theme={theme}>
    <Elements stripe={stripePromise}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Elements>
  </ChakraProvider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
