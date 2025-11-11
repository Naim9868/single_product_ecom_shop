// components/ProductShowcase.jsx
export default function ProductShowcase({ product }) {
  // Ensure features array exists with fallback
  const features = product?.features || [
    "Comfortable and premium fabric",
    "Casual style perfect for summer", 
    "Available in multiple sizes"
  ];

  return (
    <section className="product-showcase">
      <div className="product-image">
        {/* Replace with your actual image */}
        <div className="image-placeholder">
          <span>T-Shirt Image</span>
        </div>
      </div>
      
      <div className="product-info">
        <h1>{product?.name || "Premium T-Shirt Package"}</h1>
        <p className="price">৳{product?.price || 990}</p>
        <p className="description">{product?.description || "Summer Collection - Premium Quality Fabric"}</p>
        
        <div className="features">
          <h3>Product Features:</h3>
          <ul>
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}