import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';

// ========================== INICIO ===================================
const Inicio = Loadable(lazy(() => import('../../../sections/admsoporte/inicio/inicio')));
const Dashboard = Loadable(lazy(() => import('../../../sections/admsoporte/dashboard/dashboard')));

export const INICIO = [
    {
        path: 'dashboard',
        element: <Dashboard />
    },
    {
        path: 'inicio',
        element: <Inicio />
    }
]
