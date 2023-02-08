import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';
// ***************** DESARROLLADOR => ALLAN HERRERA *********************
// ========================== INICIO ===================================
const Solucion = Loadable(lazy(() => import('../../../sections/admsoporte/solucion/solucion')));

export const SOLUCION = [
    {
        path: 'requerimiento/solucion',
        element: <Solucion />
    }
]