"use client";

import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import ProductCard from "./ProductCard";

interface ProductSliderProps {
  products: any[];
  ariaLabel: string;
  className?: string;
}

export default function ProductSlider({ products, ariaLabel, className = "" }: ProductSliderProps) {
  if (products.length === 0) return null;

  return (
    <div className={`product-slider ${className}`}>
      <Splide
        aria-label={ariaLabel}
        options={{
          type: products.length > 3 ? "loop" : "slide",
          perPage: 3,
          perMove: 1,
          gap: "1rem",
          pagination: products.length > 1,
          arrows: false,
          drag: true,
          speed: 650,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          padding: { right: "3rem" },
          breakpoints: {
            1024: {
              perPage: 2,
              padding: { right: "2.5rem" },
            },
            640: {
              perPage: 2,
              gap: "0.75rem",
              padding: { right: "1.25rem" },
            },
          },
        }}
      >
        {products.map((product) => (
          <SplideSlide key={product.id}>
            <div className="h-full">
              <ProductCard product={product} />
            </div>
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
}
