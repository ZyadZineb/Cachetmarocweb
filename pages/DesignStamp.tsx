
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import StampDesigner from '../components/StampDesigner';
import { getProductById, products } from '../data/products';
import { Product } from '../types';
import LanguageSwitcher from '../components/LanguageSwitcher';
import AccessibilitySettings from '../components/StampDesigner/AccessibilitySettings';

const DesignStamp: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [highContrast, setHighContrast] = useState(false);
  const [largeControls, setLargeControls] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('productId');
  
  useEffect(() => {
    if (productId) {
      const product = getProductById(productId);
      if (product) {
        setSelectedProduct(product);
      }
    }
    
    // Load accessibility preferences from localStorage if available
    const savedHighContrast = localStorage.getItem('highContrastMode');
    const savedLargeControls = localStorage.getItem('largeControlsMode');
    
    if (savedHighContrast) setHighContrast(savedHighContrast === 'true');
    if (savedLargeControls) setLargeControls(savedLargeControls === 'true');
  }, [productId]);
  
  const handleProductSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    const product = getProductById(id);
    
    if (product) {
      setSelectedProduct(product);
      navigate(`/design?productId=${id}`);
    } else {
      setSelectedProduct(null);
    }
  };
  
  const handleAddToCart = () => {
    navigate('/cart');
  };
  
  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    localStorage.setItem('highContrastMode', String(enabled));
  };
  
  const handleLargeControlsChange = (enabled: boolean) => {
    setLargeControls(enabled);
    localStorage.setItem('largeControlsMode', String(enabled));
  };

  return (
    <div className={`min-h-screen flex flex-col ${highContrast ? 'bg-gray-100 text-black' : 'bg-gray-50'}`}>
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className={`text-3xl font-bold ${highContrast ? 'text-black' : 'text-gray-800'} mb-3`}>
                {t('designStamp.title', 'Design Your Professional Stamp')}
              </h1>
              <p className={`${highContrast ? 'text-black' : 'text-gray-600'} max-w-3xl`}>
                {t('designStamp.subtitle', 'Create a clean, professional stamp design with our easy-to-use designer. Follow our step-by-step process for optimal results.')}
              </p>
            </div>
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-3/4">
              <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
                <h2 className="font-semibold mb-3">{t('designStamp.selectProduct', 'Select a Product')}</h2>
                <select
                  value={selectedProduct?.id || ''}
                  onChange={handleProductSelect}
                  className={`w-full md:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-brand-blue ${
                    largeControls ? 'text-lg py-3' : ''
                  }`}
                  aria-label={t('designStamp.selectProductAriaLabel', 'Select a stamp model')}
                >
                  <option value="">{t('designStamp.selectProductPlaceholder', '-- Select a stamp model --')}</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>
                      {product.name} - {product.size} - {product.price} DHS
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={`bg-white rounded-lg shadow-md mb-8 ${highContrast ? 'border border-gray-800' : ''}`}>
                <StampDesigner 
                  product={selectedProduct} 
                  onAddToCart={handleAddToCart} 
                  highContrast={highContrast}
                  largeControls={largeControls}
                />
              </div>
            </div>
            
            <div className="w-full md:w-1/4">
              <div className="bg-white rounded-lg shadow p-4 mb-6">
                <AccessibilitySettings 
                  highContrast={highContrast}
                  largeControls={largeControls}
                  onHighContrastChange={handleHighContrastChange}
                  onLargeControlsChange={handleLargeControlsChange}
                />
              </div>
              
              {/* Only show help guide if no product is selected */}
              {!selectedProduct && (
                <div className={`bg-white rounded-lg shadow p-4 ${highContrast ? 'border border-gray-800' : ''}`}>
                  <h3 className="font-medium text-lg mb-3">{t('designStamp.helpGuide', 'Design Guide')}</h3>
                  <div className="space-y-4">
                    <div className={`p-3 rounded-md ${highContrast ? 'bg-gray-200' : 'bg-blue-50'}`}>
                      <p className="text-sm">
                        {t('designStamp.stepByStep', 'Our simplified designer guides you through the stamp creation process step by step.')}
                      </p>
                    </div>
                    <div className={`p-3 rounded-md ${highContrast ? 'bg-gray-200' : 'bg-yellow-50'}`}>
                      <p className="text-sm">
                        {t('designStamp.templateHelp', 'Choose from border styles and create your own unique design.')}
                      </p>
                    </div>
                    <div className={`p-3 rounded-md ${highContrast ? 'bg-gray-200' : 'bg-green-50'}`}>
                      <p className="text-sm">
                        {t('designStamp.previewHelp', 'See exactly how your stamp will look with our realistic preview.')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {!selectedProduct && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className={`bg-white p-6 rounded-lg shadow-md ${highContrast ? 'border border-gray-800' : ''}`}>
                <div className={`w-12 h-12 ${highContrast ? 'bg-red-800' : 'bg-brand-red/10'} rounded-full flex items-center justify-center mb-4`}>
                  <span className={`${highContrast ? 'text-white' : 'text-brand-red'} font-bold text-lg`}>1</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('designStamp.step1Title', 'Select Your Stamp')}
                </h3>
                <p className={`${highContrast ? 'text-black' : 'text-gray-600'}`}>
                  {t('designStamp.step1Description', 'Choose from our wide range of self-inking stamps in various sizes and styles.')}
                </p>
              </div>
              
              <div className={`bg-white p-6 rounded-lg shadow-md ${highContrast ? 'border border-gray-800' : ''}`}>
                <div className={`w-12 h-12 ${highContrast ? 'bg-red-800' : 'bg-brand-red/10'} rounded-full flex items-center justify-center mb-4`}>
                  <span className={`${highContrast ? 'text-white' : 'text-brand-red'} font-bold text-lg`}>2</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('designStamp.step2Title', 'Customize Your Design')}
                </h3>
                <p className={`${highContrast ? 'text-black' : 'text-gray-600'}`}>
                  {t('designStamp.step2Description', 'Add your text, choose fonts and formatting, select ink color, and add a logo if needed.')}
                </p>
              </div>
              
              <div className={`bg-white p-6 rounded-lg shadow-md ${highContrast ? 'border border-gray-800' : ''}`}>
                <div className={`w-12 h-12 ${highContrast ? 'bg-red-800' : 'bg-brand-red/10'} rounded-full flex items-center justify-center mb-4`}>
                  <span className={`${highContrast ? 'text-white' : 'text-brand-red'} font-bold text-lg`}>3</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {t('designStamp.step3Title', 'Preview & Order')}
                </h3>
                <p className={`${highContrast ? 'text-black' : 'text-gray-600'}`}>
                  {t('designStamp.step3Description', 'See an accurate preview of your stamp before adding to cart and completing your purchase.')}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DesignStamp;
