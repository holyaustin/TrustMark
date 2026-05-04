'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen py-12 md:py-16">
      <div className="container-custom max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 text-center">Contact Us</h1>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-8">Have questions? We'd love to hear from you.</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Get in Touch</h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <p>📧 support@trustmark.africa</p>
              <p>📞 +234 (0) 123 456 7890</p>
              <p>📍 Lagos, Nigeria</p>
              <p>🕒 Mon-Fri: 9am - 6pm WAT</p>
            </div>
          </Card>
          
          <Card className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Your Name" className="w-full p-3 border rounded-lg dark:bg-gray-800" onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input type="email" placeholder="Your Email" className="w-full p-3 border rounded-lg dark:bg-gray-800" onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <textarea placeholder="Your Message" rows={4} className="w-full p-3 border rounded-lg dark:bg-gray-800" onChange={(e) => setFormData({...formData, message: e.target.value})} required />
              <Button type="submit" className="w-full">{submitted ? 'Sent!' : 'Send Message'}</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}