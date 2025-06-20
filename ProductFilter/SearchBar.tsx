
import React, { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { useIsMobile } from '@/hooks/use-mobile';
import { Search, X } from 'lucide-react';
import { Product } from '@/types';

interface SearchBarProps {
  products: Product[];
  onSearch: (query: string) => void;
  onProductSelect: (productId: string) => void;
  placeholder?: string; // Added optional placeholder prop
}

const SearchBar = ({ products, onSearch, onProductSelect, placeholder }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        if (!open && inputRef.current) {
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  const filteredProducts = query
    ? products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase()) ||
        product.model.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  // Default placeholder text if none provided
  const defaultPlaceholder = `Search stamps${!isMobile ? " (Ctrl+K)" : ""}`;

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          ref={inputRef}
          placeholder={placeholder || defaultPlaceholder}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-9 pr-9"
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && query && (
        <Command className="absolute top-full mt-1 w-full z-50 rounded-md border shadow-md bg-white">
          <CommandInput placeholder="Search products..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Products">
              {filteredProducts.slice(0, 5).map((product) => (
                <CommandItem
                  key={product.id}
                  value={product.id}
                  onSelect={() => {
                    onProductSelect(product.id);
                    setQuery('');
                    setOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    {product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-8 h-8 object-contain"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.brand} - {product.price} MAD</p>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      )}
    </div>
  );
};

export default SearchBar;
