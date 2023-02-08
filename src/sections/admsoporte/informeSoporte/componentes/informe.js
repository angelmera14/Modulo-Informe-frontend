import { memo, useContext } from 'react';
import { DataGrid, esES } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
import { estilosdetabla, estilosdatagrid, styleActive, styleInactive } from '../../../../utils/csssistema/estilos';
import { InformeSoporteContext } from '../contextos/informeSoporteContexto';

const cabezera = [
  { field: 'nombre_empresa', headerName: 'Empresa', width: 200 },
  { field: 'creado', headerName: 'Fecha', width: 130 },
  { field: 'nombre_contacto', headerName: 'Contacto', width: 200 },
  { field: 'tipo', headerName: 'Tipo', width: 130 },
  { field: 'descripcion', headerName: 'Requerimiento', width: 350 },
  {
    field: 'solucion',
    headerName: 'Solucion',
    width: 300,
    valueFormatter: (params) => {
      if (params.value == null) {
        return '----';
      }
      if (`${params.value}`.trim().length === 0) {
        return '----';
      }
      return params.value;
    },
  },
  { field: 'nombre', headerName: 'Operador', width: 200 },
  {
    field: 'escorreo',
    headerName: 'Enviados',
    width: 100,
    renderCell: (param) =>
      param.row.escorreo === 1 ? (
        <Button variant="containded" style={styleActive}>
          Si
        </Button>
      ) : (
        <Button variant="containded" style={styleInactive}>
          No
        </Button>
      ),
  },
  {
    field: 'Estado',
    headerName: 'Estado',
    width: 100,
    renderCell: (param) =>
      `${param.row.Estado}`.toLowerCase().trim() === 'solucionado' ? (
        <Button variant="containded" style={styleActive}>
          Solucionado
        </Button>
      ) : (
        <Button variant="containded" style={styleInactive}>
          Pendiente
        </Button>
      ),
  },
];

function InformeDatosSoportes() {
  const { informe } = useContext(InformeSoporteContext);
  return (
    <Box sx={estilosdetabla}>
      <div style={{ height: '55vh', width: '100%' }}>
        <DataGrid
          density="compact"
          rowHeight={28}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
          sx={estilosdatagrid}
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          columns={cabezera}
          rows={informe}
        />
      </div>
    </Box>
  );
}

export default memo(InformeDatosSoportes);
