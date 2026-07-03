import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Supabase database...");

  // ─── Categories ────────────────────────────────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "electronics" },
      update: {},
      create: {
        id: "cat-electronics",
        name: "Electronics",
        slug: "electronics",
        description: "Laptops, smartphones, headphones, and smart home appliances.",
        icon: "Laptop",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=60",
      },
    }),
    prisma.category.upsert({
      where: { slug: "fashion" },
      update: {},
      create: {
        id: "cat-fashion",
        name: "Fashion",
        slug: "fashion",
        description: "Trendy clothing, luxury watches, activewear, and designer accessories.",
        icon: "Shirt",
        image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=60",
      },
    }),
    prisma.category.upsert({
      where: { slug: "beauty" },
      update: {},
      create: {
        id: "cat-beauty",
        name: "Beauty",
        slug: "beauty",
        description: "Skincare, cosmetics, hair care products, and wellness essentials.",
        icon: "Sparkles",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=60",
      },
    }),
    prisma.category.upsert({
      where: { slug: "gaming" },
      update: {},
      create: {
        id: "cat-gaming",
        name: "Gaming",
        slug: "gaming",
        description: "Consoles, PC accessories, high-refresh monitors, and gaming chairs.",
        icon: "Gamepad2",
        image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600&auto=format&fit=crop&q=60",
      },
    }),
    prisma.category.upsert({
      where: { slug: "fitness" },
      update: {},
      create: {
        id: "cat-fitness",
        name: "Fitness",
        slug: "fitness",
        description: "Dumbbells, running shoes, smartwatches, yoga mats, and recovery gear.",
        icon: "Dumbbell",
        image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60",
      },
    }),
    prisma.category.upsert({
      where: { slug: "travel" },
      update: {},
      create: {
        id: "cat-travel",
        name: "Travel",
        slug: "travel",
        description: "Ergonomic suitcases, backpacks, portable chargers, and travel pillows.",
        icon: "Compass",
        image: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=60",
      },
    }),
  ]);
  console.log(`✅ Seeded ${categories.length} categories`);

  // ─── Brands ────────────────────────────────────────────────────────────────
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: "apple" },
      update: {},
      create: {
        id: "brand-apple",
        name: "Apple",
        slug: "apple",
        logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300&auto=format&fit=crop&q=60",
        description: "Premium smartphones, computers, and innovative consumer gadgets.",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "sony" },
      update: {},
      create: {
        id: "brand-sony",
        name: "Sony",
        slug: "sony",
        logo: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=60",
        description: "Industry-leading audio equipment, cameras, and gaming entertainment.",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "nike" },
      update: {},
      create: {
        id: "brand-nike",
        name: "Nike",
        slug: "nike",
        logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&auto=format&fit=crop&q=60",
        description: "Global standard athletic footwear, sportswear, and active accessories.",
      },
    }),
    prisma.brand.upsert({
      where: { slug: "samsung" },
      update: {},
      create: {
        id: "brand-samsung",
        name: "Samsung",
        slug: "samsung",
        logo: "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?w=300&auto=format&fit=crop&q=60",
        description: "Cutting-edge displays, mobile devices, and memory electronics.",
      },
    }),
  ]);
  console.log(`✅ Seeded ${brands.length} brands`);

  // ─── Products ──────────────────────────────────────────────────────────────
  const macbook = await prisma.product.upsert({
    where: { slug: "macbook-pro-14-m3-max" },
    update: {},
    create: {
      id: "prod-macbook",
      name: "Apple MacBook Pro 14 (M3 Max)",
      slug: "macbook-pro-14-m3-max",
      shortDescription: "Mind-blowing speed and display quality with Apple Silicon.",
      fullDescription: "The 14-inch MacBook Pro with M3 Max is a powerhouse laptop. Designed for professional developers, videographers, and 3D artists, it offers unmatched battery life, a gorgeous Liquid Retina XDR screen, and high-performance hardware acceleration.",
      price: 3199.99,
      oldPrice: 3499.99,
      discount: 9,
      rating: 4.8,
      affiliateStore: "Amazon",
      affiliateUrl: "https://amazon.com",
      features: ["Apple M3 Max 16-Core CPU", "Liquid Retina XDR Display", "Up to 22 hours battery life", "14.2-inch compact profile"],
      specifications: { Processor: "Apple M3 Max", Memory: "48GB Unified Memory", Storage: "1TB SSD", Display: "14.2-inch XDR (3024 x 1964)", OS: "macOS Sequoia" },
      pros: ["Exceptional CPU and GPU rendering speeds", "Remarkable battery life exceeding 18 hours", "Whisper-quiet fans even under heavy load"],
      cons: ["Significantly expensive upgrade packages", "Memory and storage are not user-upgradable"],
      tags: ["macbook", "apple", "laptop", "premium", "developer"],
      stockStatus: "IN_STOCK",
      featured: true,
      trending: true,
      topDeal: false,
      categoryId: "cat-electronics",
      brandId: "brand-apple",
      images: {
        create: [
          { id: "img-mac-1", url: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80", order: 0 },
          { id: "img-mac-2", url: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80", order: 1 },
        ],
      },
    },
  });

  const headphones = await prisma.product.upsert({
    where: { slug: "sony-wh-1000xm5-headphones" },
    update: {},
    create: {
      id: "prod-headphones",
      name: "Sony WH-1000XM5 Wireless Headphones",
      slug: "sony-wh-1000xm5-headphones",
      shortDescription: "Industry leading noise-canceling with extreme comfort.",
      fullDescription: "Sony's WH-1000XM5 headphones rewrite the rules for distraction-free listening. Dual processors control eight microphones for unprecedented noise cancellation and exceptional call quality.",
      price: 348.0,
      oldPrice: 399.99,
      discount: 13,
      rating: 4.7,
      affiliateStore: "Sony Store",
      affiliateUrl: "https://sony.com",
      features: ["Multi Noise Canceling Sensor technology", "Up to 30 hours battery", "Ultra-comfortable lightweight design"],
      specifications: { Driver: "30mm dynamic driver", Battery: "30 Hours (ANC ON)", Bluetooth: "Version 5.2", Weight: "250g" },
      pros: ["Class-leading active noise cancellation", "Warm, punchy audio output", "Seamless multi-point device switching"],
      cons: ["Does not fold into a compact carrying size", "Touch controls can be sensitive to sweat"],
      tags: ["headphones", "sony", "anc", "music", "wireless"],
      stockStatus: "IN_STOCK",
      featured: true,
      trending: false,
      topDeal: true,
      categoryId: "cat-electronics",
      brandId: "brand-sony",
      images: {
        create: [
          { id: "img-head-1", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80", order: 0 },
          { id: "img-head-2", url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80", order: 1 },
        ],
      },
    },
  });

  const ps5 = await prisma.product.upsert({
    where: { slug: "playstation-5-console-slim" },
    update: {},
    create: {
      id: "prod-ps5",
      name: "Sony PlayStation 5 Console Slim",
      slug: "playstation-5-console-slim",
      shortDescription: "Next-gen gaming experience in a slim, sleek package.",
      fullDescription: "Experience lightning-fast loading with an ultra-high-speed SSD, deeper immersion with support for haptic feedback, adaptive triggers, and 3D Audio, and an all-new generation of incredible PlayStation games.",
      price: 449.99,
      oldPrice: 499.99,
      discount: 10,
      rating: 4.9,
      affiliateStore: "Amazon",
      affiliateUrl: "https://amazon.com",
      features: ["Ultra-High Speed SSD", "4K-TV Gaming at up to 120fps", "Ray Tracing support", "Tempest 3D AudioTech"],
      specifications: { Storage: "1TB Custom SSD", Resolution: "Up to 8K, 4K 120Hz", Drive: "Ultra HD Blu-ray (detachable)", HDR: "Supported" },
      pros: ["Slimmer layout occupies much less shelf space", "Fast loading is incredibly smooth", "Excellent catalog of exclusive games"],
      cons: ["Stands vertically only with separate accessory", "Runs slightly warm during intense graphic scenes"],
      tags: ["gaming", "ps5", "sony", "console"],
      stockStatus: "IN_STOCK",
      featured: false,
      trending: true,
      topDeal: true,
      categoryId: "cat-gaming",
      brandId: "brand-sony",
      images: {
        create: [
          { id: "img-ps5-1", url: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&auto=format&fit=crop&q=80", order: 0 },
          { id: "img-ps5-2", url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80", order: 1 },
        ],
      },
    },
  });

  const airmax = await prisma.product.upsert({
    where: { slug: "nike-air-max-pulse" },
    update: {},
    create: {
      id: "prod-airmax",
      name: "Nike Air Max Pulse Sneakers",
      slug: "nike-air-max-pulse",
      shortDescription: "Urban comfort meets iconic sporty aesthetic.",
      fullDescription: "The Air Max Pulse pulls inspiration from the London music scene, bringing an underground touch to the iconic Air Max line. Its textile-wrapped midsole and point-loaded cushioning deliver comfort that stands up to long walks.",
      price: 150.0,
      oldPrice: 175.0,
      discount: 14,
      rating: 4.6,
      affiliateStore: "Nike Official",
      affiliateUrl: "https://nike.com",
      features: ["Point-loaded Air cushioning system", "Durable leather and textile overlays", "Waffle-inspired rubber outsole"],
      specifications: { Style: "Sport/Casual", Material: "Leather, Fabric, Rubber", Color: "Smoke Grey/Anthracite", Cushioning: "Max Air Unit" },
      pros: ["Modern aesthetic blends with all daily outfits", "Highly bouncy and supportive heel cup"],
      cons: ["Fits slightly narrow in the toe box", "White mesh is easily scuffed"],
      tags: ["shoes", "nike", "sneakers", "fashion"],
      stockStatus: "IN_STOCK",
      featured: true,
      trending: true,
      topDeal: false,
      categoryId: "cat-fashion",
      brandId: "brand-nike",
      images: {
        create: [
          { id: "img-nike-1", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80", order: 0 },
          { id: "img-nike-2", url: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&auto=format&fit=crop&q=80", order: 1 },
        ],
      },
    },
  });

  console.log(`✅ Seeded 4 products: MacBook, Headphones, PS5, Air Max`);

  // ─── Site Settings ─────────────────────────────────────────────────────────
  await prisma.settings.upsert({
    where: { id: "site-settings" },
    update: {},
    create: {
      id: "site-settings",
      websiteName: "ShopZone",
      seoTitle: "ShopZone - Premium Outbound Recommendations",
      seoDescription: "The ultimate curated list of high-quality gear and consumer reviews.",
      footerText: "© 2026 ShopZone. Outbound links may earn us a small commission.",
      footerYear: 2026,
      contactEmail: "hello@shopzone.com",
      socialLinks: {
        twitter: "https://twitter.com/shopzone",
        facebook: "https://facebook.com/shopzone",
      },
      homepagePromos: {
        promo1: {
          title: "Dinamic Tracking",
          desc: "Artisanal rugs, wallpaper, classic vases, and lighting accessories—well-made and carefully considered—whether made by Heath or by like-minded makers we admire. Welcome in.",
          img: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800",
          link: "/search",
        },
        promo2: {
          title: "Audio Speaker A1",
          desc: "Lasted answer oppose to ye months no esteem. Branched is on an ecstatic directly it.",
          img: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800",
          link: "/search",
        },
        promo3: {
          title: "Headphone",
          desc: "Headphones give you a great experience. Verified ratings and specs.",
          img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
          link: "/search",
        },
        promo4: {
          title: "Smart Watch",
          desc: "It is a long established fact that a reader will. Aggregated specs and direct links.",
          img: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=800",
          link: "/search",
        },
      },
      contactPage: {
        title: "Contact Us",
        subtitle: "Have questions about a product specifications table, or want to list your store? Get in touch.",
        supportLabel: "Email Support",
        supportValue: "support@affiliatehub.com",
        partnershipLabel: "Partnership Queries",
        partnershipValue: "partners@affiliatehub.com",
        hotlineLabel: "Hotline",
        hotlineValue: "+1 (555) 321-7890",
        nameLabel: "Full Name",
        namePlaceholder: "John Doe",
        emailLabel: "Email Address",
        emailPlaceholder: "john@example.com",
        subjectLabel: "Subject",
        subjectPlaceholder: "e.g. Partnership Request",
        messageLabel: "Message",
        messagePlaceholder: "Write your message here...",
        submitLabel: "Send Message",
        successTitle: "Message Sent",
        successMessage: "Your message has been sent to our editor team. We'll reply within 24 hours.",
      },
    },
  });
  console.log("✅ Seeded site settings");

  console.log("\n🎉 Supabase database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
