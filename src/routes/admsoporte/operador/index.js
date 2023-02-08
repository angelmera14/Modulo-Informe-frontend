import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';
// ***************** DESARROLLADOR => ALLAN HERRERA *********************
// ========================== INICIO ===================================
const Operador = Loadable(lazy(() => import('../../../sections/admsoporte/operador/operador')));

export const OPERADOR = [
    {
        path: 'operador/inicio',
        element: <Operador />
    }
]