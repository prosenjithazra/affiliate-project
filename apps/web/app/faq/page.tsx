import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { HelpCircle } from "lucide-react";
import { buildFAQSchema } from "../../lib/seo/faq";

export const metadata = {
  title: "ShopZone - Frequently Asked Questions",
  description: "Get answers to frequently asked questions about our unbiased hardware specifications comparison tables."
};

const faqs = [
  {
    question: "How does ShopZone verify specifications sheets?",
    answer: "Our editors audit and verify specs sheets directly from manufacturer data sheets and release specs to guarantee data integrity."
  },
  {
    question: "How do referral and affiliate discounts work?",
    answer: "When you choose a deal voucher and redirect to a store, the partner merchant pays us a small fee at no extra cost to you. This funds our database hosting."
  }
];

export default function FaqPage() {
  const faqJsonLd = buildFAQSchema(faqs);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      
      {/* Dynamic JSON-LD FAQ injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 sm:py-12 space-y-6">
        <div className="space-y-1 text-center">
          <HelpCircle className="h-10 w-10 mx-auto text-primary" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">Frequently Asked Questions</h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Everything you need to know about our technical review pipelines, coupons, and specifications database.
          </p>
        </div>

        <div className="space-y-4 pt-6">
          {faqs.map((faq) => (
            <div key={faq.question} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-xl p-5 space-y-2 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">{faq.question}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
