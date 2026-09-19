import { Geist, Geist_Mono, Bricolage_Grotesque, Manrope } from "next/font/google";
import { AuthProvider } from "@/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Marketing-site-only type family (scoped via the .site wrapper in globals.css)
// — kept separate from the app's Geist pairing so dashboards are untouched.
const bricolage = Bricolage_Grotesque({
  variable: "--font-site-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-site-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Skorex — Exam & Certification Platform for Training Centers",
  description:
    "Skorex lets training centers list on our platform, enroll students, run MCQ exams online, and issue verified certificates — all from one dashboard.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} ${manrope.variable}`}
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
