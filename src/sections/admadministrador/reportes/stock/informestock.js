import {
  Box,
  Grid,
  Button,
  Fade,
  Typography,
  TextField,
  IconButton,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Checkbox,
  Card,
  CardContent,
  Chip,
} from '@mui/material';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Accordion from '@mui/material/Accordion';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import { DataGrid, esES } from '@mui/x-data-grid';
import { ExpandMore } from '@mui/icons-material';
import SearchRounded from '@mui/icons-material/SearchRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import CircularProgreso from '../../../../components/Cargando';
import { URLAPIGENERAL } from '../../../../config';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import Page from '../../../../components/Page';
import {
  estilosacordeon,
  estilosdatagrid,
  estilosdetabla,
  styleActive,
  styleInactive,
} from '../../../../utils/csssistema/estilos';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
// import CajaGenerica from '../../../../components/cajagenerica';
import ModalGenerico from '../../../../components/modalgenerico';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { fCurrency } from '../../../../utils/formatNumber';

function InformeStock() {
  // Menu que controla el cargando
  const navegacion = useNavigate();
  const [cargando, setcargando] = React.useState(false);
  const [datosc, setDatosc] = React.useState({
    desdeitem: '',
    nombreitemd: '',
    hastaitem: '',
    nombreitemh: '',
  });
  // Menu de la Cabecera
  const [datos, setDatos] = React.useState({
    empresa: 'BDADM1',
    desdeitem: '',
    nombreitemd: '',
    hastaitem: '',
    nombreitemh: '',
    iva: 'S',
    estado: 'A',
    costo: false,
    stockc: false,
  });
  // INGRESO A LA TABLA
  const [ingresotabla, setingresotabla] = React.useState([]);
  const columnnasitems = [
    { field: 'item', headerName: 'Item', width: 80 },
    { field: 'nombre', headerName: 'Nombre', width: 250 },
    { field: 'caja', headerName: 'Caja', width: 60 },
    { field: 'unidades', headerName: 'Unidad', width: 60 },
    { field: 'factor', headerName: 'Factor', width: 60 },
    {
      field: 'costoP',
      headerName: 'Costo ',
      width: 120,
      hide: !datos.costo,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '----';
        }
        return fCurrency(params.value);
      },
    },
    {
      field: 'stock',
      headerName: 'Total U',
      width: 120,
    },
    {
      field: 'totalcosto',
      headerName: 'Total Costo',
      width: 120,
      valueFormatter: (params) => {
        if (params.value == null) {
          return '----';
        }
        return fCurrency(params.value);
      },
    },
    {
      field: 'iva',
      headerName: 'Iva',
      width: 80,
      renderCell: (param) =>
        param.row.iva === 'S' ? (
          <Button variant="containded" style={styleActive}>
            SI
          </Button>
        ) : (
          <Button variant="containded" style={styleInactive}>
            NO
          </Button>
        ),
    },
  ];
  // Espacio del TOckend
  // eslint-disable-next-line camelcase
  const { token, codigo_Usuario } = JSON.parse(window.localStorage.getItem('usuario'));

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const { enqueueSnackbar } = useSnackbar();
  const mensajeSistema = (mensaje, variante) => {
    enqueueSnackbar(mensaje, {
      variant: variante,
      anchorOrigin: {
        vertical: 'top',
        horizontal: 'center',
      },
    });
  };
  // Limpiar Campos
  const Limpiar = () => {
    setDatos({
      empresa: 'BDADM',
      desdeitem: datosc.desdeitem,
      nombreitemd: datosc.nombreitemd,
      hastaitem: datosc.hastaitem,
      nombreitemh: datosc.nombreitemh,
      iva: 'S',
      estado: 'A',
      costo: false,
      stockc: false,
    });
    setingresotabla([]);
  };

  // CALCULO DE LAS CAJAS AQLI -----------------------------------------------------------------------------------------
  const caja = (stock, factor) => {
    let cajas = 0;
    if (factor === 1) cajas = stock;
    if (factor > 1) cajas = Math.floor(stock / factor);
    return cajas;
  };
  const unidad = (stock, factor) => {
    let cajas = 0;
    let unidad = 0;
    if (factor === 1) {
      unidad = 0;
    }
    if (factor > 1) {
      cajas = Math.floor(stock / factor);
      unidad = stock - cajas * factor;
    }
    return unidad;
  };

  // MenuItem de las Empresas
  const [empresa, setEmpresa] = React.useState([]);
  const [producto, setProducto] = React.useState([]);
  const [total, setTotal] = React.useState({
    costo: '0',
    stock: '0',
    totalcosto: '0',
  });
  // item desde
  // eslint-disable-next-line no-unused-vars
  const [tiposBusquedas, setTiposBusqueda] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  const [openModal, setOpenModal] = React.useState(false);
  const toggleShow = () => setOpenModal((p) => !p);
  const handleCallbackChild = (e) => {
    const item = e.row;
    setDatos({
      ...datos,
      desdeitem: item.codigo || '',
      nombreitemd: item.nombre || '',
    });
    setingresotabla([]);
    toggleShow();
  };

  // item hasta
  const [openModal1, setOpenModal1] = React.useState(false);
  const toggleShow1 = () => setOpenModal1((p) => !p);
  const handleCallbackChild1 = (e) => {
    const item = e.row;
    setDatos({
      ...datos,
      hastaitem: item.codigo || '',
      nombreitemh: item.nombre || '',
    });
    toggleShow1();
    setingresotabla([]);
  };

  // Obtener datos de la Api
  const ObtenerDatos = async () => {
    try {
      if (datos.desdeitem > datos.hastaitem) {
        mensajeSistema('El codido desde no puede ser mayor al codgo hasta', 'error');
        return;
      }
      const { data } = await axios(
        `${URLAPIGENERAL}/informestock/listar?Conexion=${datos.empresa}&Itemmin=${datos.desdeitem}&Itemmax=${datos.hastaitem}&Stocks=${datos.stockc}&Estados=${datos.estado}&Ivas=${datos.iva}`,
        config,
        setcargando(true)
      );
      // console.log(data);

      const nuevalista = data.map((m) => {
        const nuevacaja = caja(m.stock, m.factor);
        const nuevaunidad = unidad(m.stock, m.factor);
        return {
          caja: nuevacaja,
          unidades: nuevaunidad,
          conexion: m.conexion,
          costoP: m.costoP,
          estado: m.estado,
          estados: m.estados,
          factor: m.factor,
          item: m.item,
          itemmax: m.itemmax,
          itemmin: m.itemmin,
          iva: m.iva,
          ivas: m.ivas,
          nombre: m.nombre,
          stock: m.stock,
          stocks: m.stocks,
          totalcosto: m.totalcosto,
        };
      });
      let totalcosto = 0;
      let totalstock = 0;
      let totalcostof = 0;
      nuevalista.forEach((n) => {
        totalcosto += parseFloat(n.costoP);
        totalstock += parseFloat(n.stock);
        totalcostof += parseFloat(n.totalcosto);
      });
      setTotal({
        costo: totalcosto.toFixed(2),
        stock: totalstock.toFixed(2),
        totalcosto: totalcostof.toFixed(2),
      });
      setingresotabla(nuevalista);
    } catch (error) {
      // mensajeSistema('Error al buscar', 'error');
      if (error.response.status === 401) {
        navegacion(`${PATH_AUTH.login}`);
        mensajeSistema('Su inicio de sesion expiro', 'error');
      }
      if (error.response.status === 500) {
        navegacion(`${PATH_PAGE.page500}`);
      }
    } finally {
      setcargando(false);
    }
  };

  React.useEffect(() => {
    const obtenerEmpresa = async () => {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/conexiones/listar`, config);
        setEmpresa(data);
      } catch (error) {
        if (error.response.status === 401) {
          navegacion(`${PATH_AUTH.login}`);
          mensajeSistema('Su inicio de sesion expiro', 'error');
        }
        if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        }
      }
    };
    const obtenerProductos = async () => {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/productos/listar`, config);
        const productos = data.map((p) => ({ codigo: p.item, nombre: p.nombre, estado: p.estado }));
        setProducto(productos);
        setDatosc({
          desdeitem: data[0].item.trim(),
          nombreitemd: data[0].nombre.trim(),
          hastaitem: data[data.length - 1].item.trim(),
          nombreitemh: data[data.length - 1].nombre.trim(),
        });
        setDatos({
          ...datos,
          desdeitem: data[0].item.trim(),
          nombreitemd: data[0].nombre.trim(),
          hastaitem: data[data.length - 1].item.trim(),
          nombreitemh: data[data.length - 1].nombre.trim(),
        });
      } catch (error) {
        mensajeSistema('Problemas con la aplicacion', 'error');
        if (error.response.status === 401) {
          navegacion(`${PATH_AUTH.login}`);
          mensajeSistema('Su inicio de sesion expiro', 'error');
        }
        if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        }
      }
    };
    obtenerEmpresa();
    obtenerProductos();
    // ObtenerModaldato();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* MODAL DE ITEM DESDE */}
      <ModalGenerico
        nombre="Item - desde "
        openModal={openModal}
        busquedaTipo={tiposBusquedas}
        toggleShow={toggleShow}
        rowsData={producto}
        parentCallback={handleCallbackChild}
      />
      {/* MODAL DE ITEM HASTA */}
      <ModalGenerico
        nombre="Item - hasta "
        openModal={openModal1}
        busquedaTipo={tiposBusquedas}
        toggleShow={toggleShow1}
        rowsData={producto}
        parentCallback={handleCallbackChild1}
      />
      <Page title="Informe Stock">
        <CircularProgreso
          open={cargando}
          handleClose1={() => {
            setcargando(false);
          }}
        />
        <Box sx={{ ml: 3, mr: 3, p: 1 }}>
          <HeaderBreadcrumbs
            heading="Informe Stock"
            links={[{ name: 'Informe ' }, { name: 'Informe stock' }, { name: 'Menu' }]}
          />
        </Box>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore style={{ color: 'white' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={estilosacordeon}
              >
                <Typography sx={{ fontSize: '1rem' }}>Busqueda</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item container md={5} sm={6} xs={12} spacing={1}>
                    <Grid container item xs={12} spacing={1}>
                      <Grid item md={4} sm={4} xs={12}>
                        <TextField
                          label="Item - desde"
                          fullWidth
                          size="small"
                          value={datos.desdeitem}
                          onChange={(e) => {
                            setDatos({
                              ...datos,
                              desdeitem: e.target.value,
                            });
                          }}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setOpenModal(true);
                                  }}
                                >
                                  <SearchRounded />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item md={8} sm={8} xs={12}>
                        <TextField
                          label="Nombre"
                          fullWidth
                          size="small"
                          value={datos.nombreitemd}
                          onChange={(e) => {
                            setDatos({
                              ...datos,
                              nombreitemd: e.target.value,
                            });
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid container item xs={12} spacing={1}>
                      <Grid item md={4} sm={4} xs={12}>
                        <TextField
                          label="Item - hasta"
                          fullWidth
                          size="small"
                          value={datos.hastaitem}
                          onChange={(e) => {
                            setDatos({
                              ...datos,
                              hastaitem: e.target.value,
                            });
                          }}
                          InputProps={{
                            readOnly: true,
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton
                                  size="small"
                                  onClick={() => {
                                    setOpenModal1(true);
                                  }}
                                >
                                  <SearchRounded />
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                      <Grid item md={8} sm={8} xs={12}>
                        <TextField
                          label="Nombre"
                          fullWidth
                          size="small"
                          value={datos.nombreitemh}
                          onChange={(e) => {
                            setDatos({
                              ...datos,
                              nombreitemh: e.target.value,
                            });
                          }}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item container md={2} sm={6} spacing={1}>
                    <Grid item md={12} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        variant="outlined"
                        label="Estado"
                        value={datos.estado}
                        onChange={(f) => {
                          setDatos({
                            ...datos,
                            estado: f.target.value,
                          });
                          setingresotabla([]);
                        }}
                      >
                        <MenuItem key="A" value="A">
                          Activo
                        </MenuItem>
                        <MenuItem key="N" value="N">
                          Inactivo
                        </MenuItem>
                        {/* <MenuItem key="T" value="T">
                          Todos
                        </MenuItem> */}
                      </TextField>
                    </Grid>
                    <Grid item md={12} sm={12} xs={12}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        variant="outlined"
                        label="Iva"
                        value={datos.iva}
                        onChange={(f) => {
                          setDatos({
                            ...datos,
                            iva: f.target.value,
                          });
                          setingresotabla([]);
                        }}
                      >
                        <MenuItem key="S" value="S">
                          Con Iva
                        </MenuItem>
                        <MenuItem key="N" value="N">
                          Sin Iva
                        </MenuItem>
                        {/* <MenuItem key="T" value="T">
                          Todos
                        </MenuItem> */}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Grid item md={5} sm={12} xs={12}>
                    <Grid item container xs={12}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        value={datos.empresa}
                        label="Empresa"
                        onChange={(f) => {
                          setDatos({ ...datos, empresa: f.target.value });
                          setingresotabla([]);
                        }}
                      >
                        {empresa.map((t) => (
                          <MenuItem key={t.conexion} value={t.conexion}>
                            {' '}
                            {t.nombre}
                          </MenuItem>
                        ))}
                        {/* <MenuItem value="todas">TODAS</MenuItem> */}
                      </TextField>
                    </Grid>
                    <Grid item container xs={12}>
                      <Grid item md={4} sm={6} xs={6}>
                        <FormControlLabel
                          onChange={(e) => {
                            setDatos({ ...datos, costo: e.target.checked });
                            setingresotabla([]);
                          }}
                          value={ingresotabla.costo}
                          control={
                            <Checkbox
                              // checked={ingresotabla.costo}

                              defaultChecked={false}
                            />
                          }
                          label="Mostrar Costo"
                        />
                      </Grid>
                      <Grid item md={5} sm={6} xs={6}>
                        <FormControlLabel
                          value={datos.stockc}
                          onChange={(d) => {
                            setDatos({
                              ...datos,
                              stockc: d.target.checked,
                            });
                            setingresotabla([]);
                          }}
                          control={<Checkbox defaultChecked={false} />}
                          label="Solo item con Stock"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container item xs={6}>
                    <Stack spacing={2} direction="row">
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => ObtenerDatos()}
                        startIcon={<SearchRounded />}
                      >
                        Buscar
                      </Button>
                      <Button
                        variant="text"
                        color="primary"
                        onClick={() => Limpiar()}
                        startIcon={<InsertDriveFileRoundedIcon />}
                      >
                        Nuevo
                      </Button>
                    </Stack>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Fade>
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMore style={{ color: 'white' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={estilosacordeon}
              >
                <Typography sx={{ fontSize: '1rem' }}>Informe</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box mb={1}>
                  <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item md={1.2} sm={2} xs={6}>
                      <Button
                        fullWidth
                        variant="text"
                        // eslint-disable-next-line camelcase
                        href={`${URLAPIGENERAL}/informestock/generarexcel?operador=${codigo_Usuario}&Conexion=${datos.empresa}&Itemmin=${datos.desdeitem}&Itemmax=${datos.hastaitem}&Stocks=${datos.stockc}&Estados=${datos.estado}&Ivas=${datos.iva}`}
                        startIcon={<ViewComfyRoundedIcon />}
                      >
                        Excel
                      </Button>
                    </Grid>
                    <Grid item md={1.2} sm={2} xs={6}>
                      <Button
                        fullWidth
                        variant="text"
                        // eslint-disable-next-line camelcase
                        href={`${URLAPIGENERAL}/informestock/generarpdf?operador=${codigo_Usuario}&Conexion=${datos.empresa}&Itemmin=${datos.desdeitem}&Itemmax=${datos.hastaitem}&Stocks=${datos.stockc}&Estados=${datos.estado}&Ivas=${datos.iva}`}
                        target="_blank"
                        startIcon={<PictureAsPdfRoundedIcon />}
                      >
                        Pdf
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={estilosdetabla}>
                  <div
                    style={{
                      // padding: '1rem',
                      height: '45vh',
                      width: '100%',
                    }}
                  >
                    <DataGrid
                      rowHeight={28}
                      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                      components={{
                        NoRowsOverlay: CustomNoRowsOverlay,
                      }}
                      rows={ingresotabla}
                      columns={columnnasitems}
                      density="compact"
                      getRowId={(rows) => rows.item}
                      sx={estilosdatagrid}
                    />
                  </div>
                </Box>
                <Grid container sx={{ mt: 1 }} spacing={1} justifyContent="flex-end">
                  <Grid item xs={6}>
                    {''}
                  </Grid>
                  <Grid item container md={6} xs={12} spacing={1} justifyContent="flex-end">
                    <Grid item md={4} sm={4} xs={12}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 0, m: 0 }}>
                          <Grid container justifyContent="flex-end">
                            <Grid item xs={10}>
                              <Chip label="Total Costo" color="success" sx={{ color: 'white' }} />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(total.totalcosto)}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item md={4} sm={4} xs={12}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 0, m: 0 }}>
                          <Grid container justifyContent="flex-end">
                            <Grid item xs={10}>
                              <Chip label="Total Stock" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(total.stock)}</Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Fade>
      </Page>
    </>
  );
}
export default InformeStock;
