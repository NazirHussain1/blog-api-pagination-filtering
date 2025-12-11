import "./globals.css";
import Navbar from "@/app/components/Navbar/Navbar";

export const metadata = {
  title: "My Blog",
  description: "Blog system with pagination, filtering, and sorting",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
