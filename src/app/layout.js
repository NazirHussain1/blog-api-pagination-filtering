import "./globals.css";
import Header from "@/app/components/Header/Header";
import Footer from "@/app/components/Footer/Footer";
import { Toaster } from "sonner";
import ReduxProvider from "@/redux/provider";

export const metadata = {
  title: "My Blog",
  description: "Blog system with pagination, filtering, and sorting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50">
        <ReduxProvider>
          <Header />
          <main className="flex-1 container mx-auto px-4 py-6">
            {children}
          </main>
          <Footer />
        </ReduxProvider>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
