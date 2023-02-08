// Autor: Javier Caicedo Delgado. version 1
import * as React from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, IconButton, Card, Fade, InputAdornment, Box } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircle';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import CircularProgreso from '../../../../components/Cargando';
import { estilosdetabla, styleActive, styleInactive, estilosdatagrid } from '../../../../utils/csssistema/estilos';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { PATH_DASHBOARD, PATH_OPSISTEMA } from '../../../../routes/paths';
import { URLAPIGENERAL, usuario } from '../../../../config';
import Page from '../../../../components/Page';

export default function Homecategoria() {
  document.body.style.overflowX = 'hidden';
  // eslint-disable-next-line camelcase
  const { token, codigo_Usuario } = JSON.parse(window.localStorage.getItem('usuario'));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { enqueueSnackbar } = useSnackbar();

  const navegacion = useNavigate();

  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
  };

  // ----------------------- bloque de asignacion de cabeceza/ Columns DataGrid  ------------------------->
  const columns = [
    { field: 'codigo', headerName: 'Código', width: 110, editable: true },

    { field: 'categoria', headerName: 'Categoría', width: 100, editable: true, hide: true, cellClassName: 'blueCell' },
    {
      field: 'nombre_categoria',
      headerName: 'Categoría',
      width: 180,
      editable: true,
      cellClassName: 'blueCell',
    },
    { field: 'familia', headerName: 'Familia', width: 100, editable: true, hide: true, cellClassName: 'blueCell' },
    {
      field: 'nombre_familia',
      headerName: 'Familia',
      width: 180,
      editable: true,
      cellClassName: 'blueCell',
    },
    { field: 'nombre', headerName: 'Nombre', width: 180, editable: true, cellClassName: 'yellowCell' },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 100,
      renderCell: (param) =>
        param.row.estado === 'A' ? (
          <Button variant="containded" style={styleActive}>
            Activo
          </Button>
        ) : (
          <Button variant="containded" style={styleInactive}>
            Inactivo
          </Button>
        ),
    },
  ];

  // bloque de evento Edit()
  const Edit = (e) => {
    navegacion(`/sistema/inventario/editarlinea`, { state: { id: e.id } });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getDatos() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/linea/listar`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }, setMostrarProgreso(true));
        setDatosFilas(data);
        setResultadoBusqueda(data);
        setDatosFilas(data);
        // Funciones de busqueda
        setItems(data);
        setResultadoBusqueda(data);
      } catch (error) {
        setItems([]);
        if (error.response.status === 401) {
          navegacion(`/auth/login`);
          messajeTool('error', 'Su inicio de sesión expiro.');
        }
        if (error.response.status !== 401) {
          messajeTool('error', 'Error, al traer los datos del servidor.');
        }
      } finally {
        setMostrarProgreso(false);
      }
    }
    getDatos();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const [datosfilas, setDatosFilas] =
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useState([]);
  // -----------------------Bloque de useState para Filtrar o Buscar id de la tabla------------------------->
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rowss, setItems] = React.useState([]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [buscar, setBuscar] = React.useState('');
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [resultadobusqueda, setResultadoBusqueda] = React.useState([]);

  const Buscar = (e) => {
    const texto1 = e.target.value.toLocaleUpperCase();
    setBuscar(texto1);
    const texto = String(e.target.value).toLocaleUpperCase();
    const resultado = resultadobusqueda.filter(
      (b) =>
        String(b.codigo).toLocaleUpperCase().includes(texto) || String(b.nombre).toLocaleUpperCase().includes(texto)
    );
    setItems(resultado);
  };

  return (
    <>
      <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      />
      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Page title="Líneas">
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <Box>
              <HeaderBreadcrumbs
                heading="Líneas"
                links={[
                  { name: 'Inicio' },
                  { name: 'Líneas' },
                  { name: 'Lista' },
                ]}
                action={
                  <Button
                    fullWidth
                    variant="contained"
                    component={RouterLink}
                    to="/sistema/inventario/nuevalinea"
                    startIcon={<AddCircleRoundedIcon />}
                  >
                    Nuevo
                  </Button>
                }
              />
            </Box>

            <Card sx={{ height: 'auto', width: '100%' }}>
              <Box sx={{ ml: 2, mr: 3, pt: 2 }}>
                <Grid container>
                  <Grid item container>
                    <Grid item xs={12} sm={4} md={4}>
                      <Grid>
                        <TextField
                          fullWidth
                          label="Buscar"
                          value={buscar}
                          onChange={Buscar}
                          id="outlined-size-small"
                          size="small"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                <IconButton aria-label="SearchIcon">
                                  <SearchIcon />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={12} sm={8} md={8}>
                      <Grid container justifyContent="flex-end" direction="row">
                        <Grid item md={2} sm={2} xs={12}>
                          <Button fullWidth variant="text" target="_blank" startIcon={<ViewComfyRoundedIcon />}
                            href={`${URLAPIGENERAL}/linea/generarexcel`}
                          >
                            Excel
                          </Button>
                        </Grid>
                        <Grid item md={2} sm={2} xs={12}>
                          <Button
                            fullWidth
                            variant="text"
                            startIcon={<PictureAsPdfRoundedIcon />}
                            href={`${URLAPIGENERAL}/linea/generarpdf`}
                            target="_blank"
                          >
                            PDF
                          </Button>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Box sx={estilosdetabla}>
                <div
                  style={{
                    padding: '1rem',
                    height: '55vh',
                    width: '100%',
                  }}
                >
                  <DataGrid
                    sx={estilosdatagrid}
                    density="compact"
                    onRowDoubleClick={(e) => Edit(e)}
                    columns={columns}
                    rows={rowss}
                    getRowId={(rows) => rows.codigo}
                    components={{ NoRowsOverlay: CustomNoRowsOverlay }}
                    rowHeight={28}
                    disableSelectionOnClick
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                  />
                </div>
              </Box>
            </Card>
          </Box>
        </Page>
      </Fade>
    </>
  );
}
