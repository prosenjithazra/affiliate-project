"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  useToast,
} from "@repo/ui";
import {
  ShoppingBag,
  FolderTree,
  MousePointerClick,
  TrendingUp,
  Award,
  Calendar,
  Loader2,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";

interface AnalyticsData {
  summary: {
    totalProducts: number;
    totalCategories: number;
    totalClicks: number;
  };
  dailyClicks: { name: string; clicks: number }[];
  topProducts: { name: string; clicks: number }[];
  topStores: { name: string; clicks: number }[];
}

export default function DashboardPage() {
  const { error: toastError } = useToast();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      if (res.ok) {
        setData(await res.json());
      } else {
        throw new Error("Failed to load");
      }
    } catch {
      toastError("Could not retrieve analytics metrics.", "Error");
    } finally {
      setLoading(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const COLORS = ["#1E40AF", "#F97316", "#1D4ED8", "#EA580C", "#64748B"];

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 text-sm">Compiling store metrics...</p>
      </div>
    );
  }

  const summary = data?.summary || { totalProducts: 0, totalCategories: 0, totalClicks: 0 };
  const dailyClicks = data?.dailyClicks || [];
  const topProducts = data?.topProducts || [];
  const topStores = data?.topStores || [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Overview</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Real-time click conversions, stores performance, and category distribution
          </p>
        </div>
        <Button
          onClick={fetchAnalytics}
          variant="outline"
          className="flex items-center gap-2 self-start sm:self-auto border-slate-200 dark:border-slate-800"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </Button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Products Count */}
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Total Products
            </CardTitle>
            <ShoppingBag className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{summary.totalProducts}</div>
            <p className="text-[10px] text-slate-400 mt-1">Active affiliate products live</p>
          </CardContent>
        </Card>

        {/* Categories Count */}
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-[100px] pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Total Categories
            </CardTitle>
            <FolderTree className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{summary.totalCategories}</div>
            <p className="text-[10px] text-slate-400 mt-1">Store product groupings</p>
          </CardContent>
        </Card>

        {/* Clicks Count */}
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-[100px] pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Total Outbound Clicks
            </CardTitle>
            <MousePointerClick className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold tracking-tight">{summary.totalClicks}</div>
            <p className="text-[10px] text-slate-400 mt-1">Conversions recorded securely</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart: Daily Clicks */}
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-primary" /> Daily Click Activity
            </CardTitle>
            <CardDescription>Visual tracker of click frequencies this week</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {dailyClicks.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyClicks} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-900" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#0F172A",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#1E40AF"
                    strokeWidth={3}
                    dot={{ stroke: "#1E40AF", strokeWidth: 2, r: 4, fill: "#fff" }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No clicks recorded yet.</div>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart: Top Products */}
        <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-bold flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-emerald-500" /> Most Clicked Products
            </CardTitle>
            <CardDescription>Top 5 recommended items that generated redirect conversions</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {topProducts.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} margin={{ left: -10, right: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" className="dark:stroke-slate-900" />
                  <XAxis dataKey="name" stroke="#64748B" fontSize={9} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #E2E8F0",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                    {topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">No clicks logged yet.</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Stores Breakdown */}
      <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-bold flex items-center gap-1.5">
            <Award className="h-4.5 w-4.5 text-amber-500" /> Top Affiliate Partner Stores
          </CardTitle>
          <CardDescription>Total conversions driven to different store domains</CardDescription>
        </CardHeader>
        <CardContent>
          {topStores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {topStores.map((store) => (
                <div
                  key={store.name}
                  className="p-4 rounded-xl border border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10 flex flex-col justify-between"
                >
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Store</span>
                  <p className="font-extrabold text-sm text-slate-800 dark:text-slate-100 truncate mt-1">
                    {store.name}
                  </p>
                  <div className="mt-4 flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Clicks</span>
                    <span className="text-lg font-black text-primary">{store.clicks}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">No partner clicks aggregated yet.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
