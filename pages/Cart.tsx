
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { toast } from "sonner";
import { Button } from '@/components/ui/button';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Add some items first.");
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container-custom">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Cart</h1>
          
          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingCart size={64} className="text-gray-300" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">
                You don't have any items in your cart yet. Browse our products and add some stamps to your cart.
              </p>
              <Link to="/products" className="btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="text-left p-4">Product</th>
                        <th className="text-center p-4">Quantity</th>
                        <th className="text-right p-4">Price</th>
                        <th className="text-right p-4">Total</th>
                        <th className="text-right p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={`${item.productId}-${item.customText}`} className="border-b">
                          <td className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="w-16 h-16 bg-gray-100 flex-shrink-0 rounded overflow-hidden">
                                {item.previewImage ? (
                                  <img src={item.previewImage} alt="Custom Stamp Preview" className="w-full h-full object-cover" />
                                ) : (
                                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-contain" />
                                )}
                              </div>
                              <div>
                                <h3 className="font-medium">{item.product.name}</h3>
                                <p className="text-sm text-gray-600">
                                  {item.product.size} • {item.inkColor} ink
                                </p>
                                {item.customText && (
                                  <p className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                    Custom text: {item.customText}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                className="p-1 border rounded-l-md hover:bg-gray-100"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="w-10 text-center border-t border-b py-1">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                className="p-1 border rounded-r-md hover:bg-gray-100"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            {item.product.price} DHS
                          </td>
                          <td className="p-4 text-right font-medium">
                            {item.product.price * item.quantity} DHS
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => removeFromCart(item.productId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <Link to="/products" className="text-brand-blue hover:underline">
                    ← Continue Shopping
                  </Link>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>{cartTotal} DHS</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-green-600">Calculated at checkout</span>
                    </div>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Estimated Total</span>
                    <span>{cartTotal} DHS</span>
                  </div>
                  
                  <div className="mt-6">
                    <Button 
                      className="w-full py-6 text-base font-medium"
                      onClick={handleProceedToCheckout}
                    >
                      Proceed to Checkout
                    </Button>
                    <p className="text-center text-sm text-gray-500 mt-4">
                      Secure checkout powered by our payment partner
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cart;
