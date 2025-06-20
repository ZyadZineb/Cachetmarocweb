
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTranslation } from 'react-i18next';
import { StampDesign, StampTextLine } from '@/types';

interface DesignTemplatesProps {
  onSelectTemplate: (template: Partial<StampDesign>) => void;
  productShape: 'rectangle' | 'circle' | 'square';
}

interface TemplateCategory {
  id: string;
  name: string;
  nameTranslationKey?: string;
}

const DesignTemplates: React.FC<DesignTemplatesProps> = ({ onSelectTemplate, productShape }) => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('business');
  
  const categories: TemplateCategory[] = [
    { id: 'business', nameTranslationKey: 'templates.categories.business', name: 'Business' },
    { id: 'legal', nameTranslationKey: 'templates.categories.legal', name: 'Legal' },
    { id: 'education', nameTranslationKey: 'templates.categories.education', name: 'Education' },
    { id: 'healthcare', nameTranslationKey: 'templates.categories.healthcare', name: 'Healthcare' },
  ];
  
  // Define sample design templates with proper type alignment
  const templates: { 
    id: string;
    name: string;
    nameTranslationKey?: string;
    description: string;
    descriptionTranslationKey?: string;
    category: string;
    forShapes: ('rectangle' | 'circle' | 'square')[];
    template: Partial<StampDesign>;
  }[] = [
    {
      id: 'business-address',
      nameTranslationKey: 'templates.businessAddress.name',
      name: 'Business Address',
      descriptionTranslationKey: 'templates.businessAddress.description',
      description: 'Perfect for company address stamps',
      category: 'business',
      forShapes: ['rectangle', 'square'],
      template: {
        borderStyle: 'single',
        lines: [
          {
            text: 'COMPANY NAME',
            fontSize: 18,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -25,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: '123 Business Street',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 0,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'City, State 12345',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 25,
            isDragging: false,
            letterSpacing: 0
          }
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoX: 0,
        logoY: 0
      }
    },
    {
      id: 'business-signature',
      nameTranslationKey: 'templates.businessSignature.name',
      name: 'Signature',
      descriptionTranslationKey: 'templates.businessSignature.description',
      description: 'For document signing and approvals',
      category: 'business',
      forShapes: ['rectangle', 'square'],
      template: {
        borderStyle: 'double',
        lines: [
          {
            text: 'APPROVED',
            fontSize: 20,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -25,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'Date: ___________',
            fontSize: 14,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 25,
            isDragging: false,
            letterSpacing: 0
          }
        ],
        inkColor: 'red',
        includeLogo: false,
        logoX: 0,
        logoY: 0
      }
    },
    {
      id: 'business-circular',
      nameTranslationKey: 'templates.businessCircular.name',
      name: 'Circular Stamp',
      descriptionTranslationKey: 'templates.businessCircular.description',
      description: 'Professional round stamp layout',
      category: 'business',
      forShapes: ['circle'],
      template: {
        borderStyle: 'double',
        lines: [
          {
            text: 'OFFICIAL STAMP',
            fontSize: 16,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'COMPANY NAME',
            fontSize: 18,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 0,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'ESTABLISHED 2022',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0
          }
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoX: 0,
        logoY: 0
      }
    },
    {
      id: 'legal-certified',
      nameTranslationKey: 'templates.legalCertified.name',
      name: 'Certified Copy',
      descriptionTranslationKey: 'templates.legalCertified.description',
      description: 'For certifying legal documents',
      category: 'legal',
      forShapes: ['rectangle', 'square'],
      template: {
        borderStyle: 'double',
        lines: [
          {
            text: 'CERTIFIED TRUE COPY',
            fontSize: 18,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -25,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'Attorney at Law',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 0,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'Reg. No. _____________',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 25,
            isDragging: false,
            letterSpacing: 0
          }
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoX: 0,
        logoY: 0
      }
    },
    {
      id: 'legal-notary',
      nameTranslationKey: 'templates.legalNotary.name',
      name: 'Notary Seal',
      descriptionTranslationKey: 'templates.legalNotary.description',
      description: 'For notary public stamps',
      category: 'legal',
      forShapes: ['circle'],
      template: {
        borderStyle: 'double',
        lines: [
          {
            text: 'NOTARY PUBLIC - STATE OF ________',
            fontSize: 14,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: -40,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'JOHN DOE',
            fontSize: 18,
            fontFamily: 'Times New Roman',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 0,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'MY COMMISSION EXPIRES __/__/____',
            fontSize: 12,
            fontFamily: 'Times New Roman',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: true,
            xPosition: 0,
            yPosition: 40,
            isDragging: false,
            letterSpacing: 0
          }
        ],
        inkColor: 'blue',
        includeLogo: false,
        logoX: 0,
        logoY: 0
      }
    },
    {
      id: 'education-library',
      nameTranslationKey: 'templates.educationLibrary.name',
      name: 'Library',
      descriptionTranslationKey: 'templates.educationLibrary.description',
      description: 'For school and library use',
      category: 'education',
      forShapes: ['rectangle'],
      template: {
        borderStyle: 'single',
        lines: [
          {
            text: 'SCHOOL LIBRARY',
            fontSize: 18,
            fontFamily: 'Georgia',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -25,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'Date: __/__/____',
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
          }
        ],
        inkColor: 'purple',
        includeLogo: true,
        logoX: 0,
        logoY: -60
      }
    },
    {
      id: 'healthcare-prescription',
      nameTranslationKey: 'templates.healthcarePrescription.name',
      name: 'Prescription',
      descriptionTranslationKey: 'templates.healthcarePrescription.description',
      description: 'For medical prescriptions',
      category: 'healthcare',
      forShapes: ['rectangle', 'square'],
      template: {
        borderStyle: 'single',
        lines: [
          {
            text: 'DR. JANE SMITH, MD',
            fontSize: 16,
            fontFamily: 'Arial',
            bold: true,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: -25,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'License #: 12345',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 0,
            isDragging: false,
            letterSpacing: 0
          },
          {
            text: 'DEA #: XS1234567',
            fontSize: 12,
            fontFamily: 'Arial',
            bold: false,
            italic: false,
            alignment: 'center' as const,
            curved: false,
            xPosition: 0,
            yPosition: 25,
            isDragging: false,
            letterSpacing: 0
          }
        ],
        inkColor: 'blue',
        includeLogo: true,
        logoX: -60,
        logoY: 0
      }
    }
  ];

  // Filter templates based on product shape and active category
  const filteredTemplates = templates.filter(template => 
    template.forShapes.includes(productShape) && template.category === activeCategory
  );

  const getCategoryName = (category: TemplateCategory) => {
    if (category.nameTranslationKey && i18n.exists(category.nameTranslationKey)) {
      return t(category.nameTranslationKey);
    }
    return category.name;
  };

  const getTemplateName = (template: typeof templates[0]) => {
    if (template.nameTranslationKey && i18n.exists(template.nameTranslationKey)) {
      return t(template.nameTranslationKey);
    }
    return template.name;
  };

  const getTemplateDescription = (template: typeof templates[0]) => {
    if (template.descriptionTranslationKey && i18n.exists(template.descriptionTranslationKey)) {
      return t(template.descriptionTranslationKey);
    }
    return template.description;
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">{t('templates.title', 'Design Templates')}</h3>
      <p className="text-sm text-gray-500">{t('templates.subtitle', 'Start with a template and customize it to your needs.')}</p>
      
      <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          {categories.map(category => (
            <TabsTrigger 
              key={category.id} 
              value={category.id}
              className="text-xs sm:text-sm"
            >
              {getCategoryName(category)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {categories.map(category => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              {filteredTemplates.map((template) => (
                <Card key={template.id}>
                  <CardContent className="p-4">
                    <h4 className="font-medium">{getTemplateName(template)}</h4>
                    <p className="text-sm text-gray-500 mt-1">{getTemplateDescription(template)}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-3" 
                      onClick={() => onSelectTemplate(template.template)}
                    >
                      {t('templates.useTemplate', 'Use Template')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {filteredTemplates.length === 0 && (
                <p className="text-sm text-gray-500 col-span-2">
                  {t('templates.noTemplates', 'No templates available for this stamp shape.')}
                </p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default DesignTemplates;
