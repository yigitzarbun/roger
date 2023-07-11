import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useAppSelector } from "../../store/hooks";

interface MainLayoutProps {
  children: React.ReactNode | React.ReactNode[];
}
const MainLayout = ({ children }: MainLayoutProps) => {
  const player = useAppSelector((store) => store.user);
  console.log(player);
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
