import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import PageLoading from "../components/loading/PageLoading";

import paths from "./Paths";

const Home = lazy(() => import("../modules/home/Home"));
const NotFound = lazy(() => import("../modules/not-found/NotFound"));
const Login = lazy(() => import("../modules/login/Login"));
const Register = lazy(() => import("../modules/register/Register"));
const Profile = lazy(() => import("../modules/profile/Profile"));

const getRouteElement = (Component: React.ElementType): React.ReactNode => (
  <Suspense fallback={<PageLoading />}>
    <MainLayout>
      <Component />
    </MainLayout>
  </Suspense>
);

interface Route {
  path: string;
  element: React.ReactNode;
}
const routes: Route[] = [
  { path: paths.HOME, element: getRouteElement(Home) },
  { path: paths.NOT_FOUND, element: getRouteElement(NotFound) },
  { path: paths.LOGIN, element: getRouteElement(Login) },
  { path: paths.REGISTER, element: getRouteElement(Register) },
  { path: paths.PROFILE, element: getRouteElement(Profile) },
];

export default createBrowserRouter(routes);
