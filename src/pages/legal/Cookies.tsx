
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';

const Cookies = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Cookie Policy | Yumvi-Pay</title>
        <meta name="description" content="Yumvi-Pay's cookie policy explains how we use cookies and similar technologies." />
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6 text-primary-700">Cookie Policy</h1>
      
      <div className="prose max-w-none">
        <p className="text-lg mb-6">
          This Cookie Policy explains how Yumvi-Pay uses cookies and similar technologies to recognize you when you visit
          our website and mobile application. It explains what these technologies are and why we use them, as well as your
          rights to control our use of them.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">What Are Cookies?</h2>
          <p>
            Cookies are small data files that are placed on your computer or mobile device when you visit a website.
            Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well
            as to provide reporting information.
          </p>
          <p className="mt-4">
            Cookies set by the website owner (in this case, Yumvi-Pay) are called "first-party cookies". Cookies set by
            parties other than the website owner are called "third-party cookies". Third-party cookies enable third-party
            features or functionality to be provided on or through the website (e.g., advertising, interactive content,
            and analytics).
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Types of Cookies We Use</h2>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type of Cookie</TableHead>
                <TableHead>Purpose</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Essential Cookies</TableCell>
                <TableCell>
                  These cookies are necessary for the website to function properly. They enable core functionality such as
                  security, network management, and account access. You may disable these by changing your browser settings,
                  but this may affect how the website functions.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Analytics Cookies</TableCell>
                <TableCell>
                  These cookies help us understand how visitors interact with our website by collecting and reporting information
                  anonymously. This helps us improve our website and services.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Functionality Cookies</TableCell>
                <TableCell>
                  These cookies enable the website to provide enhanced functionality and personalization. They may be set by us
                  or by third-party providers whose services we have added to our pages.
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Marketing Cookies</TableCell>
                <TableCell>
                  These cookies are used to track visitors across websites. The intention is to display ads that are relevant
                  and engaging for the individual user and thereby more valuable for publishers and third-party advertisers.
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">How to Control Cookies</h2>
          <p>
            You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies,
            you may still use our website though your access to some functionality and areas of our website may be restricted.
          </p>
          <p className="mt-4">
            Most browsers also allow you to control cookies through their settings preferences. For more information on how
            to manage cookies in your web browser, visit <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">www.allaboutcookies.org</a>.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Your Cookie Preferences</h2>
          <p className="mb-4">
            You can set your cookie preferences by selecting which types of cookies you accept or reject.
            Essential cookies cannot be rejected as they are necessary for the website to function.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button variant="outline" className="border-primary-300">Accept All</Button>
            <Button variant="outline" className="border-primary-300">Essential Only</Button>
            <Button variant="outline" className="border-primary-300">Customize Settings</Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-primary-600">Updates to This Cookie Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in technology, regulation, or our business
            practices. Any changes will become effective when we post the revised Cookie Policy on our website.
          </p>
          <p className="mt-4">
            If you have any questions about our use of cookies, please contact us at{' '}
            <a href="mailto:privacy@yumvi-pay.com" className="text-primary-600 hover:text-primary-700">
              privacy@yumvi-pay.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cookies;
