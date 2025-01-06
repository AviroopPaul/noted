import { Providers } from "./providers";
import "./globals.css";
import { Inter } from "next/font/google";
import { DateTimeProvider } from "./DateTimeContext";

const inter = Inter({
  subsets: ["latin"],
  // Inter works best with its default weights, which include
  // 400 (regular), 500 (medium), 600 (semibold), and 700 (bold)
});

export const metadata = {
  title: "Noted",
  description: "Your personal note-taking app",
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Noted",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Roboto+Slab:wght@700&family=Space+Mono:wght@700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          type="image/png"
          href="/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
      </head>
      <body className={inter.className}>
        <DateTimeProvider>
          <Providers>{children}</Providers>
        </DateTimeProvider>
      </body>
    </html>
  );
}
