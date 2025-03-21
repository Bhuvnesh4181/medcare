import { Montserrat } from "next/font/google";
import Navbar from "./_Components/Navbar/Navbar";
import "./globals.css";
import { Metadata } from "next";

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
                <Navbar />
                {children}
                {/* <Footer/> */}
            </body>
        </html>
    );
}
