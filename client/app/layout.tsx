import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SocketProvider } from "./providers/Socket";
import { WebRTCProvider } from "./providers/WebRTC";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AnyCall",
  description: "Online random video + message chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WebRTCProvider>
          <SocketProvider>{children}</SocketProvider>
        </WebRTCProvider>
      </body>
    </html>
  );
}
