import { Montserrat } from "next/font/google";
import Navbar from "./_Components/Navbar/Navbar";
import "./globals.css";
import { Metadata } from "next";
import { LoginProvider } from "@/providers/loginProvider";
import { Toaster } from "sonner";

const montserrat = Montserrat({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-montserrat",
});

export const metadata: Metadata = {
    title: "Medcare",
    description: "A doctor appointment booking app.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={montserrat.variable}>
            <body>
                <Toaster
                    position="top-right"
                    closeButton
                    richColors
                    duration={3000}
                    expand={false}
                    theme="light"
                />
                <LoginProvider>
                    <Navbar />
                    {children}
                </LoginProvider>
            </body>
        </html>
    );
}