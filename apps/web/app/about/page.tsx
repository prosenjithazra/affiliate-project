import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Award, Eye, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@repo/ui";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f6] dark:bg-slate-950">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-10 sm:py-16 flex-1 space-y-8 sm:space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">About AffiliateHub</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base max-w-xl mx-auto">
            Our mission is to help consumers find premium gadgets, outfits, and gear at verified discount prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center p-6">
            <CardContent className="space-y-3 pt-4">
              <div className="mx-auto h-10 w-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <Eye className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm">Honest Reviews</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We review full spec sheets, read customer write-ups, and compile accurate pros and cons.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center p-6">
            <CardContent className="space-y-3 pt-4">
              <div className="mx-auto h-10 w-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm">Verified Discounts</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We track price drop charts and offer verified discount percentages to ensure you never overpay.
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200/50 dark:border-slate-800/50 shadow-sm text-center p-6">
            <CardContent className="space-y-3 pt-4">
              <div className="mx-auto h-10 w-10 bg-amber-500/10 text-amber-600 rounded-xl flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-sm">Secure Redirects</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Our redirect trackers safely redirect you directly to secure official partner marketplaces.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white dark:bg-slate-900/40 p-5 sm:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm space-y-4">
          <h2 className="text-lg font-bold">Our Editorial Guidelines</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Every product showcased on AffiliateHub goes through a strict indexing pipeline. We evaluate pricing history, benchmark specs against competitors, list genuine user complaints (cons), and ensure the store link goes to authorized retailers. While we receive commissions, it never shifts our specifications assessment.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
