import "./globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ToastProvider } from "../components/Toast";
import { SITE } from "../data/site";

export const metadata = {
  title: {
    default: `${SITE.shortName} — ${SITE.tagline}`,
    template: `%s | ${SITE.shortName}`,
  },
  description: `${SITE.description} Portfolio demo with a local-only appointment booking flow.`,
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-royal focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        <ToastProvider>
          <Navbar />
          <main id="main" className="flex-1">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}
