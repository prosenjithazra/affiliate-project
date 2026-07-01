import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { GitCompare, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "ShopZone - Compare Product Specifications Tables",
  description: "Compare device technical specifications grids, pros & cons lists, and referrals pricing tables side by side."
};

export default function ComparePage() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100">
      <Navbar />
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex flex-col items-center justify-center text-center space-y-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <GitCompare className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 dark:text-white">Side-by-Side Spec Comparisons</h1>
        <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
          Select products from our catalog index grids to map their memory, clock speeds, dimensions, and affiliate prices side by side.
        </p>
      </main>

      <Footer />
    </div>
  );
}
