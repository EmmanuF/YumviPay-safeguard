
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Smartphone, CreditCard, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <UserPlus className="h-8 w-8 text-white" />,
      title: "Sign Up",
      description: "Create your Yumvi-Pay account in minutes with just a few details",
      color: {
        bg: "bg-gradient-to-br from-primary-400 to-primary-600",
        hover: "from-primary-500 to-primary-700",
        shadow: "rgba(0, 128, 0, 0.3)"
      }
    },
    {
      id: 2,
      icon: <Smartphone className="h-8 w-8 text-white" />,
      title: "Add Recipient",
      description: "Enter your recipient's details or choose from your saved contacts",
      color: {
        bg: "bg-gradient-to-br from-secondary-400 to-secondary-600",
        hover: "from-secondary-500 to-secondary-700",
        shadow: "rgba(138, 43, 226, 0.3)"
      }
    },
    {
      id: 3,
      icon: <CreditCard className="h-8 w-8 text-white" />,
      title: "Make Payment",
      description: "Choose your payment method and complete the transaction securely",
      color: {
        bg: "bg-gradient-to-br from-amber-400 to-amber-600",
        hover: "from-amber-500 to-amber-700",
        shadow: "rgba(245, 158, 11, 0.3)"
      }
    },
    {
      id: 4,
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "Money Delivered",
      description: "Your recipient gets the money quickly through their preferred method",
      color: {
        bg: "bg-gradient-to-br from-indigo-400 to-indigo-600",
        hover: "from-indigo-500 to-indigo-700",
        shadow: "rgba(99, 102, 241, 0.3)"
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <motion.div 
      className="my-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 text-gradient-primary"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Sending money to Africa has never been easier
          </motion.p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div 
              key={step.id}
              className={`rounded-xl p-6 text-center relative border border-white/20 backdrop-blur-sm shadow-lg ${step.color.bg}`}
              variants={itemVariants}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                boxShadow: `0 20px 30px ${step.color.shadow}`,
                background: `linear-gradient(to bottom right, var(--${step.color.hover.split('-')[1]}))`,
                transition: { duration: 0.3, ease: "easeOut" }
              }}
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 -right-3 w-6 h-1 bg-white/50 z-0"></div>
              )}
              <div className="bg-white/30 backdrop-blur-md rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-md transform transition-transform duration-300 hover:rotate-12 border border-white/40">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut"
                  }}
                >
                  {step.icon}
                </motion.div>
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">{step.title}</h3>
              <p className="text-white/90 leading-relaxed">{step.description}</p>
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-white text-indigo-600 flex items-center justify-center text-lg font-bold shadow-lg border border-indigo-100">
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
