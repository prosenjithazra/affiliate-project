import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { LifeBuoy, ArrowRight } from "lucide-react";

export const metadata = {
  title: "ShopZone - Help Desk Support",
  description: "Contact the ShopZone customer help desk, search knowledge articles, or file tickets."
};

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 sm:py-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <LifeBuoy className="h-12 w-12 text-primary animate-spin" style={{ animationDuration: "12s" }} />
        </div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Help Desk Support</h1>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
          Need help navigating comparison specs or verification tables? Our customer support agents are online 24/7 to resolve inquiries.
        </p>
        <a
          href="mailto:support@shopzone.com"
          className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all"
        >
          Email Support Desk <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </main>

      <Footer />
    </div>
  );
}
