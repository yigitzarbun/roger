import React, { useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import Paths from "../../routing/Paths";

interface MainLayoutProps {
  children: React.ReactNode | React.ReactNode[];
}
const MainLayout = ({ children }: MainLayoutProps) => {
  const token = useAppSelector((store) => store.user?.token);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      if (
        location.pathname !== Paths.LOGIN &&
        location.pathname !== Paths.REGISTER
      ) {
        navigate(Paths.LOGIN);
      }
    }
  }, [token, location, navigate]);
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default MainLayout;
