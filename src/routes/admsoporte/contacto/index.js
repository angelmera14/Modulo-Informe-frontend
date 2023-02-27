import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';

// ========================== INICIO ===================================
const Contacto = Loadable(lazy(() => import('../../../sections/admsoporte/contacto/contacto')));

export const CONTACTO = [
    {
        path: 'contacto/inicio',
        element: <Contacto />
    }
]
