import type { Metadata } from "next";
import { EB_Garamond, Cormorant_Garamond, Parisienne } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { couple } from "@/content/site";
import "./globals.css";

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const parisienne = Parisienne({
  variable: "--font-parisienne",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: `${couple.partnerOneFirstName} & ${couple.partnerTwoFirstName}`,
  description: `Join us as we celebrate our wedding on ${couple.weddingDateDisplay} at ${couple.venueName}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${ebGaramond.variable} ${cormorant.variable} ${parisienne.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-paper text-ink">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
