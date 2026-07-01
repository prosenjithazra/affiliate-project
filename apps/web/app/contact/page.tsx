"use client";

import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Input, Textarea, Label, Card, CardContent, useToast } from "@repo/ui";
import { Mail, MessageSquare, Phone } from "lucide-react";

export default function ContactPage() {
  const { success } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      success("Your message has been sent to our editor team. We'll reply within 24 hours.", "Message Sent");
      setSubmitting(false);
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f3f6] dark:bg-slate-950">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-10 sm:py-16 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="md:col-span-5 space-y-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Us</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
              Have questions about a product specifications table, or want to list your store? Get in touch.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Mail className="h-5 w-5 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Support</p>
                <p className="text-xs font-semibold">support@affiliatehub.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <MessageSquare className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Partnership Queries</p>
                <p className="text-xs font-semibold">partners@affiliatehub.com</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Phone className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hotline</p>
                <p className="text-xs font-semibold">+1 (555) 321-7890</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <Card className="md:col-span-7 border-slate-200/60 dark:border-slate-800/60 shadow-lg">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="john@example.com" required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="e.g. Partnership Request" required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" rows={5} placeholder="Write your message here..." required />
              </div>

              <Button type="submit" className="w-full bg-primary text-white hover:bg-primary-hover py-5 font-bold" loading={submitting}>
                Send Message
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
