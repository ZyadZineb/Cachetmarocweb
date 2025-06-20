
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface CompareProductsProps {
  selectedProducts: Product[];
  onRemoveProduct: (productId: string) => void;
  onClearAll: () => void;
  maxSelectableProducts?: number;
}

const CompareProducts = ({
  selectedProducts,
  onRemoveProduct,
  onClearAll,
  maxSelectableProducts = 3,
}: CompareProductsProps) => {
  const [open, setOpen] = useState(false);

  if (selectedProducts.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg py-2 px-4 z-40">
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm">
              Compare ({selectedProducts.length}/{maxSelectableProducts})
            </span>
            <div className="flex -space-x-2">
              {selectedProducts.map((product) => (
                <img
                  key={product.id}
                  src={product.images[0]}
                  alt={product.name}
                  className="w-8 h-8 rounded-full border border-white object-cover"
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onClearAll}
              className="text-xs"
            >
              Clear
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="text-xs">Compare</Button>
              </DialogTrigger>
              <DialogContent className="max-w-5xl w-[90%]">
                <DialogHeader>
                  <DialogTitle>Product Comparison</DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="text-left py-2 px-4 bg-gray-50">Feature</th>
                        {selectedProducts.map((product) => (
                          <th key={product.id} className="text-left py-2 px-4 bg-gray-50">
                            <div className="relative">
                              <button
                                onClick={() => {
                                  onRemoveProduct(product.id);
                                  if (selectedProducts.length <= 1) {
                                    setOpen(false);
                                  }
                                }}
                                className="absolute -top-2 -right-2 bg-gray-200 rounded-full p-0.5"
                              >
                                <X className="h-3 w-3" />
                              </button>
                              <div className="flex flex-col items-center space-y-1">
                                <img
                                  src={product.images[0]}
                                  alt={product.name}
                                  className="w-16 h-16 object-contain mb-2"
                                />
                                <span className="font-medium text-sm">{product.name}</span>
                              </div>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-t">Brand</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-2 px-4 border-t">
                            {product.brand}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-t">Model</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-2 px-4 border-t">
                            {product.model}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-t">Price</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-2 px-4 border-t font-medium">
                            {product.price} MAD
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-t">Size</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-2 px-4 border-t">
                            {product.size}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-t">Shape</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-2 px-4 border-t">
                            {product.shape ? product.shape.charAt(0).toUpperCase() + product.shape.slice(1) : 'N/A'}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-t">Text Lines</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-2 px-4 border-t">
                            {product.lines}
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-t">Available Colors</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-2 px-4 border-t">
                            <div className="flex flex-wrap gap-1">
                              {product.colors.map((color) => (
                                <span
                                  key={color}
                                  className="px-2 py-0.5 rounded-full text-xs bg-gray-100"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-t">Ink Colors</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-2 px-4 border-t">
                            <div className="flex flex-wrap gap-1">
                              {product.inkColors.map((color) => (
                                <span
                                  key={color}
                                  className="px-2 py-0.5 rounded-full text-xs bg-gray-100"
                                >
                                  {color}
                                </span>
                              ))}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-t">Description</td>
                        {selectedProducts.map((product) => (
                          <td key={product.id} className="py-2 px-4 border-t text-sm">
                            {product.description}
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompareProducts;
