
import React from 'react';
import { ImageIcon, MoveHorizontal, MoveVertical, Upload, X } from 'lucide-react';
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface LogoUploaderProps {
  includeLogo: boolean;
  toggleLogo: () => void;
  logoX?: number;
  logoY?: number;
  uploadedLogo: string | null;
  onLogoUpload: () => void;
  updateLogoPosition: (x: number, y: number) => void;
  largeControls?: boolean;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  includeLogo,
  toggleLogo,
  logoX = 0,
  logoY = 0,
  uploadedLogo,
  onLogoUpload,
  updateLogoPosition,
  largeControls = false
}) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <h3 className={`font-medium text-lg mb-3 ${largeControls ? "text-xl" : ""}`}>Start with Your Logo</h3>
        <p className="text-sm text-gray-500 mb-4">
          Start with your logo for best results. We'll help position your text around it.
        </p>
        
        <div className="flex items-center mb-4">
          <Button 
            variant={includeLogo ? "default" : "outline"} 
            size="sm"
            className={`mr-3 ${includeLogo ? "bg-blue-600 hover:bg-blue-700" : ""}`}
            onClick={toggleLogo}
          >
            {includeLogo ? "Logo Enabled" : "Add Logo"}
          </Button>
          
          {includeLogo && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={toggleLogo}
            >
              <X className="h-4 w-4 mr-1" /> Remove Logo
            </Button>
          )}
        </div>
        
        {includeLogo && (
          <div className="space-y-4">
            <div 
              className={`border-dashed border-2 border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${largeControls ? "p-8" : ""}`}
              onClick={onLogoUpload}
            >
              {!uploadedLogo ? (
                <>
                  <div className="flex justify-center mb-3">
                    <Upload size={largeControls ? 32 : 24} className="text-blue-500" />
                  </div>
                  <h4 className={`font-medium ${largeControls ? "text-lg" : ""}`}>
                    Upload Your Logo
                  </h4>
                  <p className={`text-sm text-gray-500 ${largeControls ? "text-base mt-2" : ""}`}>
                    Click to upload an image file or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Recommended: Square PNG or SVG with transparent background
                  </p>
                </>
              ) : (
                <>
                  <div className="mt-2 p-4 bg-gray-50 rounded-md border">
                    <img src={uploadedLogo} alt="Uploaded logo" className={`h-20 mx-auto object-contain ${largeControls ? "h-24" : ""}`} />
                    <p className="text-sm text-blue-600 mt-3">Click to change logo</p>
                  </div>
                </>
              )}
            </div>
            
            {uploadedLogo && (
              <div className="space-y-4">
                <h4 className="font-medium text-sm">Logo Position</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <MoveHorizontal size={14} /> Horizontal Position
                    </Label>
                    <Slider
                      min={-100}
                      max={100}
                      step={1}
                      value={[logoX]}
                      onValueChange={(value) => updateLogoPosition(value[0], logoY)}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Left</span>
                      <span>Center</span>
                      <span>Right</span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 flex items-center gap-1 mb-2">
                      <MoveVertical size={14} /> Vertical Position
                    </Label>
                    <Slider
                      min={-100}
                      max={100}
                      step={1}
                      value={[logoY]}
                      onValueChange={(value) => updateLogoPosition(logoX, value[0])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Top</span>
                      <span>Center</span>
                      <span>Bottom</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <ImageIcon size={12} /> You can also drag the logo directly on the preview area
                </p>
                
                <div className="bg-blue-50 p-3 rounded-md mt-4">
                  <p className="text-sm text-blue-600">
                    <strong>Tip:</strong> After positioning your logo, click "Next" to add and arrange your text.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        
        {!includeLogo && (
          <div className="rounded-md bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">
              Proceed without a logo to create a text-only stamp design
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="mt-3"
              onClick={() => {}}
            >
              Continue to Text Design
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LogoUploader;
