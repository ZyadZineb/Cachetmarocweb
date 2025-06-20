import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import { useProductFilter } from '../hooks/useProductFilter';
import PriceRangeSlider from '../components/ProductFilter/PriceRangeSlider';
import BrandFilter from '../components/ProductFilter/BrandFilter';
import ShapeFilter from '../components/ProductFilter/ShapeFilter';
import TextLinesFilter from '../components/ProductFilter/TextLinesFilter';
import ColorFilter from '../components/ProductFilter/ColorFilter';
import SearchBar from '../components/ProductFilter/SearchBar';
import SortSelector from '../components/ProductFilter/SortSelector';
import ActiveFilters from '../components/ProductFilter/ActiveFilters';
import CompareProducts from '../components/ProductFilter/CompareProducts';
import MobileFilterDrawer from '../components/ProductFilter/MobileFilterDrawer';
import SizeFilter from '../components/ProductFilter/SizeFilter';
import { useIsMobile } from '../hooks/use-mobile';
import { SlidersHorizontal } from 'lucide-react';
import { useMetaTags } from '../utils/seo';
import { trackPageView } from '../utils/analytics';
import TranslatedText from '../components/common/TranslatedText';

const Products = () => {
  const { t, i18n } = useTranslation();
  
  // Apply SEO meta tags
  useMetaTags({
    title: t('products.metaTitle', 'Shop Self-Inking Stamps'),
    description: t('products.metaDescription', 'Browse our extensive collection of self-inking stamps from top brands like Trodat, Shiny, and more. Filter by size, shape, and price.'),
    keywords: t('products.metaKeywords', 'self-inking stamps, custom stamps, Trodat stamps, Shiny stamps, MobiStamps, business stamps'),
    ogType: 'product',
    ogUrl: 'https://cachets-maroc.com/products',
    hrefLangTags: [
      { lang: 'en', url: 'https://cachets-maroc.com/en/products' },
      { lang: 'fr', url: 'https://cachets-maroc.com/fr/products' }
    ]
  });

  // Analytics tracking
  useEffect(() => {
    // Track page view using our analytics utility
    trackPageView(window.location.pathname, 'Products Page');
  }, []);

  const {
    filters,
    updateFilter,
    filteredProducts,
    brands,
    sizeGroups,
    colorOptions,
    sortOptions,
    compareProducts,
    removeProductFromComparison,
    clearProductComparison,
    removeFilter,
    clearAllFilters,
    activeFilterCount,
  } = useProductFilter({ products });

  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const isMobile = useIsMobile();

  // Toggle product selection for comparison
  const handleProductSelection = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const isAlreadySelected = compareProducts.some(p => p.id === productId);
    
    if (isAlreadySelected) {
      removeProductFromComparison(productId);
    } else if (compareProducts.length < 3) {
      updateFilter('searchQuery', '');
      window.scrollTo({
        top: document.getElementById(productId)?.offsetTop || 0,
        behavior: 'smooth'
      });
    }
  };

  // Render the filters sidebar/drawer
  const renderFilters = () => (
    <>
      <div className="mb-6">
        <PriceRangeSlider
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          value={filters.priceRange}
          onChange={(value) => updateFilter('priceRange', value)}
        />
      </div>
      
      <div className="space-y-6">
        <BrandFilter
          brands={brands}
          selectedBrands={filters.selectedBrands}
          onChange={(brands) => updateFilter('selectedBrands', brands)}
        />
        
        <ShapeFilter
          selectedShape={filters.selectedShape}
          onChange={(shape) => updateFilter('selectedShape', shape)}
        />
        
        <SizeFilter
          sizeGroups={sizeGroups}
          selectedSizes={filters.selectedSizes}
          onChange={(sizes) => updateFilter('selectedSizes', sizes)}
        />
        
        <TextLinesFilter
          selectedLines={filters.selectedLines}
          onChange={(lines) => updateFilter('selectedLines', lines)}
        />
        
        <ColorFilter
          colors={colorOptions}
          selectedColors={filters.selectedColors}
          onChange={(colors) => updateFilter('selectedColors', colors)}
        />
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container-custom">
          {/* Search and Sort Controls */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
              <div className="w-full md:max-w-md">
                <SearchBar
                  products={products}
                  onSearch={(query) => updateFilter('searchQuery', query)}
                  onProductSelect={handleProductSelection}
                  placeholder={t('products.searchPlaceholder')}
                />
              </div>
              
              <div className="flex items-center gap-3">
                <MobileFilterDrawer filterCount={activeFilterCount}>
                  {renderFilters()}
                </MobileFilterDrawer>
                
                <SortSelector
                  options={sortOptions}
                  value={filters.sortOption}
                  onChange={(value) => updateFilter('sortOption', value)}
                />
              </div>
            </div>
            
            <ActiveFilters
              filters={filters}
              brands={brands}
              colorOptions={colorOptions}
              onRemove={removeFilter}
              onClearAll={clearAllFilters}
            />
          </div>
          
          <div className="flex flex-col-reverse lg:flex-row gap-8">
            {/* Desktop Sidebar with filters */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-white p-4 rounded-lg shadow-md sticky top-4">
                <h2 className="font-semibold text-lg mb-4 border-b pb-2 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <TranslatedText i18nKey="products.filters">Filters</TranslatedText>
                </h2>
                
                {renderFilters()}
              </div>
            </div>
            
            {/* Main content with products */}
            <div className="lg:w-3/4">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  <TranslatedText i18nKey="products.title">Our Stamp Collection</TranslatedText>
                </h1>
                <p className="text-gray-600">
                  <TranslatedText i18nKey="products.description">
                    Browse our extensive collection of high-quality stamps from top brands like Trodat, Shiny, MobiStamps and more.
                  </TranslatedText>
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-gray-600" aria-live="polite">
                  <TranslatedText 
                    i18nKey="products.productsFound" 
                    values={{ count: filteredProducts.length }}
                  >
                    {filteredProducts.length} products found
                  </TranslatedText>
                </p>
                <button
                  onClick={() => setIsSelectionMode(!isSelectionMode)}
                  className={`text-sm ${isSelectionMode ? 'text-blue-600 font-medium' : 'text-gray-600'}`}
                  aria-pressed={isSelectionMode}
                >
                  {isSelectionMode ? 
                    <TranslatedText i18nKey="products.cancelComparison">Cancel comparison</TranslatedText> : 
                    <TranslatedText i18nKey="products.compareProducts">Compare products</TranslatedText>
                  }
                </button>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map(product => (
                    <div key={product.id} id={product.id}>
                      <ProductCard 
                        product={product} 
                        isSelectionMode={isSelectionMode}
                        isSelected={compareProducts.some(p => p.id === product.id)}
                        onSelectForComparison={() => {
                          const isSelected = compareProducts.some(p => p.id === product.id);
                          if (isSelected) {
                            removeProductFromComparison(product.id);
                          } else if (compareProducts.length < 3) {
                            const updatedCompare = [...compareProducts, product];
                            // Clear selection mode if 3 products are selected
                            if (updatedCompare.length === 3) {
                              setIsSelectionMode(false);
                            }
                          }
                        }}
                        maxSelectableProducts={3}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12" aria-live="polite">
                  <p className="text-gray-500">
                    <TranslatedText i18nKey="products.noProductsFound">
                      No products found matching your filters.
                    </TranslatedText>
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 text-brand-blue hover:underline"
                  >
                    <TranslatedText i18nKey="products.clearFilters">
                      Clear filters
                    </TranslatedText>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      {/* Product comparison drawer */}
      <CompareProducts
        selectedProducts={compareProducts}
        onRemoveProduct={removeProductFromComparison}
        onClearAll={clearProductComparison}
      />
      
      <Footer />
    </div>
  );
};

export default Products;
