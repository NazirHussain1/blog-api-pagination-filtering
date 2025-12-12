import "./globals.css";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import { Toaster } from "sonner";

export const metadata = {
  title: "My Blog",
  description: "Blog system with pagination, filtering, and sorting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1 container mx-auto p-4">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Global Toaster for toast notifications */}
        <Toaster richColors />
      </body>
    </html>
  );
}
