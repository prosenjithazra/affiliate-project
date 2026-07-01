"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "@repo/ui";
import {
  LayoutDashboard,
  ShoppingBag,
  FolderTree,
  Bookmark,
  BookOpen,
  Settings,
  LogOut,
  Menu,
  X,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";
import { Button } from "@repo/ui";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigation: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: <FolderTree className="h-5 w-5" />,
    },
    {
      name: "Brands",
      href: "/admin/brands",
      icon: <Bookmark className="h-5 w-5" />,
    },
    {
      name: "Blogs & Guides",
      href: "/admin/blog",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-900/60 px-4 py-6">
      {/* Brand Header */}
      <div className="px-2 mb-8">
        <img
          src="/logoNewUpdate.png"
          alt="ShopZone"
          className="h-16 w-auto object-contain dark:brightness-0 dark:invert"
        />
      </div>

      {/* Navigation items */}
      <nav className="flex-1 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-slate-500 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-900/40 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Footer Actions */}
      <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-900">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between px-2 py-1 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Appearance</span>
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* User Card */}
        {session?.user && (
          <div className="flex items-center gap-3 px-2">
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-slate-600 dark:text-slate-300">
              {session.user.name?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-white truncate">
                {session.user.name || "Administrator"}
              </p>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                {session.user.email}
              </p>
            </div>
          </div>
        )}

        {/* Sign out */}
        <Button
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full justify-start gap-3 px-3 py-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-sm font-medium"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-200 via-blue-100 to-orange-200 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile Top Navbar */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-950 border-b border-slate-200/60 dark:border-slate-900/60 w-full z-40 sticky top-0">
        <img
          src="/logoNewUpdate.png"
          alt="ShopZone"
          className="h-10 w-auto object-contain dark:brightness-0 dark:invert"
        />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-64 max-w-xs h-full bg-white dark:bg-slate-950">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
