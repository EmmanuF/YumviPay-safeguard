
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import MobileAppLayout from '@/components/MobileAppLayout';
import { useLocale } from '@/contexts/LocaleContext';
import { BookOpenIcon, CalendarIcon, UserIcon, TagIcon } from 'lucide-react';

const Blog: React.FC = () => {
  const { t } = useLocale();
  
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const blogPosts = [
    {
      title: "How Mobile Money is Transforming Financial Access in Cameroon",
      date: "March 15, 2024",
      author: "Jean Mbida",
      category: "Market Insights",
      excerpt: "Mobile money has revolutionized financial services in Cameroon, providing banking access to millions previously underserved. This article explores the impact and future potential of mobile payment services.",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "5 Things to Know Before Sending Money to Africa",
      date: "February 28, 2024",
      author: "Sarah Johnson",
      category: "Tips & Guides",
      excerpt: "Planning to send money to friends or family in Africa? Here are five important things you should know to ensure your transfer is fast, secure, and cost-effective.",
      imageUrl: "/placeholder.svg"
    },
    {
      title: "Understanding Exchange Rates: Getting the Best Value When Sending Money",
      date: "January 20, 2024",
      author: "Michael Tanyi",
      category: "Financial Education",
      excerpt: "Exchange rates can significantly impact how much money your recipients actually get. Learn how to understand currency exchange and maximize the value of your transfers.",
      imageUrl: "/placeholder.svg"
    }
  ];
  
  const categories = [
    "Market Insights", 
    "Tips & Guides", 
    "Financial Education", 
    "Company News", 
    "Customer Stories"
  ];
  
  return (
    <MobileAppLayout>
      <Helmet>
        <title>Blog | {t('app.name')}</title>
      </Helmet>
      
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <motion.div
          className="space-y-8"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
          <motion.div variants={fadeIn}>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-800 mb-2">
              Yumvi-Pay Blog
            </h1>
            <p className="text-gray-600">
              Insights about money transfers, African economies, and financial inclusion
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              {blogPosts.map((post, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeIn} 
                  className="bg-white rounded-xl overflow-hidden shadow-sm mb-6"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 bg-primary-600 text-white px-3 py-1 text-sm">
                      {post.category}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-primary-800 mb-2">
                      {post.title}
                    </h2>
                    <div className="flex items-center text-gray-500 text-sm mb-3">
                      <div className="flex items-center mr-4">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      {post.excerpt}
                    </p>
                    <button className="text-primary-700 font-medium hover:text-primary-800 transition-colors flex items-center">
                      Read more 
                      <span className="ml-1">→</span>
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.div variants={fadeIn} className="space-y-6">
              <div className="bg-white rounded-xl p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-primary-700 mb-3">Categories</h3>
                <ul className="space-y-2">
                  {categories.map((category, index) => (
                    <li key={index}>
                      <button className="flex items-center text-gray-700 hover:text-primary-700 transition-colors">
                        <TagIcon className="h-4 w-4 mr-2" />
                        <span>{category}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-primary-50 rounded-xl p-5">
                <h3 className="text-lg font-semibold text-primary-700 mb-3">Subscribe to Updates</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Get the latest blog posts and insights delivered to your inbox.
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  <button className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </MobileAppLayout>
  );
};

export default Blog;
