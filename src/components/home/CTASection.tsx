
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();
  
  return (
    <motion.div 
      className="my-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-primary-gradient text-white rounded-3xl overflow-hidden relative">
          {/* Background decorative elements */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-white/5 blur-xl"></div>
          
          <div className="grid md:grid-cols-2 gap-8 p-8 md:p-12 relative z-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-primary-100 mb-8 text-lg">
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
                  className="bg-white text-primary-600 hover:bg-gray-100 font-medium px-6 py-3 rounded-xl text-base"
                  size="lg"
                >
                  Create Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  size="lg"
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Us
                </Button>
              </motion.div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Get In Touch</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Email Us</p>
                    <p className="font-medium">support@yumvi-pay.com</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Call Us</p>
                    <p className="font-medium">+1 (234) 567-8901</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full mr-3">
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Live Chat</p>
                    <p className="font-medium">Available 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CTASection;
