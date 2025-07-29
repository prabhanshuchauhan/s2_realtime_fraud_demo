"use client";

import { useEffect, useState } from "react";
import FraudChart from "../components/FraudChart";
import TopCities from "../components/TopCities";
import { useRouter } from "next/navigation";

function StatCard({ title, value }: { title: string; value: string }) {
    return (
        <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-xl font-bold text-purple-700 dark:text-purple-400">{value}</p>
        </div>
    );
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState({ total: 0, topCity: "-", peakHour: "-" });

    const router = useRouter();
    
    useEffect(() => {
        fetch("/api/analytics/summary")
            .then((res) => res.json())
            .then((data) => setStats(data));
    }, []);

    return (
        <div className="space-y-6 px-4 py-6">
            <button onClick={() => router.push("/")} className="text-purple-600 hover:underline">
                ← Back to Dashboard
            </button>

            <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300">📊 Fraud Analytics Dashboard</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard title="Total Frauds" value={stats.total.toLocaleString()} />
                <StatCard title="Top City" value={stats.topCity} />
                <StatCard title="Peak Hour" value={stats.peakHour} />
            </div>

            <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow">
                    <FraudChart />
                </div>

                <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl shadow">
                    <TopCities />
                </div>
            </div>
        </div>
    );
}
