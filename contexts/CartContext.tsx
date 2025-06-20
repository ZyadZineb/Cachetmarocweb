
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { toast } from "sonner";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, customText?: string, inkColor?: string, previewImage?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product, quantity = 1, customText?: string, inkColor?: string, previewImage?: string) => {
    const existingItem = cartItems.find(item => 
      item.productId === product.id && 
      item.customText === customText &&
      item.inkColor === inkColor
    );

    if (existingItem) {
      updateQuantity(product.id, existingItem.quantity + quantity);
      toast.success("Updated quantity in cart");
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: product.id,
          product: product,
          quantity,
          customText,
          inkColor: inkColor || product.inkColors[0],
          previewImage
        },
      ]);
      toast.success("Added to cart");
    }
  };

  const removeFromCart = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
    toast.success("Item removed from cart");
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(
      cartItems.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
    toast.success("Quantity updated");
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success("Cart cleared");
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  const itemCount = cartItems.reduce(
    (count, item) => count + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
