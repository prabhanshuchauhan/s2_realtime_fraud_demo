// app/layout.tsx
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ATM Fraud Intelligence | SingleStore Demo",
  description: "Real-time fraud detection powered by SingleStore and Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.className} bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-200`}
      >
        <Header/>
        <main className="max-w-7xl mx-auto px-4 py-6 min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
