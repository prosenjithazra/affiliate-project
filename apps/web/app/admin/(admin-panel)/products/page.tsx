"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  useToast,
  Input,
} from "@repo/ui";
import {
  Plus,
  Edit2,
  Trash2,
  Copy,
  ShoppingBag,
  Star,
  Flame,
  Percent,
  Search,
  ExternalLink,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Product } from "@repo/types";
import { formatPrice } from "@repo/utils";

export default function ProductsPage() {
  const router = useRouter();
  const { success: toastSuccess, error: toastError } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProducts(data);
    } catch (err: any) {
      toastError("Could not retrieve products list. Showing memory fallback.", "Fetch Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDuplicate = async (product: Product) => {
    try {
      const duplicateData = {
        ...product,
        name: `${product.name} (Copy)`,
        slug: `${product.slug}-copy-${Math.floor(Math.random() * 1000)}`,
        images: product.images?.map((img) => img.url) || [],
        featured: false,
        trending: false,
        topDeal: false,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(duplicateData),
      });

      if (res.ok) {
        toastSuccess("Product duplicated successfully.", "Product Duplicated");
        fetchProducts();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to duplicate");
      }
    } catch (err: any) {
      toastError(err.message || "Could not duplicate product.", "Error");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toastSuccess("Product successfully deleted.", "Product Deleted");
        fetchProducts();
      } else {
        const err = await res.json();
        throw new Error(err.error || "Failed to delete");
      }
    } catch (err: any) {
      toastError(err.message || "Could not delete product.", "Error");
    }
  };

  const handleToggleFlag = async (id: string, field: "featured" | "trending" | "topDeal", currentValue: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: !currentValue }),
      });

      if (res.ok) {
        toastSuccess(
          `Product flag ${field} updated.`,
          "Status Updated"
        );
        fetchProducts();
      } else {
        throw new Error("Failed to update flag");
      }
    } catch (err: any) {
      toastError("Could not update product flag.", "Error");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.affiliateStore.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Products</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Publish products, edit specifications, and track affiliate outbound URLs
          </p>
        </div>
        <Link href="/admin/products/new" passHref legacyBehavior>
          <Button className="bg-primary hover:bg-primary-hover text-white flex items-center gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <Card className="border-slate-200/60 dark:border-slate-900/60">
        <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-lg">Product Listings</CardTitle>
            <CardDescription>
              Total {filteredProducts.length} products found
            </CardDescription>
          </div>
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search products, brands, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-slate-50/50 dark:bg-slate-900/30"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-slate-500 text-sm">Loading product database...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center px-4">
              <ShoppingBag className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4" />
              <h3 className="text-base font-bold">No Products Found</h3>
              <p className="text-slate-500 text-xs max-w-xs mt-1">
                Try searching for a different phrase or create a new product above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-900 bg-slate-50/70 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px] font-bold">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Brand/Category</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4 text-center">Badges</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                  {filteredProducts.map((product) => {
                    const primaryImage = product.images?.[0]?.url || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=80&auto=format&fit=crop";

                    return (
                      <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={primaryImage}
                              alt={product.name}
                              className="h-12 w-12 rounded-lg object-cover bg-slate-100 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-900"
                            />
                            <div className="min-w-0 max-w-[220px]">
                              <p className="font-semibold text-slate-800 dark:text-white truncate">
                                {product.name}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono block truncate">
                                {product.affiliateStore}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-xs text-slate-700 dark:text-slate-300">
                            {product.brand?.name || "No Brand"}
                          </p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {product.category?.name || "No Category"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-primary">
                            {formatPrice(product.price)}
                          </p>
                          {product.oldPrice && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatPrice(product.oldPrice)}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => handleToggleFlag(product.id, "featured", product.featured)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                product.featured
                                  ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                  : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600"
                              }`}
                              title="Toggle Featured"
                            >
                              <Star className="h-4 w-4 fill-current" />
                            </button>
                            <button
                              onClick={() => handleToggleFlag(product.id, "trending", product.trending)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                product.trending
                                  ? "bg-rose-500/10 border-rose-500/20 text-rose-500"
                                  : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600"
                              }`}
                              title="Toggle Trending"
                            >
                              <Flame className="h-4 w-4 fill-current" />
                            </button>
                            <button
                              onClick={() => handleToggleFlag(product.id, "topDeal", product.topDeal)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                product.topDeal
                                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                                  : "border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600"
                              }`}
                              title="Toggle Top Deal"
                            >
                              <Percent className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {product.stockStatus === "IN_STOCK" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 border border-emerald-200/40 dark:border-emerald-800/40 font-semibold">
                              <CheckCircle className="h-3 w-3" /> In Stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-200/40 dark:border-rose-800/40 font-semibold">
                              <XCircle className="h-3 w-3" /> Out of Stock
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end items-center gap-1.5">
                            <a
                              href={product.affiliateUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                              title="Visit Link"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => handleDuplicate(product)}
                              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                              title="Duplicate"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                              className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-900 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
