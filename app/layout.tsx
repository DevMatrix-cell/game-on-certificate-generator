import type { Metadata } from "next";
import "./globals.css";
import "./certificate-name.css";
export const metadata: Metadata = { title: "Certify | Game On", description: "Generate your Game On participation certificate." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body>{children}</body></html>; }
