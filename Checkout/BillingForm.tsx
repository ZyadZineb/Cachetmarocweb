
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { CheckCircle2, CreditCard } from 'lucide-react';

interface BillingFormProps {
  onBack: () => void;
  onContinue: () => void;
}

const BillingForm: React.FC<BillingFormProps> = ({ onBack, onContinue }) => {
  const { register, formState: { errors }, watch, setValue, trigger } = useFormContext();
  const sameAsShipping = watch('sameAsShipping');
  const paymentMethod = watch('paymentMethod');
  
  // Credit card form state (in a real implementation, you'd use a secure payment processor)
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };
  
  const handleSameAsShippingChange = (checked: boolean) => {
    setValue('sameAsShipping', checked);
    if (!checked) {
      // Clear billing fields when unchecked
      setValue('billingFullName', '');
      setValue('billingAddress', '');
      setValue('billingCity', '');
      setValue('billingState', '');
      setValue('billingPostalCode', '');
      setValue('billingCountry', '');
    }
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setValue('paymentMethod', value);
  };
  
  const handleContinue = async () => {
    // Validate billing info if not same as shipping
    let fieldsToValidate = ['paymentMethod'];
    
    if (paymentMethod === 'credit_card') {
      fieldsToValidate = [...fieldsToValidate, 'cardNumber', 'cardExpiry', 'cardCVC', 'cardholderName'];
      
      // Set credit card details for validation
      setValue('cardNumber', cardNumber);
      setValue('cardExpiry', expiry);
      setValue('cardCVC', cvc);
    }
    
    if (!sameAsShipping) {
      fieldsToValidate = [
        ...fieldsToValidate, 
        'billingFullName', 
        'billingAddress', 
        'billingCity', 
        'billingState', 
        'billingPostalCode', 
        'billingCountry'
      ];
    }
    
    const isValid = await trigger(fieldsToValidate);
    
    if (isValid) {
      onContinue();
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
      
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="sameAsShipping" 
            checked={sameAsShipping} 
            onCheckedChange={handleSameAsShippingChange} 
          />
          <Label htmlFor="sameAsShipping" className="cursor-pointer">
            Billing address same as shipping address
          </Label>
        </div>
        
        {!sameAsShipping && (
          <div className="mt-6 space-y-6">
            <div>
              <Label htmlFor="billingFullName" className={errors.billingFullName ? "text-destructive" : ""}>
                Full Name*
              </Label>
              <Input
                id="billingFullName"
                {...register('billingFullName')}
                className={errors.billingFullName ? "border-destructive" : ""}
              />
              {errors.billingFullName && (
                <p className="text-destructive text-sm mt-1">{errors.billingFullName.message as string}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="billingAddress" className={errors.billingAddress ? "text-destructive" : ""}>
                Street Address*
              </Label>
              <Input
                id="billingAddress"
                {...register('billingAddress')}
                className={errors.billingAddress ? "border-destructive" : ""}
              />
              {errors.billingAddress && (
                <p className="text-destructive text-sm mt-1">{errors.billingAddress.message as string}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="billingCity" className={errors.billingCity ? "text-destructive" : ""}>
                  City*
                </Label>
                <Input
                  id="billingCity"
                  {...register('billingCity')}
                  className={errors.billingCity ? "border-destructive" : ""}
                />
                {errors.billingCity && (
                  <p className="text-destructive text-sm mt-1">{errors.billingCity.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="billingState" className={errors.billingState ? "text-destructive" : ""}>
                  State/Province*
                </Label>
                <Input
                  id="billingState"
                  {...register('billingState')}
                  className={errors.billingState ? "border-destructive" : ""}
                />
                {errors.billingState && (
                  <p className="text-destructive text-sm mt-1">{errors.billingState.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="billingPostalCode" className={errors.billingPostalCode ? "text-destructive" : ""}>
                  Postal Code*
                </Label>
                <Input
                  id="billingPostalCode"
                  {...register('billingPostalCode')}
                  className={errors.billingPostalCode ? "border-destructive" : ""}
                />
                {errors.billingPostalCode && (
                  <p className="text-destructive text-sm mt-1">{errors.billingPostalCode.message as string}</p>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="billingCountry" className={errors.billingCountry ? "text-destructive" : ""}>
                Country*
              </Label>
              <Input
                id="billingCountry"
                {...register('billingCountry')}
                defaultValue="Morocco"
                className={errors.billingCountry ? "border-destructive" : ""}
              />
              {errors.billingCountry && (
                <p className="text-destructive text-sm mt-1">{errors.billingCountry.message as string}</p>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
        
        <RadioGroup 
          className="space-y-3" 
          value={paymentMethod} 
          onValueChange={handlePaymentMethodChange}
          defaultValue="credit_card"
        >
          <div className={`flex items-start p-3 rounded-md border ${paymentMethod === 'credit_card' ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200'}`}>
            <RadioGroupItem value="credit_card" id="payment-card" className="mt-1" />
            <Label htmlFor="payment-card" className="flex flex-1 ml-3 cursor-pointer">
              <div>
                <p className="font-medium">Credit Card</p>
                <p className="text-sm text-gray-500">Pay securely with your credit card</p>
              </div>
            </Label>
            {paymentMethod === 'credit_card' && (
              <CheckCircle2 className="h-5 w-5 text-brand-blue ml-2" />
            )}
          </div>
          
          <div className={`flex items-start p-3 rounded-md border ${paymentMethod === 'paypal' ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200'}`}>
            <RadioGroupItem value="paypal" id="payment-paypal" className="mt-1" />
            <Label htmlFor="payment-paypal" className="flex flex-1 ml-3 cursor-pointer">
              <div>
                <p className="font-medium">PayPal</p>
                <p className="text-sm text-gray-500">Pay using your PayPal account</p>
              </div>
            </Label>
            {paymentMethod === 'paypal' && (
              <CheckCircle2 className="h-5 w-5 text-brand-blue ml-2" />
            )}
          </div>
          
          <div className={`flex items-start p-3 rounded-md border ${paymentMethod === 'bank_transfer' ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200'}`}>
            <RadioGroupItem value="bank_transfer" id="payment-bank" className="mt-1" />
            <Label htmlFor="payment-bank" className="flex flex-1 ml-3 cursor-pointer">
              <div>
                <p className="font-medium">Bank Transfer</p>
                <p className="text-sm text-gray-500">Pay directly from your bank account</p>
              </div>
            </Label>
            {paymentMethod === 'bank_transfer' && (
              <CheckCircle2 className="h-5 w-5 text-brand-blue ml-2" />
            )}
          </div>
        </RadioGroup>
        
        {paymentMethod === 'credit_card' && (
          <div className="mt-6 p-5 border rounded-md">
            <div className="flex items-center mb-4">
              <CreditCard className="h-6 w-6 text-gray-500 mr-2" />
              <h4 className="font-medium">Credit Card Details</h4>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardholderName">Cardholder Name*</Label>
                <Input
                  id="cardholderName"
                  {...register('cardholderName')}
                  placeholder="Name as it appears on card"
                />
                {errors.cardholderName && (
                  <p className="text-destructive text-sm mt-1">{errors.cardholderName.message as string}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="cardNumber">Card Number*</Label>
                <Input
                  id="cardNumber"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date*</Label>
                  <Input
                    id="expiry"
                    value={expiry}
                    onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                
                <div>
                  <Label htmlFor="cvc">Security Code*</Label>
                  <Input
                    id="cvc"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))}
                    placeholder="CVC"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Shipping
        </Button>
        <Button onClick={handleContinue} className="px-8">
          Continue to Review
        </Button>
      </div>
    </div>
  );
};

export default BillingForm;
