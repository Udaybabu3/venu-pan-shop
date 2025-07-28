import React, { useState } from 'react';
import Inventory from './components/Inventory';
import UseForm from './components/UseForm';
import StockForm from './components/StockForm';
import Reports from './components/Reports';
import './App.css';

function App() {
  const [page, setPage] = useState('inventory');

  const renderPage = () => {
    switch (page) {
      case 'inventory':
        return <Inventory />;
      case 'use':
        return <UseForm />;
      case 'stock':
        return <StockForm />;
      case 'reports':
        return <Reports />;
      default:
        return <Inventory />;
    }
  };

  return (
    <div className="App">
      <h1>🧾 Venu Pan Shop Inventory App</h1>

      <nav style={{ marginBottom: '20px', display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className={page === 'inventory' ? 'active' : ''} onClick={() => setPage('inventory')}>
          📦 Inventory
        </button>
        <button className={page === 'use' ? 'active' : ''} onClick={() => setPage('use')}>
          📝 Use Ingredient
        </button>
        <button className={page === 'stock' ? 'active' : ''} onClick={() => setPage('stock')}>
          📥 Add Stock
        </button>
        <button className={page === 'reports' ? 'active' : ''} onClick={() => setPage('reports')}>
          📊 Reports
        </button>
      </nav>

      <main>{renderPage()}</main>
    </div>
  );
}

export default App;
