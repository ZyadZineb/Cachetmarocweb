
import React, { useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { CheckCircle2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  days: string;
}

interface ShippingFormProps {
  shippingMethods: ShippingMethod[];
  onContinue: () => void;
}

const ShippingForm: React.FC<ShippingFormProps> = ({ shippingMethods, onContinue }) => {
  const { register, formState: { errors }, setValue, trigger, watch } = useFormContext();
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addressRef = useRef<HTMLDivElement>(null);
  
  // Watch the shipping method selection
  const selectedShippingMethod = watch('shippingMethod');

  // Mock address autocomplete function (would be replaced with a real geocoding service)
  const getAddressSuggestions = (input: string) => {
    if (input.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    
    // Mock suggestions based on input
    // In a real implementation, this would call a geocoding API
    const mockSuggestions = [
      `${input}, Main St, Anytown, NY, 10001`,
      `${input}, Broadway, New York, NY, 10012`,
      `${input}, Park Ave, Boston, MA, 02108`,
    ];
    
    setAddressSuggestions(mockSuggestions);
    setShowSuggestions(true);
  };

  const selectAddress = (address: string) => {
    setValue('address', address);
    setShowSuggestions(false);
    
    // Extract city, state, postal code from the selected address
    const parts = address.split(', ');
    if (parts.length >= 4) {
      setValue('city', parts[2]);
      const stateZip = parts[3].split(' ');
      if (stateZip.length >= 1) {
        setValue('state', stateZip[0]);
      }
      if (stateZip.length >= 2) {
        setValue('postalCode', stateZip[1]);
      }
    }
    
    // Set a default country
    setValue('country', 'Morocco');
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressRef.current && !addressRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleContinue = async () => {
    const isValid = await trigger([
      'fullName', 'email', 'phone', 'address', 'city', 'state', 'postalCode', 'country', 'shippingMethod'
    ]);
    
    if (isValid) {
      onContinue();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="fullName" className={errors.fullName ? "text-destructive" : ""}>
              Full Name*
            </Label>
            <Input
              id="fullName"
              {...register('fullName')}
              className={errors.fullName ? "border-destructive" : ""}
            />
            {errors.fullName && (
              <p className="text-destructive text-sm mt-1">{errors.fullName.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="email" className={errors.email ? "text-destructive" : ""}>
              Email Address*
            </Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-destructive text-sm mt-1">{errors.email.message as string}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="phone" className={errors.phone ? "text-destructive" : ""}>
            Phone Number*
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && (
            <p className="text-destructive text-sm mt-1">{errors.phone.message as string}</p>
          )}
        </div>
        
        <div ref={addressRef} className="relative">
          <Label htmlFor="address" className={errors.address ? "text-destructive" : ""}>
            Street Address*
          </Label>
          <Input
            id="address"
            {...register('address')}
            className={errors.address ? "border-destructive" : ""}
            onChange={(e) => getAddressSuggestions(e.target.value)}
            autoComplete="off"
          />
          {errors.address && (
            <p className="text-destructive text-sm mt-1">{errors.address.message as string}</p>
          )}
          
          {showSuggestions && addressSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {addressSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => selectAddress(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="city" className={errors.city ? "text-destructive" : ""}>
              City*
            </Label>
            <Input
              id="city"
              {...register('city')}
              className={errors.city ? "border-destructive" : ""}
            />
            {errors.city && (
              <p className="text-destructive text-sm mt-1">{errors.city.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="state" className={errors.state ? "text-destructive" : ""}>
              State/Province*
            </Label>
            <Input
              id="state"
              {...register('state')}
              className={errors.state ? "border-destructive" : ""}
            />
            {errors.state && (
              <p className="text-destructive text-sm mt-1">{errors.state.message as string}</p>
            )}
          </div>
          
          <div>
            <Label htmlFor="postalCode" className={errors.postalCode ? "text-destructive" : ""}>
              Postal Code*
            </Label>
            <Input
              id="postalCode"
              {...register('postalCode')}
              className={errors.postalCode ? "border-destructive" : ""}
            />
            {errors.postalCode && (
              <p className="text-destructive text-sm mt-1">{errors.postalCode.message as string}</p>
            )}
          </div>
        </div>
        
        <div>
          <Label htmlFor="country" className={errors.country ? "text-destructive" : ""}>
            Country*
          </Label>
          <Input
            id="country"
            {...register('country')}
            defaultValue="Morocco"
            className={errors.country ? "border-destructive" : ""}
          />
          {errors.country && (
            <p className="text-destructive text-sm mt-1">{errors.country.message as string}</p>
          )}
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Shipping Method</h3>
        
        <RadioGroup defaultValue="standard" className="space-y-3" value={selectedShippingMethod} onValueChange={(value) => setValue('shippingMethod', value)}>
          {shippingMethods.map((method) => (
            <div key={method.id} className={`flex items-start p-3 rounded-md border ${selectedShippingMethod === method.id ? 'border-brand-blue bg-brand-blue/5' : 'border-gray-200'}`}>
              <RadioGroupItem value={method.id} id={`shipping-${method.id}`} className="mt-1" />
              <Label htmlFor={`shipping-${method.id}`} className="flex flex-1 justify-between ml-3 cursor-pointer">
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-gray-500">{method.days}</p>
                </div>
                <p className="font-medium">{method.price.toFixed(2)} DHS</p>
              </Label>
              {selectedShippingMethod === method.id && (
                <CheckCircle2 className="h-5 w-5 text-brand-blue ml-2" />
              )}
            </div>
          ))}
        </RadioGroup>
        
        {errors.shippingMethod && (
          <p className="text-destructive text-sm mt-2">{errors.shippingMethod.message as string}</p>
        )}
      </div>
      
      <div className="mt-8 flex justify-end">
        <Button onClick={handleContinue} className="px-8">
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};

export default ShippingForm;
