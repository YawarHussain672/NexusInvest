import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "MLM Investment Dashboard",
  description: "Manage your investments and referrals.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>{children}</body>
    </html>
  );
}
