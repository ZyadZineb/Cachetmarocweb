
import React, { useEffect } from 'react';
import { Product } from '@/types';
import StampDesignerSimplified from './StampDesignerSimplified';
import { toast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';
import { trackEvent } from '@/utils/analytics';

interface StampDesignerProps {
  product: Product | null;
  onAddToCart?: () => void;
  highContrast?: boolean;
  largeControls?: boolean;
}

// This is a wrapper component that maintains the same API but uses the new simplified implementation
const StampDesigner: React.FC<StampDesignerProps> = ({ 
  product, 
  onAddToCart,
  highContrast = false,
  largeControls = false
}) => {
  const { t } = useTranslation();

  // Display a welcome toast when the component mounts and track page view
  useEffect(() => {
    if (product) {
      toast({
        title: t('design.welcome', "Welcome to the Stamp Designer"),
        description: t('design.designIntro', "Create your professional stamp in a few simple steps"),
      });
      
      // Track the design session start
      trackEvent('stamp_design', 'session_start', product.id);
      
      console.log('StampDesigner initialized with product:', product.name);
    }
  }, [product, t]);

  if (!product) {
    return (
      <div className="p-8 text-center bg-white rounded-lg">
        <p className="text-gray-500">Please select a product to start designing your stamp.</p>
      </div>
    );
  }

  return (
    <StampDesignerSimplified 
      product={product} 
      onAddToCart={onAddToCart} 
      highContrast={highContrast}
      largeControls={largeControls}
    />
  );
};

export default StampDesigner;
