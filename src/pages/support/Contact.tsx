
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Send, Mail, MapPin, MessageSquare } from 'lucide-react';
import MobileAppLayout from '@/components/MobileAppLayout';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/contexts/LocaleContext';

const ContactInfo: React.FC<{ icon: React.ReactNode; title: string; content: React.ReactNode }> = ({ 
  icon, title, content 
}) => (
  <div className="flex gap-3 items-start">
    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-medium text-gray-800">{title}</h3>
      <div className="text-gray-600">{content}</div>
    </div>
  </div>
);

const Contact: React.FC = () => {
  const { t } = useLocale();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Your message has been sent. We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Contact Us | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2">
            Contact Us
          </h1>
          <p className="text-gray-600">
            Have questions or need assistance? We're here to help!
          </p>
        </motion.div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-primary-700 mb-4">
              Send Us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Form fields */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john.doe@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  placeholder="How can we help you?"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Please describe your question or issue in detail..."
                  rows={5}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </motion.div>
          
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-primary-700 mb-4">
                Contact Information
              </h2>
              
              <div className="space-y-4">
                <ContactInfo
                  icon={<Mail className="h-4 w-4 text-primary-600" />}
                  title="Email Us"
                  content={
                    <a href="mailto:support@yumvipay.com" className="hover:text-primary-600 transition-colors">
                      support@yumvipay.com
                    </a>
                  }
                />
                
                <ContactInfo
                  icon={<MapPin className="h-4 w-4 text-primary-600" />}
                  title="Our Office"
                  content={
                    <address className="not-italic">
                      2470 S DAIRY ASHFORD RD<br />
                      HOUSTON TX 77077
                    </address>
                  }
                />
                
                <ContactInfo
                  icon={<MessageSquare className="h-4 w-4 text-primary-600" />}
                  title="Live Chat"
                  content={
                    <div>
                      <p>Available 24/7</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Start Chat
                      </Button>
                    </div>
                  }
                />
              </div>
            </div>
            
            <div className="bg-primary-50 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-primary-700 mb-2">
                Business Hours
              </h2>
              <div className="space-y-1 text-gray-700">
                <p>Monday - Friday: 8:00 AM - 8:00 PM</p>
                <p>Saturday: 9:00 AM - 5:00 PM</p>
                <p>Sunday: Closed</p>
                <p className="mt-2 text-sm">(Central African Time)</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </MobileAppLayout>
  );
};

export default Contact;
