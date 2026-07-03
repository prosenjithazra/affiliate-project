"use client";

import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Button, Input, Textarea, Label, Card, CardContent, useToast } from "@repo/ui";
import { Mail, MessageSquare, Phone } from "lucide-react";
import { Settings } from "@repo/types";

const defaultContactPage = {
  supportValue: "support@affiliatehub.com",
  partnershipValue: "partners@affiliatehub.com",
  hotlineValue: "+1 (555) 321-7890",
};

export default function ContactPage() {
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [contactPage, setContactPage] = useState(defaultContactPage);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((settings: Settings | null) => {
        if (settings) {
          setContactPage({
            ...defaultContactPage,
            supportValue: settings.contactEmail || settings.contactPage?.supportValue || defaultContactPage.supportValue,
            partnershipValue: settings.contactPage?.partnershipValue || defaultContactPage.partnershipValue,
            hotlineValue: settings.contactPage?.hotlineValue || defaultContactPage.hotlineValue,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          subject: formData.get("subject"),
          message: formData.get("message"),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Message could not be sent");
      }

      success("Your message has been sent to our editor team. We'll reply within 24 hours.", "Message Sent");
      form.reset();
    } catch (err: any) {
      error(err.message || "Message could not be sent", "Error");
    } finally {
      setSubmitting(false);
    }
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
                <p className="text-xs font-semibold">{contactPage.supportValue}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <MessageSquare className="h-5 w-5 text-emerald-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Partnership Queries</p>
                <p className="text-xs font-semibold">{contactPage.partnershipValue}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 bg-white dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/50 shadow-sm">
              <Phone className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hotline</p>
                <p className="text-xs font-semibold">{contactPage.hotlineValue}</p>
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
                  <Input id="name" name="name" placeholder="John Doe" required />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" placeholder="john@example.com" required />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="e.g. Partnership Request" required />
              </div>

              <div className="space-y-1">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" rows={5} placeholder="Write your message here..." required />
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
