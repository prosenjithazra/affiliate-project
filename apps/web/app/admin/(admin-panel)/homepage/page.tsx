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
import { Loader2, UploadCloud, Globe, SlidersHorizontal, Image } from "lucide-react";
import { Settings } from "@repo/types";

const homepageSchema = z.object({
  // Promo Spot 1
  promo1Title: z.string().min(1, "Title is required"),
  promo1Desc: z.string().min(1, "Description is required"),
  promo1Img: z.string().min(1, "Image is required"),
  promo1Link: z.string().min(1, "Link path is required"),

  // Promo Spot 2
  promo2Title: z.string().min(1, "Title is required"),
  promo2Desc: z.string().min(1, "Description is required"),
  promo2Img: z.string().min(1, "Image is required"),
  promo2Link: z.string().min(1, "Link path is required"),

  // Promo Spot 3
  promo3Title: z.string().min(1, "Title is required"),
  promo3Desc: z.string().min(1, "Description is required"),
  promo3Img: z.string().min(1, "Image is required"),
  promo3Link: z.string().min(1, "Link path is required"),

  // Promo Spot 4
  promo4Title: z.string().min(1, "Title is required"),
  promo4Desc: z.string().min(1, "Description is required"),
  promo4Img: z.string().min(1, "Image is required"),
  promo4Link: z.string().min(1, "Link path is required"),
});

type HomepageFormValues = z.infer<typeof homepageSchema>;

