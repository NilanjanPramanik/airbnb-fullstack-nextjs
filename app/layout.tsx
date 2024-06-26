import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navber/Navbar";
import RegisterModal from "@/components/modals/RegisterModal";
import ToastProvider from "@/providers/TosterProvider";
import LoginModal from "@/components/modals/LoginModal";
import RentModal from "@/components/modals/RentModal";
import getCurrentUser from "./actions/getCurrentUser";
import ClientOnly from "@/components/ClientOnly";
import SearchModal from "@/components/modals/SearchModal";

const font = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Airbnb",
  description: "Airbnb clone",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  const currentUser = await getCurrentUser();

  return (
    <html lang="en">
      <body className={font.className}>
          <ClientOnly>
            <ToastProvider />
            <SearchModal />
            <RegisterModal />
            {currentUser ? (
              <RentModal />
            ) : (
              <LoginModal />
            )}
            <Navbar currentUser={currentUser} />
          </ClientOnly>
          <div className="pb-20 pt-28">
            {children}
          </div>
      </body>
    </html>
  );
}

export default RootLayout;
