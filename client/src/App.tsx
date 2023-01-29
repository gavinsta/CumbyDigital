import React from 'react';
import logo from './logo.svg';
//import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';
import NoPage from './pages/NoPage';
import OrderCompletePage from './pages/OrderCompletePage';
import BookingsPage from './pages/BookingsPage';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/home" />} />
          <Route path="bookings" element={<BookingsPage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="success" element={<OrderCompletePage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>

  );
}

export default App;
