
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Home, Heart, TrendingUp, Users, Settings } from 'lucide-react';

const ContentEditor = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('hero');
  
  // Sample content data - in a real app, this would be fetched from the database
  const [contentData, setContentData] = useState({
    hero: {
      title: "Transfer Without Boundaries",
      description: "Send money to Africa with zero fees, better exchange rates, and lightning-fast transfers. Your loved ones receive funds directly to their mobile wallets or bank accounts.",
      cta: "Get Started",
    },
    features: {
      title: "Why Choose Yumvi-Pay",
      feature1Title: "Best Exchange Rates",
      feature1Description: "We offer the most competitive exchange rates in the market, ensuring you get more value for your money.",
      feature2Title: "Zero Transfer Fees",
      feature2Description: "No hidden charges or markup fees. What you send is what they get.",
      feature3Title: "Secure & Compliant",
      feature3Description: "Advanced encryption and fully compliant with financial regulations for your peace of mind."
    },
    countries: {
      title: "Send Money Across Africa",
      description: "We support transfers to multiple African countries, with more being added regularly"
    },
    testimonials: {
      title: "What Our Customers Say",
      description: "Join thousands of satisfied customers who trust Yumvi-Pay for their money transfer needs"
    }
  });
  
  const handleInputChange = (section: string, field: string, value: string) => {
    setContentData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };
  
  const handleSaveContent = () => {
    // In a real app, this would call an API to save the content to the database
    toast({
      title: "Content Saved",
      description: `${activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} section content has been updated.`,
    });
  };
  
  return (
    <Card className="border-none shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-t-lg">
        <CardTitle className="text-lg text-primary-700">Content Editor</CardTitle>
        <CardDescription>
          Edit text content for different sections of your website
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="hero" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              Hero
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="countries" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Countries
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Testimonials
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="hero" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hero-title">Main Heading</Label>
                <Input 
                  id="hero-title" 
                  value={contentData.hero.title}
                  onChange={(e) => handleInputChange('hero', 'title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero-description">Description</Label>
                <Textarea 
                  id="hero-description" 
                  rows={4}
                  value={contentData.hero.description}
                  onChange={(e) => handleInputChange('hero', 'description', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hero-cta">Call to Action Button</Label>
                <Input 
                  id="hero-cta" 
                  value={contentData.hero.cta}
                  onChange={(e) => handleInputChange('hero', 'cta', e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSaveContent} className="w-full">Save Hero Content</Button>
          </TabsContent>
          
          <TabsContent value="features" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="features-title">Section Title</Label>
                <Input 
                  id="features-title" 
                  value={contentData.features.title}
                  onChange={(e) => handleInputChange('features', 'title', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="feature1-title">Feature 1 Title</Label>
                  <Input 
                    id="feature1-title" 
                    value={contentData.features.feature1Title}
                    onChange={(e) => handleInputChange('features', 'feature1Title', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="feature1-description">Feature 1 Description</Label>
                  <Textarea 
                    id="feature1-description" 
                    rows={2}
                    value={contentData.features.feature1Description}
                    onChange={(e) => handleInputChange('features', 'feature1Description', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="feature2-title">Feature 2 Title</Label>
                  <Input 
                    id="feature2-title" 
                    value={contentData.features.feature2Title}
                    onChange={(e) => handleInputChange('features', 'feature2Title', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="feature2-description">Feature 2 Description</Label>
                  <Textarea 
                    id="feature2-description" 
                    rows={2}
                    value={contentData.features.feature2Description}
                    onChange={(e) => handleInputChange('features', 'feature2Description', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="feature3-title">Feature 3 Title</Label>
                  <Input 
                    id="feature3-title" 
                    value={contentData.features.feature3Title}
                    onChange={(e) => handleInputChange('features', 'feature3Title', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="feature3-description">Feature 3 Description</Label>
                  <Textarea 
                    id="feature3-description" 
                    rows={2}
                    value={contentData.features.feature3Description}
                    onChange={(e) => handleInputChange('features', 'feature3Description', e.target.value)}
                  />
                </div>
              </div>
            </div>
            <Button onClick={handleSaveContent} className="w-full">Save Features Content</Button>
          </TabsContent>
          
          <TabsContent value="countries" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="countries-title">Section Title</Label>
                <Input 
                  id="countries-title" 
                  value={contentData.countries.title}
                  onChange={(e) => handleInputChange('countries', 'title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="countries-description">Description</Label>
                <Textarea 
                  id="countries-description" 
                  rows={4}
                  value={contentData.countries.description}
                  onChange={(e) => handleInputChange('countries', 'description', e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSaveContent} className="w-full">Save Countries Content</Button>
          </TabsContent>
          
          <TabsContent value="testimonials" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="testimonials-title">Section Title</Label>
                <Input 
                  id="testimonials-title" 
                  value={contentData.testimonials.title}
                  onChange={(e) => handleInputChange('testimonials', 'title', e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="testimonials-description">Description</Label>
                <Textarea 
                  id="testimonials-description" 
                  rows={4}
                  value={contentData.testimonials.description}
                  onChange={(e) => handleInputChange('testimonials', 'description', e.target.value)}
                />
              </div>
            </div>
            <Button onClick={handleSaveContent} className="w-full">Save Testimonials Content</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ContentEditor;
