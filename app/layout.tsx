import "./globals.css";
import { Amiri } from "next/font/google";

const amiri = Amiri({ subsets: ["arabic"], weight: ["400", "700"] });

export const metadata = {
  title: "محلل الجمل العربية",
  description: "تطبيق لتحليل وإعراب الجمل العربية",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className="bg-white dark:bg-gray-900 min-w-full">
      <body
        className={`${amiri.className} bg-white dark:bg-gray-900 min-w-full`}
      >
        {children}
      </body>
    </html>
  );
}
