"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ProductForm from "../../ProductForm";
import { Product } from "@repo/types";
import { useToast } from "@repo/ui";

export default function EditProductPage() {
  const { id } = useParams() as { id: string };
  const { error: toastError } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        } else {
          throw new Error("Failed to load product");
        }
      } catch (err) {
        toastError("Could not retrieve product information.", "Error");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 text-sm">Hydrating product fields...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Product Not Found</h3>
        <p className="text-slate-500 text-sm mt-1">
          The requested product could not be located in our memory store or database.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Edit Product</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Update specifications, change price values, or rearrange image slots.
        </p>
      </div>
      <ProductForm initialData={product} />
    </div>
  );
}
