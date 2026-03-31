import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { getSettings, SiteSettings } from '../data/settings';

export default function About() {
  const [settings, setSettings] = useState<SiteSettings>(getSettings());

  useEffect(() => {
    setSettings(getSettings());
  }, []);

  return (
    <div className="flex flex-col w-full">
      <header className="relative overflow-hidden bg-stone-900 text-stone-50 py-20 px-6 sm:px-12 lg:px-24">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent opacity-80" />
        
        <div className="relative z-10 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-6">
              About Us
            </h1>
            <p className="text-lg md:text-xl text-stone-300 max-w-2xl leading-relaxed">
              Marrying the idea of a city full of unique crafts with its love for connection and community.
            </p>
          </motion.div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 sm:px-12 py-16 w-full">
        <div className="prose prose-stone lg:prose-lg max-w-none">
          <h2 className="font-serif text-3xl text-stone-900 mb-6">Our Story</h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            You might know me as the Craft Wizard. I’ve been fortunate to watch Little Button Craft grow into something completely unique over the last decade. We have worked with over 275 artists within 100 miles of Rochester and recently expanded our offerings of craft classes and free events.
          </p>
          <p className="text-stone-600 leading-relaxed mb-6">
            Coming to Roc from a larger city left me missing the spaces I could walk to in my neighborhood and hang out while also checking out new goods from local artists. When I moved to the South Wedge I fell in love with the neighborhood and everyone in it. There’s a strong sense of community and acceptance here that I have never found or experienced anywhere else.
          </p>
          <p className="text-stone-600 leading-relaxed mb-6">
            I got the opportunity to take over the LBC space and have been doing my best to showcase the local Rochester handmade goods scene. Through this showcase, I aim to provide creative inspiration, as well as an accessible, affordable, and approachable environment to help the Rochester artistic community grow.
          </p>
          <p className="text-stone-600 leading-relaxed mb-8 italic">
            — Shelby, Owner, Little Button Craft
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 my-16">
            <img 
              src={settings.aboutImage1} 
              alt="About Us Image 1" 
              className="rounded-lg shadow-md w-full h-64 object-cover"
              referrerPolicy="no-referrer"
            />
            <img 
              src={settings.aboutImage2} 
              alt="About Us Image 2" 
              className="rounded-lg shadow-md w-full h-64 object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <h2 className="font-serif text-3xl text-stone-900 mb-6">What We Do</h2>
          <p className="text-stone-600 leading-relaxed mb-6">
            The word "craft" can mean a whole lot. To the team here at Little Button, it means anything that's created by hand. This includes knitting, illustration, photography, needle felting, woodwork, and so much more!
          </p>
          <p className="text-stone-600 leading-relaxed mb-6">
            We are a community center for creatives, offering:
          </p>
          <ul className="list-disc pl-6 text-stone-600 space-y-2 mb-8">
            <li>Curated, high-quality craft supplies for knitting, crochet, embroidery, and sewing.</li>
            <li>A rotating selection of handmade goods from local Rochester artisans.</li>
            <li>Workshops and classes taught by experienced, patient instructors.</li>
            <li>Free community events like Fiber Nights and clothing swaps to help you connect with fellow makers.</li>
          </ul>

          <h2 className="font-serif text-3xl text-stone-900 mb-6">Our Values</h2>
          <p className="text-stone-600 leading-relaxed">
            Whether you're a writer, painter, sculptor, quilter, engineer, or an admirer of those who create; you are welcome. Craft does not discriminate by any means. Any individual of any characteristic can create, and through our ability to create, we can craft a community that will continue to grow.
          </p>
        </div>
      </main>
    </div>
  );
}
