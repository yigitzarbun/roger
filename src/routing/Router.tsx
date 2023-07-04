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
const Train = lazy(() => import("../modules/training/Training"));
const Match = lazy(() => import("../modules/match/Match"));
const Lesson = lazy(() => import("../modules/lesson/Lesson"));
const Calendar = lazy(() => import("../modules/calendar/Calendar"));
const Requests = lazy(() => import("../modules/requests/Requests"));

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
  { path: paths.TRAIN, element: getRouteElement(Train) },
  { path: paths.MATCH, element: getRouteElement(Match) },
  { path: paths.LESSON, element: getRouteElement(Lesson) },
  { path: paths.CALENDAR, element: getRouteElement(Calendar) },
  { path: paths.REQUESTS, element: getRouteElement(Requests) },
];

export default createBrowserRouter(routes);
