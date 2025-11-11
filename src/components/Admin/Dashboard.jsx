// components/Admin/Dashboard.jsx
"use client";

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    productsCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load orders
      const ordersResponse = await fetch('/api/orders');
      const ordersData = await ordersResponse.json();
      const orders = ordersData.orders || [];

      // Load products
      const productsResponse = await fetch('/api/products');
      const productsData = await productsResponse.json();
      const products = productsData.products || [];

      // Calculate stats
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(order => order.status === 'pending').length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      const productsCount = products.length;

      setStats({
        totalOrders,
        pendingOrders,
        totalRevenue,
        productsCount
      });

      // Get recent orders (last 5)
      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus })
      });

      if (response.ok) {
        loadDashboardData(); // Reload data
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Fixed navigation functions
  const navigateToProducts = () => {
    // This will be handled by the parent component (AdminPanel)
    // We'll use a callback approach
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adminNavigation', { 
        detail: { tab: 'products' } 
      }));
    }
  };

  const navigateToOrders = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('adminNavigation', { 
        detail: { tab: 'orders' } 
      }));
    }
  };

  return (
    <div className="dashboard">
      <h2>Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Pending Orders</h3>
          <p className="stat-number">{stats.pendingOrders}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-number">৳{stats.totalRevenue}</p>
        </div>
        
        <div className="stat-card">
          <h3>Products</h3>
          <p className="stat-number">{stats.productsCount}</p>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="recent-orders">
        <h3>Recent Orders</h3>
        {recentOrders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <div className="orders-list">
            {recentOrders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-info">
                  <strong>{order.name}</strong>
                  <span>#{order.orderId}</span>
                  <span>৳{order.total}</span>
                  <span className={`status ${order.status}`}>
                    {order.status}
                  </span>
                </div>
                <div className="order-actions">
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions - FIXED */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button 
            onClick={navigateToProducts}
            className="action-btn"
          >
            Add New Product
          </button>
          <button 
            onClick={navigateToOrders}
            className="action-btn"
          >
            View All Orders
          </button>
        </div>
      </div>
    </div>
  );
}