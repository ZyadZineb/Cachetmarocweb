
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  isSelectionMode?: boolean;
  isSelected?: boolean;
  onSelectForComparison?: () => void;
  maxSelectableProducts?: number;
}

const ProductCard = ({ 
  product, 
  isSelectionMode = false, 
  isSelected = false, 
  onSelectForComparison,
  maxSelectableProducts = 3 
}: ProductCardProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (isSelectionMode && onSelectForComparison) {
      onSelectForComparison();
    } else {
      navigate(`/design?productId=${product.id}`);
    }
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onSelectForComparison) {
      onSelectForComparison();
    }
  };

  return (
    <Card 
      className={`overflow-hidden transition-all duration-200 hover:shadow-md cursor-pointer ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="relative pt-[100%]">
        {product.images && product.images.length > 0 && (
          <img
            src={product.images[0]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4"
          />
        )}
        
        {isSelectionMode && (
          <div 
            className="absolute top-2 right-2 bg-white rounded-full shadow-sm"
            onClick={handleCompareClick}
          >
            <Checkbox 
              checked={isSelected} 
              className="h-5 w-5"
              onCheckedChange={() => {}}
            />
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="mb-2">
          <p className="text-sm text-gray-500">{product.brand}</p>
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-gray-700 text-xl font-medium">{product.price} MAD</p>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
            {product.size}
          </span>
          <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
            {product.lines} lines
          </span>
          {product.shape && (
            <span className="text-xs bg-gray-100 rounded-full px-2 py-1">
              {product.shape}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
