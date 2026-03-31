import { motion } from 'motion/react';
import { Star, ArrowRight, Heart, Scissors, Palette } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      text: "Little Button Craft is an absolute gem! The staff is incredibly welcoming and the classes are so much fun. I learned to crochet here and made so many friends.",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "James T.",
      text: "A beautiful space filled with local art and craft supplies. Their fiber nights are the highlight of my week. The community they've built is truly special. Highly recommend!",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Emily R.",
      text: "Best craft store ever. They have a great selection of yarn and embroidery supplies. I took the sewing 101 class and the instructor was so patient and knowledgeable.",
      date: "3 months ago"
    }
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-stone-100 py-24 px-6 sm:px-12 lg:px-24 flex items-center min-h-[80vh]">
        <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#fdfbf7] via-[#fdfbf7]/90 to-transparent" />
        
        <div className="relative z-10 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 bg-rose-100 text-rose-800 hover:bg-rose-200 border-rose-200 text-sm px-3 py-1">
              Welcome to our creative hub
            </Badge>
            <h1 className="text-5xl md:text-7xl font-serif font-medium leading-tight mb-6 text-stone-900">
              Your Local Haven for <span className="text-rose-600 italic">Makers</span>
            </h1>
            <p className="text-lg md:text-xl text-stone-600 max-w-2xl leading-relaxed mb-10">
              Blending Rochester’s vibrant craft culture with its strong sense of community, we create a welcoming space where every maker feels at home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button render={<Link to="/events" />} nativeButton={false} size="lg" className="bg-stone-900 hover:bg-stone-800 text-white text-base h-14 px-8">
                Explore Classes <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button render={<Link to="/about" />} nativeButton={false} variant="outline" size="lg" className="border-stone-300 text-stone-700 hover:bg-stone-100 text-base h-14 px-8">
                Our Story
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">What We Offer</h2>
            <div className="w-24 h-1 bg-rose-200 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mb-6">
                <Palette className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-serif font-medium text-stone-900">275+ Local Artists</h3>
              <p className="text-stone-600 leading-relaxed">
                We work with over 275 artists within 100 miles of Rochester to showcase the best of our local handmade scene.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-6">
                <Scissors className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-serif font-medium text-stone-900">Workshops & Classes</h3>
              <p className="text-stone-600 leading-relaxed">
                From beginner sewing to advanced embroidery, our expert instructors are here to help you learn new skills.
              </p>
            </motion.div>
            
            <motion.div 
              whileHover={{ y: -5 }}
              className="text-center space-y-4"
            >
              <div className="w-16 h-16 mx-auto bg-rose-100 text-rose-700 rounded-full flex items-center justify-center mb-6">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-serif font-medium text-stone-900">Community First</h3>
              <p className="text-stone-600 leading-relaxed">
                From free Fiber Nights to clothing swaps, we provide an accessible and approachable space for everyone to grow.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <section className="py-24 px-6 sm:px-12 lg:px-24 bg-stone-50 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Loved by the Community</h2>
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-6 w-6 fill-current" />
                  ))}
                </div>
                <span className="text-stone-600 font-medium ml-2">5.0 Average on Google Reviews</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full bg-white border-stone-200 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex text-amber-400 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-stone-700 leading-relaxed flex-1 italic mb-6">
                      "{review.text}"
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-stone-100">
                      <span className="font-medium text-stone-900">{review.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center bg-stone-900 text-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif mb-6">Ready to start making?</h2>
          <p className="text-stone-300 text-lg mb-10">
            Check out our upcoming classes or drop by the store to say hello!
          </p>
          <Button render={<Link to="/events" />} nativeButton={false} size="lg" className="bg-rose-600 hover:bg-rose-700 text-white h-14 px-10 text-lg">
            View Calendar
          </Button>
        </div>
      </section>
    </div>
  );
}
