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
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@repo/ui";
import { Plus, Edit2, Trash2, Bookmark, Image, Loader2, UploadCloud } from "lucide-react";
import { Brand } from "@repo/types";

const brandSchema = z.object({
  name: z.string().min(1, "Name must be at least 1 character"),
  slug: z.string().min(1, "Slug must be at least 1 character"),
  logo: z.string().min(1, "Brand logo is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type BrandFormValues = z.infer<typeof brandSchema>;

export default function BrandsPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BrandFormValues>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      name: "",
      slug: "",
      logo: "",
      description: "",
    },
  });

  const brandName = watch("name");
  const brandLogo = watch("logo");
  useEffect(() => {
    if (brandName && !editingBrand) {
      const generatedSlug = brandName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", generatedSlug);
    }
  }, [brandName, setValue, editingBrand]);

  const fetchBrands = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/brands");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = res.ok ? await res.json() : [];
      setBrands(data);
    } catch {
      toastError("Unable to fetch brands. Showing memory fallback.", "Fetch Failed");
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    reset({
      name: brand.name,
      slug: brand.slug,
      logo: brand.logo,
      description: brand.description,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this brand?")) return;

    try {
      const res = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toastSuccess("Brand successfully deleted.", "Brand Deleted");
        fetchBrands();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete");
      }
    } catch (err: any) {
      toastError(err.message || "Could not delete brand.", "Error");
    }
  };

  const onSubmit = async (data: BrandFormValues) => {
    setSubmitting(true);
    try {
      const url = editingBrand ? `/api/brands/${editingBrand.id}` : "/api/brands";
      const method = editingBrand ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toastSuccess(
          editingBrand ? "Brand successfully updated." : "Brand successfully created.",
          editingBrand ? "Brand Updated" : "Brand Created"
        );
        setOpen(false);
        setEditingBrand(null);
        reset();
        fetchBrands();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Operation failed");
      }
    } catch (err: any) {
      toastError(err.message || "Failed to save brand.", "Error");
    } finally {
      setSubmitting(false);
    }
  };

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

  const handleModalClose = () => {
    setOpen(false);
    setEditingBrand(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Brands</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage manufacturer labels and associate them with products
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Brand
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 text-sm">Fetching brands list...</p>
        </div>
      ) : brands.length === 0 ? (
        <Card className="border-dashed py-16 flex flex-col items-center justify-center text-center">
          <Bookmark className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-bold">No Brands Configured</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-1">
            Start by adding labels like Apple, Sony, Samsung or Nike.
          </p>
          <Button onClick={() => setOpen(true)} className="mt-4 bg-primary hover:bg-primary-hover text-white">
            Add First Brand
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <Card key={brand.id} className="overflow-hidden border-slate-200/60 dark:border-slate-900/60 group hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="h-32 relative bg-slate-100 dark:bg-slate-900/40 p-4 flex items-center justify-center border-b border-slate-100 dark:border-slate-900">
                  {brand.logo ? (
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="max-h-24 max-w-[80%] object-contain rounded-lg shadow-sm"
                    />
                  ) : (
                    <div className="text-slate-300">
                      <Image className="h-10 w-10" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2 pt-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base font-bold">{brand.name}</CardTitle>
                      <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                        /{brand.slug}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-900 font-semibold rounded-full border border-slate-200/40 dark:border-slate-800/40">
                      {brand._count?.products || 0} Products
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {brand.description}
                  </p>
                </CardContent>
              </div>
              <div className="flex border-t border-slate-100 dark:border-slate-900 divide-x divide-slate-100 dark:divide-slate-900">
                <button
                  onClick={() => handleEdit(brand)}
                  className="flex-1 py-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(brand.id)}
                  className="flex-1 py-3 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Brand Dialog */}
      <Dialog open={open} onOpenChange={(v) => !v && handleModalClose()}>
        <DialogContent className="border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit Brand" : "Add New Brand"}</DialogTitle>
            <DialogDescription>
              Create or modify a manufacturer label. Slug generates automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Brand Name</Label>
              <Input id="name" placeholder="e.g. Apple" {...register("name")} />
              {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="slug">Brand Slug</Label>
              <Input id="slug" placeholder="e.g. apple" {...register("slug")} />
              {errors.slug && <p className="text-xs text-rose-500 font-medium">{errors.slug.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Brand Logo</Label>
              <input type="hidden" {...register("logo")} />
              <div className="relative flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 cursor-pointer opacity-0"
                />
                {brandLogo ? (
                  <img src={brandLogo} alt="Brand logo preview" className="max-h-24 max-w-[85%] rounded-lg object-contain" />
                ) : (
                  <>
                    <UploadCloud className="mb-1 h-6 w-6 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-500">Upload Logo</span>
                  </>
                )}
              </div>
              {errors.logo && <p className="text-xs text-rose-500 font-medium">{errors.logo.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Write a brief overview of the brand's history or values..."
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white hover:bg-primary-hover" loading={submitting}>
                {editingBrand ? "Save Changes" : "Create Brand"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
