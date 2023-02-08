import {
    Button
} from '@mui/material';
import { styleActive, styleInactive } from '../../../../../utils/csssistema/estilos';
import { fCurrency } from '../../../../../utils/formatNumber';


export const columns = [
    {
        field: 'item',
        headerName: 'Codigo',
        width: 90,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true
    },
    {
        field: 'nombre',
        headerName: 'Nombre',
        width: 180,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true
    },
    {
        field: 'iva',
        headerName: 'Iva',
        width: 70,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        renderCell: (param) => (
            param.row.iva === 'S' ? <Button variant="containded" style={styleActive}>SI</Button> : <Button variant="containded" style={styleInactive}>NO</Button>
        ),
    },
    {
        field: 'costo',
        headerName: 'Costo',
        width: 75,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }

    },
    {
        field: 'precio1',
        headerName: 'Precio 1',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }

    },
    {
        field: 'inc1',
        headerName: 'Inc',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (Number.isNaN(params.value)) {
                return `${parseFloat(0).toFixed(2)}%`;
            }
            if (params.value === Infinity) {
                return '****';
            }
            return `${parseFloat(params.value).toFixed(2)}%`;
        },
        // preProcessEditCellProps: async (params) => {
        //     console.log(params)
        //     const valor = await validar(`${params.props.value}`);
        //     return valor;
        // },
    },
    {
        field: 'nuevoprecio1',
        headerName: 'Nuv .Pre 1',
        width: 120,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (Number.isNaN(params.value)) {
                return fCurrency(0);
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'precio2',
        headerName: 'Precio 2',
        width: 80,
        sortable: false,
        disableColumnMenu: true,
        headerClassName: 'columnclass',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'inc2',
        headerName: 'Inc',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (Number.isNaN(params.value)) {
                return `${parseFloat(0).toFixed(2)}%`;
            }
            if (params.value === Infinity) {
                return '****';
            }
            return `${parseFloat(params.value).toFixed(2)}%`;
        }
    },
    {
        field: 'nuevoprecio2',
        headerName: 'Nuv .Pre 2',
        width: 120,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (Number.isNaN(params.value)) {
                return fCurrency(0);
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'precio3',
        headerName: 'Precio 3',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }

    },
    {
        field: 'inc3',
        headerName: 'Inc',
        width: 80,
        headerClassName: 'columnclass',
        editable: true,
        sortable: false,
        disableColumnMenu: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (params.value === Infinity) {
                return '****';
            }
            if (Number.isNaN(params.value)) {
                return `${parseFloat(0).toFixed(2)}%`;
            }
            return `${parseFloat(params.value).toFixed(2)}%`;
        }
    },
    {
        field: 'nuevoprecio3',
        headerName: 'Nuv .Pre 3',
        width: 120,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (Number.isNaN(params.value)) {
                return fCurrency(0);
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'precio4',
        headerName: 'Precio 4',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }

    },
    {
        field: 'inc4',
        headerName: 'Inc',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (params.value === Infinity) {
                return '****';
            }
            if (Number.isNaN(params.value)) {
                return `${parseFloat(0).toFixed(2)}%`;
            }
            return `${parseFloat(params.value).toFixed(2)}%`;
        }
    },
    {
        field: 'nuevoprecio4',
        headerName: 'Nuv .Pre 4',
        width: 120,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (Number.isNaN(params.value)) {
                return fCurrency(0);
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'precio5',
        headerName: 'Precio 5',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }

    },
    {
        field: 'inc5',
        headerName: 'Inc',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (params.value === Infinity) {
                return '****';
            }
            if (Number.isNaN(params.value)) {
                return `${parseFloat(0).toFixed(2)}%`;
            }
            return `${parseFloat(params.value).toFixed(2)}%`;
        }
    },
    {
        field: 'nuevoprecio5',
        headerName: 'Nuv .Pre 5',
        width: 120,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        editable: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (Number.isNaN(params.value)) {
                return fCurrency(0);
            }
            return fCurrency(params.value);
        }
    }
];