import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata = {
  title: "ShopZone - Privacy Policy",
  description: "Read the privacy policy guidelines, cookie definitions, and data handling regulations of ShopZone."
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 sm:py-12 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-400 font-semibold">Last Updated: June 30, 2026</p>
        
        <div className="prose dark:prose-invert text-xs text-slate-500 dark:text-slate-400 space-y-4 leading-relaxed">
          <p>
            At ShopZone, accessible from shopzone.com, one of our main priorities is the privacy of our visitors. 
            This Privacy Policy document contains types of information that is collected and recorded by ShopZone and how we use it.
          </p>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white pt-2">Log Files</h3>
          <p>
            ShopZone follows a standard procedure of using log files. These files log visitors when they visit websites. 
            All hosting companies do this and a part of hosting services' analytics. The information collected by log files includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
