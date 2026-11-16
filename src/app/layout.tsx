import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

// Be Vietnam Pro has a "vietnamese" subset, so accented letters render in the same font.
const beVietnam = Be_Vietnam_Pro({
  subsets: ["vietnamese", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={beVietnam.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
