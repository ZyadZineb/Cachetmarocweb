
import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types';

export interface FilterState {
  searchQuery: string;
  priceRange: [number, number];
  selectedBrands: string[];
  selectedShape: string | null;
  selectedSizes: string[];
  selectedLines: number | null;
  selectedColors: string[];
  sortOption: string;
  minPrice: number;
  maxPrice: number;
}

interface UseProductFilterOptions {
  products: Product[];
  initialFilters?: Partial<FilterState>;
  storageKey?: string;
}

interface SizeGroup {
  name: string;
  sizes: string[];
}

export const useProductFilter = ({
  products,
  initialFilters = {},
  storageKey = 'stampShopFilters',
}: UseProductFilterOptions) => {
  // Calculate min and max prices
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = products.map(p => p.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [products]);

  // Initialize filters with defaults or localStorage values
  const [filters, setFilters] = useState<FilterState>(() => {
    // Try to get saved filters from localStorage
    if (typeof window !== 'undefined') {
      const savedFilters = localStorage.getItem(storageKey);
      if (savedFilters) {
        try {
          const parsed = JSON.parse(savedFilters);
          return {
            ...parsed,
            // Ensure price range is within current min/max
            priceRange: [
              Math.max(parsed.priceRange[0], minPrice),
              Math.min(parsed.priceRange[1], maxPrice),
            ],
          };
        } catch (e) {
          console.error('Error parsing saved filters', e);
        }
      }
    }

    // Default filters
    return {
      searchQuery: '',
      priceRange: [minPrice, maxPrice],
      selectedBrands: [],
      selectedShape: null,
      selectedSizes: [],
      selectedLines: null,
      selectedColors: [],
      sortOption: 'featured',
      minPrice,
      maxPrice,
      ...initialFilters,
    };
  });

  // Filter active count (for mobile indicator)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.searchQuery) count++;
    if (filters.selectedBrands.length) count++;
    if (filters.selectedShape) count++;
    if (filters.selectedSizes.length) count++;
    if (filters.selectedLines) count++;
    if (filters.selectedColors.length) count++;
    if (filters.priceRange[0] > minPrice || filters.priceRange[1] < maxPrice) count++;
    return count;
  }, [filters, minPrice, maxPrice]);

  // Extract available filter options from products
  const brands = useMemo(() => 
    Array.from(new Set(products.map(product => product.brand))).sort(),
  [products]);
  
  const sizeGroups = useMemo<SizeGroup[]>(() => {
    const sizes = products.map(p => p.size);
    
    // Group sizes by type (round vs rectangular)
    const roundSizes = sizes
      .filter(size => size.includes('mm') && !size.includes('x'))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
      
    const rectangularSizes = sizes
      .filter(size => size.includes('x'))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort();
    
    return [
      { name: 'Round', sizes: roundSizes },
      { name: 'Rectangular', sizes: rectangularSizes },
    ];
  }, [products]);
  
  const colorOptions = useMemo(() => [
    { id: 'blue', name: 'Blue', hex: '#0066cc' },
    { id: 'red', name: 'Red', hex: '#cc0000' },
    { id: 'black', name: 'Black', hex: '#000000' },
  ], []);
  
  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
  ];
  
  // Save filters to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(filters));
    }
  }, [filters, storageKey]);

  // List of products for comparison
  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  // Update filters
  const updateFilter = <K extends keyof FilterState>(
    filterKey: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value,
    }));
  };

  // Remove specific filter
  const removeFilter = (filterType: string, value?: string | number) => {
    setFilters(prev => {
      const updated = { ...prev };
      
      switch (filterType) {
        case 'searchQuery':
          updated.searchQuery = '';
          break;
        case 'priceRange':
          updated.priceRange = [minPrice, maxPrice];
          break;
        case 'shape':
          updated.selectedShape = null;
          break;
        case 'lines':
          updated.selectedLines = null;
          break;
        case 'brand':
          if (value) {
            updated.selectedBrands = prev.selectedBrands.filter(b => b !== value);
          }
          break;
        case 'color':
          if (value) {
            updated.selectedColors = prev.selectedColors.filter(c => c !== value);
          }
          break;
        case 'size':
          if (value) {
            updated.selectedSizes = prev.selectedSizes.filter(s => s !== value);
          }
          break;
        default:
          break;
      }
      
      return updated;
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      searchQuery: '',
      priceRange: [minPrice, maxPrice],
      selectedBrands: [],
      selectedShape: null,
      selectedSizes: [],
      selectedLines: null,
      selectedColors: [],
      sortOption: 'featured',
      minPrice,
      maxPrice,
    });
  };

  // Toggle product comparison
  const toggleProductComparison = (product: Product) => {
    setCompareProducts(prev => {
      const isSelected = prev.some(p => p.id === product.id);
      
      if (isSelected) {
        return prev.filter(p => p.id === product.id);
      } else if (prev.length < 3) {
        return [...prev, product];
      }
      
      return prev;
    });
  };

  // Remove product from comparison
  const removeProductFromComparison = (productId: string) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  // Clear all products from comparison
  const clearProductComparison = () => {
    setCompareProducts([]);
  };

  // Apply filters and sort to products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Filter by search query
      if (filters.searchQuery && 
          !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !product.brand.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
          !product.model.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
      
      // Filter by price range
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }
      
      // Filter by brand
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(product.brand)) {
        return false;
      }
      
      // Filter by shape
      if (filters.selectedShape && product.shape !== filters.selectedShape) {
        return false;
      }
      
      // Filter by size
      if (filters.selectedSizes.length > 0 && !filters.selectedSizes.includes(product.size)) {
        return false;
      }
      
      // Filter by text lines
      if (filters.selectedLines) {
        if (filters.selectedLines === 2 && product.lines > 2) return false;
        if (filters.selectedLines === 4 && (product.lines < 3 || product.lines > 4)) return false;
        if (filters.selectedLines === 5 && product.lines < 5) return false;
      }
      
      // Filter by ink colors
      if (filters.selectedColors.length > 0) {
        const hasSelectedColor = filters.selectedColors.some(color => 
          product.inkColors.includes(color)
        );
        if (!hasSelectedColor) return false;
      }
      
      return true;
    }).sort((a, b) => {
      // Sort products
      switch (filters.sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          // Featured sort - prioritize featured products
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
      }
    });
  }, [products, filters]);

  return {
    filters,
    updateFilter,
    filteredProducts,
    brands,
    sizeGroups,
    colorOptions,
    sortOptions,
    compareProducts,
    toggleProductComparison,
    removeProductFromComparison,
    clearProductComparison,
    removeFilter,
    clearAllFilters,
    activeFilterCount,
  };
};
