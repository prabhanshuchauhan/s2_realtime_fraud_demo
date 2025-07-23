"use client";
import Link from "next/link";
import { useEffect } from "react";

export default function Header() {
  useEffect(() => {}, []);

  return (
    <header className="border-b border-gray-200 dark:border-gray-800 py-4 shadow-sm sticky-">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4">
        <Link href="/">
          <span className="text-xl font-bold tracking-tight text-purple-700 dark:text-purple-400">
            Singlestore Demo
          </span>
        </Link>

        <nav className="space-x-4 text-sm font-medium">
          <Link href="/potential-frauds" className="hover:underline">
            Frauds
          </Link>
          <Link href="/analytics" className="hover:underline">
            Analytics
          </Link>
        </nav>
      </div>
    </header>
  );
}
