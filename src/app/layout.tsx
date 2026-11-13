import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "RentHub – Thuê nhà Quận 7, TP.HCM",
    template: "%s | RentHub",
  },
  description:
    "Tìm căn hộ, nhà phố, studio cho thuê tại khu Quận 7 (Tân Thuận, Phú Thuận, Tân Mỹ, Tân Hưng). Tin đăng được môi giới xác minh.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
