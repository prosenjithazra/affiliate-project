"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui";
import { ContactMessage } from "@repo/types";
import { Loader2, Mail } from "lucide-react";

export default function ContactAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/contact");
        if (res.ok) {
          setMessages(await res.json());
        }
      } catch {
        console.error("Failed to load contact messages");
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-slate-500 text-sm">Fetching contact submissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight">Contact Messages</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          View messages submitted from the public contact form.
        </p>
      </div>

      <Card className="border-slate-200/60 dark:border-slate-900/60 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-1.5">
            <Mail className="h-4.5 w-4.5 text-primary" /> Submissions
          </CardTitle>
          <CardDescription>{messages.length} total contact message{messages.length === 1 ? "" : "s"}</CardDescription>
        </CardHeader>
        <CardContent>
          {messages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-10 text-center text-sm text-slate-500">
              No contact messages yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead className="bg-slate-50 dark:bg-slate-900/60 text-xs uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Date</th>
                    <th className="px-4 py-3 font-bold">Name</th>
                    <th className="px-4 py-3 font-bold">Email</th>
                    <th className="px-4 py-3 font-bold">Subject</th>
                    <th className="px-4 py-3 font-bold">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {messages.map((message) => (
                    <tr key={message.id} className="bg-white dark:bg-slate-950 align-top">
                      <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                        {new Date(message.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">
                        {message.name}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        <a href={`mailto:${message.email}`} className="text-primary hover:underline">
                          {message.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        {message.subject}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-md">
                        {message.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
