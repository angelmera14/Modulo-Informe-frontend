import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';

// ========================== INICIO ===================================
const Inicio = Loadable(lazy(() => import('../../../sections/admsoporte/inicio/inicio')));

export const INICIO = [
    {
        path: 'inicio',
        element: <Inicio />
    }
]
