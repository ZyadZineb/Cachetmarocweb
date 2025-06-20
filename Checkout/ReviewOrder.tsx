
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  days: string;
}

interface ReviewOrderProps {
  onBack: () => void;
  shippingMethods: ShippingMethod[];
}

const ReviewOrder: React.FC<ReviewOrderProps> = ({ onBack, shippingMethods }) => {
  const { watch, formState: { isSubmitting } } = useFormContext();
  
  // Get form data
  const formData = watch();
  const {
    fullName,
    email,
    phone,
    address,
    city,
    state,
    postalCode,
    country,
    sameAsShipping,
    billingFullName,
    billingAddress,
    billingCity,
    billingState,
    billingPostalCode,
    billingCountry,
    shippingMethod,
    paymentMethod,
  } = formData;
  
  // Get shipping method details
  const selectedShippingMethod = shippingMethods.find(method => method.id === shippingMethod);
  
  // Format payment method for display
  const paymentMethodLabels: Record<string, string> = {
    credit_card: 'Credit Card',
    paypal: 'PayPal',
    bank_transfer: 'Bank Transfer'
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Review Your Order</h2>
      
      <div className="space-y-8">
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg">Shipping Information</h3>
            <button
              type="button"
              onClick={() => onBack()}
              className="text-sm text-brand-blue hover:underline"
            >
              Edit
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-medium">{fullName}</p>
              <p>{address}</p>
              <p>{city}, {state} {postalCode}</p>
              <p>{country}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Phone:</span> {phone}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <span className="font-medium mr-2">Shipping Method:</span>
                <span className="flex items-center">
                  {selectedShippingMethod?.name} ({selectedShippingMethod?.days})
                  <span className="text-brand-blue font-medium ml-2">{selectedShippingMethod?.price.toFixed(2)} DHS</span>
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-lg">Billing Information</h3>
            <button
              type="button"
              onClick={() => onBack()}
              className="text-sm text-brand-blue hover:underline"
            >
              Edit
            </button>
          </div>
          
          {sameAsShipping ? (
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              Same as shipping address
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="font-medium">{billingFullName}</p>
                <p>{billingAddress}</p>
                <p>{billingCity}, {billingState} {billingPostalCode}</p>
                <p>{billingCountry}</p>
              </div>
            </div>
          )}
          
          <div className="mt-4 flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Payment Method:</span>
            <span>{paymentMethodLabels[paymentMethod]}</span>
            {paymentMethod === 'credit_card' && (
              <span className="ml-2">•••• •••• •••• {formData.cardNumber?.split(' ').pop()}</span>
            )}
          </div>
        </div>
        
        <div className="mt-8">
          <div className="text-sm text-gray-600 mb-4">
            By placing your order, you agree to our Terms of Service and Privacy Policy. 
            You will be redirected to complete your payment.
          </div>
          
          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              Back to Payment
            </Button>
            <Button type="submit" className="px-8" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Place Order'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewOrder;
