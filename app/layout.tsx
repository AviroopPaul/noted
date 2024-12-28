import { Providers } from "./providers";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  // Inter works best with its default weights, which include
  // 400 (regular), 500 (medium), 600 (semibold), and 700 (bold)
});

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
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
