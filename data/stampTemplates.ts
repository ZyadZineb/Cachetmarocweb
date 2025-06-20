
import { StampTemplate, StampTemplateCategory, StampTemplateSubcategory } from '@/types/designTemplates';

// Organized collection of stamp templates
export const stampTemplates: Record<StampTemplateCategory, StampTemplate[]> = {
  business: [
    // Address Stamps
    {
      id: 'business-classic',
      name: 'Classic Business',
      description: 'Traditional business layout with company name, address and contact info',
      category: 'business',
      subcategory: 'address',
      shape: 'rectangle',
      borderStyle: 'double',
      textZones: [
        { name: 'companyName', position: 'top', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'COMPANY NAME' },
        { name: 'address', position: 'middle', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: '123 Business Street' },
        { name: 'contact', position: 'bottom', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'City, State 12345' }
      ],
      recommendedFonts: ['Arial', 'Helvetica', 'Roboto'],
      compatibility: ['rectangle', 'square'],
      purpose: 'business',
      popularity: 0.9
    },
    {
      id: 'business-modern',
      name: 'Modern Business',
      description: 'Contemporary business layout with minimal design',
      category: 'business',
      subcategory: 'address',
      shape: 'rectangle',
      borderStyle: 'single',
      textZones: [
        { name: 'companyName', position: 'top', fontSize: 20, bold: true, alignment: 'left', curved: false, placeholder: 'COMPANY NAME' },
        { name: 'tagline', position: 'middle', fontSize: 14, bold: false, alignment: 'left', curved: false, placeholder: 'Professional Services' },
        { name: 'contact', position: 'bottom', fontSize: 12, bold: false, alignment: 'left', curved: false, placeholder: 'contact@company.com • (123) 456-7890' }
      ],
      recommendedFonts: ['Montserrat', 'Open Sans', 'Roboto'],
      compatibility: ['rectangle'],
      purpose: 'business',
      popularity: 0.85
    },
    {
      id: 'business-compact',
      name: 'Compact Business',
      description: 'Space-efficient layout for detailed business information',
      category: 'business',
      subcategory: 'address',
      shape: 'rectangle',
      borderStyle: 'single',
      textZones: [
        { name: 'companyName', position: 'top', fontSize: 16, bold: true, alignment: 'center', curved: false, placeholder: 'COMPANY NAME' },
        { name: 'addressLine1', position: 'middle', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: '123 Business Street, Suite 100' },
        { name: 'addressLine2', position: 'middle', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: 'City, State 12345' },
        { name: 'contact', position: 'bottom', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: 'Tel: (123) 456-7890 • Fax: (123) 456-7899' }
      ],
      recommendedFonts: ['Arial', 'Tahoma', 'Verdana'],
      compatibility: ['rectangle', 'square'],
      purpose: 'business',
      popularity: 0.8
    },
    {
      id: 'business-logo-left',
      name: 'Logo Left',
      description: 'Business layout with logo positioned on the left',
      category: 'business',
      subcategory: 'address',
      shape: 'rectangle',
      borderStyle: 'single',
      textZones: [
        { name: 'companyName', position: 'top-right', fontSize: 18, bold: true, alignment: 'left', curved: false, placeholder: 'COMPANY NAME' },
        { name: 'details', position: 'bottom-right', fontSize: 14, bold: false, alignment: 'left', curved: false, placeholder: '123 Business St\nCity, State 12345' }
      ],
      logoPosition: 'left',
      logoZone: {
        position: 'left-center',
        maxWidth: 40,
        maxHeight: 40
      },
      recommendedFonts: ['Helvetica', 'Arial', 'Roboto'],
      compatibility: ['rectangle'],
      purpose: 'business',
      popularity: 0.75
    },
    {
      id: 'business-minimal',
      name: 'Minimal Business',
      description: 'Clean, minimalist business stamp with essential information only',
      category: 'business',
      subcategory: 'address',
      shape: 'rectangle',
      borderStyle: 'none',
      textZones: [
        { name: 'companyName', position: 'top', fontSize: 20, bold: true, alignment: 'center', curved: false, placeholder: 'COMPANY NAME' },
        { name: 'contact', position: 'bottom', fontSize: 16, bold: false, alignment: 'center', curved: false, placeholder: 'www.company.com' }
      ],
      recommendedFonts: ['Montserrat', 'Roboto', 'Open Sans'],
      compatibility: ['rectangle', 'square'],
      purpose: 'business',
      popularity: 0.7
    },
    
    // Transaction Stamps
    {
      id: 'transaction-paid',
      name: 'Paid Stamp',
      description: 'Clear payment received stamp with date line',
      category: 'business',
      subcategory: 'transaction',
      shape: 'rectangle',
      borderStyle: 'single',
      textZones: [
        { name: 'paidText', position: 'top', fontSize: 24, bold: true, alignment: 'center', curved: false, placeholder: 'PAID' },
        { name: 'dateLine', position: 'bottom', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: 'DATE: __/__/____' }
      ],
      recommendedFonts: ['Impact', 'Arial Black', 'Roboto'],
      compatibility: ['rectangle', 'square'],
      purpose: 'business',
      popularity: 0.85
    },
    {
      id: 'transaction-invoice',
      name: 'Invoice Processing',
      description: 'Invoice processing stamp with reference fields',
      category: 'business',
      subcategory: 'transaction',
      shape: 'rectangle',
      borderStyle: 'double',
      textZones: [
        { name: 'title', position: 'top', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'INVOICE PROCESSED' },
        { name: 'reference', position: 'middle', fontSize: 12, bold: false, alignment: 'left', curved: false, placeholder: 'Ref#: ____________' },
        { name: 'date', position: 'bottom', fontSize: 12, bold: false, alignment: 'left', curved: false, placeholder: 'Date: __/__/____' },
        { name: 'initials', position: 'bottom-right', fontSize: 12, bold: false, alignment: 'right', curved: false, placeholder: 'By: _____' }
      ],
      recommendedFonts: ['Arial', 'Tahoma', 'Verdana'],
      compatibility: ['rectangle'],
      purpose: 'business',
      popularity: 0.75
    },
    
    // Signature/Approval Stamps
    {
      id: 'approval-simple',
      name: 'Simple Approval',
      description: 'Clear approval stamp with signature line',
      category: 'business',
      subcategory: 'signature',
      shape: 'rectangle',
      borderStyle: 'single',
      textZones: [
        { name: 'approvedText', position: 'top', fontSize: 22, bold: true, alignment: 'center', curved: false, placeholder: 'APPROVED' },
        { name: 'signatureLine', position: 'bottom', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: 'Signature: _______________' }
      ],
      recommendedFonts: ['Arial', 'Helvetica', 'Tahoma'],
      compatibility: ['rectangle', 'square'],
      purpose: 'business',
      popularity: 0.9
    },
    {
      id: 'approval-detailed',
      name: 'Detailed Approval',
      description: 'Comprehensive approval stamp with multiple fields',
      category: 'business',
      subcategory: 'signature',
      shape: 'rectangle',
      borderStyle: 'double',
      textZones: [
        { name: 'approvedText', position: 'top', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'APPROVED' },
        { name: 'dateField', position: 'middle-left', fontSize: 12, bold: false, alignment: 'left', curved: false, placeholder: 'Date: __/__/____' },
        { name: 'byField', position: 'middle-right', fontSize: 12, bold: false, alignment: 'right', curved: false, placeholder: 'By: _________' },
        { name: 'notesField', position: 'bottom', fontSize: 10, bold: false, alignment: 'center', curved: false, placeholder: 'Notes: ___________________' }
      ],
      recommendedFonts: ['Arial', 'Tahoma', 'Verdana'],
      compatibility: ['rectangle'],
      purpose: 'business',
      popularity: 0.8
    },
    
    // Banking/Financial Stamps
    {
      id: 'financial-deposit',
      name: 'For Deposit Only',
      description: 'Standard bank deposit stamp',
      category: 'business',
      subcategory: 'financial',
      shape: 'rectangle',
      borderStyle: 'single',
      textZones: [
        { name: 'depositText', position: 'top', fontSize: 16, bold: true, alignment: 'center', curved: false, placeholder: 'FOR DEPOSIT ONLY' },
        { name: 'accountField', position: 'middle', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'Account #: __________' },
        { name: 'companyName', position: 'bottom', fontSize: 14, bold: true, alignment: 'center', curved: false, placeholder: 'COMPANY NAME, INC.' }
      ],
      recommendedFonts: ['Arial', 'Courier New', 'Tahoma'],
      compatibility: ['rectangle'],
      purpose: 'business',
      popularity: 0.75
    },
  ],
  
  circular: [
    {
      id: 'circular-classic',
      name: 'Classic Circular',
      description: 'Traditional circular stamp with curved text around the perimeter',
      category: 'circular',
      shape: 'circle',
      borderStyle: 'double',
      textZones: [
        { name: 'outer', position: 'perimeter-top', fontSize: 16, bold: false, alignment: 'center', curved: true, curvature: 'top', placeholder: 'COMPANY NAME, INC.' },
        { name: 'inner', position: 'perimeter-bottom', fontSize: 16, bold: false, alignment: 'center', curved: true, curvature: 'bottom', placeholder: 'ESTABLISHED 2022' },
        { name: 'center', position: 'center', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'SEAL' }
      ],
      recommendedFonts: ['Times New Roman', 'Georgia', 'Garamond'],
      compatibility: ['circle'],
      purpose: 'official',
      popularity: 0.95
    },
    {
      id: 'circular-modern',
      name: 'Modern Circular',
      description: 'Contemporary circular stamp with minimalist design',
      category: 'circular',
      shape: 'circle',
      borderStyle: 'single',
      textZones: [
        { name: 'top', position: 'perimeter-top', fontSize: 16, bold: true, alignment: 'center', curved: true, curvature: 'top', placeholder: 'COMPANY NAME' },
        { name: 'center', position: 'center', fontSize: 20, bold: true, alignment: 'center', curved: false, placeholder: 'OFFICIAL' },
        { name: 'bottom', position: 'perimeter-bottom', fontSize: 14, bold: false, alignment: 'center', curved: true, curvature: 'bottom', placeholder: 'CITY • STATE' }
      ],
      recommendedFonts: ['Montserrat', 'Roboto', 'Open Sans'],
      compatibility: ['circle'],
      purpose: 'business',
      popularity: 0.85
    },
    {
      id: 'circular-seal',
      name: 'Official Seal',
      description: 'Government or official seal-style circular stamp',
      category: 'circular',
      subcategory: 'government',
      shape: 'circle',
      borderStyle: 'triple',
      textZones: [
        { name: 'header', position: 'perimeter-top', fontSize: 16, bold: true, alignment: 'center', curved: true, curvature: 'top', placeholder: 'OFFICIAL SEAL' },
        { name: 'footer', position: 'perimeter-bottom', fontSize: 16, bold: true, alignment: 'center', curved: true, curvature: 'bottom', placeholder: 'STATE OF EXAMPLE' },
        { name: 'title', position: 'center-top', fontSize: 14, bold: true, alignment: 'center', curved: false, placeholder: 'DEPARTMENT OF' },
        { name: 'emblem', position: 'center', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'RECORDS' },
        { name: 'date', position: 'center-bottom', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'EST. 1950' }
      ],
      recommendedFonts: ['Times New Roman', 'Georgia', 'Cambria'],
      compatibility: ['circle'],
      purpose: 'official',
      popularity: 0.9
    },
    {
      id: 'circular-simple',
      name: 'Simple Circle',
      description: 'Minimalist circular stamp with limited text',
      category: 'circular',
      shape: 'circle',
      borderStyle: 'single',
      textZones: [
        { name: 'top', position: 'perimeter-top', fontSize: 18, bold: true, alignment: 'center', curved: true, curvature: 'top', placeholder: 'JOHN SMITH' },
        { name: 'bottom', position: 'perimeter-bottom', fontSize: 18, bold: true, alignment: 'center', curved: true, curvature: 'bottom', placeholder: 'PERSONAL SEAL' }
      ],
      recommendedFonts: ['Arial', 'Helvetica', 'Roboto'],
      compatibility: ['circle'],
      purpose: 'personal',
      popularity: 0.75
    },
    {
      id: 'circular-logo-center',
      name: 'Logo Center Circle',
      description: 'Circular stamp with prominent center logo',
      category: 'circular',
      shape: 'circle',
      borderStyle: 'double',
      textZones: [
        { name: 'top', position: 'perimeter-top', fontSize: 16, bold: false, alignment: 'center', curved: true, curvature: 'top', placeholder: 'COMPANY NAME, INC.' },
        { name: 'bottom', position: 'perimeter-bottom', fontSize: 16, bold: false, alignment: 'center', curved: true, curvature: 'bottom', placeholder: 'ESTABLISHED 2022' }
      ],
      logoPosition: 'center',
      logoZone: {
        position: 'center',
        maxWidth: 50,
        maxHeight: 50
      },
      recommendedFonts: ['Montserrat', 'Open Sans', 'Roboto'],
      compatibility: ['circle'],
      purpose: 'business',
      popularity: 0.8
    },
    
    // Notary Stamps
    {
      id: 'notary-standard',
      name: 'Standard Notary',
      description: 'Standard notary public circular stamp',
      category: 'circular',
      subcategory: 'notary',
      shape: 'circle',
      borderStyle: 'double',
      textZones: [
        { name: 'top', position: 'perimeter-top', fontSize: 14, bold: true, alignment: 'center', curved: true, curvature: 'top', placeholder: 'NOTARY PUBLIC' },
        { name: 'bottom', position: 'perimeter-bottom', fontSize: 14, bold: true, alignment: 'center', curved: true, curvature: 'bottom', placeholder: 'STATE OF EXAMPLE' },
        { name: 'name', position: 'center', fontSize: 16, bold: true, alignment: 'center', curved: false, placeholder: 'JOHN SMITH' },
        { name: 'commission', position: 'center-bottom', fontSize: 10, bold: false, alignment: 'center', curved: false, placeholder: 'My Commission Expires 12/31/2025' }
      ],
      recommendedFonts: ['Times New Roman', 'Georgia', 'Cambria'],
      compatibility: ['circle'],
      purpose: 'official',
      popularity: 0.95
    },
    
    // Medical/Healthcare
    {
      id: 'medical-prescription',
      name: 'Prescription Authorization',
      description: 'Medical prescription authorization stamp',
      category: 'circular',
      subcategory: 'medical',
      shape: 'circle',
      borderStyle: 'double',
      textZones: [
        { name: 'top', position: 'perimeter-top', fontSize: 14, bold: true, alignment: 'center', curved: true, curvature: 'top', placeholder: 'DR. JANE SMITH, M.D.' },
        { name: 'bottom', position: 'perimeter-bottom', fontSize: 14, bold: true, alignment: 'center', curved: true, curvature: 'bottom', placeholder: 'LICENSE #12345678' },
        { name: 'center', position: 'center', fontSize: 16, bold: true, alignment: 'center', curved: false, placeholder: 'AUTHORIZED' },
        { name: 'dea', position: 'center-bottom', fontSize: 10, bold: false, alignment: 'center', curved: false, placeholder: 'DEA# XS1234567' }
      ],
      recommendedFonts: ['Times New Roman', 'Georgia', 'Arial'],
      compatibility: ['circle'],
      purpose: 'professional',
      popularity: 0.85
    },
  ],
  
  square: [
    {
      id: 'square-modern',
      name: 'Modern Square',
      description: 'Contemporary square stamp with clean layout',
      category: 'square',
      shape: 'square',
      borderStyle: 'single',
      textZones: [
        { name: 'header', position: 'top', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'COMPANY NAME' },
        { name: 'content', position: 'middle', fontSize: 16, bold: false, alignment: 'center', curved: false, placeholder: 'ESTABLISHED 2022' },
        { name: 'footer', position: 'bottom', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'CITY, STATE' }
      ],
      recommendedFonts: ['Roboto', 'Open Sans', 'Montserrat'],
      compatibility: ['square', 'rectangle'],
      purpose: 'business',
      popularity: 0.85
    },
    {
      id: 'square-compact',
      name: 'Compact Square',
      description: 'Space-efficient square stamp for detailed information',
      category: 'square',
      shape: 'square',
      borderStyle: 'double',
      textZones: [
        { name: 'title', position: 'top', fontSize: 16, bold: true, alignment: 'center', curved: false, placeholder: 'COMPANY NAME' },
        { name: 'subtitle', position: 'middle-top', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'DEPARTMENT' },
        { name: 'details-1', position: 'middle', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: '123 Business Street' },
        { name: 'details-2', position: 'middle-bottom', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: 'City, State 12345' },
        { name: 'contact', position: 'bottom', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: 'Tel: (123) 456-7890' }
      ],
      recommendedFonts: ['Arial', 'Helvetica', 'Verdana'],
      compatibility: ['square'],
      purpose: 'business',
      popularity: 0.8
    },
    {
      id: 'square-minimal',
      name: 'Minimal Square',
      description: 'Clean, minimalist square stamp design',
      category: 'square',
      shape: 'square',
      borderStyle: 'none',
      textZones: [
        { name: 'main', position: 'center', fontSize: 20, bold: true, alignment: 'center', curved: false, placeholder: 'APPROVED' }
      ],
      recommendedFonts: ['Montserrat', 'Open Sans', 'Roboto'],
      compatibility: ['square'],
      purpose: 'personal',
      popularity: 0.7
    },
    
    // Technical/Engineering
    {
      id: 'engineering-approval',
      name: 'Engineering Approval',
      description: 'Technical drawing approval stamp',
      category: 'square',
      subcategory: 'technical',
      shape: 'square',
      borderStyle: 'double',
      textZones: [
        { name: 'title', position: 'top', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'ENGINEERING APPROVED' },
        { name: 'engineer', position: 'middle', fontSize: 14, bold: false, alignment: 'left', curved: false, placeholder: 'Engineer: __________' },
        { name: 'license', position: 'middle-bottom', fontSize: 12, bold: false, alignment: 'left', curved: false, placeholder: 'License #: ________' },
        { name: 'date', position: 'bottom', fontSize: 12, bold: false, alignment: 'left', curved: false, placeholder: 'Date: __/__/____' }
      ],
      recommendedFonts: ['Arial', 'Tahoma', 'Verdana'],
      compatibility: ['square', 'rectangle'],
      purpose: 'professional',
      popularity: 0.75
    },
  ],
  
  official: [
    {
      id: 'official-seal',
      name: 'Official Seal',
      description: 'Formal seal for official documents',
      category: 'official',
      subcategory: 'government',
      shape: 'circle',
      borderStyle: 'triple',
      textZones: [
        { name: 'organization', position: 'perimeter-top', fontSize: 16, bold: true, alignment: 'center', curved: true, curvature: 'top', placeholder: 'OFFICE OF THE SECRETARY' },
        { name: 'department', position: 'perimeter-bottom', fontSize: 16, bold: true, alignment: 'center', curved: true, curvature: 'bottom', placeholder: 'STATE OF EXAMPLE' },
        { name: 'seal-center', position: 'center', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'GREAT SEAL' }
      ],
      recommendedFonts: ['Times New Roman', 'Georgia', 'Garamond'],
      compatibility: ['circle'],
      purpose: 'official',
      popularity: 0.95
    },
    {
      id: 'official-rectangular',
      name: 'Official Rectangle',
      description: 'Formal rectangular stamp for official use',
      category: 'official',
      subcategory: 'government',
      shape: 'rectangle',
      borderStyle: 'double',
      textZones: [
        { name: 'header', position: 'top', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'DEPARTMENT OF RECORDS' },
        { name: 'title', position: 'middle', fontSize: 16, bold: true, alignment: 'center', curved: false, placeholder: 'OFFICIAL COPY' },
        { name: 'date-line', position: 'bottom', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'Date: __/__/____' }
      ],
      recommendedFonts: ['Times New Roman', 'Calibri', 'Georgia'],
      compatibility: ['rectangle'],
      purpose: 'official',
      popularity: 0.9
    },
    
    // Legal Stamps
    {
      id: 'legal-certified',
      name: 'Certified Copy',
      description: 'Legal document certification stamp',
      category: 'official',
      subcategory: 'legal',
      shape: 'rectangle',
      borderStyle: 'double',
      textZones: [
        { name: 'title', position: 'top', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'CERTIFIED TRUE COPY' },
        { name: 'authority', position: 'middle', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'Court Clerk' },
        { name: 'date', position: 'bottom', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: 'Date: __/__/____' }
      ],
      recommendedFonts: ['Times New Roman', 'Garamond', 'Georgia'],
      compatibility: ['rectangle'],
      purpose: 'official',
      popularity: 0.85
    },
  ],
  
  specialty: [
    {
      id: 'date-stamp',
      name: 'Date Stamp',
      description: 'Specialized stamp for dates and numbering',
      category: 'specialty',
      shape: 'rectangle',
      borderStyle: 'single',
      textZones: [
        { name: 'header', position: 'top', fontSize: 16, bold: true, alignment: 'center', curved: false, placeholder: 'RECEIVED' },
        { name: 'date', position: 'middle', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: '__/__/____' },
        { name: 'number', position: 'bottom', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'Ref: ________' }
      ],
      recommendedFonts: ['Courier New', 'Roboto Mono', 'Arial'],
      compatibility: ['rectangle'],
      purpose: 'official',
      popularity: 0.85
    },
    {
      id: 'signature-stamp',
      name: 'Signature Stamp',
      description: 'Professional stamp for signatures',
      category: 'specialty',
      subcategory: 'signature',
      shape: 'rectangle',
      borderStyle: 'none',
      textZones: [
        { name: 'name', position: 'top', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'JOHN SMITH' },
        { name: 'title', position: 'bottom', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'Chief Executive Officer' }
      ],
      recommendedFonts: ['Times New Roman', 'Georgia', 'Garamond'],
      compatibility: ['rectangle'],
      purpose: 'personal',
      popularity: 0.75
    },
    
    // Educational
    {
      id: 'library-stamp',
      name: 'Library Stamp',
      description: 'Standard library processing stamp',
      category: 'specialty',
      subcategory: 'educational',
      shape: 'rectangle',
      borderStyle: 'single',
      textZones: [
        { name: 'library', position: 'top', fontSize: 16, bold: true, alignment: 'center', curved: false, placeholder: 'CITY PUBLIC LIBRARY' },
        { name: 'received', position: 'middle', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'RECEIVED' },
        { name: 'date', position: 'bottom', fontSize: 12, bold: false, alignment: 'center', curved: false, placeholder: 'DATE: __/__/____' }
      ],
      recommendedFonts: ['Georgia', 'Book Antiqua', 'Times New Roman'],
      compatibility: ['rectangle'],
      purpose: 'educational',
      popularity: 0.7
    },
    
    // Personal Stamps
    {
      id: 'personal-address',
      name: 'Personal Address',
      description: 'Decorative personal address stamp',
      category: 'specialty',
      subcategory: 'personal',
      shape: 'rectangle',
      borderStyle: 'single',
      textZones: [
        { name: 'name', position: 'top', fontSize: 18, bold: true, alignment: 'center', curved: false, placeholder: 'THE SMITH FAMILY' },
        { name: 'address', position: 'middle', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: '123 Home Street' },
        { name: 'city-state-zip', position: 'bottom', fontSize: 14, bold: false, alignment: 'center', curved: false, placeholder: 'City, State 12345' }
      ],
      recommendedFonts: ['Script MT Bold', 'Brush Script MT', 'Lucida Handwriting'],
      compatibility: ['rectangle', 'square'],
      purpose: 'personal',
      popularity: 0.8
    }
  ]
};

// Helper functions
export const getAllTemplates = (): StampTemplate[] => {
  return Object.values(stampTemplates).flat();
};

export const getTemplateById = (id: string): StampTemplate | undefined => {
  return getAllTemplates().find(template => template.id === id);
};

export const getTemplatesByShape = (shape: string): StampTemplate[] => {
  return getAllTemplates().filter(template => template.compatibility.includes(shape));
};

export const getTemplatesByPurpose = (purpose: string): StampTemplate[] => {
  return getAllTemplates().filter(template => template.purpose === purpose);
};

export const getTemplatesByCategory = (category: StampTemplateCategory): StampTemplate[] => {
  return stampTemplates[category] || [];
};

export const getTemplatesBySubcategory = (subcategory: StampTemplateSubcategory): StampTemplate[] => {
  return getAllTemplates().filter(template => template.subcategory === subcategory);
};
