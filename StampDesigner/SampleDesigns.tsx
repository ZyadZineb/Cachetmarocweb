
import React from 'react';

const SampleDesigns: React.FC = () => {
  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="font-medium text-gray-800 mb-2">Sample Designs</h3>
      <div className="grid grid-cols-2 gap-3">
        <div className="border rounded p-2 hover:border-brand-blue cursor-pointer transition-colors">
          <img src="/lovable-uploads/3fa9a59f-f08d-4f59-9e2e-1a681dbd53eb.png" alt="Sample stamp" className="w-full h-auto" />
        </div>
        <div className="border rounded p-2 hover:border-brand-blue cursor-pointer transition-colors">
          <img src="/lovable-uploads/28a683e8-de59-487e-b2ab-af1930ed01d6.png" alt="Sample stamp" className="w-full h-auto" />
        </div>
        <div className="border rounded p-2 hover:border-brand-blue cursor-pointer transition-colors">
          <img src="/lovable-uploads/ef68040b-498e-4d2f-a69f-f379ff643c4b.png" alt="Sample stamp" className="w-full h-auto" />
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">Click on a sample to get inspiration</p>
    </div>
  );
};

export default SampleDesigns;
