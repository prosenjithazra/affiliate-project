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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  useToast,
} from "@repo/ui";
import { Plus, Edit2, Trash2, BookOpen, Image, Loader2, Calendar, Eye, EyeOff, UploadCloud } from "lucide-react";

const blogSchema = z.object({
  title: z.string().min(1, "Title must be at least 1 character"),
  slug: z.string().min(1, "Slug must be at least 1 character"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  published: z.boolean().default(true),
});

type BlogFormValues = z.infer<typeof blogSchema>;

export default function BlogAdminPage() {
  const { success: toastSuccess, error: toastError } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setValue("coverImage", reader.result, { shouldValidate: true });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      metaTitle: "",
      metaDescription: "",
      published: true,
    },
  });

  const postTitle = watch("title");
  useEffect(() => {
    if (postTitle && !editingPost) {
      const generatedSlug = postTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      setValue("slug", generatedSlug);
    }
  }, [postTitle, setValue, editingPost]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blogs");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPosts(data);
    } catch (err: any) {
      toastError("Unable to fetch blog posts. Showing mocks.", "Fetch Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleEdit = (post: any) => {
    setEditingPost(post);
    reset({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage || "",
      metaTitle: post.metaTitle || "",
      metaDescription: post.metaDescription || "",
      published: post.published,
    });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toastSuccess("Article successfully deleted.", "Article Deleted");
        fetchPosts();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete");
      }
    } catch (err: any) {
      toastError(err.message || "Could not delete article.", "Error");
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    setSubmitting(true);
    try {
      const url = editingPost ? `/api/blogs/${editingPost.id}` : "/api/blogs";
      const method = editingPost ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toastSuccess(
          editingPost ? "Article successfully updated." : "Article successfully created.",
          editingPost ? "Article Updated" : "Article Created"
        );
        setOpen(false);
        setEditingPost(null);
        reset();
        fetchPosts();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || "Operation failed");
      }
    } catch (err: any) {
      toastError(err.message || "Failed to save article.", "Error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setOpen(false);
    setEditingPost(null);
    reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Blogs & Guides</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Write shopping guidelines, comparison sheets, and tech news articles
          </p>
        </div>
        <Button
          onClick={() => setOpen(true)}
          className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" /> Add Article
        </Button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-slate-500 text-sm">Fetching blog database...</p>
        </div>
      ) : posts.length === 0 ? (
        <Card className="border-dashed py-16 flex flex-col items-center justify-center text-center">
          <BookOpen className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-lg font-bold">No Articles Written</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-1">
            Publish your first technical buyer's specs review guide to help users shop smarter.
          </p>
          <Button onClick={() => setOpen(true)} className="mt-4 bg-primary hover:bg-primary-hover text-white">
            Add First Article
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="overflow-hidden border-slate-200/60 dark:border-slate-900/60 group hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="h-44 relative bg-slate-100 dark:bg-slate-900/45 p-4 flex items-center justify-center border-b border-slate-100 dark:border-slate-900 overflow-hidden">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                  ) : (
                    <div className="text-slate-300">
                      <Image className="h-12 w-12" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center gap-1">
                    {post.published ? (
                      <>
                        <Eye className="h-3 w-3 text-emerald-400" /> PUBLISHED
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3 text-slate-400" /> DRAFT
                      </>
                    )}
                  </div>
                </div>
                <CardHeader className="pb-2 pt-4">
                  <div className="space-y-1">
                    <CardTitle className="text-base font-bold line-clamp-1 group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                    <span className="text-[10px] font-mono text-slate-400 block">
                      /blog/{post.slug}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-1 text-[9px] text-slate-400 font-bold mt-3">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </div>
              <div className="flex border-t border-slate-100 dark:border-slate-900 divide-x divide-slate-100 dark:divide-slate-900">
                <button
                  onClick={() => handleEdit(post)}
                  className="flex-1 py-3 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Edit2 className="h-3.5 w-3.5" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="flex-1 py-3 text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/10 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add / Edit Blog Dialog */}
      <Dialog open={open} onOpenChange={(v) => !v && handleModalClose()}>
        <DialogContent className="border-slate-200 dark:border-slate-800 max-w-2xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{editingPost ? "Edit Article" : "Create New Article"}</DialogTitle>
            <DialogDescription>
              Write comprehensive specs comparisons and articles. Slug updates automatically from title.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="title">Article Title</Label>
                <Input id="title" placeholder="e.g. Best Developer Laptops of 2026" {...register("title")} />
                {errors.title && <p className="text-xs text-rose-500 font-medium">{errors.title.message}</p>}
              </div>

              <div className="space-y-1">
                <Label htmlFor="slug">Url Slug</Label>
                <Input id="slug" placeholder="e.g. best-developer-laptops-2026" {...register("slug")} />
                {errors.slug && <p className="text-xs text-rose-500 font-medium">{errors.slug.message}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Cover Image Upload</Label>
              <input type="hidden" {...register("coverImage")} />
              <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors relative h-[140px]">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  {watch("coverImage") ? (
                    <img src={watch("coverImage")} alt="Cover Preview" className="h-full w-full rounded object-cover" />
                  ) : (
                    <>
                      <UploadCloud className="h-6 w-6 text-slate-400 mb-1" />
                      <span className="text-[10px] font-semibold text-slate-700 dark:text-slate-300">Click / Drag to Upload</span>
                    </>
                  )}
                </div>
                {watch("coverImage") && (
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-[9px] text-slate-400 truncate">Image uploaded</span>
                    <button
                      type="button"
                      onClick={() => setValue("coverImage", "")}
                      className="text-[9px] font-bold text-rose-500 hover:underline px-1.5"
                    >
                      Clear
                    </button>
                  </div>
                )}
                {errors.coverImage && <p className="text-xs text-rose-500 font-medium mt-1">{errors.coverImage.message}</p>}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="published"
                className="h-4 w-4 rounded border-slate-300 text-primary focus:border-orange-500 focus:ring-0"
                {...register("published")}
              />
              <Label htmlFor="published" className="cursor-pointer font-extrabold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Publish immediately
              </Label>
            </div>

            <div className="space-y-1">
              <Label htmlFor="excerpt">Summary Excerpt</Label>
              <Textarea
                id="excerpt"
                rows={2}
                placeholder="Write a brief 1-2 sentence overview summary for preview cards..."
                {...register("excerpt")}
              />
              {errors.excerpt && <p className="text-xs text-rose-500 font-medium">{errors.excerpt.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="content">Full Article Content (Markdown / HTML)</Label>
              <Textarea
                id="content"
                rows={6}
                placeholder="Write the full content of your guide here..."
                {...register("content")}
              />
              {errors.content && <p className="text-xs text-rose-500 font-medium">{errors.content.message}</p>}
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <span className="text-xs uppercase tracking-widest text-slate-400 font-black block mb-3">SEO Parameters</span>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="metaTitle">SEO Meta Title</Label>
                  <Input id="metaTitle" placeholder="Custom Google title tag (optional)" {...register("metaTitle")} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="metaDescription">SEO Meta Description</Label>
                  <Input id="metaDescription" placeholder="Custom search snippet description (optional)" {...register("metaDescription")} />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={handleModalClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-white hover:bg-primary-hover" loading={submitting}>
                {editingPost ? "Save Changes" : "Create Article"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
