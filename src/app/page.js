// app/page.js
'use client';

import { useState, useEffect } from 'react';
import ProductShowcase from '../components/ProductShowcase';
import OrderForm from '../components/OrderForm';
import OrderSummary from '../components/OrderSummary';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [shippingMethod, setShippingMethod] = useState('outside-dhaka');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching products from API...');
      
      const response = await fetch('/api/products');
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API response data:', data);
      
      if (data && data.products && data.products.length > 0) {
        setProducts(data.products);
        setSelectedProduct(data.products[0]);
        console.log('Products loaded successfully:', data.products.length);
      } else {
        throw new Error('No products array in response');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      setError(`Failed to load products: ${error.message}`);
      // Set fallback product
      const fallbackProduct = {
        id: "1",
        name: "Premium Full Sleeve T-Shirts - 3 Pcs Package",
        price: 990,
        description: "Summer Collection - Imported Chine Mash Fabric",
        features: [
          "Comfortable and premium fabric",
          "Casual style perfect for summer",
          "Available in multiple sizes"
        ],
        sizes: ["M", "L", "XL", "2XL"],
        images: [""]
      };
      setProducts([fallbackProduct]);
      setSelectedProduct(fallbackProduct);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>Loading Shop...</h2>
          <p>Please wait while we load our products</p>
        </div>
      </div>
    );
  }

  // Show error state but with fallback product
  if (error && !selectedProduct) {
    return (
      <div className="container">
        <div className="error">
          <h2>⚠️ Connection Issue</h2>
          <p>{error}</p>
          <p>Showing demo product instead:</p>
          <button onClick={loadProducts} style={{marginTop: '10px'}}>
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  // If we have an error but selectedProduct exists, show the shop with warning
  const shippingRates = {
    'inside-dhaka': 60,
    'outside-dhaka': 120
  };

  const subtotal = selectedProduct.price;
  const shippingCost = shippingRates[shippingMethod];
  const total = subtotal + shippingCost;

  return (
    <div className="container">
      {error && (
        <div className="warning-banner">
          <p>⚠️ {error} Showing demo data.</p>
        </div>
      )}
      
      <header className="header">
        <div className="brand">
          <span className="established">ESTD 1989</span>
          <h1>POSITIVE | NED</h1>
        </div>
      </header>

      <main className="main-grid">
        <ProductShowcase product={selectedProduct} />
        
        <OrderForm 
          selectedSize={selectedSize}
          shippingMethod={shippingMethod}
          setShippingMethod={setShippingMethod}
          total={total}
        />
        
        <OrderSummary 
          product={selectedProduct}
          subtotal={subtotal}
          shippingCost={shippingCost}
          total={total}
          shippingMethod={shippingMethod}
        />
      </main>
    </div>
  );
}