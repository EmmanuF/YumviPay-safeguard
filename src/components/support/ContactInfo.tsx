
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  content: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, title, content }) => (
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

const ContactInfo: React.FC = () => {
  return (
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
          <InfoItem
            icon={<Mail className="h-4 w-4 text-primary-600" />}
            title="Email Us"
            content={
              <a href="mailto:support@yumvipay.com" className="hover:text-primary-600 transition-colors">
                support@yumvipay.com
              </a>
            }
          />
          
          <InfoItem
            icon={<MapPin className="h-4 w-4 text-primary-600" />}
            title="Our Office"
            content={
              <address className="not-italic">
                2470 S DAIRY ASHFORD RD<br />
                HOUSTON TX 77077
              </address>
            }
          />
          
          <InfoItem
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
  );
};

export default ContactInfo;
