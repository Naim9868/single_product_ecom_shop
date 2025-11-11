// components/OrderSummary.jsx
export default function OrderSummary({ subtotal, shippingCost, total, shippingMethod }) {
  return (
    <div className="order-summary">
      <h3>Your Order</h3>
      
      <div className="summary-details">
        <div className="summary-row">
          <span>Product</span>
          <span>Full sleeve 3 pcs package × 1</span>
        </div>
        
        <div className="summary-row">
          <span>Subtotal</span>
          <span>৳{subtotal}.00</span>
        </div>
        
        <div className="summary-row">
          <span>Shipping</span>
          <span>
            {shippingMethod === 'inside-dhaka' ? 'Inside' : 'Outside'} Dhaka: ৳{shippingCost}.00
          </span>
        </div>
        
        <div className="summary-row total">
          <span>Total</span>
          <span>৳{total}.00</span>
        </div>
      </div>

      <div className="payment-method">
        <p>Cash on Delivery</p>
      </div>
    </div>
  );
}