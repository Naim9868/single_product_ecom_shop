// components/Admin/OrderManager.jsx
import { useState, useEffect } from 'react';

export default function OrderManager() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const response = await fetch('/api/orders');
    const data = await response.json();
    setOrders(data.orders || []);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    const response = await fetch('/api/orders', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, status: newStatus })
    });

    if (response.ok) {
      loadOrders(); // Reload orders
    }
  };

  const deleteOrder = async (orderId) => {
    if (confirm('Are you sure you want to delete this order?')) {
      // Since we're using JSON files, we'll need to implement delete in the API
      // For now, let's mark it as cancelled
      await updateOrderStatus(orderId, 'cancelled');
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f39c12',
      confirmed: '#3498db',
      shipped: '#9b59b6',
      delivered: '#27ae60',
      cancelled: '#e74c3c'
    };
    return colors[status] || '#95a5a6';
  };

  return (
    <div className="order-manager">
      <div className="order-header">
        <h2>Order Management ({orders.length} orders)</h2>
        
        <div className="filter-controls">
          <label>Filter by status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found</p>
        </div>
      ) : (
        <div className="orders-table">
          {filteredOrders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-main-info">
                <div className="order-customer">
                  <h3>{order.name}</h3>
                  <p>📞 {order.phone}</p>
                  <p>📍 {order.district}</p>
                </div>
                
                <div className="order-details">
                  <p><strong>Order ID:</strong> {order.orderId}</p>
                  <p><strong>Size:</strong> {order.size}</p>
                  <p><strong>Shipping:</strong> {order.shipping}</p>
                  <p><strong>Total:</strong> ৳{order.total}</p>
                  <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                
                <div className="order-address">
                  <p><strong>Address:</strong></p>
                  <p>{order.address}</p>
                </div>
              </div>

              <div className="order-actions">
                <div className="status-control">
                  <label>Status:</label>
                  <select 
                    value={order.status} 
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    style={{ borderColor: getStatusColor(order.status) }}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <span 
                    className="status-indicator"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  ></span>
                </div>

                <div className="action-buttons">
                  <button 
                    onClick={() => window.open(`tel:${order.phone}`)}
                    className="btn-call"
                  >
                    📞 Call
                  </button>
                  <button 
                    onClick={() => deleteOrder(order.id)}
                    className="btn-delete"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Statistics */}
      <div className="order-stats">
        <h3>Order Statistics</h3>
        <div className="stats-breakdown">
          {['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(status => {
            const count = orders.filter(order => order.status === status).length;
            const percentage = orders.length > 0 ? (count / orders.length * 100).toFixed(1) : 0;
            
            return (
              <div key={status} className="stat-item">
                <span className="stat-label">{status}:</span>
                <span className="stat-value">{count} ({percentage}%)</span>
                <div 
                  className="stat-bar" 
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: getStatusColor(status)
                  }}
                ></div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}