
import React from 'react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  colorScheme?: 'green' | 'purple' | 'orange';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  colorScheme = 'green' 
}) => {
  // Define color schemes for different cards
  const colors = {
    green: {
      gradient: "bg-gradient-to-br from-primary-50 to-primary-200",
      iconBg: "bg-gradient-to-br from-primary-200 to-primary-400",
      iconColor: "text-primary-700",
      border: "border-primary-100",
      hoverShadow: "rgba(0, 128, 0, 0.2)",
      titleGradient: "from-primary-700 to-primary-500",
      glowColor: "primary"
    },
    purple: {
      gradient: "bg-gradient-to-br from-secondary-50 to-secondary-200",
      iconBg: "bg-gradient-to-br from-secondary-200 to-secondary-400",
      iconColor: "text-secondary-700",
      border: "border-secondary-100",
      hoverShadow: "rgba(138, 43, 226, 0.2)",
      titleGradient: "from-secondary-700 to-secondary-500",
      glowColor: "secondary"
    },
    orange: {
      gradient: "bg-gradient-to-br from-amber-50 to-amber-200",
      iconBg: "bg-gradient-to-br from-amber-200 to-amber-400",
      iconColor: "text-amber-700",
      border: "border-amber-100",
      hoverShadow: "rgba(245, 158, 11, 0.2)",
      titleGradient: "from-amber-700 to-amber-500",
      glowColor: "amber"
    }
  };

  const scheme = colors[colorScheme];

  return (
    <motion.div 
      className={`rounded-2xl p-5 h-full ${scheme.gradient} border ${scheme.border} shadow-lg backdrop-blur-sm`}
      whileHover={{ 
        y: -8,
        scale: 1.03,
        boxShadow: `0 20px 30px ${scheme.hoverShadow}`,
        transition: { duration: 0.3, ease: "easeOut" }
      }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.7,
        type: "spring",
        stiffness: 100,
        damping: 10
      }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <motion.div 
        className={`w-16 h-16 rounded-full ${scheme.iconBg} flex items-center justify-center mb-5 shadow-md soft-glow-${scheme.glowColor}`}
        whileHover={{ 
          scale: 1.1, 
          rotate: 5,
          transition: { duration: 0.3, type: "spring" }
        }}
        animate={{ 
          boxShadow: ['0 0 0 rgba(0,0,0,0)', `0 0 15px rgba(var(--${scheme.glowColor}-rgb), 0.3)`, '0 0 0 rgba(0,0,0,0)'],
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      >
        <motion.div 
          className={`${scheme.iconColor} text-xl`}
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [1, 0.8, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        >
          {icon}
        </motion.div>
      </motion.div>
      <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${scheme.titleGradient} bg-clip-text text-transparent`}>{title}</h3>
      <p className="text-gray-700 leading-relaxed">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
