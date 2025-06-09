// app/layout.jsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { CartProvider } from "./context/CartContext";
import { UserProvider } from "./context/UserContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "GrowSpace",
  description: "Платформа для садівників-початківців",
};

export default function RootLayout({ children }) {
  return (
    <html lang="uk">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CartProvider>
          <UserProvider>
            <Header />
            {children}
            <Footer />
          </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}
