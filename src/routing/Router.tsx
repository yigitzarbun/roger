import { lazy, Suspense, useEffect } from "react";
import React from "react";
import { createBrowserRouter, useLocation } from "react-router-dom";

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

const ClubCourts = lazy(() => import("../modules/club-courts/ClubCourts"));
const TrainerStudents = lazy(
  () => import("../modules/trainer-students/TrainerStudents")
);
const Explore = lazy(() => import("../modules/explore/Explore"));
const ExploreProfile = lazy(
  () => import("../modules/explore-profiles/ExploreProfiles")
);

const ClubSubscriptions = lazy(
  () => import("../modules/club-subscriptions/ClubSubscriptions")
);
const ClubStaff = lazy(() => import("../modules/club-staff/ClubStaff"));
const Payments = lazy(() => import("../modules/payments/Payments"));
const Events = lazy(() => import("../modules/events/Events"));
const PlayersLeaderboard = lazy(
  () => import("../modules/leaderboard/PlayersLeaderboard")
);
const Social = lazy(() => import("../modules/social/Social"));
const PlayerSubscriptions = lazy(
  () => import("../modules/player-subscriptions/PlayerSubscriptions")
);
const PlayerGroups = lazy(
  () => import("../modules/player-groups/PlayerGroups")
);
const Favourites = lazy(() => import("../modules/favourites/Favourites"));

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const getRouteElement = (Component: React.ElementType): React.ReactNode => (
  <Suspense fallback={<PageLoading />}>
    <ScrollToTop />
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
  { path: paths.CLUB_COURTS, element: getRouteElement(ClubCourts) },
  { path: paths.STUDENTS, element: getRouteElement(TrainerStudents) },
  { path: paths.EXPLORE, element: getRouteElement(Explore) },
  {
    path: `${paths.EXPLORE_PROFILE}:profile_type/:id`,
    element: getRouteElement(ExploreProfile),
  },

  {
    path: paths.CLUB_SUBSCRIPTIONS,
    element: getRouteElement(ClubSubscriptions),
  },
  { path: paths.CLUB_STAFF, element: getRouteElement(ClubStaff) },
  { path: paths.PAYMENTS, element: getRouteElement(Payments) },
  { path: paths.PERFORMANCE, element: getRouteElement(Events) },
  {
    path: paths.PLAYERS_LEADERBOARD,
    element: getRouteElement(PlayersLeaderboard),
  },
  { path: paths.SOCIAL, element: getRouteElement(Social) },
  {
    path: paths.PLAYER_SUBSCRIPTIONS,
    element: getRouteElement(PlayerSubscriptions),
  },
  { path: paths.PLAYER_GROUPS, element: getRouteElement(PlayerGroups) },
  { path: paths.FAVOURITES, element: getRouteElement(Favourites) },
];

export default createBrowserRouter(routes);
