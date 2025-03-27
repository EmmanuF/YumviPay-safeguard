
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Smartphone, CreditCard, CheckCircle, ChevronRight } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <UserPlus className="h-8 w-8 text-white" />,
      title: "Sign Up",
      description: "Create your Yumvi-Pay account in minutes with just a few details",
      tooltip: "No complicated paperwork - just enter your basic information and you're ready to go",
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
      tooltip: "Save recipients for quick access or choose from your phone contacts",
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
      tooltip: "Multiple secure payment options available including mobile money and bank transfers",
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
      tooltip: "Track your transaction in real-time and get notification when it's complete",
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
    <TooltipProvider>
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
          
          <div className="grid md:grid-cols-4 gap-6 relative">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <motion.div 
                  className={`rounded-3xl p-6 text-center relative border border-white/20 backdrop-blur-sm shadow-lg ${step.color.bg} overflow-hidden`}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -10, 
                    scale: 1.03,
                    boxShadow: `0 20px 30px ${step.color.shadow}`,
                    background: `linear-gradient(to bottom right, var(--${step.color.hover.split('-')[1]}))`,
                    transition: { duration: 0.3, ease: "easeOut" }
                  }}
                >
                  {/* Connection arrows between steps - improved visibility */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:flex absolute top-1/2 -right-3 z-20 transform -translate-y-1/2">
                      <div className="connector-line w-[30px] h-[3px] bg-white/80 absolute top-1/2 transform -translate-y-1/2 right-[14px] shadow-[0_0_8px_rgba(255,255,255,0.6)]"></div>
                      <motion.div
                        animate={{ 
                          x: [0, 5, 0], 
                          opacity: [0.8, 1, 0.8]
                        }}
                        transition={{ 
                          duration: 1.5, 
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                        className="bg-white rounded-full p-1 shadow-md z-20 relative shadow-[0_0_10px_rgba(255,255,255,0.7)]"
                      >
                        <ChevronRight size={20} className="text-gray-800" strokeWidth={3} />
                      </motion.div>
                    </div>
                  )}
                  
                  <HoverCard openDelay={100} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <div className="bg-white/30 backdrop-blur-md rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-5 shadow-md transform transition-transform duration-300 hover:rotate-12 border border-white/40 cursor-help">
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
                    </HoverCardTrigger>
                    <HoverCardContent className="p-3 w-64 bg-white shadow-lg border border-gray-200 rounded-lg z-50 text-left">
                      <p className="text-sm font-medium text-gray-800">{step.tooltip}</p>
                    </HoverCardContent>
                  </HoverCard>
                  
                  <h3 className="font-bold text-xl mb-3 text-white">{step.title}</h3>
                  <p className="text-white/90 leading-relaxed">{step.description}</p>
                  
                  {/* Repositioned number indicator with improved visibility */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center text-lg font-bold shadow-md border border-white cursor-help">
                        {step.id}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-white/90 backdrop-blur-md border border-white/40">
                      <p className="text-sm font-medium">Step {step.id}</p>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default HowItWorks;
