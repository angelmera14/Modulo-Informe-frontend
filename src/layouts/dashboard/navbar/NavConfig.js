// routes
import { PATH_OPSISTEMA } from '../../../routes/paths';
// components
// import Label from '../../../components/Label';
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  booking: getIcon('ic_booking'),
  invoice: getIcon('ic_invoice'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  inventariokardex: getIcon('ic_inventariokardex'),
  ticket: getIcon('ic_ticket'),
};

const navConfig = [
  {
    subheader: 'SOPORTE',
    items: [
      // {
      //   title: 'Ticket',
      //   path: PATH_OPSISTEMA.inicio,
      //   icon: ICONS.ticket
      // },
      {
        title: 'Informe',
        path: PATH_OPSISTEMA.informeSoporte,
        icon: ICONS.analytics
      },
      // {
      //   title: 'Requerimiento',
      //   icon: ICONS.invoice,
      //   children: [
      //     { title: 'Asignar', path: PATH_OPSISTEMA.requerimiento.asignar },
      //     { title: 'Tipo', path: PATH_OPSISTEMA.requerimiento.tipo },
      //     { title: 'Solucion', path: PATH_OPSISTEMA.requerimiento.solucion }
      //   ],
      // },
      // {
      //   title: 'Mantenimiento',
      //   icon: ICONS.kanban,
      //   children: [
      //     { title: 'Empresa', path: PATH_OPSISTEMA.mantenimiento.empresa.inicio },
      //     { title: 'Contacto', path: PATH_OPSISTEMA.mantenimiento.contacto.inicio },
      //     { title: 'Operador', path: PATH_OPSISTEMA.mantenimiento.operador.inicio }
      //   ],
      // },
      
      
    ],
  },
];
export default navConfig;
