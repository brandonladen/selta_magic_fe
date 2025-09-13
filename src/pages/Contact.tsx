import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success('Your message has been sent!', {
        description: 'We will get back to you as soon as possible.'
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Contact Us - Hair & Beauty Products</title>
      </Helmet>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Get In Touch</h2>
              <p className="mb-4">We’d love to hear from you! Whether you have questions about our products, need personalized recommendations, or want to share your Selta Magic transformation, our team is here to help.</p>
              <div className="mb-4">
                <p><span className="font-medium">📍 Address</span><br/>2603 sw 85th Ave 101 miramar Fl , 33025</p>
                <p className="mt-2"><span className="font-medium">📞 Phone</span><br/>(754) 231-7832</p>
                <p className="mt-2"><span className="font-medium">📧 Email</span><br/><a href="mailto:info@seltamagic.com" className="text-blue-600">info@seltamagic.com</a></p>
                <p className="mt-2"><span className="font-medium">🕘 Business Hours</span><br/>Monday – Friday: 9am – 6pm<br/>Saturday: 10am – 4pm</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required placeholder="your.email@example.com" />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                  <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} required placeholder="What is this regarding?" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">Message</label>
                  <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} required placeholder="Your message here..." rows={5} />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-3">Frequently Asked Questions</h3>
                <div className="space-y-3">
                  <div>
                    <p className="font-medium">What is your return policy?</p>
                    <p className="text-gray-700 text-sm">We accept returns within 30 days of purchase with receipt.</p>
                  </div>
                  <div>
                    <p className="font-medium">Do you ship internationally?</p>
                    <p className="text-gray-700 text-sm">Yes, we proudly ship worldwide so everyone can experience Selta Magic.</p>
                  </div>
                  <div>
                    <p className="font-medium">Are your products cruelty-free?</p>
                    <p className="text-gray-700 text-sm">Absolutely. All of our products are cruelty-free and never tested on animals.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
