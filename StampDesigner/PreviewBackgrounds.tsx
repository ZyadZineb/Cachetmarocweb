
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';

interface PreviewBackgroundsProps {
  onSelectBackground: (background: string) => void;
  selectedBackground: string;
}

const PreviewBackgrounds: React.FC<PreviewBackgroundsProps> = ({
  onSelectBackground,
  selectedBackground
}) => {
  const { t } = useTranslation();

  // Define various background options
  const backgrounds = [
    { id: 'none', name: t('backgrounds.none', 'None'), color: '#ffffff', thumbnail: '/placeholder.svg' },
    { id: 'paper', name: t('backgrounds.paper', 'Paper'), color: '#f8f8f8', thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158' },
    { id: 'envelope', name: t('backgrounds.envelope', 'Envelope'), color: '#f1f0ed', thumbnail: 'https://images.unsplash.com/photo-1473091534298-04dcbce3278c' },
    { id: 'cardboard', name: t('backgrounds.cardboard', 'Cardboard'), color: '#d4c8b8', thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb' },
    { id: 'fabric', name: t('backgrounds.fabric', 'Fabric'), color: '#e2d1c3', thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7' },
  ];

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-gray-800">{t('backgrounds.title', 'Preview Background')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            onClick={() => onSelectBackground(bg.id)}
            className={`relative border rounded-md overflow-hidden h-16 ${selectedBackground === bg.id ? 'ring-2 ring-brand-blue' : 'ring-1 ring-gray-200'}`}
            aria-label={bg.name}
            style={{
              backgroundColor: bg.color,
              backgroundImage: bg.id !== 'none' ? `url(${bg.thumbnail})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {selectedBackground === bg.id && (
              <div className="absolute inset-0 bg-brand-blue/20 flex items-center justify-center">
                <Check size={16} className="text-white" />
              </div>
            )}
            <span className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs py-0.5 px-1 truncate">
              {bg.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PreviewBackgrounds;
