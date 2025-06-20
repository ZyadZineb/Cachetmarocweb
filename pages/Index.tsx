
import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { Check, Truck, ThumbsUp, Award } from 'lucide-react';
import { useMetaTags, generateOrganizationSchema } from '../utils/seo';

const Index = () => {
  // Apply SEO meta tags
  useMetaTags({
    title: 'Custom Self-Inking Stamps for Business',
    description: 'Design and order custom self-inking stamps for your business or personal use. Choose from a wide range of models with free delivery in Casablanca, Morocco.',
    structuredData: generateOrganizationSchema(),
    ogUrl: 'https://cachets-maroc.com/'
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <FeaturedProducts />
        
        {/* Features Section */}
        <section className="py-16 bg-white" aria-labelledby="features-heading">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 id="features-heading" className="text-3xl font-bold text-gray-800 mb-4">Why Choose Our Stamps?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                We offer high-quality self-inking stamps with a variety of options to meet your business needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <Award className="text-brand-red" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
                <p className="text-gray-600">
                  All our stamps are made with high-quality materials for long-lasting durability.
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <ThumbsUp className="text-brand-blue" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Customizable</h3>
                <p className="text-gray-600">
                  Easily design your own stamps with our intuitive online design tool.
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <Truck className="text-brand-red" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
                <p className="text-gray-600">
                  Free delivery in Casablanca and surrounding regions with quick processing times.
                </p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                <div className="mx-auto w-12 h-12 bg-brand-blue/10 rounded-full flex items-center justify-center mb-4" aria-hidden="true">
                  <Check className="text-brand-blue" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Wide Selection</h3>
                <p className="text-gray-600">
                  Choose from various sizes, models, and brands to fit your specific needs.
                </p>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <Link to="/products" className="btn-secondary">
                Explore Our Collection
              </Link>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-brand-blue py-16 text-white" aria-labelledby="cta-heading">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 id="cta-heading" className="text-3xl font-bold mb-4">
                  Ready to Create Your Custom Stamp?
                </h2>
                <p className="mb-6 text-blue-50">
                  Design your own stamp now with our easy-to-use online designer tool.
                  See a preview before you order!
                </p>
                <Link to="/design" className="bg-white text-brand-blue px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors inline-block">
                  Start Designing Now
                </Link>
              </div>
              <div className="flex justify-center">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
                  <div className="text-brand-blue mb-4">
                    <h3 className="font-bold text-xl">Contact Us</h3>
                    <p className="text-gray-600">For questions or assistance</p>
                  </div>
                  <div className="space-y-3 text-gray-800">
                    <p className="flex items-center gap-3">
                      <span className="bg-brand-blue/10 p-2 rounded-full" aria-hidden="true">
                        <Phone className="text-brand-blue w-5 h-5" />
                      </span>
                      <span><a href="tel:+212699118028" className="hover:underline">06 99 11 80 28</a></span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="bg-brand-blue/10 p-2 rounded-full" aria-hidden="true">
                        <Mail className="text-brand-blue w-5 h-5" />
                      </span>
                      <span><a href="mailto:zyad.sobhi@gmail.com" className="hover:underline">zyad.sobhi@gmail.com</a></span>
                    </p>
                    <p className="flex items-center gap-3">
                      <span className="bg-brand-blue/10 p-2 rounded-full" aria-hidden="true">
                        <MapPin className="text-brand-blue w-5 h-5" />
                      </span>
                      <span>Casablanca, Morocco</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;

// Import necessary icons
import { Phone, Mail, MapPin } from 'lucide-react';
