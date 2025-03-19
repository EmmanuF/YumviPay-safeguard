
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from '@/components/ui/use-toast';
import { PaintBucket, Type, Box, Grid } from 'lucide-react';

const AppearanceEditor = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('colors');
  
  // Sample appearance data - in a real app, this would be fetched from a database
  const [appearance, setAppearance] = useState({
    colors: {
      primary: '#9b87f5',
      secondary: '#7E69AB',
      accent: '#6E59A5',
      text: '#1A1F2C',
      background: '#F6F6F7',
      error: '#FF3B30',
      success: '#34C759',
    },
    typography: {
      headingFont: 'Inter',
      bodyFont: 'Roboto',
      baseSize: 16,
      lineHeight: 1.5,
      fontWeight: '400',
    },
    spacing: {
      containerWidth: 1200,
      gapSize: 24,
      padding: 16,
    },
    layout: {
      roundedCorners: 8,
      shadowIntensity: 2,
      contentWidth: 'contained', // "contained", "wide", "full"
      headerStyle: 'light', // "light", "dark", "transparent"
    }
  });
  
  const handleColorChange = (colorName: string, value: string) => {
    setAppearance(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorName]: value
      }
    }));
  };
  
  const handleTypographyChange = (field: string, value: string | number) => {
    setAppearance(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [field]: value
      }
    }));
  };
  
  const handleSpacingChange = (field: string, value: number) => {
    setAppearance(prev => ({
      ...prev,
      spacing: {
        ...prev.spacing,
        [field]: value
      }
    }));
  };
  
  const handleLayoutChange = (field: string, value: string | number) => {
    setAppearance(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [field]: value
      }
    }));
  };
  
  const handleSaveAppearance = () => {
    // In a real app, this would call an API to save the appearance settings
    toast({
      title: "Appearance Saved",
      description: `Your appearance settings have been updated.`,
    });
  };
  
  const colorInputs = Object.entries(appearance.colors).map(([name, value]) => (
    <div key={name} className="grid grid-cols-3 items-center gap-4">
      <Label htmlFor={`color-${name}`} className="capitalize col-span-1">{name}</Label>
      <div className="col-span-1">
        <div 
          className="w-10 h-10 rounded-md border" 
          style={{ backgroundColor: value }}
        />
      </div>
      <Input
        id={`color-${name}`}
        type="text"
        className="col-span-1"
        value={value}
        onChange={(e) => handleColorChange(name, e.target.value)}
      />
    </div>
  ));
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
        <CardTitle className="text-lg text-primary-700">Appearance Editor</CardTitle>
        <CardDescription>
          Customize colors, typography, spacing, and layout
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <PaintBucket className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              Spacing
            </TabsTrigger>
            <TabsTrigger value="layout" className="flex items-center gap-2">
              <Grid className="h-4 w-4" />
              Layout
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="colors" className="space-y-6">
            <div className="grid gap-6">
              {colorInputs}
            </div>
            <Button onClick={handleSaveAppearance} className="w-full">Save Color Settings</Button>
          </TabsContent>
          
          <TabsContent value="typography" className="space-y-6">
            <div className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="heading-font">Heading Font</Label>
                  <Select 
                    value={appearance.typography.headingFont} 
                    onValueChange={(value) => handleTypographyChange('headingFont', value)}
                  >
                    <SelectTrigger id="heading-font">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="body-font">Body Font</Label>
                  <Select 
                    value={appearance.typography.bodyFont} 
                    onValueChange={(value) => handleTypographyChange('bodyFont', value)}
                  >
                    <SelectTrigger id="body-font">
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Poppins">Poppins</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label>Base Font Size: {appearance.typography.baseSize}px</Label>
                <Slider 
                  value={[appearance.typography.baseSize]} 
                  min={12} 
                  max={24} 
                  step={1} 
                  onValueChange={(value) => handleTypographyChange('baseSize', value[0])}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Line Height: {appearance.typography.lineHeight}</Label>
                <Slider 
                  value={[appearance.typography.lineHeight * 10]} 
                  min={10} 
                  max={25} 
                  step={1} 
                  onValueChange={(value) => handleTypographyChange('lineHeight', value[0] / 10)}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="font-weight">Font Weight</Label>
                <Select 
                  value={appearance.typography.fontWeight} 
                  onValueChange={(value) => handleTypographyChange('fontWeight', value)}
                >
                  <SelectTrigger id="font-weight">
                    <SelectValue placeholder="Select font weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Regular (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi-Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSaveAppearance} className="w-full">Save Typography Settings</Button>
          </TabsContent>
          
          <TabsContent value="spacing" className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label>Container Width: {appearance.spacing.containerWidth}px</Label>
                <Slider 
                  value={[appearance.spacing.containerWidth]} 
                  min={768} 
                  max={1920} 
                  step={8} 
                  onValueChange={(value) => handleSpacingChange('containerWidth', value[0])}
                />
              </div>
              <div className="grid gap-2">
                <Label>Gap Size: {appearance.spacing.gapSize}px</Label>
                <Slider 
                  value={[appearance.spacing.gapSize]} 
                  min={8} 
                  max={48} 
                  step={4} 
                  onValueChange={(value) => handleSpacingChange('gapSize', value[0])}
                />
              </div>
              <div className="grid gap-2">
                <Label>Padding: {appearance.spacing.padding}px</Label>
                <Slider 
                  value={[appearance.spacing.padding]} 
                  min={8} 
                  max={32} 
                  step={4} 
                  onValueChange={(value) => handleSpacingChange('padding', value[0])}
                />
              </div>
            </div>
            <Button onClick={handleSaveAppearance} className="w-full">Save Spacing Settings</Button>
          </TabsContent>
          
          <TabsContent value="layout" className="space-y-6">
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label>Rounded Corners: {appearance.layout.roundedCorners}px</Label>
                <Slider 
                  value={[appearance.layout.roundedCorners]} 
                  min={0} 
                  max={24} 
                  step={1} 
                  onValueChange={(value) => handleLayoutChange('roundedCorners', value[0])}
                />
              </div>
              <div className="grid gap-2">
                <Label>Shadow Intensity: {appearance.layout.shadowIntensity}</Label>
                <Slider 
                  value={[appearance.layout.shadowIntensity]} 
                  min={0} 
                  max={5} 
                  step={1} 
                  onValueChange={(value) => handleLayoutChange('shadowIntensity', value[0])}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content-width">Content Width</Label>
                <Select 
                  value={appearance.layout.contentWidth} 
                  onValueChange={(value) => handleLayoutChange('contentWidth', value)}
                >
                  <SelectTrigger id="content-width">
                    <SelectValue placeholder="Select content width" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contained">Contained</SelectItem>
                    <SelectItem value="wide">Wide</SelectItem>
                    <SelectItem value="full">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="header-style">Header Style</Label>
                <Select 
                  value={appearance.layout.headerStyle} 
                  onValueChange={(value) => handleLayoutChange('headerStyle', value)}
                >
                  <SelectTrigger id="header-style">
                    <SelectValue placeholder="Select header style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="transparent">Transparent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleSaveAppearance} className="w-full">Save Layout Settings</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppearanceEditor;
