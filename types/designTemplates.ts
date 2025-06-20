
// Type definitions for design templates
import { StampDesign } from './index';

export type StampTemplateCategory = 'business' | 'circular' | 'official' | 'square' | 'specialty';
export type StampTemplateSubcategory = 'address' | 'transaction' | 'signature' | 'financial' | 'notary' | 'government' | 'legal' | 'medical' | 'educational' | 'technical' | 'personal';

export interface TextZone {
  name: string;
  position: string;
  fontSize: number;
  bold: boolean;
  alignment: 'left' | 'center' | 'right';
  curved: boolean;
  curvature?: 'top' | 'bottom';
  maxLines?: number;
  lineHeight?: number;
  placeholder?: string;
}

export interface LogoZone {
  position: string;
  maxWidth: number;
  maxHeight: number;
}

export interface TemplateVariation {
  fontFamily: string;
  borderStyle: 'single' | 'double' | 'triple' | 'none';
}

export interface StampTemplate {
  id: string;
  name: string;
  description: string;
  shape: string;
  category: string;
  subcategory?: StampTemplateSubcategory;
  borderStyle: 'single' | 'double' | 'triple' | 'none';
  textZones: TextZone[];
  logoPosition?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  logoZone?: LogoZone;
  variations?: TemplateVariation[];
  recommendedFonts: string[];
  compatibility: string[];
  purpose: string;
  popularity: number;
}

export interface GeneratedDesign {
  id: string;
  templateId: string;
  templateName: string;
  previewImage?: string;
  design: StampDesign;
  score: number;
  generatedAt: Date;
}

// Content pattern types for text recognition
export interface ContentPattern {
  type: 'address' | 'phone' | 'email' | 'company' | 'date' | 'name' | 'title' | 'other';
  text: string;
  confidence: number;
}

export interface ContentAnalysisResult {
  patterns: ContentPattern[];
  contentType: 'business' | 'official' | 'personal' | 'unknown';
  complexity: number;
  textCount: number;
}
