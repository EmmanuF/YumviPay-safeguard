
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { usePreview } from '@/contexts/PreviewContext';

const ContentEditor = () => {
  const { toast } = useToast();
  const { updatePreviewData } = usePreview();
  
  const [homeContent, setHomeContent] = useState({
    title: 'Send Money to Cameroon',
    subtitle: 'Fast and secure way to transfer money to your loved ones',
    heroText: '<p>Yumvi-Pay provides the easiest way to send money to Cameroon with competitive rates and low fees. Send money to family and friends with just a few taps.</p>',
  });
  
  const [aboutContent, setAboutContent] = useState({
    title: 'About Yumvi-Pay',
    subtitle: 'Our mission and values',
    mainContent: '<p>Yumvi-Pay was founded with a simple mission: to make international money transfers to Africa simple, affordable, and accessible to everyone. We specialize in providing seamless money transfer services with a focus on Cameroon.</p><p>Our team combines expertise in financial technology with deep understanding of African markets to offer you the best service possible.</p>',
  });
  
  // Send content to preview when it changes
  useEffect(() => {
    updatePreviewData({
      content: `
        <div style="font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 2rem; font-weight: bold; color: #333;">${homeContent.title}</h1>
          <h2 style="font-size: 1.2rem; color: #666; margin-bottom: 1rem;">${homeContent.subtitle}</h2>
          <div>${homeContent.heroText}</div>
        </div>
      `,
      pageType: 'home'
    });
  }, [homeContent, updatePreviewData]);
  
  const handleHomeContentChange = (field: keyof typeof homeContent, value: string) => {
    setHomeContent(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleAboutContentChange = (field: keyof typeof aboutContent, value: string) => {
    setAboutContent(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Update preview data if about section is being edited
    updatePreviewData({
      content: `
        <div style="font-family: system-ui, sans-serif; max-width: 800px; margin: 0 auto;">
          <h1 style="font-size: 2rem; font-weight: bold; color: #333;">${aboutContent.title}</h1>
          <h2 style="font-size: 1.2rem; color: #666; margin-bottom: 1rem;">${aboutContent.subtitle}</h2>
          <div>${aboutContent.mainContent}</div>
        </div>
      `,
      pageType: 'about'
    });
  };
  
  const handleSaveContent = () => {
    toast({
      title: "Content Saved",
      description: "Your content changes have been saved successfully"
    });
  };
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
        <CardTitle className="text-lg text-primary-700">Content Editor</CardTitle>
        <CardDescription>
          Edit website text content and manage translations
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="home" className="space-y-4">
          <TabsList>
            <TabsTrigger value="home">Home Page</TabsTrigger>
            <TabsTrigger value="about">About Us</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="home" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="home-title">Page Title</Label>
                <Input 
                  id="home-title" 
                  value={homeContent.title}
                  onChange={(e) => handleHomeContentChange('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="home-subtitle">Subtitle</Label>
                <Input 
                  id="home-subtitle" 
                  value={homeContent.subtitle}
                  onChange={(e) => handleHomeContentChange('subtitle', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="home-hero">Hero Content (HTML)</Label>
                <Textarea 
                  id="home-hero" 
                  rows={6}
                  value={homeContent.heroText}
                  onChange={(e) => handleHomeContentChange('heroText', e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="about" className="space-y-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="about-title">Page Title</Label>
                <Input 
                  id="about-title" 
                  value={aboutContent.title}
                  onChange={(e) => handleAboutContentChange('title', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-subtitle">Subtitle</Label>
                <Input 
                  id="about-subtitle" 
                  value={aboutContent.subtitle}
                  onChange={(e) => handleAboutContentChange('subtitle', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="about-content">Main Content (HTML)</Label>
                <Textarea 
                  id="about-content" 
                  rows={10}
                  value={aboutContent.mainContent}
                  onChange={(e) => handleAboutContentChange('mainContent', e.target.value)}
                  className="font-mono text-sm"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="services">
            <div className="py-8 text-center text-muted-foreground">
              Services content editor will be available soon.
            </div>
          </TabsContent>
          
          <TabsContent value="faq">
            <div className="py-8 text-center text-muted-foreground">
              FAQ content editor will be available soon.
            </div>
          </TabsContent>
          
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSaveContent}
              className="bg-primary-600 hover:bg-primary-700"
            >
              Save Content
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentEditor;
