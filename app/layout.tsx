import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ysphotography.vercel.app"),
  title: {
    default: "Yousif Saleem \u2014 YS Photography",
    template: "%s | YS Photography"
  },
  description:
    "Photography portfolio by Yousif Saleem, based in Dundee. Portraits, graduations, events, street, nature, and landscape work.",
  keywords: [
    "YS Photography",
    "Yousif Saleem",
    "Dundee photographer",
    "graduation photography",
    "portrait photography",
    "event photography",
    "street photography",
    "landscape photography"
  ],
  authors: [{ name: "Yousif Saleem" }],
  creator: "YS Photography",
  openGraph: {
    title: "Yousif Saleem \u2014 YS Photography",
    description:
      "Photography portfolio by Yousif Saleem, based in Dundee. Portraits, graduations, events, street, nature, and landscape work.",
    url: "https://ysphotography.vercel.app",
    siteName: "YS Photography",
    images: [
      {
        url: "/images/work-01.jpg",
        width: 1200,
        height: 630,
        alt: "YS Photography portfolio image"
      }
    ],
    locale: "en_GB",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Yousif Saleem \u2014 YS Photography",
    description:
      "Photography portfolio by Yousif Saleem, based in Dundee. Portraits, graduations, events, street, nature, and landscape work.",
    images: ["/images/work-01.jpg"]
  },
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${archivo.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
