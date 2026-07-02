"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
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
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Trash, UploadCloud, MoveUp, MoveDown } from "lucide-react";
import { Category, Brand, Product } from "@repo/types";

const productSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  shortDescription: z.string().min(10, "Short description must be at least 10 characters"),
  fullDescription: z.string().min(20, "Full description must be at least 20 characters"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, "Price must be a positive number"),
  oldPrice: z.string().optional().refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), "Old price must be positive"),
  discount: z.string().optional(),
  rating: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0 && parseFloat(val) <= 5, "Rating must be between 0 and 5"),
  affiliateStore: z.string().min(2, "Store name must be at least 2 characters"),
  affiliateUrl: z.string().url("Must be a valid URL"),
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK"]),
  featured: z.boolean().default(false),
  trending: z.boolean().default(false),
  topDeal: z.boolean().default(false),
  categoryId: z.string().min(1, "Please select a category"),
  brandId: z.string().min(1, "Please select a brand"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  tags: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product | null;
}

export default function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Image State
  const [images, setImages] = useState<string[]>(
    initialData?.images?.map((img) => img.url) || []
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      shortDescription: initialData?.shortDescription || "",
      fullDescription: initialData?.fullDescription || "",
      price: initialData?.price?.toString() || "",
      oldPrice: initialData?.oldPrice?.toString() || "",
      discount: initialData?.discount?.toString() || "",
      rating: initialData?.rating?.toString() || "4.5",
      affiliateStore: initialData?.affiliateStore || "Amazon",
      affiliateUrl: initialData?.affiliateUrl || "",
      stockStatus: (initialData?.stockStatus as any) || "IN_STOCK",
      featured: initialData?.featured || false,
      trending: initialData?.trending || false,
      topDeal: initialData?.topDeal || false,
      categoryId: initialData?.categoryId || "",
      brandId: initialData?.brandId || "",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      tags: initialData?.tags?.join(", ") || "",
    },
  });

  // Dynamic arrays for Features, Specs, Pros, Cons
  const [features, setFeatures] = useState<string[]>(initialData?.features || []);
  const [featureInput, setFeatureInput] = useState("");

  const [pros, setPros] = useState<string[]>(initialData?.pros || []);
  const [proInput, setProInput] = useState("");

  const [cons, setCons] = useState<string[]>(initialData?.cons || []);
  const [conInput, setConInput] = useState("");

  const [specifications, setSpecifications] = useState<Record<string, string>>(
    initialData?.specifications || {}
  );
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  const productName = watch("name");
  useEffect(() => {
    if (productName && !initialData) {
      const generatedSlug = productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", generatedSlug);
    }
  }, [productName, setValue, initialData]);

  useEffect(() => {
    // Load categories & brands for selector fields
    const loadSelectors = async () => {
      try {
        const catRes = await fetch("/api/categories");
        const bRes = await fetch("/api/brands");
        if (catRes.ok) setCategories(await catRes.json());
        if (bRes.ok) setBrands(await bRes.json());
      } catch {
        console.error("Failed to load selector options");
      }
    };
    loadSelectors();
  }, []);

  // Features logic
  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };
  const removeFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  // Pros logic
  const addPro = () => {
    if (proInput.trim()) {
      setPros([...pros, proInput.trim()]);
      setProInput("");
    }
  };
  const removePro = (idx: number) => {
    setPros(pros.filter((_, i) => i !== idx));
  };

  // Cons logic
  const addCon = () => {
    if (conInput.trim()) {
      setCons([...cons, conInput.trim()]);
      setConInput("");
    }
  };
  const removeCon = (idx: number) => {
    setCons(cons.filter((_, i) => i !== idx));
  };

  // Specs logic
  const addSpec = () => {
    if (specKey.trim() && specValue.trim()) {
      setSpecifications({ ...specifications, [specKey.trim()]: specValue.trim() });
      setSpecKey("");
      setSpecValue("");
    }
  };
  const removeSpec = (key: string) => {
    const next = { ...specifications };
    delete next[key];
    setSpecifications(next);
  };

  // Images logic (upload, delete, reorder)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const moveImage = (idx: number, direction: "up" | "down") => {
    const nextIdx = direction === "up" ? idx - 1 : idx + 1;
    if (nextIdx < 0 || nextIdx >= images.length) return;

    const reordered = [...images];
    const temp = reordered[idx]!;
    reordered[idx] = reordered[nextIdx]!;
    reordered[nextIdx] = temp;
    setImages(reordered);
  };

  const onSubmit = async (data: ProductFormValues) => {
    if (images.length === 0) {
      toastError("Please upload at least one product image", "Images Required");
      return;
    }

    setSubmitting(true);
    try {
      const parsedTags = data.tags
        ? data.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      const payload = {
        ...data,
        features,
        specifications,
        pros,
        cons,
        tags: parsedTags,
        images,
      };

      const url = initialData ? `/api/products/${initialData.id}` : "/api/products";
      const method = initialData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toastSuccess(
          initialData ? "Product successfully updated." : "Product successfully published.",
          initialData ? "Product Updated" : "Product Created"
        );
        router.push("/admin/products");
        router.refresh();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit form");
      }
    } catch (err: any) {
      toastError(err.message || "An error occurred while saving the product.", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left 2 Columns: Basic & Detailed Information */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-md">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Configure naming, descriptions and categorization</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" placeholder="e.g. Apple iPad Air" {...register("name")} />
                {errors.name && <p className="text-xs text-rose-500">{errors.name.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" placeholder="e.g. apple-ipad-air" {...register("slug")} />
                {errors.slug && <p className="text-xs text-rose-500">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="categoryId">Category</Label>
                <input type="hidden" {...register("categoryId")} />
                <Select value={watch("categoryId") || ""} onValueChange={(value) => setValue("categoryId", value, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && <p className="text-xs text-rose-500">{errors.categoryId.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="brandId">Brand</Label>
                <input type="hidden" {...register("brandId")} />
                <Select value={watch("brandId") || ""} onValueChange={(value) => setValue("brandId", value, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Brand" />
                  </SelectTrigger>
                  <SelectContent>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.id}>
                      {b.name}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
                {errors.brandId && <p className="text-xs text-rose-500">{errors.brandId.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Input
                id="shortDescription"
                placeholder="Write a brief subtitle/tagline for this product..."
                {...register("shortDescription")}
              />
              {errors.shortDescription && <p className="text-xs text-rose-500">{errors.shortDescription.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="fullDescription">Full Description</Label>
              <Textarea
                id="fullDescription"
                rows={6}
                placeholder="Explain details, utility, screen-resolution, build quality, etc..."
                {...register("fullDescription")}
              />
              {errors.fullDescription && <p className="text-xs text-rose-500">{errors.fullDescription.message}</p>}
            </div>
          </CardContent>
        </Card>

        {/* Dynamic Lists (Features, Specifications, Pros & Cons) */}
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-md">
          <CardHeader>
            <CardTitle>Features & Specifications</CardTitle>
            <CardDescription>Enter tabular specifications and bullet features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features Builder */}
            <div className="space-y-3">
              <Label>Key Features</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="e.g. 10 hours battery life"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="secondary">
                  Add
                </Button>
              </div>
              <ul className="space-y-1.5 mt-2">
                {features.map((feat, i) => (
                  <li key={i} className="flex items-center justify-between text-sm px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                    <span>{feat}</span>
                    <button type="button" onClick={() => removeFeature(i)} className="text-rose-500 hover:text-rose-600">
                      <Trash className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Specifications Builder */}
            <div className="space-y-3">
              <Label>Technical Specifications</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Property (e.g. RAM)"
                  value={specKey}
                  onChange={(e) => setSpecKey(e.target.value)}
                  className="w-1/3"
                />
                <Input
                  placeholder="Value (e.g. 16GB)"
                  value={specValue}
                  onChange={(e) => setSpecValue(e.target.value)}
                  className="w-2/3"
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpec())}
                />
                <Button type="button" onClick={addSpec} variant="secondary">
                  Add
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(specifications).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-xs px-3 py-1.5 bg-slate-50 dark:bg-slate-900 rounded-lg border">
                    <span className="font-semibold text-slate-500">{key}: {val}</span>
                    <button type="button" onClick={() => removeSpec(key)} className="text-rose-500 hover:text-rose-600">
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pros */}
              <div className="space-y-2">
                <Label className="text-emerald-600">Pros</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add positive..."
                    value={proInput}
                    onChange={(e) => setProInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPro())}
                  />
                  <Button type="button" onClick={addPro} variant="secondary" className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200">
                    +
                  </Button>
                </div>
                <ul className="space-y-1.5">
                  {pros.map((p, i) => (
                    <li key={i} className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-emerald-50/30 dark:bg-emerald-950/10 text-emerald-800 dark:text-emerald-100 rounded-lg border border-emerald-100">
                      <span>✓ {p}</span>
                      <button type="button" onClick={() => removePro(i)} className="text-rose-500">
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Cons */}
              <div className="space-y-2">
                <Label className="text-rose-600">Cons</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add negative..."
                    value={conInput}
                    onChange={(e) => setConInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCon())}
                  />
                  <Button type="button" onClick={addCon} variant="secondary" className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-200">
                    +
                  </Button>
                </div>
                <ul className="space-y-1.5">
                  {cons.map((c, i) => (
                    <li key={i} className="flex items-center justify-between text-xs px-2.5 py-1.5 bg-rose-50/30 dark:bg-rose-950/10 text-rose-800 dark:text-rose-100 rounded-lg border border-rose-100">
                      <span>✗ {c}</span>
                      <button type="button" onClick={() => removeCon(i)} className="text-rose-500">
                        <Trash className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Pricing, Affiliate links, Images Manager, Flags */}
      <div className="space-y-6">
        {/* Deal Pricing */}
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-md">
          <CardHeader>
            <CardTitle>Pricing & Affiliate Link</CardTitle>
            <CardDescription>Setup prices and redirect stores</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="price">Offer Price (₹)</Label>
                <Input id="price" placeholder="349.99" {...register("price")} />
                {errors.price && <p className="text-xs text-rose-500">{errors.price.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="oldPrice">Old Price (₹)</Label>
                <Input id="oldPrice" placeholder="399.99" {...register("oldPrice")} />
                {errors.oldPrice && <p className="text-xs text-rose-500">{errors.oldPrice.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input id="discount" placeholder="12" {...register("discount")} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="rating">Rating (0-5)</Label>
                <Input id="rating" placeholder="4.5" {...register("rating")} />
                {errors.rating && <p className="text-xs text-rose-500">{errors.rating.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="affiliateStore">Affiliate Store</Label>
              <Input id="affiliateStore" placeholder="e.g. Amazon, BestBuy" {...register("affiliateStore")} />
              {errors.affiliateStore && <p className="text-xs text-rose-500">{errors.affiliateStore.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="affiliateUrl">Secure Outbound URL</Label>
              <Input id="affiliateUrl" placeholder="https://amazon.com/..." {...register("affiliateUrl")} />
              {errors.affiliateUrl && <p className="text-xs text-rose-500">{errors.affiliateUrl.message}</p>}
            </div>

            <div className="space-y-1 flex flex-col">
              <Label htmlFor="stockStatus" className="mb-1.5">Stock Status</Label>
              <input type="hidden" {...register("stockStatus")} />
              <Select value={watch("stockStatus")} onValueChange={(value) => setValue("stockStatus", value as "IN_STOCK" | "OUT_OF_STOCK", { shouldValidate: true })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stock status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_STOCK">In Stock</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Image Upload/Preview Manager */}
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-md">
          <CardHeader>
            <CardTitle>Image Gallery Manager</CardTitle>
            <CardDescription>Upload product images, then reorder or remove them</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Drag and Drop Box */}
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors relative">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Click or Drag images here</p>
              <p className="text-[10px] text-slate-400 mt-1">Supports PNG, JPG, WEBP</p>
            </div>

            {/* Images list with reordering/deletion */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {images.map((url, idx) => (
                <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200/40 dark:border-slate-800/40">
                  <img
                    src={url}
                    alt={`Preview ${idx}`}
                    className="h-10 w-10 rounded object-cover bg-slate-200"
                  />
                  <div className="flex-1 text-[10px] truncate text-slate-400">
                    Image {idx + 1}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveImage(idx, "up")}
                      disabled={idx === 0}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                    >
                      <MoveUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveImage(idx, "down")}
                      disabled={idx === images.length - 1}
                      className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                    >
                      <MoveDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 text-rose-500 hover:text-rose-600"
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges and SEO */}
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-md">
          <CardHeader>
            <CardTitle>Badges & Meta SEO</CardTitle>
            <CardDescription>Toggle banner visibility and configure metadata</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <div className="space-y-0.5">
                <Label>Featured Product</Label>
                <p className="text-[10px] text-slate-400">Render in main homepage slider</p>
              </div>
              <Switch
                checked={watch("featured")}
                onCheckedChange={(checked) => setValue("featured", checked)}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div className="space-y-0.5">
                <Label>Trending Product</Label>
                <p className="text-[10px] text-slate-400">Show in hot trending list</p>
              </div>
              <Switch
                checked={watch("trending")}
                onCheckedChange={(checked) => setValue("trending", checked)}
              />
            </div>

            <div className="flex items-center justify-between py-2 border-b">
              <div className="space-y-0.5">
                <Label>Top Deal</Label>
                <p className="text-[10px] text-slate-400">Highlight discount badges</p>
              </div>
              <Switch
                checked={watch("topDeal")}
                onCheckedChange={(checked) => setValue("topDeal", checked)}
              />
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <Label htmlFor="metaTitle">SEO Meta Title</Label>
                <Input id="metaTitle" placeholder="Google Search Title" {...register("metaTitle")} />
              </div>

              <div className="space-y-1">
                <Label htmlFor="metaDescription">SEO Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  rows={2}
                  placeholder="Summarize product features for search engine optimization..."
                  {...register("metaDescription")}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input id="tags" placeholder="macbook, apple, laptop" {...register("tags")} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Bar */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/products")}
            className="w-1/3"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="w-2/3 bg-primary text-white hover:bg-primary-hover"
            loading={submitting}
          >
            {initialData ? "Save Product" : "Publish Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
