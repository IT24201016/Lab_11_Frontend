import { useState, useEffect } from 'react';
import './App.css';

// Read backend API URL from environment variable as required by Lab 11 Task 01
const API = import.meta.env.VITE_API_URL || 'https://lab-11-khyv.onrender.com';

const fallbackMenu = [
  { id: 1, name: 'Campus Chicken Rice & Curry', price: 'Rs. 450.00', category: 'Lunch', available: true },
  { id: 2, name: 'Crispy Veggie Sub Burger', price: 'Rs. 380.00', category: 'Fast Food', available: true },
  { id: 3, name: 'Fresh Tropical Fruit Salad', price: 'Rs. 250.00', category: 'Dessert', available: true },
  { id: 4, name: 'Iced Milk Coffee', price: 'Rs. 200.00', category: 'Beverage', available: true },
];

export default function App() {
  const [menu, setMenu] = useState(fallbackMenu);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ text: 'Ready', type: 'idle' });
  const [cart, setCart] = useState([]);
  const [activeTab, setActiveTab] = useState('menu');

  const fetchMenu = async () => {
    setLoading(true);
    setStatus({ text: `Calling ${API}/api/menu ...`, type: 'loading' });
    try {
      const response = await fetch(`${API}/api/menu`);
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      const data = await response.json();
      setMenu(data);
      setStatus({ text: `Connected! HTTP ${response.status} OK (from ${API})`, type: 'success' });
    } catch (err) {
      console.warn('Backend unavailable, using cached menu items:', err);
      setStatus({
        text: `Backend cold start or not reachable at ${API}. Showing offline menu data.`,
        type: 'warning'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart((prev) => [...prev, item]);
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <div className="logo-section">
          <span className="logo-icon">🍔</span>
          <div>
            <h1 className="logo-title">CampusEats</h1>
            <span className="logo-badge">SE3090 DevOps Lab 11</span>
          </div>
        </div>
        <nav className="nav-links">
          <button className={`nav-btn ${activeTab === 'menu' ? 'active' : ''}`} onClick={() => setActiveTab('menu')}>Menu</button>
          <button className={`nav-btn ${activeTab === 'architecture' ? 'active' : ''}`} onClick={() => setActiveTab('architecture')}>Architecture & Config</button>
          <button className={`nav-btn ${activeTab === 'cart' ? 'active' : ''}`} onClick={() => setActiveTab('cart')}>
            Cart ({cart.length})
          </button>
        </nav>
      </header>



      <main className="main-content">
        {activeTab === 'menu' && (
          <div className="menu-view">
            <div className="section-header">
              <h2>Campus Cafeteria Daily Menu</h2>
              <p>Dynamic items loaded via production REST API wired to cloud database.</p>
            </div>
            <div className="menu-grid">
              {menu.map((item) => (
                <div key={item.id} className="menu-card">
                  <div className="card-header">
                    <span className="item-category">{item.category}</span>
                    <span className="item-price">{item.price}</span>
                  </div>
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-desc">Freshly prepared and available today at the campus main cafeteria.</p>
                  <button className="add-btn" onClick={() => addToCart(item)}>
                    + Add to Order
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'architecture' && (
          <div className="arch-view">
            <h2>CampusEats 3-Tier Production Architecture (Lab 11)</h2>
            <div className="tiers-container">
              <div className="tier-card">
                <span className="tier-number">Tier 1</span>
                <h3>Frontend Client</h3>
                <p><strong>Platform:</strong> Vercel / Netlify</p>
                <p><strong>Stack:</strong> React + Vite SPA</p>
                <p><strong>Env Var:</strong> <code>VITE_API_URL</code></p>
                <div className="tier-badge">Static Global CDN</div>
              </div>

              <div className="tier-arrow">➔</div>

              <div className="tier-card">
                <span className="tier-number">Tier 2</span>
                <h3>Backend REST API</h3>
                <p><strong>Platform:</strong> Render / Railway</p>
                <p><strong>Stack:</strong> ASP.NET Core 8.0</p>
                <p><strong>Config:</strong> Port 8080, CORS, Dockerfile</p>
                <div className="tier-badge">Containerized Web Service</div>
              </div>

              <div className="tier-arrow">➔</div>

              <div className="tier-card">
                <span className="tier-number">Tier 3</span>
                <h3>Cloud Database</h3>
                <p><strong>Platform:</strong> Neon / Supabase</p>
                <p><strong>Stack:</strong> Managed PostgreSQL</p>
                <p><strong>Env Var:</strong> <code>ConnectionStrings__Default</code></p>
                <div className="tier-badge">Serverless Postgres (SSL)</div>
              </div>
            </div>

            <div className="devops-info-box">
              <h4>DevOps Best Practice (Lecture 11 & Twelve-Factor App)</h4>
              <p>
                Configuration that varies between deployment environments (development, staging, production)
                must be supplied through <strong>Environment Variables</strong>, never hard-coded in source code
                or committed to Git.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'cart' && (
          <div className="cart-view">
            <h2>Your Order ({cart.length} items)</h2>
            {cart.length === 0 ? (
              <p className="empty-cart">Your cart is currently empty. Select items from the menu.</p>
            ) : (
              <ul className="cart-list">
                {cart.map((item, idx) => (
                  <li key={idx} className="cart-item">
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <footer className="footer">
        <p>SE3090 Software Engineering Frameworks — Lab Practical 11 | Student IT: IT24100131</p>
      </footer>
    </div>
  );
}