export default function HomepagePromosPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Settings | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<HomepageFormValues>({
    resolver: zodResolver(homepageSchema),
    defaultValues: {
      promo1Title: "",
      promo1Desc: "",
      promo1Img: "",
      promo1Link: "",
      promo2Title: "",
      promo2Desc: "",
      promo2Img: "",
      promo2Link: "",
      promo3Title: "",
      promo3Desc: "",
      promo3Img: "",
      promo3Link: "",
      promo4Title: "",
      promo4Desc: "",
      promo4Img: "",
      promo4Link: "",
    },
  });

  const promo1Img = watch("promo1Img");
  const promo2Img = watch("promo2Img");
  const promo3Img = watch("promo3Img");
  const promo4Img = watch("promo4Img");

  const handleImageUpload = (fieldName: keyof HomepageFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setValue(fieldName, reader.result, { shouldValidate: true });
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
          setSiteSettings(data);
          reset({
            promo1Title: data.homepagePromos?.promo1?.title || "",
            promo1Desc: data.homepagePromos?.promo1?.desc || "",
            promo1Img: data.homepagePromos?.promo1?.img || "",
            promo1Link: data.homepagePromos?.promo1?.link || "",

            promo2Title: data.homepagePromos?.promo2?.title || "",
            promo2Desc: data.homepagePromos?.promo2?.desc || "",
            promo2Img: data.homepagePromos?.promo2?.img || "",
            promo2Link: data.homepagePromos?.promo2?.link || "",

            promo3Title: data.homepagePromos?.promo3?.title || "",
            promo3Desc: data.homepagePromos?.promo3?.desc || "",
            promo3Img: data.homepagePromos?.promo3?.img || "",
            promo3Link: data.homepagePromos?.promo3?.link || "",

            promo4Title: data.homepagePromos?.promo4?.title || "",
            promo4Desc: data.homepagePromos?.promo4?.desc || "",
            promo4Img: data.homepagePromos?.promo4?.img || "",
            promo4Link: data.homepagePromos?.promo4?.link || "",
          });
        }
      } catch (err) {
        console.error("Failed to load settings data");
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, [reset]);

  const onSubmit = async (values: HomepageFormValues) => {
    if (!siteSettings) return;
    setSubmitting(true);
    try {
      const payload = {
        ...siteSettings,
        homepagePromos: {
          promo1: {
            title: values.promo1Title,
            desc: values.promo1Desc,
            img: values.promo1Img,
            link: values.promo1Link,
          },
          promo2: {
            title: values.promo2Title,
            desc: values.promo2Desc,
            img: values.promo2Img,
            link: values.promo2Link,
          },
          promo3: {
            title: values.promo3Title,
            desc: values.promo3Desc,
            img: values.promo3Img,
            link: values.promo3Link,
          },
          promo4: {
            title: values.promo4Title,
            desc: values.promo4Desc,
            img: values.promo4Img,
            link: values.promo4Link,
          },
        }
      };

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toastSuccess("Homepage customization saved successfully.", "Changes Saved");
      } else {
        throw new Error("Failed to save homepage settings");
      }
    } catch (err: any) {
      toastError(err.message || "Could not write homepage configuration.", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 text-sm">Fetching homepage configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Homepage Customization</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Customize the main highlights banners, links, and promo text copies dynamically
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          
          {/* Promo Spot 1 */}
          <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <CardTitle className="text-base flex items-center gap-1.5 text-orange-600 dark:text-orange-500">
                <Globe className="h-4.5 w-4.5" /> Spot 1: Main Wide Banner (Dynamic Tracking)
              </CardTitle>
              <CardDescription>Main 3-column banner positioned right below the categories nav bar</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="promo1Title">Title Header</Label>
                  <Input id="promo1Title" {...register("promo1Title")} />
                  {errors.promo1Title && <p className="text-xs text-rose-500">{errors.promo1Title.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="promo1Link">Target Path Link</Label>
                  <Input id="promo1Link" placeholder="/search?categoryId=cat-electronics" {...register("promo1Link")} />
                  {errors.promo1Link && <p className="text-xs text-rose-500">{errors.promo1Link.message}</p>}
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="promo1Desc">Description Copy</Label>
                <Textarea id="promo1Desc" rows={2} {...register("promo1Desc")} />
                {errors.promo1Desc && <p className="text-xs text-rose-500">{errors.promo1Desc.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Promo Banner Image</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="relative flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900 md:col-span-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload("promo1Img")}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <UploadCloud className="mb-1 h-6 w-6 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500">Upload Image File</span>
                  </div>
                  <div className="md:col-span-2">
                    {promo1Img ? (
                      <div className="relative rounded-xl border p-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-center max-h-[140px] overflow-hidden">
                        <img src={promo1Img} alt="Preview Spot 1" className="max-h-[120px] object-contain rounded-lg" />
                      </div>
                    ) : (
                      <div className="rounded-xl border p-6 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-950 border-dashed">
                        <Image className="h-4 w-4" /> No Image Selected
                      </div>
                    )}
                  </div>
                </div>
                {errors.promo1Img && <p className="text-xs text-rose-500">{errors.promo1Img.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Promo Spot 2 */}
          <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <CardTitle className="text-base flex items-center gap-1.5 text-orange-600 dark:text-orange-500">
                <Globe className="h-4.5 w-4.5" /> Spot 2: Tall Left Banner (Audio Speaker A1)
              </CardTitle>
              <CardDescription>Tall, prominent promotional card positioned on the left side</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="promo2Title">Title Header</Label>
                  <Input id="promo2Title" {...register("promo2Title")} />
                  {errors.promo2Title && <p className="text-xs text-rose-500">{errors.promo2Title.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="promo2Link">Target Path Link</Label>
                  <Input id="promo2Link" placeholder="/search" {...register("promo2Link")} />
                  {errors.promo2Link && <p className="text-xs text-rose-500">{errors.promo2Link.message}</p>}
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="promo2Desc">Description Copy</Label>
                <Textarea id="promo2Desc" rows={2} {...register("promo2Desc")} />
                {errors.promo2Desc && <p className="text-xs text-rose-500">{errors.promo2Desc.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Promo Banner Image</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="relative flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900 md:col-span-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload("promo2Img")}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <UploadCloud className="mb-1 h-6 w-6 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500">Upload Image File</span>
                  </div>
                  <div className="md:col-span-2">
                    {promo2Img ? (
                      <div className="relative rounded-xl border p-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-center max-h-[140px] overflow-hidden">
                        <img src={promo2Img} alt="Preview Spot 2" className="max-h-[120px] object-contain rounded-lg" />
                      </div>
                    ) : (
                      <div className="rounded-xl border p-6 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-950 border-dashed">
                        <Image className="h-4 w-4" /> No Image Selected
                      </div>
                    )}
                  </div>
                </div>
                {errors.promo2Img && <p className="text-xs text-rose-500">{errors.promo2Img.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Promo Spot 3 */}
          <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <CardTitle className="text-base flex items-center gap-1.5 text-orange-600 dark:text-orange-500">
                <Globe className="h-4.5 w-4.5" /> Spot 3: Right Top Banner (Headphone)
              </CardTitle>
              <CardDescription>Horizontal banner displayed on the upper-right stack</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="promo3Title">Title Header</Label>
                  <Input id="promo3Title" {...register("promo3Title")} />
                  {errors.promo3Title && <p className="text-xs text-rose-500">{errors.promo3Title.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="promo3Link">Target Path Link</Label>
                  <Input id="promo3Link" placeholder="/search" {...register("promo3Link")} />
                  {errors.promo3Link && <p className="text-xs text-rose-500">{errors.promo3Link.message}</p>}
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="promo3Desc">Description Copy</Label>
                <Textarea id="promo3Desc" rows={2} {...register("promo3Desc")} />
                {errors.promo3Desc && <p className="text-xs text-rose-500">{errors.promo3Desc.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Promo Banner Image</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="relative flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900 md:col-span-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload("promo3Img")}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <UploadCloud className="mb-1 h-6 w-6 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500">Upload Image File</span>
                  </div>
                  <div className="md:col-span-2">
                    {promo3Img ? (
                      <div className="relative rounded-xl border p-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-center max-h-[140px] overflow-hidden">
                        <img src={promo3Img} alt="Preview Spot 3" className="max-h-[120px] object-contain rounded-lg" />
                      </div>
                    ) : (
                      <div className="rounded-xl border p-6 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-950 border-dashed">
                        <Image className="h-4 w-4" /> No Image Selected
                      </div>
                    )}
                  </div>
                </div>
                {errors.promo3Img && <p className="text-xs text-rose-500">{errors.promo3Img.message}</p>}
              </div>
            </CardContent>
          </Card>

          {/* Promo Spot 4 */}
          <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
            <CardHeader className="border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <CardTitle className="text-base flex items-center gap-1.5 text-orange-600 dark:text-orange-500">
                <Globe className="h-4.5 w-4.5" /> Spot 4: Right Bottom Banner (Smart Watch)
              </CardTitle>
              <CardDescription>Horizontal banner displayed on the lower-right stack</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="promo4Title">Title Header</Label>
                  <Input id="promo4Title" {...register("promo4Title")} />
                  {errors.promo4Title && <p className="text-xs text-rose-500">{errors.promo4Title.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="promo4Link">Target Path Link</Label>
                  <Input id="promo4Link" placeholder="/search" {...register("promo4Link")} />
                  {errors.promo4Link && <p className="text-xs text-rose-500">{errors.promo4Link.message}</p>}
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="promo4Desc">Description Copy</Label>
                <Textarea id="promo4Desc" rows={2} {...register("promo4Desc")} />
                {errors.promo4Desc && <p className="text-xs text-rose-500">{errors.promo4Desc.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Promo Banner Image</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="relative flex h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 text-center transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900 md:col-span-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload("promo4Img")}
                      className="absolute inset-0 cursor-pointer opacity-0"
                    />
                    <UploadCloud className="mb-1 h-6 w-6 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-500">Upload Image File</span>
                  </div>
                  <div className="md:col-span-2">
                    {promo4Img ? (
                      <div className="relative rounded-xl border p-2 bg-slate-50 dark:bg-slate-950 flex items-center justify-center max-h-[140px] overflow-hidden">
                        <img src={promo4Img} alt="Preview Spot 4" className="max-h-[120px] object-contain rounded-lg" />
                      </div>
                    ) : (
                      <div className="rounded-xl border p-6 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5 bg-slate-50 dark:bg-slate-950 border-dashed">
                        <Image className="h-4 w-4" /> No Image Selected
                      </div>
                    )}
                  </div>
                </div>
                {errors.promo4Img && <p className="text-xs text-rose-500">{errors.promo4Img.message}</p>}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            className="bg-primary text-white hover:bg-primary-hover px-8 py-5 text-sm font-semibold rounded-xl"
            loading={submitting}
          >
            Save Homepage Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
