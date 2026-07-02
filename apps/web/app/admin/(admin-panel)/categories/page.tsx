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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui";
import { Plus, Edit2, Trash2, Folder, Image, Loader2, Sparkles, Laptop, Shirt, Gamepad2, Dumbbell, Compass, UploadCloud } from "lucide-react";
import { Category } from "@repo/types";

const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  image: z.string().min(1, "Category image is required"),
  icon: z.string().min(1, "Icon is required"),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

const AVAILABLE_ICONS = [
  { name: "Laptop", icon: <Laptop className="h-4 w-4" /> },
  { name: "Shirt", icon: <Shirt className="h-4 w-4" /> },
  { name: "Sparkles", icon: <Sparkles className="h-4 w-4" /> },
  { name: "Gamepad2", icon: <Gamepad2 className="h-4 w-4" /> },
  { name: "Dumbbell", icon: <Dumbbell className="h-4 w-4" /> },
  { name: "Compass", icon: <Compass className="h-4 w-4" /> },
];

export default function CategoriesPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      icon: "Laptop",
    },
  });

  const categoryName = watch("name");
  const categoryImage = watch("image");
  useEffect(() => {
    if (categoryName && !editingCategory) {
      const generatedSlug = categoryName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", generatedSlug);
    }
  }, [categoryName, setValue, editingCategory]);

  const fetchCategories = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = res.ok ? await res.json() : [];
      setCategories(data);
    } catch {
      toastError("Unable to fetch categories. Displaying local data.", "Fetch Failed");
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      icon: category.icon,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toastSuccess("Category successfully removed.", "Category Deleted");
        fetchCategories();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete");
      }
    } catch (err: any) {
      toastError(err.message || "Could not delete category.", "Error");
    }
  };

  const onSubmit = async (data: CategoryFormValues) => {
    setSubmitting(true);
    try {
      const url = editingCategory ? `/api/categories/${editingCategory.id}` : "/api/categories";
      const method = editingCategory ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toastSuccess(
          editingCategory ? "Category successfully updated." : "Category successfully created.",
          editingCategory ? "Category Updated" : "Category Created"
        );
        setOpen(false);
        setEditingCategory(null);
        reset();
        fetchCategories();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Operation failed");
      }
    } catch (err: any) {
      toastError(err.message || "Failed to save category.", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setValue("image", reader.result, { shouldValidate: true });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleModalClose = () => {
    setOpen(false);
    setEditingCategory(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Categories</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Group products into search-friendly categories for customers
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 text-sm">Fetching category indexes...</p>
        </div>
      ) : categories.length === 0 ? (
        <Card className="border-dashed py-16 flex flex-col items-center justify-center text-center">
          <Folder className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-bold">No Categories Configured</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-1">
            Start by adding categories like Electronics, Gaming, or Fashion.
          </p>
          <Button onClick={() => setOpen(true)} className="mt-4 bg-primary hover:bg-primary-hover text-white">
            Add First Category
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card key={category.id} className="overflow-hidden border-slate-200/60 dark:border-slate-900/60 group hover:shadow-lg transition-all duration-300">
              <div className="h-40 relative bg-slate-100 dark:bg-slate-900">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <Image className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-3 left-3 px-2.5 py-1.5 rounded-lg bg-black/60 backdrop-blur-sm text-white flex items-center gap-1.5 text-xs font-semibold">
                  {AVAILABLE_ICONS.find((i) => i.name === category.icon)?.icon || <Folder className="h-3.5 w-3.5" />}
                  {category.icon}
                </div>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-lg font-bold">{category.name}</CardTitle>
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                      /{category.slug}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-900 font-semibold rounded-full border border-slate-200/40 dark:border-slate-800/40">
                    {category._count?.products || 0} Products
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-4 min-h-[70px]">
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3">
                  {category.description}
                </p>
              </CardContent>
              <div className="flex border-t border-slate-100 dark:border-slate-900 divide-x divide-slate-100 dark:divide-slate-900">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 py-3 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="flex-1 py-3 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Category Dialog */}
      <Dialog open={open} onOpenChange={(v) => !v && handleModalClose()}>
        <DialogContent className="border-slate-200 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            <DialogDescription>
              Create a grouping card. Names generate slugs automatically.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" placeholder="e.g. Smart Watches" {...register("name")} />
              {errors.name && <p className="text-xs text-rose-500 font-medium">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="slug">Category Slug</Label>
              <Input id="slug" placeholder="e.g. smart-watches" {...register("slug")} />
              {errors.slug && <p className="text-xs text-rose-500 font-medium">{errors.slug.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 flex flex-col">
                <Label htmlFor="icon" className="mb-1.5">Category Icon</Label>
                <input type="hidden" {...register("icon")} />
                <Select value={watch("icon")} onValueChange={(value) => setValue("icon", value, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                  {AVAILABLE_ICONS.map((i) => (
                    <SelectItem key={i.name} value={i.name}>
                      {i.name}
                    </SelectItem>
                  ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label>Category Image</Label>
                <input type="hidden" {...register("image")} />
                <div className="relative flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-center transition-colors hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-900">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                  {categoryImage ? (
                    <img src={categoryImage} alt="Category preview" className="h-full w-full rounded-lg object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="mb-1 h-5 w-5 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-500">Upload Image</span>
                    </>
                  )}
                </div>
                {errors.image && <p className="text-xs text-rose-500 font-medium">{errors.image.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Give a short summary of items contained in this category..."
                {...register("description")}
              />
              {errors.description && <p className="text-xs text-rose-500 font-medium">{errors.description.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white hover:bg-primary-hover" loading={submitting}>
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
