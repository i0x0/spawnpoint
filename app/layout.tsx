import type { Metadata } from "next";
import { ToastContainer } from 'react-toastify';

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "spawnpoint",
  description: "another way to manage ur data ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <ToastContainer
          position="bottom-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          toastClassName="bg-[#1a1a1a] text-white"
        />
        {children}
      </body>
    </html>
  );
}