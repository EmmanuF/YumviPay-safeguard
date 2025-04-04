
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const CTASection = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Your message has been sent. We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1000);
  };
  
  return (
    <motion.div 
      className="my-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-primary-500 text-white rounded-2xl overflow-hidden relative shadow-xl">
          {/* Decorative elements with better visibility */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/15 blur-xl"></div>
          
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white drop-shadow-sm">Ready to Get Started?</h2>
              <p className="text-white text-opacity-90 mb-8 text-lg">
                Join thousands of customers who trust Yumvi-Pay for their money transfers to Africa
              </p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={() => navigate('/signup')}
                  className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-6 py-6 rounded-xl text-base shadow-md"
                  size="lg"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  className="border-white border-2 bg-white/10 text-white hover:bg-white hover:text-primary-600 font-semibold transition-colors shadow-md py-6"
                  size="lg"
                  onClick={() => navigate('/support/contact')}
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
              </motion.div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-white">Get In Touch</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    required
                    className="bg-white/30 border-white/20 text-white placeholder:text-white/70 focus:border-white shadow-md h-12"
                  />
                </div>
                
                <div>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    required
                    className="bg-white/30 border-white/20 text-white placeholder:text-white/70 focus:border-white shadow-md h-12"
                  />
                </div>
                
                <div>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    required
                    rows={3}
                    className="bg-white/30 border-white/20 text-white placeholder:text-white/70 focus:border-white shadow-md resize-none"
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-white text-primary-600 hover:bg-white/90 py-6 shadow-md" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CTASection;
