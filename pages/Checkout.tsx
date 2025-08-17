
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '../contexts/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CheckoutStepper from '../components/Checkout/CheckoutStepper';
import ShippingForm from '../components/Checkout/ShippingForm';
import BillingForm from '../components/Checkout/BillingForm';
import ReviewOrder from '../components/Checkout/ReviewOrder';
import OrderSummary from '../components/Checkout/OrderSummary';
import { toast } from "sonner";

// Define the schema for our form
const checkoutSchema = z.object({
  // Shipping info
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  postalCode: z.string().min(5, 'Valid postal code is required'),
  country: z.string().min(2, 'Country is required'),
  // Billing info (can be same as shipping)
  sameAsShipping: z.boolean().optional(),
  billingFullName: z.string().optional(),
  billingAddress: z.string().optional(),
  billingCity: z.string().optional(),
  billingState: z.string().optional(),
  billingPostalCode: z.string().optional(),
  billingCountry: z.string().optional(),
  // Shipping method
  shippingMethod: z.enum(['standard', 'express', 'overnight']),
  // Payment method
  paymentMethod: z.enum(['credit_card', 'paypal', 'bank_transfer']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCVC: z.string().optional(),
  cardholderName: z.string().optional(),
});

type CheckoutData = z.infer<typeof checkoutSchema>;

const shippingMethods = [
  { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7 business days' },
  { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3 business days' },
  { id: 'overnight', name: 'Overnight Shipping', price: 19.99, days: '1 business day' }
];

const Checkout = () => {
  const [step, setStep] = useState(1);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Initialize form with React Hook Form and zod validation
  const methods = useForm<CheckoutData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      shippingMethod: 'standard',
      paymentMethod: 'credit_card',
      sameAsShipping: true,
    },
  });

  // Check if cart is empty and redirect to cart page if it is
  useEffect(() => {
    if (cartItems.length === 0 && !orderConfirmed) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderConfirmed]);

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleFormSubmit = async (data: CheckoutData) => {
    console.log('Form submitted:', data);
    try {
      // Generate a random order ID (in a real app, this would come from the backend)
      const newOrderId = `ORD-${Math.floor(Math.random() * 10000000)}`;
      setOrderId(newOrderId);
      
      // Simulate API call for order processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Send confirmation email (this would be handled by a backend service)
      console.log('Sending confirmation email to:', data.email);
      
      // Clear the cart and set order as confirmed
      clearCart();
      setOrderConfirmed(true);
      toast.success("Order placed successfully!");
      
      // Redirect to the confirmation page
      navigate('/order-confirmation', { 
        state: { 
          order: {
            id: newOrderId,
            customerName: data.fullName,
            email: data.email,
            shippingAddress: `${data.address}, ${data.city}, ${data.state} ${data.postalCode}, ${data.country}`,
            shippingMethod: shippingMethods.find(m => m.id === data.shippingMethod),
            paymentMethod: data.paymentMethod,
            items: cartItems,
            subtotal: cartTotal,
            shipping: shippingMethods.find(m => m.id === data.shippingMethod)?.price || 0,
            total: cartTotal + (shippingMethods.find(m => m.id === data.shippingMethod)?.price || 0),
            date: new Date().toISOString(),
          } 
        } 
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error("There was a problem placing your order. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Checkout</h1>
          
          <CheckoutStepper currentStep={step} />
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
                  {step === 1 && (
                    <ShippingForm shippingMethods={shippingMethods} onContinue={nextStep} />
                  )}
                  
                  {step === 2 && (
                    <BillingForm 
                      onBack={prevStep} 
                      onContinue={nextStep}
                    />
                  )}
                  
                  {step === 3 && (
                    <ReviewOrder 
                      onBack={prevStep}
                      shippingMethods={shippingMethods}
                    />
                  )}
                </form>
              </FormProvider>
            </div>
            
            <div className="lg:col-span-1">
              <OrderSummary 
                items={cartItems}
                subtotal={cartTotal}
                shippingMethodId={methods.watch('shippingMethod')}
                shippingMethods={shippingMethods}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
