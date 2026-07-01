import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export const metadata = {
  title: "ShopZone - Terms of Service",
  description: "Read the terms of service guidelines, affiliate disclosures, and website user agreements of ShopZone."
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 sm:py-12 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-400 font-semibold">Last Updated: June 30, 2026</p>
        
        <div className="prose dark:prose-invert text-xs text-slate-500 dark:text-slate-400 space-y-4 leading-relaxed">
          <p>
            Welcome to ShopZone! These terms and conditions outline the rules and regulations for the use of ShopZone's Website, located at shopzone.com.
          </p>
          <p>
            By accessing this website we assume you accept these terms and conditions. Do not continue to use ShopZone if you do not agree to take all of the terms and conditions stated on this page.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
