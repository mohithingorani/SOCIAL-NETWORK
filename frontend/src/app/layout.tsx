"use client"
import { Inter } from "next/font/google";
import "./globals.css";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";
import { Analytics } from "@vercel/analytics/react";
import Footer from "./components/Footer";
import { RecoilRoot } from "recoil";
import { ToastContainer } from "react-toastify";
const inter = Inter({ subsets: ["latin"] });

const poppins_init = Poppins({
  subsets: ["latin"],
  weight: ["100", "300", "700"],
  variable: "--font-poppins",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RecoilRoot>
      <html lang="en">
        <body
          className={`${inter.className} ${poppins_init.className} h-screen  bg-gradient-to-b from-[#161616] to-[#101010]`}
        >
          <Providers>

                {children}
                </Providers>
                
                <ToastContainer
        // className="absolute top-0 right-0"
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        // transition={Bounce}
      />
        </body>
      </html>
    </RecoilRoot>
  );
}
