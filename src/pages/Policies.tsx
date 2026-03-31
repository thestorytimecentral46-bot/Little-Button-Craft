import React from 'react';
import { motion } from 'motion/react';
import { Shield, FileText, Info, AlertCircle } from 'lucide-react';

export default function Policies() {
  const policies = [
    {
      title: "Class Cancellation Policy",
      icon: <AlertCircle className="h-6 w-6 text-rose-600" />,
      content: "We understand that plans change. If you need to cancel your registration for a class, please do so at least 48 hours in advance for a full refund. Cancellations made within 48 hours are eligible for store credit only. No-shows are not eligible for refunds or credit."
    },
    {
      title: "Privacy Policy",
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      content: "Your privacy is important to us. We only collect information necessary to process your registrations and provide you with the best experience. We never sell your data to third parties. Any information shared with us is kept secure and used only for the purposes stated."
    },
    {
      title: "Shop Rules & Safety",
      icon: <Info className="h-6 w-6 text-amber-600" />,
      content: "Little Button Craft is a safe space for everyone. We expect all visitors and students to treat each other with respect. When using shop tools, please follow all safety instructions provided by our staff. We reserve the right to ask anyone to leave if they are creating an unsafe or disrespectful environment."
    },
    {
      title: "Return Policy",
      icon: <FileText className="h-6 w-6 text-stone-600" />,
      content: "Unused yarn in its original condition (with labels intact) can be returned for store credit within 30 days of purchase. Special orders, needles, and patterns are final sale. If you find a defect in a product, please bring it in and we'll make it right."
    }
  ];

  return (
    <div className="flex flex-col w-full">
      <header className="bg-stone-900 text-stone-50 py-16 px-6 sm:px-12 lg:px-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif font-medium mb-4">Shop Policies</h1>
          <p className="text-stone-400 max-w-2xl mx-auto">
            Everything you need to know about our classes, returns, and how we keep our community safe.
          </p>
        </motion.div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 w-full">
        <div className="grid grid-cols-1 gap-8">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2 bg-stone-50 rounded-lg">
                  {policy.icon}
                </div>
                <h2 className="text-2xl font-serif text-stone-900">{policy.title}</h2>
              </div>
              <p className="text-stone-600 leading-relaxed">
                {policy.content}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 p-8 bg-rose-50 rounded-2xl border border-rose-100 text-center">
          <h3 className="text-xl font-serif text-rose-900 mb-2">Still have questions?</h3>
          <p className="text-rose-700 mb-6">We're here to help. Reach out to us directly.</p>
          <a 
            href="/contact" 
            className="inline-flex items-center justify-center px-6 py-3 bg-rose-600 text-white rounded-full font-medium hover:bg-rose-700 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </main>
    </div>
  );
}
