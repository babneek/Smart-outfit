import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import PosePage from './pages/PosePage';
import MeasurementsPage from './pages/MeasurementsPage';
import TryOnPage from './pages/TryOnPage';
import EcommercePage from './pages/EcommercePage';
import ProductsPage from './pages/ProductsPage';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>SmartFit - Virtual Try-On</h1>
          <p>AI-powered virtual try-on system for fashion MSMEs</p>
          <div className="status">
            <h2>Service Status</h2>
            <ul>
              <li>✅ ML Service: Running on port 8000</li>
              <li>✅ Backend: Running on port 3001</li>
              <li>✅ Frontend: Running on port 3000</li>
            </ul>
          </div>
          <div className="features">
            <h2>Features</h2>
            <ul>
              <li><Link to="/pose">📸 Pose Estimation</Link></li>
              <li><Link to="/measurements">📏 Body Measurements</Link></li>
              <li><Link to="/tryon">👕 Virtual Try-On</Link></li>
              <li><Link to="/products">🛒 E-commerce Integration</Link></li>
            </ul>
          </div>
        </header>
        <Routes>
          <Route path="/pose" element={<PosePage />} />
          <Route path="/measurements" element={<MeasurementsPage />} />
          <Route path="/tryon" element={<TryOnPage />} />
          <Route path="/ecommerce" element={<EcommercePage />} />
          <Route path="/products" element={<ProductsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;