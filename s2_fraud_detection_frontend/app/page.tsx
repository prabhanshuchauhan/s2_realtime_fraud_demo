"use client";

import dynamic from "next/dynamic";
import SummaryStats from "./components/SummaryStats";

const LiveMap = dynamic(() => import("./components/LiveMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function Home() {
  return (
    <section className="space-y-10">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold text-purple-700 dark:text-purple-300">
          Real-time Fraud Detection
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Monitoring transactions worldwide and flagging suspicious activity using SingleStore.
        </p>
      </div>

      <SummaryStats />

      <div className="rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700">
        <LiveMap />
      </div>
    </section>
  );
}
