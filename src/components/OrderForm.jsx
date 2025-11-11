// components/OrderForm.jsx - More robust version
import { useState } from 'react';

export default function OrderForm({ 
  selectedSize = 'M',
  shippingMethod = 'outside-dhaka',
  setShippingMethod,
  total = 0
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderData, setOrderData] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    size: selectedSize,
    shipping: shippingMethod
  });

  // Safe state update
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData(prev => ({
      ...(prev || {}),
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!orderData.name || !orderData.phone || !orderData.address || !orderData.district) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        name: orderData.name || '',
        phone: orderData.phone || '',
        address: orderData.address || '',
        district: orderData.district || '',
        size: selectedSize || 'M',
        shipping: shippingMethod || 'outside-dhaka',
        total: total || 0
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload)
      });

      if (response.ok) {
        alert('Order placed successfully! We will contact you soon.');
        // Reset form
        setOrderData({
          name: '',
          phone: '',
          address: '',
          district: '',
          size: selectedSize,
          shipping: shippingMethod
        });
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Network error. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure orderData is always defined
  const safeOrderData = orderData || {
    name: '', phone: '', address: '', district: '', size: selectedSize, shipping: shippingMethod
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h2>Billing Details</h2>
      
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={safeOrderData.name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={safeOrderData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="district">District *</label>
        <select
          id="district"
          name="district"
          value={safeOrderData.district}
          onChange={handleInputChange}
          required
        >
          <option value="">Select District</option>
          <option value="dhaka">Dhaka</option>
          <option value="chattogram">Chattogram</option>
          <option value="sylhet">Sylhet</option>
          <option value="rajshahi">Rajshahi</option>
          <option value="khulna">Khulna</option>
          <option value="barishal">Barishal</option>
          <option value="rangpur">Rangpur</option>
          <option value="mymensingh">Mymensingh</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="address">Full Address *</label>
        <textarea
          id="address"
          name="address"
          value={safeOrderData.address}
          onChange={handleInputChange}
          rows="3"
          required
        />
      </div>

      <div className="shipping-method">
        <h3>Shipping Method</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="shipping"
              value="inside-dhaka"
              checked={shippingMethod === 'inside-dhaka'}
              onChange={(e) => setShippingMethod && setShippingMethod(e.target.value)}
            />
            Inside Dhaka: ৳60.00
          </label>
          <label>
            <input
              type="radio"
              name="shipping"
              value="outside-dhaka"
              checked={shippingMethod === 'outside-dhaka'}
              onChange={(e) => setShippingMethod && setShippingMethod(e.target.value)}
            />
            Outside Dhaka: ৳120.00
          </label>
        </div>
      </div>

      <button 
        type="submit" 
        className="place-order-btn"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Placing Order...' : `Place Order - ৳${total}`}
      </button>
    </form>
  );
}