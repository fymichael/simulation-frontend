import { lazy } from 'react';

// project import
import Loadable from 'components/Loadable';
import Dashboard from 'layout/Dashboard';

const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/index')));

// render - sample page
const UserPage = Loadable(lazy(() => import('pages/extra-pages/users/User')));
const UserProfile = Loadable(lazy(() => import('pages/extra-pages/users/UserProfile')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: 'nyhavana',
  element: <Dashboard />,
  children: [
    {
      path: 'dashboard',
      element: <DashboardDefault />
    },

    {
      path: 'users',
      element: <UserPage />
    },
    {
      path: 'colors',
      element: <Color />
    },
    {
      path: 'profile',
      element: <UserProfile />
    }
  ]
};

export default MainRoutes;
