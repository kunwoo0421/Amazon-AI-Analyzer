import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for modern look
import "./globals.css";
import { NavigationWrapper } from "../components/NavigationWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ASP - Amazon Seller Pilot",
    description: "Amazon Seller Pilot by Withalice",
};

import { DataProvider } from "./contexts/DataContext";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body className={`${inter.className} min-h-screen bg-pastel-cream text-primary`}>
                <DataProvider>
                    <NavigationWrapper>
                        {children}
                    </NavigationWrapper>
                </DataProvider>
            </body>
        </html>
    );
}
