"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  Rocket,
  ShieldCheck,
  ShoppingBag,
  Star,
  Zap,
} from "lucide-react";

const launchOffset = 14 * 24 * 60 * 60 * 1000;

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function getTimeLeft(target: number): TimeLeft {
  const diff = Math.max(target - Date.now(), 0);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function cardMotion(delay = 0) {
  return {
    initial: { opacity: 0, y: 28, scale: 0.96 },
    animate: {
      opacity: 1,
      y: [0, -10, 0],
      scale: 1,
      transition: {
        opacity: { duration: 0.45, delay },
        scale: { duration: 0.45, delay },
        y: {
          duration: 4.5,
          delay,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      },
    },
  };
}

export default function ComingSoonPage() {
  const targetDate = useMemo(() => Date.now() + launchOffset, []);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 14,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetDate));

    const timer = window.setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [targetDate]);

  const countdown = [
    { label: "Days", value: timeLeft.days },
    { label: "Hrs", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <main className="relative flex min-h-screen overflow-hidden bg-[#f7f9fb] text-slate-950">
      <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-orange-200/50 blur-3xl" />
      <div className="absolute left-1/2 top-0 h-52 w-52 -translate-x-1/2 rounded-full bg-cyan-100/70 blur-3xl" />

      <div className="absolute left-1/2 top-8 z-50 -translate-x-1/2">
        <img
          src="/logoNewUpdate.png"
          alt="Logo"
          className="h-16 w-auto object-contain sm:h-20"
        />
      </div>

      <section className="relative z-10 mx-auto grid min-h-screen w-full max-w-[1440px] items-center gap-4 px-4 py-6 sm:px-6 sm:py-8 lg:grid-cols-[1fr_0.95fr] lg:px-8 pt-28">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-blue-700 shadow-sm shadow-blue-100/70">
            <Rocket className="h-4 w-4" />
            Ecosystem Evolution
          </div>

          <h1 className="text-balance text-4xl font-black leading-[0.95] tracking-normal text-slate-950 sm:text-4xl lg:text-6xl">
            The Next Frontier of{" "}
            <span className="text-blue-600">E-Commerce</span> is Almost Here.
          </h1>

          <p className="mx-auto mt-4 max-w-lg text-sm font-medium leading-6 text-slate-600 sm:mt-5 sm:text-base lg:mx-0">
            Aether Protocol is redefining the digital shopping experience with
            high-velocity transactions and professional-grade trust.
          </p>

          <div className="mt-6 grid grid-cols-4 gap-2 sm:mt-8 sm:gap-3">
            {countdown.map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white/85 px-2 py-3 text-center shadow-sm shadow-slate-200/70 sm:rounded-2xl sm:px-4 sm:py-4"
              >
                <div className="text-2xl font-black tabular-nums text-slate-950 sm:text-4xl">
                  {pad(item.value)}
                </div>
                <div className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400 sm:text-xs">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-slate-600 sm:mt-7 lg:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-sm shadow-slate-200">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              Secure by design
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-sm shadow-slate-200">
              <Zap className="h-4 w-4 text-orange-500" />
              Fast checkout
            </span>
          </div>
        </div>

        <div className="relative mx-auto grid w-full max-w-xl grid-cols-2 gap-3 sm:gap-4 lg:max-w-none">
          {/* <motion.div
            {...cardMotion(0.1)}
            className="relative col-span-1 min-h-64 overflow-hidden rounded-[1.75rem] border border-white bg-white shadow-2xl shadow-blue-950/10 sm:min-h-80"
          >
            <img
              src="/coming-soon/hero-product.jpg"
              alt="Aether product preview"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/10 to-white/95" />
            <div className="absolute inset-x-5 bottom-5 text-center">
              <div className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">
                The all-new aura phone t1
              </div>
              <div className="mt-1 text-2xl font-black leading-none text-slate-950 sm:text-4xl">
                COMING SOON
              </div>
              <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                Launching Q4 2026
              </div>
            </div>
          </motion.div> */}

          <div className="col-span-1 grid gap-3 sm:gap-4">
            {/* <motion.div
              {...cardMotion(0.22)}
              className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-xl shadow-blue-950/10 sm:p-7"
            >
              <div className="mb-2 flex text-orange-400">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-sm font-black italic leading-5 text-slate-800 sm:text-base">
                &quot;The cleanest interface I&apos;ve seen in years. Truly
                game-changing.&quot;
              </p>
              <div className="mt-3 text-xs font-black text-blue-700">
                Beta User #042
              </div>
            </motion.div> */}

            <motion.div
              {...cardMotion(0.34)}
              className="overflow-hidden rounded-xl border border-white bg-white shadow-xl shadow-blue-950/10 sm:rounded-[1.5rem]"
            >
              <img
                src="/coming-soon/hero-retail.jpg"
                alt="Aether retail interface preview"
                className="h-full w-full object-cover sm:h-64 lg:h-72"
              />
            </motion.div>
          </div>

          <motion.div
            {...cardMotion(0.46)}
            className="relative col-span-1 min-h-auto rounded-xl bg-blue-600 p-5 text-white shadow-xl shadow-blue-600/20 sm:min-h-auto sm:rounded-[1.75rem] sm:p-7"
          >
            <CreditCard className="absolute right-5 top-5 h-12 w-12 text-white/20 sm:h-16 sm:w-16" />
            <div className="mt-10 text-2xl font-black sm:mt-14 sm:text-3xl">
              Safe & Secure
            </div>
            <div className="mt-2 max-w-[13rem] text-xs font-medium text-blue-100 sm:text-sm">
              Encrypted transaction protocols for total launch confidence.
            </div>
          </motion.div>

          <motion.div
            {...cardMotion(0.58)}
            className="absolute -bottom-3 -left-4 z-20 inline-flex items-center gap-3 rounded-xl border border-orange-200 bg-white/95 px-3 py-2 shadow-2xl shadow-slate-900/10 backdrop-blur sm:-bottom-5 sm:left-10 sm:rounded-2xl sm:px-4 sm:py-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100 text-orange-600 sm:h-11 sm:w-11 sm:rounded-xl">
              <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <span>
              <span className="block whitespace-nowrap text-xs font-black text-slate-950 sm:text-sm">
                500+ Items
              </span>
              <span className="block whitespace-nowrap text-[10px] font-bold text-slate-500 sm:text-[11px]">
                In Launch Inventory
              </span>
            </span>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
