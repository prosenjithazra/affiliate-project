"use client";

import React from "react";
import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Add New Product</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Create a new affiliate product listing and push it live to the customer storefront.
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
