// components/Admin/ProductManager.jsx
import { useState, useEffect } from 'react';

export default function ProductManager() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: [''],
    sizes: ['M', 'L', 'XL', '2XL'],
    images: ['']
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const response = await fetch('/api/products');
    const data = await response.json();
    setProducts(data.products || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseInt(formData.price),
      features: formData.features.filter(f => f.trim() !== '')
    };

    const url = editingProduct ? `/api/products` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';
    const body = editingProduct 
      ? { id: editingProduct.id, ...productData }
      : productData;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (response.ok) {
      await loadProducts();
      setFormData({
        name: '', price: '', description: '', features: [''], sizes: [], images: ['']
      });
      setEditingProduct(null);
    }
  };

  const deleteProduct = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const response = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
      if (response.ok) await loadProducts();
    }
  };

  const editProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      features: product.features.length ? product.features : [''],
      sizes: product.sizes || [],
      images: product.images || ['']
    });
  };

  return (
    <div className="product-manager">
      <div className="form-section">
        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            required
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            required
          />
          <button type="submit">
            {editingProduct ? 'Update Product' : 'Add Product'}
          </button>
        </form>
      </div>

      <div className="products-list">
        <h2>Products ({products.length})</h2>
        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <h3>{product.name}</h3>
              <p>৳{product.price}</p>
              <p>{product.description}</p>
              <div className="product-actions">
                <button onClick={() => editProduct(product)}>Edit</button>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}