
import React from 'react';
import { CartItem } from '../../types';

interface OrderDetails {
  id: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  shippingMethod: {
    name: string;
    price: number;
    days: string;
  };
  paymentMethod: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  date: string;
}

interface EmailTemplateProps {
  order: OrderDetails;
}

// This component is for demonstration purposes only
// In a real app, this would be an HTML email template on the server
const EmailTemplate: React.FC<EmailTemplateProps> = ({ order }) => {
  const formattedDate = new Date(order.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const paymentMethodLabels: Record<string, string> = {
    credit_card: 'Credit Card',
    paypal: 'PayPal',
    bank_transfer: 'Bank Transfer'
  };
  
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ backgroundColor: '#f8f8f8', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ color: '#d32f2f', margin: '0' }}>Cachets Maroc</h1>
        <p style={{ color: '#555' }}>Your order has been confirmed!</p>
      </div>
      
      <div style={{ padding: '20px' }}>
        <h2>Hello {order.customerName},</h2>
        <p>Thank you for your order. We're getting everything ready for you!</p>
        
        <div style={{ backgroundColor: '#f8f8f8', padding: '15px', borderRadius: '5px', marginBottom: '20px' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Order Summary</h3>
          <p><strong>Order Number:</strong> {order.id}</p>
          <p><strong>Order Date:</strong> {formattedDate}</p>
          <p><strong>Payment Method:</strong> {paymentMethodLabels[order.paymentMethod]}</p>
        </div>
        
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #ddd' }}>Product</th>
              <th style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #ddd' }}>Qty</th>
              <th style={{ textAlign: 'right', padding: '10px', borderBottom: '1px solid #ddd' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <strong>{item.product.name}</strong><br />
                  <span style={{ color: '#777', fontSize: '14px' }}>
                    {item.product.size} • {item.inkColor} ink
                  </span>
                  {item.customText && (
                    <div style={{ fontSize: '14px', color: '#777' }}>Custom text: {item.customText}</div>
                  )}
                </td>
                <td style={{ textAlign: 'center', padding: '10px', borderBottom: '1px solid #eee' }}>
                  {item.quantity}
                </td>
                <td style={{ textAlign: 'right', padding: '10px', borderBottom: '1px solid #eee' }}>
                  {(item.product.price * item.quantity).toFixed(2)} DHS
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <p><strong>Subtotal:</strong> {order.subtotal.toFixed(2)} DHS</p>
          <p><strong>Shipping ({order.shippingMethod.name}):</strong> {order.shipping.toFixed(2)} DHS</p>
          <p style={{ fontSize: '18px' }}><strong>Total:</strong> {order.total.toFixed(2)} DHS</p>
        </div>
        
        <div style={{ margin: '30px 0', padding: '15px', backgroundColor: '#f0f7ff', borderRadius: '5px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#0056b3' }}>Shipping Details</h3>
          <p><strong>Address:</strong> {order.shippingAddress}</p>
          <p><strong>Shipping Method:</strong> {order.shippingMethod.name} ({order.shippingMethod.days})</p>
        </div>
        
        <p>
          If you have any questions or concerns about your order, please don't hesitate to 
          <a href="mailto:support@cachets-maroc.com" style={{ color: '#d32f2f' }}> contact our customer service team</a>.
        </p>
      </div>
      
      <div style={{ backgroundColor: '#333', color: '#fff', padding: '20px', textAlign: 'center' }}>
        <p>© 2025 Cachets Maroc. All rights reserved.</p>
        <p style={{ fontSize: '14px' }}>
          <a href="#" style={{ color: '#fff', marginRight: '10px' }}>Privacy Policy</a>
          <a href="#" style={{ color: '#fff', marginRight: '10px' }}>Terms of Service</a>
          <a href="#" style={{ color: '#fff' }}>Contact Us</a>
        </p>
      </div>
    </div>
  );
};

export default EmailTemplate;
