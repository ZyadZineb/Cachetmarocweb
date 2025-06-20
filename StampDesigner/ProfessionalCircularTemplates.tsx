
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StampDesign, StampTextLine } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfessionalCircularTemplatesProps {
  onApplyTemplate: (template: Partial<StampDesign>) => void;
}

const ProfessionalCircularTemplates: React.FC<ProfessionalCircularTemplatesProps> = ({ onApplyTemplate }) => {
  const { t } = useTranslation();
  const [category, setCategory] = React.useState('business');

  const professionalTemplates = [
    // Business templates
    {
      id: 'officialCircular',
      name: 'Official Circular Stamp',
      description: 'Professional circular stamp with curved text border and centered lines',
      category: 'business',
      template: {
        borderStyle: 'double' as const,
        lines: [
          {
            text: 'OFFICIAL SEAL * PROFESSIONAL STAMP *',
            fontSize: 16,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 1
          },
          {
            text: 'COMPANY NAME',
            fontSize: 20,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -15,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: '123 BUSINESS STREET',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 5,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'CITY, STATE 12345',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 20,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'EST. 2024',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 1
          }
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -40,
        elements: []
      }
    },
    {
      id: 'businessAddress',
      name: 'Business Address',
      description: 'Clean professional address stamp layout',
      category: 'business',
      template: {
        borderStyle: 'single' as const,
        lines: [
          {
            text: '* BUSINESS NAME * ESTABLISHED 2024 *',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'JOHN SMITH',
            fontSize: 18,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: '123 BUSINESS AVENUE',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'CONTACT: (123) 456-7890 * EMAIL@EXAMPLE.COM',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.3
          }
        ],
        inkColor: 'black',
        includeLogo: false,
        logoPosition: 'center' as const,
        elements: []
      }
    },
    {
      id: 'corporateSeal',
      name: 'Corporate Seal',
      description: 'Formal corporate seal with professional layout',
      category: 'business',
      template: {
        borderStyle: 'triple' as const,
        lines: [
          {
            text: 'CORPORATE SEAL * AUTHENTIC DOCUMENT *',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'CORPORATION NAME',
            fontSize: 20,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -15,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'INCORPORATED',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 5,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'REGISTERED: 00/00/0000',
            fontSize: 12,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.3
          }
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -35,
        elements: []
      }
    },
    
    // Legal templates
    {
      id: 'notarySeal',
      name: 'Notary Seal',
      description: 'Professional notary seal with state text and commission details',
      category: 'legal',
      template: {
        borderStyle: 'triple' as const,
        lines: [
          {
            text: '* NOTARY PUBLIC * STATE OF JURISDICTION *',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'NOTARY NAME',
            fontSize: 18,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'COMMISSION #000000',
            fontSize: 12,
            fontFamily: 'Times New Roman',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'MY COMMISSION EXPIRES 00/00/0000',
            fontSize: 12,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.5
          }
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: 0,
        elements: []
      }
    },
    {
      id: 'certifiedCopy',
      name: 'Certified Copy',
      description: 'Professional stamp for document certification',
      category: 'legal',
      template: {
        borderStyle: 'double' as const,
        lines: [
          {
            text: '* CERTIFIED TRUE COPY * OFFICIAL DOCUMENT *',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'CERTIFIED',
            fontSize: 20,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 1
          },
          {
            text: 'DATE: _______________',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 15,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'ATTORNEY SIGNATURE: _______________',
            fontSize: 12,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 35,
            isDragging: false,
            letterSpacing: 0
          }
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: 0,
        elements: []
      }
    },
    {
      id: 'witnessedSignature',
      name: 'Witnessed Signature',
      description: 'Professional stamp for witnessing signatures',
      category: 'legal',
      template: {
        borderStyle: 'single' as const,
        lines: [
          {
            text: '* WITNESSED * AUTHENTIC SIGNATURE *',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'SIGNATURE WITNESSED BY',
            fontSize: 16,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'NAME: _______________',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'DATE: __/__/____ * ID: __________',
            fontSize: 12,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.3
          }
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        elements: []
      }
    },
    
    // Medical templates
    {
      id: 'medicalPractice',
      name: 'Medical Practice',
      description: 'Professional stamp for medical documents',
      category: 'medical',
      template: {
        borderStyle: 'double' as const,
        lines: [
          {
            text: '* MEDICAL PRACTICE * CONFIDENTIAL *',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'DR. FULL NAME',
            fontSize: 18,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'LICENSE #: 000000',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'MEDICAL SPECIALTY * NPI #: 0000000000',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.3
          }
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -35,
        elements: []
      }
    },
    {
      id: 'pharmacy',
      name: 'Pharmacy',
      description: 'Professional stamp for pharmacy use',
      category: 'medical',
      template: {
        borderStyle: 'single' as const,
        lines: [
          {
            text: '* PHARMACY * PRESCRIPTION VERIFIED *',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'PHARMACY NAME',
            fontSize: 18,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'VERIFIED BY: _______________',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'DATE: __/__/____ * TIME: __:__ AM/PM',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.3
          }
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        elements: []
      }
    },
    
    // Educational templates
    {
      id: 'schoolLibrary',
      name: 'School Library',
      description: 'Professional stamp for school library use',
      category: 'education',
      template: {
        borderStyle: 'double' as const,
        lines: [
          {
            text: '* SCHOOL LIBRARY * PROPERTY OF *',
            fontSize: 14,
            fontFamily: 'Georgia',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'SCHOOL NAME',
            fontSize: 18,
            fontFamily: 'Georgia',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'BOOK ID: _____________',
            fontSize: 14,
            fontFamily: 'Georgia',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'DUE DATE: __/__/____ * PLEASE RETURN',
            fontSize: 12,
            fontFamily: 'Georgia',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.3
          }
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -35,
        elements: []
      }
    },
    {
      id: 'studentRecord',
      name: 'Student Record',
      description: 'Professional stamp for student documents',
      category: 'education',
      template: {
        borderStyle: 'single' as const,
        lines: [
          {
            text: '* STUDENT RECORDS * CONFIDENTIAL *',
            fontSize: 14,
            fontFamily: 'Georgia',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'INSTITUTION NAME',
            fontSize: 18,
            fontFamily: 'Georgia',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'VERIFIED BY: _______________',
            fontSize: 14,
            fontFamily: 'Georgia',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 10,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'DATE: __/__/____ * REF: __________',
            fontSize: 12,
            fontFamily: 'Georgia',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.3
          }
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoPosition: 'center' as const,
        elements: []
      }
    },
    
    // Government templates
    {
      id: 'governmentOfficial',
      name: 'Government Official',
      description: 'Professional stamp for government document processing',
      category: 'government',
      template: {
        borderStyle: 'triple' as const,
        lines: [
          {
            text: '* OFFICIAL USE ONLY * GOVERNMENT DOCUMENT *',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0.5
          },
          {
            text: 'APPROVED',
            fontSize: 22,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -5,
            isDragging: false,
            letterSpacing: 1
          },
          {
            text: 'OFFICIAL: _______________',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 20,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'DATE: __/__/____ * REF: __________',
            fontSize: 12,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0.3
          }
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoPosition: 'center' as const,
        logoX: 0,
        logoY: -30,
        elements: []
      }
    }
  ];

  // Filter templates by category
  const filteredTemplates = React.useMemo(() => {
    return professionalTemplates.filter(template => template.category === category);
  }, [category]);

  // Categories for the tabs
  const categories = [
    { id: 'business', name: 'Business' },
    { id: 'legal', name: 'Legal' },
    { id: 'medical', name: 'Medical' },
    { id: 'education', name: 'Education' },
    { id: 'government', name: 'Government' },
  ];

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className="font-medium text-lg mb-2">
          {t('professionalTemplates.title', 'Professional Circular Templates')}
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          {t('professionalTemplates.description', 'Choose from our professional circular stamp templates for various uses')}
        </p>
        
        <Tabs defaultValue="business" value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="grid grid-cols-5 mb-4">
            {categories.map(cat => (
              <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map(template => (
                  <div key={template.id} className="border rounded-md p-3 hover:bg-slate-50">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-xs text-gray-500 mt-1 mb-3">{template.description}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full" 
                      onClick={() => onApplyTemplate(template.template)}
                    >
                      {t('professionalTemplates.apply', 'Apply Template')}
                    </Button>
                  </div>
                ))}
                
                {filteredTemplates.length === 0 && (
                  <div className="col-span-2 text-center p-4 text-gray-500">
                    No templates available for this category.
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ProfessionalCircularTemplates;
