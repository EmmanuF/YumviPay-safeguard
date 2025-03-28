
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const blogPosts = [
  {
    id: 1,
    title: 'How Mobile Money is Transforming Africa',
    excerpt: 'Africa has emerged as a global leader in mobile money adoption, with services like MTN Mobile Money and Orange Money leading the way.',
    date: 'June 15, 2023',
    category: 'Industry Insights',
    author: 'Sarah Johnson',
    image: '/placeholder.svg'
  },
  {
    id: 2,
    title: 'The Impact of Remittances on African Economies',
    excerpt: 'Remittances contribute significantly to GDP in many African countries, often exceeding foreign direct investment and aid.',
    date: 'July 3, 2023',
    category: 'Economy',
    author: 'Daniel Mensah',
    image: '/placeholder.svg'
  },
  {
    id: 3,
    title: 'Security in Digital Money Transfers: What You Need to Know',
    excerpt: 'As digital money transfers grow in popularity, ensuring the security of transactions has become more important than ever.',
    date: 'August 10, 2023',
    category: 'Security',
    author: 'Michelle Nkongho',
    image: '/placeholder.svg'
  }
];

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Blog | Yumvi-Pay</title>
        <meta name="description" content="The latest insights on mobile money, remittances, and fintech innovations in Africa." />
      </Helmet>
      
      <div className="flex flex-col md:flex-row justify-between items-start mb-12">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-primary-700">Yumvi-Pay Blog</h1>
          <p className="text-lg text-gray-600">Insights on remittances, mobile money, and fintech in Africa</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <Badge variant="outline" className="hover:bg-primary-50 cursor-pointer">All</Badge>
          <Badge variant="outline" className="hover:bg-primary-50 cursor-pointer">Industry Insights</Badge>
          <Badge variant="outline" className="hover:bg-primary-50 cursor-pointer">Economy</Badge>
          <Badge variant="outline" className="hover:bg-primary-50 cursor-pointer">Security</Badge>
          <Badge variant="outline" className="hover:bg-primary-50 cursor-pointer">Tips & Guides</Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map(post => (
          <Card key={post.id} className="h-full flex flex-col">
            <div className="h-48 bg-gray-100 rounded-t-lg overflow-hidden">
              <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center mb-2">
                <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                <span className="text-xs text-gray-500 ml-2">{post.date}</span>
              </div>
              <CardTitle className="text-xl">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-gray-600">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="pt-0 flex justify-between items-center">
              <span className="text-sm text-gray-500">By {post.author}</span>
              <Button variant="ghost" className="text-primary-600 hover:text-primary-700 p-0">
                Read more →
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="mt-10 flex justify-center">
        <Button variant="outline" className="mr-2">Previous</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
};

export default Blog;
