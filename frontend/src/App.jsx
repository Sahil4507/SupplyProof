import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './hooks/ThemeContext';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import RegisterProductPage from './pages/RegisterProductPage';
import VerifyProductPage from './pages/VerifyProductPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import BatchRecallPage from './pages/BatchRecallPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="register" element={<RegisterProductPage />} />
            <Route path="verify" element={<VerifyProductPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="batch-recall" element={<BatchRecallPage />} />
            <Route path="about" element={<AboutPage />} />
            
            {/* Legacy redirects for old bookmarks / routes */}
            <Route path="bikes" element={<Navigate to="/products" replace />} />
            <Route path="bike/:id" element={<Navigate to="/product/:id" replace />} />
            <Route path="dashboard" element={<Navigate to="/products" replace />} />
            
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
