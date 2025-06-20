
import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Check, Package, Mail, Truck, ArrowDown } from 'lucide-react';
import { CartItem } from '../types';

interface OrderData {
  id: string;
  customerName: string;
  email: string;
  shippingAddress: string;
  shippingMethod: {
    id: string;
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

interface LocationState {
  order: OrderData;
}

const OrderConfirmation = () => {
  const location = useLocation();
  const state = location.state as LocationState;
  
  if (!state || !state.order) {
    // Redirect to home if no order data is available
    return <Navigate to="/" />;
  }
  
  const { order } = state;
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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800">Order Confirmed!</h1>
              <p className="text-gray-600 mt-2">
                Thank you for your order. We've sent a confirmation email to {order.email}.
              </p>
            </div>
            
            <div className="border-t border-b py-4 mb-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <div>
                  <p className="text-sm text-gray-500">Order Number</p>
                  <p className="font-medium">{order.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{formattedDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">{order.total.toFixed(2)} DHS</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Payment Method</p>
                  <p className="font-medium">{paymentMethodLabels[order.paymentMethod]}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              {order.items.map((item) => (
                <div key={`${item.productId}-${item.customText}`} className="flex items-start py-4 border-b">
                  <div className="w-16 h-16 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                    {item.previewImage ? (
                      <img src={item.previewImage} alt="Custom Stamp Preview" className="w-full h-full object-cover" />
                    ) : (
                      <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                    )}
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{item.product.name}</h3>
                    <p className="text-sm text-gray-600">
                      {item.product.size} • {item.inkColor} ink • Qty: {item.quantity}
                    </p>
                    {item.customText && (
                      <p className="text-xs text-gray-500 mt-1">
                        Custom text: {item.customText}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{(item.product.price * item.quantity).toFixed(2)} DHS</p>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{order.subtotal.toFixed(2)} DHS</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping ({order.shippingMethod.name})</span>
                  <span>{order.shipping.toFixed(2)} DHS</span>
                </div>
                <div className="flex justify-between font-medium text-lg pt-2 border-t">
                  <span>Total</span>
                  <span>{order.total.toFixed(2)} DHS</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium">Shipping Information</h3>
                </div>
                <p className="text-gray-700">{order.customerName}</p>
                <p className="text-gray-600 text-sm whitespace-pre-line">
                  {order.shippingAddress.split(', ').join('\n')}
                </p>
              </div>
              
              <div className="border rounded-md p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-5 h-5 text-gray-600" />
                  <h3 className="font-medium">Delivery Details</h3>
                </div>
                <p className="text-gray-700">{order.shippingMethod.name}</p>
                <p className="text-gray-600 text-sm">{order.shippingMethod.days}</p>
                <p className="text-sm text-gray-500 mt-1">
                  We'll send you shipping confirmation when your order ships.
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                If you have any questions about your order, please contact our customer service.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/" className="btn-primary">
                  Continue Shopping
                </Link>
                <Link to="/contact" className="btn-outline">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
          
          <div className="bg-brand-blue/10 rounded-lg p-6 flex items-center">
            <Mail className="w-10 h-10 text-brand-blue mr-4 flex-shrink-0" />
            <div>
              <h3 className="font-medium mb-1">Order Confirmation Email</h3>
              <p className="text-sm text-gray-600">
                We've sent a confirmation email to {order.email} with all your order details.
                If you don't see it in your inbox, please check your spam folder.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default OrderConfirmation;
