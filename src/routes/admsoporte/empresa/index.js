import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';
// ***************** DESARROLLADOR => ALLAN HERRERA *********************
// ========================== INICIO ===================================
const Empresa = Loadable(lazy(() => import('../../../sections/admsoporte/empresa/empresa')));
const Formulario = Loadable(lazy(() => import('../../../sections/admsoporte/empresa/componentes/formulario')));


export const EMPRESA = [
    {
        path: 'empresa/inicio',
        element: <Empresa />
    },
    {
        path: 'empresa/formulario',
        element: <Formulario />
    }
]