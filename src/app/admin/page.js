// app/admin/page.js
'use client';

import { useState, useEffect } from 'react';
import Dashboard from '../../components/Admin/Dashboard';
import ProductManager from '../../components/Admin/ProductManager';
import OrderManager from '../../components/Admin/OrderManager';

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newOrdersCount, setNewOrdersCount] = useState(0);

  useEffect(() => {
    // Real-time order notifications
    const eventSource = new EventSource('/api/orders');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_ORDER') {
        setNewOrdersCount(prev => prev + 1);
        // Show browser notification
        if (Notification.permission === 'granted') {
          new Notification('New Order!', {
            body: `New order from ${data.order.name}`
          });
        }
      }
    };

    // Handle navigation events from Dashboard
    const handleAdminNavigation = (event) => {
      setActiveTab(event.detail.tab);
    };

    window.addEventListener('adminNavigation', handleAdminNavigation);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      eventSource.close();
      window.removeEventListener('adminNavigation', handleAdminNavigation);
    };
  }, []);

  const tabs = {
    dashboard: { name: 'Dashboard', count: newOrdersCount },
    products: { name: 'Products' },
    orders: { name: 'Orders' }
  };

  return (
    <div className="admin-panel">
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <nav className="admin-nav">
          {Object.entries(tabs).map(([key, tab]) => (
            <button
              key={key}
              className={`nav-btn ${activeTab === key ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(key);
                if (key === 'dashboard') setNewOrdersCount(0);
              }}
            >
              {tab.name}
              {tab.count > 0 && <span className="badge">{tab.count}</span>}
            </button>
          ))}
        </nav>
      </header>

      <main className="admin-main">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'products' && <ProductManager />}
        {activeTab === 'orders' && <OrderManager />}
      </main>
    </div>
  );
}