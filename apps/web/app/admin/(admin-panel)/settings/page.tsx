"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Input,
  Textarea,
  Label,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useToast,
} from "@repo/ui";
import { Settings as SettingsIcon, Globe, Share2, Mail, Loader2, UploadCloud } from "lucide-react";
import { Settings } from "@repo/types";

const settingsSchema = z.object({
  websiteName: z.string().min(2, "Name must be at least 2 characters"),
  logo: z.string().optional(),
  seoTitle: z.string().min(10, "Title must be at least 10 characters"),
  seoDescription: z.string().min(20, "Description must be at least 20 characters"),
  googleAnalyticsId: z.string().optional(),
  contactEmail: z.string().email("Must be a valid email address").or(z.literal("")),
  footerText: z.string().optional(),
  twitter: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      websiteName: "AffiliateHub",
      logo: "",
      seoTitle: "",
      seoDescription: "",
      googleAnalyticsId: "",
      contactEmail: "",
      footerText: "",
      twitter: "",
      facebook: "",
      instagram: "",
    },
  });

  const logo = watch("logo");

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setValue("logo", reader.result, { shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data: Settings = await res.json();
          reset({
            websiteName: data.websiteName || "",
            logo: data.logo || "",
            seoTitle: data.seoTitle || "",
            seoDescription: data.seoDescription || "",
            googleAnalyticsId: data.googleAnalyticsId || "",
            contactEmail: data.contactEmail || "",
            footerText: data.footerText || "",
            twitter: data.socialLinks?.twitter || "",
            facebook: data.socialLinks?.facebook || "",
            instagram: data.socialLinks?.instagram || "",
          });
        }
      } catch {
        console.error("Failed to load settings data");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [reset]);

  const onSubmit = async (values: SettingsFormValues) => {
    setSubmitting(true);
    try {
      const payload = {
        websiteName: values.websiteName,
        logo: values.logo || null,
        seoTitle: values.seoTitle || null,
        seoDescription: values.seoDescription || null,
        googleAnalyticsId: values.googleAnalyticsId || null,
        contactEmail: values.contactEmail || null,
        footerText: values.footerText || null,
        socialLinks: {
          twitter: values.twitter || "",
          facebook: values.facebook || "",
          instagram: values.instagram || "",
        },
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toastSuccess("Configuration updated successfully.", "Settings Saved");
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (err: any) {
      toastError(err.message || "Could not write configurations.", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 text-sm">Fetching site configurations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Settings</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure website descriptors, meta fields, analytics trackers, and footer notices
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Brand & SEO */}
          <div className="lg:col-span-2 space-y-6">
            {/* Core Configurations */}
            <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <SettingsIcon className="h-4.5 w-4.5 text-primary" /> General Settings
                </CardTitle>
                <CardDescription>Configure naming and core brand assets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="websiteName">Website Title Name</Label>
                    <Input id="websiteName" {...register("websiteName")} />
                    {errors.websiteName && <p className="text-xs text-rose-500">{errors.websiteName.message}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Logo Image</Label>
                    <input type="hidden" {...register("logo")} />
                    <div className="relative flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      {logo ? (
                        <img src={logo} alt="Logo preview" className="max-h-16 max-w-[85%] rounded-lg object-contain" />
                      ) : (
                        <>
                          <UploadCloud className="mb-1 h-5 w-5 text-slate-400" />
                          <span className="text-[10px] font-bold text-slate-500">Upload Logo</span>
                        </>
                      )}
                    </div>
                    {errors.logo && <p className="text-xs text-rose-500">{errors.logo.message}</p>}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="footerText">Copyright Footer Notice</Label>
                  <Input id="footerText" placeholder="© 2026 AffiliateHub. All rights reserved." {...register("footerText")} />
                </div>
              </CardContent>
            </Card>

            {/* SEO Configurations */}
            <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <Globe className="h-4.5 w-4.5 text-emerald-500" /> Search Engine Optimization (SEO)
                </CardTitle>
                <CardDescription>Default search listings settings for indexing crawlers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="seoTitle">Search Engine Title</Label>
                  <Input id="seoTitle" placeholder="AffiliateHub - Handpicked Tech Reviews" {...register("seoTitle")} />
                  {errors.seoTitle && <p className="text-xs text-rose-500">{errors.seoTitle.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="seoDescription">Search Engine Description</Label>
                  <Textarea id="seoDescription" rows={4} placeholder="Browse our curated comparison tables..." {...register("seoDescription")} />
                  {errors.seoDescription && <p className="text-xs text-rose-500">{errors.seoDescription.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Contact, Social, Integrations */}
          <div className="space-y-6">
            {/* Contact & Support */}
            <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <Mail className="h-4.5 w-4.5 text-blue-500" /> Contacts & Analytics
                </CardTitle>
                <CardDescription>Setup emails and external trackers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="contactEmail">Contact Email Address</Label>
                  <Input id="contactEmail" placeholder="support@affiliate.com" {...register("contactEmail")} />
                  {errors.contactEmail && <p className="text-xs text-rose-500">{errors.contactEmail.message}</p>}
                </div>

                <div className="space-y-1">
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input id="googleAnalyticsId" placeholder="e.g. G-XXXXXXX" {...register("googleAnalyticsId")} />
                </div>
              </CardContent>
            </Card>

            {/* Social channels */}
            <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-1.5">
                  <Share2 className="h-4.5 w-4.5 text-amber-500" /> Social Profile Handles
                </CardTitle>
                <CardDescription>Add profile paths for website icons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="twitter">Twitter Link</Label>
                  <Input id="twitter" placeholder="https://twitter.com/..." {...register("twitter")} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="facebook">Facebook Link</Label>
                  <Input id="facebook" placeholder="https://facebook.com/..." {...register("facebook")} />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="instagram">Instagram Link</Label>
                  <Input id="instagram" placeholder="https://instagram.com/..." {...register("instagram")} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end gap-3 max-w-7xl">
          <Button
            type="submit"
            className="bg-primary text-white hover:bg-primary-hover px-8 py-5 text-sm font-semibold rounded-xl"
            loading={submitting}
          >
            Save Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
