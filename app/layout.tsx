import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/ThemeProvider/ThemeProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/actions/authOptions";
import SessionProviderWrapper from "@/components/SessionProvider/SessionProviderWrapper";

export const metadata: Metadata = {
  title: "ShopMart - Your Premium Shopping Destination",
  description: "Discover the latest technology, fashion, and lifestyle products. Quality guaranteed with fast shipping and excellent customer service.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProviderWrapper session={session}>
            <Navbar />
            <main className="flex-1">
              <div className="container mx-auto px-4 py-8">
                <Toaster
                  position="top-center"
                  toastOptions={{
                    // Light mode
                    style: {
                      background: '#ffffff',
                      color: '#0f172a',
                      border: '1px solid #e2e8f0',
                    },
                    // Success
                    success: {
                      iconTheme: {
                        primary: '#22c55e',
                        secondary: '#ffffff',
                      },
                    },
                    // Error
                    error: {
                      iconTheme: {
                        primary: '#ef4444',
                        secondary: '#ffffff',
                      },
                    },
                    // Custom class for dark mode
                    className: 'dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700',
                  }}
                />
                {children}
              </div>
            </main>
            <Footer />
          </SessionProviderWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}