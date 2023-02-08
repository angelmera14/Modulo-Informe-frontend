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
       headerClassName: '',
       sortable: false,
       disableColumnMenuL: true 
    },
    {
        field: 'razonsocial',
        headerName: 'Razon Social',
        width: 200,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true
    },
    {
        field: 'tipopag',
        headerName: 'Tipo de Pago',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true
    },
    {
        field: 'secuencial',
        headerName: 'Secuencial',
        width: 120,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        type: 'string'
    },
    {
        field: 'cajac',
        headerName: 'Caja',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        type: 'number'
    },
    {
        field: 'numero',
        headerName: 'Numero',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        type: 'string'
    },
    {
        field: 'cuenta',
        headerName: 'Cuenta',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true
    },
    {
        field: 'monto',
        headerName: 'Monto',
        width: 120,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        type: 'number'
    },
    {
        field: 'numchq',
        headerName: 'Num. Cheque',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true
    },
    {
        field: 'operador',
        headerName: 'Operador',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
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
            const fecha = new Date(params.value).toISOString()
            return formaterarFecha(fecha, '-', '/')
        }
        , type: 'date',
    }

]