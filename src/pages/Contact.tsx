import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage for demo purposes since Firebase was declined
      const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      const newMessage = {
        id: Date.now().toString(),
        ...formData,
        timestamp: new Date().toISOString(),
        read: false
      };
      localStorage.setItem('contact_messages', JSON.stringify([newMessage, ...existingMessages]));

      toast.success('Message sent successfully!', {
        description: "We'll get back to you as soon as possible."
      });
      
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error('Failed to send message', {
        description: 'Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <header className="relative overflow-hidden bg-stone-900 text-stone-50 py-20 px-6 sm:px-12 lg:px-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent opacity-80" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-6">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl text-stone-300 max-w-2xl leading-relaxed">
              Have a question about a class, looking for a specific yarn, or just want to say hi? We'd love to hear from you.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 sm:px-12 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* Contact Information */}
          <div className="space-y-12">
            <div>
              <h2 className="font-serif text-3xl text-stone-900 mb-6">Get in Touch</h2>
              <p className="text-stone-600 leading-relaxed mb-8">
                Visit our shop in Rochester, NY, or reach out to us via phone or email. We try our best to respond to all inquiries within 24 hours.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-rose-100 p-3 rounded-full text-rose-700 shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 text-lg">Visit Us</h3>
                  <p className="text-stone-600 mt-1">
                    658 South Ave<br />
                    Rochester, NY 14620
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-700 shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 text-lg">Store Hours</h3>
                  <div className="text-stone-600 mt-1 grid grid-cols-2 gap-x-4">
                    <span>Mon - Tue:</span> <span>Closed</span>
                    <span>Wed - Fri:</span> <span>11:00 AM - 6:00 PM</span>
                    <span>Saturday:</span> <span>10:00 AM - 5:00 PM</span>
                    <span>Sunday:</span> <span>11:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-emerald-100 p-3 rounded-full text-emerald-700 shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 text-lg">Call Us</h3>
                  <p className="text-stone-600 mt-1">(585) 555-0198</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-stone-200 p-3 rounded-full text-stone-700 shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-medium text-stone-900 text-lg">Email</h3>
                  <p className="text-stone-600 mt-1">shelby@littlebuttoncraft.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-stone-200 shadow-sm bg-white">
              <CardContent className="p-8">
                <h2 className="font-serif text-2xl text-stone-900 mb-6">Send a Message</h2>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="firstName" className="text-sm font-medium text-stone-700">First Name</label>
                      <Input 
                        id="firstName" 
                        placeholder="Jane" 
                        className="bg-stone-50" 
                        required 
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="lastName" className="text-sm font-medium text-stone-700">Last Name</label>
                      <Input 
                        id="lastName" 
                        placeholder="Doe" 
                        className="bg-stone-50" 
                        required 
                        value={formData.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-stone-700">Email Address</label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="jane@example.com" 
                      className="bg-stone-50" 
                      required 
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="text-sm font-medium text-stone-700">Subject</label>
                    <Input 
                      id="subject" 
                      placeholder="Question about a class" 
                      className="bg-stone-50" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-stone-700">Message</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      className="w-full rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm ring-offset-white placeholder:text-stone-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200 focus-visible:ring-offset-2"
                      placeholder="How can we help you?"
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-stone-900 hover:bg-stone-800 text-white h-12"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  );
}
