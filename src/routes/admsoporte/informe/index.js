import { lazy } from 'react';
import { Loadable } from '../../../utils/loadable';
// ***************** DESARROLLADOR => ALLAN HERRERA *********************
// ========================== INICIO ===================================
const Informe = Loadable(lazy(() => import('../../../sections/admsoporte/informe/informe')));
const InformeSoporte = Loadable(lazy(() => import('../../../sections/admsoporte/informeSoporte/informeSoporte')));

export const INFORME = [
  {
    path: 'informe',
    element: <Informe />,
  },
  {
    path: 'informesoporte',
    element: <InformeSoporte />,
  },
];
