
import React from 'react';
import { CartItem } from '../../types';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  days: string;
}

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingMethodId: string;
  shippingMethods: ShippingMethod[];
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shippingMethodId,
  shippingMethods
}) => {
  // Get selected shipping method
  const selectedShippingMethod = shippingMethods.find(method => method.id === shippingMethodId);
  const shippingPrice = selectedShippingMethod?.price || 0;
  
  // Calculate total
  const total = subtotal + shippingPrice;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      
      <div className="max-h-80 overflow-y-auto mb-4">
        {items.map((item) => (
          <div key={`${item.productId}-${item.customText}`} className="flex items-start py-3 border-b">
            <div className="w-16 h-16 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
              {item.previewImage ? (
                <img src={item.previewImage} alt="Custom Stamp Preview" className="w-full h-full object-cover" />
              ) : (
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
              )}
            </div>
            <div className="ml-3 flex-grow">
              <p className="font-medium text-sm">{item.product.name}</p>
              <p className="text-xs text-gray-500">
                {item.product.size} • {item.inkColor} ink
              </p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm font-medium">{(item.product.price * item.quantity).toFixed(2)} DHS</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-2 py-4 border-b">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>{subtotal.toFixed(2)} DHS</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>
            {shippingPrice > 0 ? `${shippingPrice.toFixed(2)} DHS` : 'Free'}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between py-4 font-bold text-lg">
        <span>Total</span>
        <span>{total.toFixed(2)} DHS</span>
      </div>
    </div>
  );
};

export default OrderSummary;
