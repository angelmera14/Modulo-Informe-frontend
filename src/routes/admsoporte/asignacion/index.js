import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';

// ========================== INICIO ===================================
const Asignacion = Loadable(lazy(() => import('../../../sections/admsoporte/asignacion/asignacion')));

export const ASIGNACION = [
    {
        path: 'requerimiento/asignar',
        element: <Asignacion />
    }
]
