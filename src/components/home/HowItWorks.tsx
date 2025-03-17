
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Smartphone, CreditCard, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <UserPlus className="h-8 w-8 text-primary-500" />,
      title: "Sign Up",
      description: "Create your Yumvi-Pay account in minutes with just a few details"
    },
    {
      id: 2,
      icon: <Smartphone className="h-8 w-8 text-primary-500" />,
      title: "Add Recipient",
      description: "Enter your recipient's details or choose from your saved contacts"
    },
    {
      id: 3,
      icon: <CreditCard className="h-8 w-8 text-primary-500" />,
      title: "Make Payment",
      description: "Choose your payment method and complete the transaction securely"
    },
    {
      id: 4,
      icon: <CheckCircle className="h-8 w-8 text-primary-500" />,
      title: "Money Delivered",
      description: "Your recipient gets the money quickly through their preferred method"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="my-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sending money to Africa has never been easier
          </p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              className="glass-effect rounded-xl p-6 text-center relative"
              variants={itemVariants}
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-3 w-6 h-1 bg-primary-200 z-0"></div>
              )}
              <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 relative z-10">
                {step.icon}
              </div>
              <h3 className="font-bold text-xl mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
              <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
                {step.id}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default HowItWorks;
