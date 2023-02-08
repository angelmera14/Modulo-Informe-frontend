import { fCurrency } from '../../../../../utils/formatNumber';

const formaterarFecha = (fecha, separador, union) => {
    try {
        let f = String(fecha).substring(0, 10)
        f = f.split(separador)
        f = f.reverse()
        f = f.join(union)
        return f
    } catch {
        return "--/--/----"
    }
}

export const columns = [
    {
        field: 'cliente',
        headerName: 'Cliente',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenuL: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'razonsocial',
        headerName: 'Nombre',
        width: 300,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'negocio',
        headerName: 'Negocio',
        width: 200,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'celular',
        headerName: 'Celular',
        width: 150,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'telefono',
        headerName: 'Telefono',
        width: 200,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'canton',
        headerName: 'Canton',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'sector',
        headerName: 'Sector',
        width: 150,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'tipoCliente',
        headerName: 'Tipo Cliente',
        width: 200,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'ruc',
        headerName: 'Ruc',
        width: 120,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'direccion',
        headerName: 'Direccion',
        width: 200,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'vendedor',
        headerName: 'Vendedor',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'nombre',
        headerName: 'Nombre',
        width: 180,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'tipo',
        headerName: 'Tipo Doc.',
        width: 90,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'serie',
        headerName: 'Serie',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'numero',
        headerName: 'Numero',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    },
    {
        field: 'monto',
        headerName: 'Monto',
        width: 150,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'saldo',
        headerName: 'Saldo',
        width: 150,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'fechaemi',
        headerName: 'Fecha Emision',
        width: 170,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: (params) => {
            if (params.value === null) {
                return '--/--/--'
            }
            if (typeof params.value === 'undefined') {
                return '----'
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            const valueFormatted = formaterarFecha(params.value, '-', '/');
            return valueFormatted;
        }
        , type: 'date'
    },
    {
        field: 'fechaven',
        headerName: 'Fecha Vencimiento',
        width: 170,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: (params) => {
            if (params.value === null) {
                return '--/--/--'
            }
            if (typeof params.value === 'undefined') {
                return '----'
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            const valueFormatted = formaterarFecha(params.value, '-', '/');
            return valueFormatted;
        }
        , type: 'date'
    },
    {
        field: 'modulo',
        headerName: 'Modulo',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (`${params.value}`.trim().length === 0) {
                return '----';
            }
            return `${params.value}`;
        }
    }

]