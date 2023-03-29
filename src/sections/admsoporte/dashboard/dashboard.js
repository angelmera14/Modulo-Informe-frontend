import { Grid, Box, Typography } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import { IconoDataGrid } from '../../../components/admsoporte/IconoDataGrid';
import { estilosdetabla, estilosdatagrid } from '../../../utils/admsoporte/estilos';
import Page from '../../../components/Page';
// import { fCurrency } from '../../../utils/formatNumber';
import { BookingIllustration, DocIllustration, OrderCompleteIllustration } from '../../../assets';
import TarjetaTotal from './componentes/TarjetaTotal';
import TarjetaTotalHoy from './componentes/TarjetaTotalHoy';
import ImgSoporte1 from '../../../assets/images/soporte/soporte_img1.png';
import ImgSoporte2 from '../../../assets/images/soporte/soporte_img2.png';
import ImgTotalAnio from '../../../assets/images/soporte/total_anio_img.png';
import useDashboard from './hooks/useDashboard';

// ----------------------------------------------------------------------
const columnas1 = [
  {
    field: 'operador',
    headerName: 'Operador',
    width: 300,
  },
  {
    field: 'total_soporte',
    headerName: 'Soportes Realizados',
    width: 300,
  },
];
const columnas2 = [
  {
    field: 'tipo_soporte',
    headerName: 'Tipo',
    width: 250,
  },
  {
    field: 'total_soporte',
    headerName: 'Total',
    width: 300,
  },
];
export default function Desktop() {
  const { datos } = useDashboard();
  return (
    <Page title="Inicio">
      <Box m={3}>
        <Grid container spacing={2}>
          {/* <Grid item container md={12} spacing={1}>
            <Grid item md={4} sm={6} xs={12}>
              <TextField
                select
                label="Empresa"
                value="{empresa}"
                fullWidth
                size="small"
                onChange={(e) => cambiarEmpresa(e)}
              >
                {empresas.map((emp) => (
                  <MenuItem key={emp.conexion} value={emp.conexion}>
                    {emp.nombre}
                  </MenuItem>
                ))} 
                <MenuItem key={emp.conexion} value={emp.conexion}>
                    {emp.nombre}
                  </MenuItem>
              </TextField>
            </Grid>
            <Grid item md={2} sm={3} xs={12}>
              <TextField
                select
                label="Tipo de Venta"
                value={tipoVenta}
                fullWidth
                size="small"
                onChange={(e) => cambiarTipoVenta(e)}
              >
                <MenuItem value="P">POS</MenuItem>
                <MenuItem value="D">DIRECTA</MenuItem>
              </TextField>
            </Grid>
            <Grid item md={2} sm={3} xs={12}>
              <TextField label="Año" disabled value={new Date().getFullYear()} fullWidth size="small" />
            </Grid>
          </Grid> */}
          <Grid item xs={12} md={4}>
            <TarjetaTotal descripcion="Total Empresas" valor={datos.total_empresa} icono={<DocIllustration />} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TarjetaTotal descripcion="Total Contactos" valor={datos.total_contaco} icono={<BookingIllustration />} />
          </Grid>
          <Grid item xs={12} md={4}>
            <TarjetaTotal
              descripcion="Total Soporte (Año)"
              valor={datos.total_soporte_anio}
              icono={ImgTotalAnio}
              esImg
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TarjetaTotalHoy descripcion="Soportes del Dia" valor={datos.total_soporte_hoy} imagen={ImgSoporte1} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TarjetaTotalHoy descripcion="Soporte del Mes" valor={datos.total_soporte_mes} imagen={ImgSoporte2} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">Soporte Realizados Por Operador</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={estilosdetabla}>
              <div style={{ height: '35vh', width: '100%' }}>
                <DataGrid
                  density="compact"
                  hideFooter
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  sx={estilosdatagrid}
                  components={{
                    NoRowsOverlay: IconoDataGrid,
                  }}
                  getRowId={(r) => r.id}
                  columns={columnas1}
                  rows={datos.soporte_operador.map((m, i) => ({ ...m, id: i }))}
                />
              </div>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4">Tipos de Soporte Realizados</Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={estilosdetabla}>
              <div style={{ height: '35vh', width: '100%' }}>
                <DataGrid
                  density="compact"
                  hideFooter
                  localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  sx={estilosdatagrid}
                  components={{
                    NoRowsOverlay: IconoDataGrid,
                  }}
                  getRowId={(r) => r.id}
                  columns={columnas2}
                  rows={datos.soporte_tipo_soporte.map((m, i) => ({ ...m, id: i }))}
                />
              </div>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Page>
  );
}
