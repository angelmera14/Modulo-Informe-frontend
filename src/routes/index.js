import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
import CuentaGuardada from '../guards/session/session';
import LoadingScreen from '../components/LoadingScreen';
import { RUTAS_SISTEMA } from './admsoporte';


// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/sistema')} />}>
      <Component {...props} />
    </Suspense>
  );
};


export default function Router() {
  console.log(RUTAS_SISTEMA)
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            // <GuestGuard>
            <Login />
            // </GuestGuard>
          ),
        },
        // {
        //   path: 'register',
        //   element: (
        //     <GuestGuard>
        //       <Register />
        //     </GuestGuard>
        //   ),
        // },
        // { path: 'login-unprotected', element: <Login /> },
        // { path: 'register-unprotected', element: <Register /> },
        // { path: 'reset-password', element: <ResetPassword /> },
        // { path: 'verify', element: <VerifyCode /> },
      ],
    },
    // RUTAS DEL SISTEMA
    {
      path: 'sistema',
      element: (
        // <CuentaGuardada>
          <DashboardLayout />
        // </CuentaGuardada>
      ),
      children: [
        ...RUTAS_SISTEMA
      ]
    },
    // Dashboard Routes
    {
      path: 'dashboard',
      element: (
        // <AuthGuard>
        <DashboardLayout />
        // </AuthGuard>
      ),
      children: [
        // { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        // { path: 'app', element: <GeneralApp /> },
        // { path: 'ecommerce', element: <GeneralEcommerce /> },
        // { path: 'analytics', element: <GeneralAnalytics /> },
        // { path: 'banking', element: <GeneralBanking /> },
        // { path: 'booking', element: <GeneralBooking /> },

       
        // {
        //   path: 'e-commerce',
        //   children: [
        //     { element: <Navigate to="/dashboard/e-commerce/shop" replace />, index: true },
        //     { path: 'shop', element: <EcommerceShop /> },
        //     { path: 'product/:name', element: <EcommerceProductDetails /> },
        //     { path: 'list', element: <EcommerceProductList /> },
        //     { path: 'product/new', element: <EcommerceProductCreate /> },
        //     { path: 'product/:name/edit', element: <EcommerceProductCreate /> },
        //     { path: 'checkout', element: <EcommerceCheckout /> },
        //   ],
        // },
        // {
        //   path: 'user',
        //   children: [
        //     { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
        //     { path: 'profile', element: <UserProfile /> },
        //     { path: 'cards', element: <UserCards /> },
        //     { path: 'list', element: <UserList /> },
        //     { path: 'new', element: <UserCreate /> },
        //     { path: ':name/edit', element: <UserCreate /> },
        //     { path: 'account', element: <UserAccount /> },
        //   ],
        // },
        // {
        //   path: 'invoice',
        //   children: [
        //     { element: <Navigate to="/dashboard/invoice/list" replace />, index: true },
        //     { path: 'list', element: <InvoiceList /> },
        //     { path: ':id', element: <InvoiceDetails /> },
        //     { path: ':id/edit', element: <InvoiceEdit /> },
        //     { path: 'new', element: <InvoiceCreate /> },
        //   ],
        // },
        // {
        //   path: 'blog',
        //   children: [
        //     { element: <Navigate to="/dashboard/blog/posts" replace />, index: true },
        //     { path: 'posts', element: <BlogPosts /> },
        //     { path: 'post/:title', element: <BlogPost /> },
        //     { path: 'new', element: <BlogNewPost /> },
        //   ],
        // },
        // {
        //   path: 'mail',
        //   children: [
        //     { element: <Navigate to="/dashboard/mail/all" replace />, index: true },
        //     { path: 'label/:customLabel', element: <Mail /> },
        //     { path: 'label/:customLabel/:mailId', element: <Mail /> },
        //     { path: ':systemLabel', element: <Mail /> },
        //     { path: ':systemLabel/:mailId', element: <Mail /> },
        //   ],
        // },
        // {
        //   path: 'chat',
        //   children: [
        //     { element: <Chat />, index: true },
        //     { path: 'new', element: <Chat /> },
        //     { path: ':conversationKey', element: <Chat /> },
        //   ],
        // },
        // { path: 'calendar', element: <Calendar /> },
        // { path: 'kanban', element: <Kanban /> },
      ],
    },

    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        // { path: 'coming-soon', element: <ComingSoon /> },
        // { path: 'maintenance', element: <Maintenance /> },
        // { path: 'pricing', element: <Pricing /> },
        { path: 'payment', element: <Payment /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: <Login />
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
// const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
// const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

const Payment = Loadable(lazy(() => import('../pages/Payment')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const NotFound = Loadable(lazy(() => import('../pages/Page404')));



