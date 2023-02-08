import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Grid,
  Fade,
  Typography,
  MenuItem,
  Card,
  Chip,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DataGrid, esES } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import es from 'date-fns/locale/es';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSnackbar } from 'notistack';
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';
import { ordenarListaJson } from '../../../../utils/sistema/funciones';
import Page from '../../../../components/Page';
import { URLAPIGENERAL } from "../../../../config";
import { estilosacordeon, estilosdetabla, estilosdatagrid } from '../../../../utils/csssistema/estilos';
import { columns } from './components/columnas';
import CircularProgreso from '../../../../components/Cargando';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { fCurrency } from '../../../../utils/formatNumber';


const tipodocumentos = [
  {
    tipo: 'CHP',
    nombre: 'CHEQUES P.'
  },
  {
    tipo: 'FAC',
    nombre: 'FACTURAS'
  },
  {
    tipo: 'PRO',
    nombre: 'PROTESTOS'
  },
  {
    tipo: 'NVT',
    nombre: 'NOTAS DE VENTAS'
  },
  {
    tipo: 'NDB',
    nombre: 'NOTAS DE DEBITO'
  },
  {
    tipo: 'ANT',
    nombre: 'ANTICIPOS'
  },
  {
    tipo: 'todos',
    nombre: 'TODOS'
  }
];
export default function SaldoClientes() {
  // eslint-disable-next-line camelcase
  const { token, codigo_Usuario } = JSON.parse(window.localStorage.getItem("usuario"));
  const { enqueueSnackbar } = useSnackbar();
  const navegacion = useNavigate();
  const [progreso, setProgreso] = useState(false);
  const [rows, setItems] = useState([]);
  const [total, setTotales] = useState({
    cheque: "0",
    factura: "0",
    protesto: "0",
    ncredito: "0",
    ndebito: "0",
    anticipo: "0",
    totalsaldo: "0"
  });
  const [formulario, setFormulario] = useState({
    empresa: 'BDADM',
    fdesde: new Date(),
    fhasta: new Date(),
    tipofecha: 'EMI',
    criterioagrupacion: 'SIM',
    ordenar: 'NOM',
    tipodoc: 'todos'
  })
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
  const mensajeSistema = (mensaje, variante) => {
    enqueueSnackbar(mensaje,
      {
        variant: variante,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'center',
        },
      }
    )
  }

  // datos a enviar
  const obtenerInforme = async () => {
    try {

      const enviarjson = {
        codigo: "string",
        razonsocial: "string",
        ruc: "string",
        direccion: "string",
        vendedor: "string",
        nombre: "string",
        tipo: "string",
        serie: "string",
        numero: 0,
        monto: 0,
        saldo: 0,
        fechaemi: "2022-06-25T19:11:08.731Z",
        fechaven: "2022-06-25T19:11:08.731Z",
        modulo: "string",
        fechadesde: formulario.fdesde,
        fechahasta: formulario.fhasta,
        tipofecha: formulario.tipofecha,
        tipodocumento: formulario.tipodoc,
        conexion: formulario.empresa
      }
      // console.log(enviarjson)
      const esfechaValida = formulario.fdesde <= formulario.fhasta;
      // if (!existedocs) mensajeSistema('Seleccion al menos un tipo', 'error');
      if (esfechaValida) {

        const { data } = await axios.post(`${URLAPIGENERAL}/informesaldocliente/listar`, enviarjson, config, setProgreso(true));
        console.log(data)
        if (data.length > 0) {
          const listareporte = data;
          let listaorden = [];
          let id = 0;

          if (listareporte.length > 0) {
            let totalsaldogeneral = 0;
            let totalmontogeneral = 0;
            let totalcheque = 0;
            let totalfactura = 0;
            let totalprotesto = 0;
            let totalnotacredito = 0;
            let totalnotadebito = 0;
            let totalanticipo = 0;
            listareporte.forEach(l => {
              totalsaldogeneral += parseFloat(l.saldo);
              totalmontogeneral += parseFloat(l.monto);
              if (l.tipo === 'CHP') totalcheque += parseFloat(l.saldo);
              if (l.tipo === 'FAC') totalfactura += parseFloat(l.saldo);
              if (l.tipo === 'PRO') totalprotesto += parseFloat(l.saldo);
              if (l.tipo === 'NVT') totalnotacredito += parseFloat(l.saldo);
              if (l.tipo === 'NDB') totalnotadebito += parseFloat(l.saldo);
              if (l.tipo === 'ANT') totalanticipo += parseFloat(l.saldo);
            });

            setTotales({
              cheque: totalcheque.toFixed(2),
              factura: totalfactura.toFixed(2),
              protesto: totalprotesto.toFixed(2),
              ncredito: totalnotacredito.toFixed(2),
              ndebito: totalnotadebito.toFixed(2),
              anticipo: totalanticipo.toFixed(2),
              totalsaldo: totalsaldogeneral.toFixed(2)
            })
            /* ordenar por */
            // nombre
            if (formulario.ordenar === 'NOM') {
              listaorden = ordenarListaJson(listareporte, 'razonsocial', 'asc');
            }
            // numero
            if (formulario.ordenar === 'NUM') {
              listaorden = ordenarListaJson(listareporte, 'numero', 'asc');
            }
            // fecha emision
            if (formulario.ordenar === 'VEN') {
              listaorden = ordenarListaJson(listareporte, 'fechaven', 'asc');
            }
            /* AGRUPACION */
            // sin agrupacion
            if (formulario.criterioagrupacion === 'SIM') {
              listaorden.forEach(l => {
                id += 1;
                l.id = id;
              });

              listaorden.push({ id: id + 1, razonsocial: '𝐂𝐀𝐑𝐓𝐄𝐑𝐀 𝐓𝐎𝐓𝐀𝐋 --> ', saldo: totalsaldogeneral, monto: totalmontogeneral });
              setItems(listaorden);
            }
            // por cliente
            if (formulario.criterioagrupacion === 'OCLIE') {
              let totalporcliente = 0;
              const listagrupada = [];
              let pivotecliente = listaorden[0].cliente;
              let siguientecliente;
              // nombre del clienrte
              listagrupada.push({
                razonsocial: `${listaorden[0].cliente} ** ${listaorden[0].razonsocial}`
              });
              for (let index = 0; index < listaorden.length; index += 1) {
                siguientecliente = listaorden[index].cliente;
                if (pivotecliente === siguientecliente) {
                  // total por cliente
                  totalporcliente += parseFloat(listaorden[index].saldo);
                  // detalles del cliente
                  listagrupada.push({
                    cliente: listaorden[index].cliente,
                    razonsocial: listaorden[index].razonsocial,
                    negocio: listaorden[index].negocio,
                    celular: listaorden[index].celular,
                    telefono: listaorden[index].telefono,
                    canton: listaorden[index].canton,
                    sector: listaorden[index].sector,
                    tipoCliente: listaorden[index].tipoCliente,
                    ruc: listaorden[index].ruc,
                    direccion: listaorden[index].direccion,
                    vendedor: listaorden[index].vendedor,
                    nombre: listaorden[index].nombre,
                    tipo: listaorden[index].tipo,
                    serie: listaorden[index].serie,
                    numero: listaorden[index].numero,
                    monto: listaorden[index].monto,
                    saldo: listaorden[index].saldo,
                    fechaemi: listaorden[index].fechaemi,
                    fechaven: listaorden[index].fechaven,
                    modulo: listaorden[index].modulo
                  });
                  // agg el total del ultimo cliente
                  if (listaorden.length - 1 === index) {
                    listagrupada.push({
                      razonsocial: 'TOTAL SALDO CLIENTE 🡆🡆🡆',
                      saldo: totalporcliente
                    });
                  }
                } else {
                  listagrupada.push({
                    razonsocial: 'TOTAL SALDO CLIENTE 🡆🡆🡆',
                    saldo: totalporcliente
                  });
                  listagrupada.push({
                    razonsocial: `${listaorden[index].cliente} ** ${listaorden[index].razonsocial}`
                  });
                  pivotecliente = listaorden[index].cliente;
                  index -= 1;
                  totalporcliente = 0;
                }
              }
              listagrupada.forEach(l => {
                id += 1;
                l.id = id;
              });
              listagrupada.push({
                id: id + 1,
                razonsocial: '𝐂𝐀𝐑𝐓𝐄𝐑𝐀 𝐓𝐎𝐓𝐀𝐋 -->',
                saldo: totalsaldogeneral,
                monto: totalmontogeneral
              });
              setItems(listagrupada);

            }
          } else mensajeSistema('No existe datos con las caracteristicas proporcionales', 'error');
        } else {
          mensajeSistema('No existe datos con las caracteristicas proporcionales', 'error');
          setItems([]);
        }
      } else {
        mensajeSistema('Los datos no son validos', 'error');
        setItems([]);
      }
    } catch (error) {
      mensajeSistema('Error al buscar', 'error');
      if (error.response.status === 401) {
        navegacion(`${PATH_AUTH.login}`);
        mensajeSistema("Su inicio de sesion expiro", "error");
      }
      if (error.response.status === 500) {
        navegacion(`${PATH_PAGE.page500}`);
      }
      /// .log(error)
      setItems([]);
    } finally {
      setProgreso(false);
    }
  };

  // limpiar campos
  const Nuevo = () => {
    setFormulario({
      empresa: 'BDADM1',
      fdesde: new Date(),
      fhasta: new Date(),
      tipofecha: 'EMI',
      criterioagrupacion: 'SIM',
      ordenar: 'NOM',
      tipodoc: 'CHP'
    });
    setItems([]);
  };



  const [empresas, setEmpresas] = useState([]);

  useEffect(() => {
    async function obtenerEmpresas() {
      try {
        const { data } = await axios(`${URLAPIGENERAL}/conexiones/listar`, config, setProgreso(true));
        // console.log(data);
        setEmpresas(data);
      } catch (error) {
        setEmpresas([{ conexion: '--', nombre: '----' }]);
        mensajeSistema('Error al buscar', 'error');
        if (error.response.status === 401) {
          navegacion(`${PATH_AUTH.login}`);
          mensajeSistema("Su inicio de sesion expiro", "error");
        }
        if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        }
      } finally {
        setProgreso(false);
      }
    }
    obtenerEmpresas();
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setFormulario({
      ...formulario,
      fdesde: firstDay,
      fhasta: lastDay
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <>
      <CircularProgreso open={progreso} handleClose1={() => { setProgreso(false) }} />
      <Page title='Informe Saldo de Clientes'>
        <Fade
          in
          style={{ transformOrigin: '0 0 0' }}
          timeout={1000}
        >
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <HeaderBreadcrumbs
              heading='Informe Saldo de Clientes'
              links={[
                { name: 'Informe ' },
                { name: 'Saldo de Clientes' },
                { name: 'Menu' },
              ]}

            />
          </Box>
        </Fade>
        <Fade
          in
          style={{ transformOrigin: '0 0 0' }}
          timeout={1000}
        >
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <Accordion
              defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={estilosacordeon}
              >
                <Typography sx={{ fontWeight: 'bold' }}>Busqueda</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid container spacing={1}>
                  <Grid item container md={2} sm={3} xs={12} spacing={1}>
                    <Grid item xs={12}>
                      <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                          label="Fecha Desde"
                          inputFormat="dd/MM/yyyy"
                          value={formulario.fdesde}
                          onChange={newValue => {
                            setFormulario({
                              ...formulario,
                              fdesde: newValue
                            });
                            const esfechavalida = formulario.fhasta >= newValue;
                            if (!esfechavalida)
                              mensajeSistema(
                                'La Fecha de inicio debe ser menor o igual ala fecha final',
                                'error'
                              );
                            setItems([]);
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              fullWidth
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                          label="Fecha Hasta"
                          inputFormat="dd/MM/yyyy"
                          value={formulario.fhasta}
                          onChange={newValue => {
                            setFormulario({
                              ...formulario,
                              fhasta: newValue
                            });
                            const esfechavalida = formulario.fdesde <= newValue;
                            if (!esfechavalida)
                              mensajeSistema(
                                'La Fecha de inicio debe ser menor o igual ala fecha final',
                                'error'
                              );
                            setItems([]);
                          }}
                          renderInput={params => (
                            <TextField
                              {...params}
                              fullWidth
                              variant="outlined"
                              size="small"
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                  <Grid item container md={3.5} sm={4} xs={12} spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        variant="outlined"
                        label="Empresas"
                        value={formulario.empresa}
                        onChange={e => {
                          setFormulario({
                            ...formulario,
                            empresa: e.target.value
                          });
                          setItems([]);
                        }}
                      >
                        {empresas.map(em => (
                          <MenuItem
                            key={em.conexion.trim() || '--'}
                            value={em.conexion.trim() || '----'}
                          >
                            {em.nombre}
                          </MenuItem>
                        ))}
                        <MenuItem value="todas">TODAS</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12} >
                      <TextField
                        fullWidth
                        select
                        size="small"
                        variant="outlined"
                        label="Tipo de documentos"
                        value={formulario.tipodoc}
                        onChange={(e) => {
                          setFormulario({
                            ...formulario,
                            tipodoc: e.target.value
                          })
                          setItems([]);
                        }}
                      >
                        {tipodocumentos.map(tc => (
                          <MenuItem key={tc.tipo} value={tc.tipo}>
                            {tc.nombre}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <Grid item container md={3} sm={4} xs={12} spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Tipo Fecha"
                        select
                        size="small"
                        value={formulario.tipofecha}
                        onChange={e => {
                          setFormulario({
                            ...formulario,
                            tipofecha: e.target.value
                          });
                          setItems([]);
                        }}
                      >
                        <MenuItem value="EMI">EMISION</MenuItem>
                        <MenuItem value="VEN">VENCIMIENTO</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Criterios de agrupacion"
                        select
                        size="small"
                        value={formulario.criterioagrupacion}
                        onChange={e => {
                          setFormulario({
                            ...formulario,
                            criterioagrupacion: e.target.value
                          });
                          setItems([]);
                        }}
                      >
                        <MenuItem value="SIM">SIN AGRUPACION</MenuItem>
                        <MenuItem value="OCLIE">POR CLIENTE</MenuItem>
                        {/* <MenuItem value="OVEN">FECHA VENCIMIENTO</MenuItem> */}
                      </TextField>
                    </Grid>
                  </Grid>
                  <Grid item container md={3} sm={4} xs={12} spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        variant="outlined"
                        label="Ordenar por"
                        select
                        size="small"
                        value={formulario.ordenar}
                        onChange={e => {
                          setFormulario({
                            ...formulario,
                            ordenar: e.target.value
                          });
                          setItems([]);
                        }}
                      >
                        <MenuItem value="NOM">NOMBRE</MenuItem>
                        <MenuItem value="NUM">NUMERO</MenuItem>
                        <MenuItem value="VEN">FECHA EMISION</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>


                  <Grid container item xs={12} spacing={1}>
                    <Grid item md={1.2} sm={2} xs={6}>
                      <Button
                        fullWidth
                        color="primary"
                        variant="text"
                        onClick={() => {
                          obtenerInforme();
                        }}
                        startIcon={<SearchRoundedIcon />}
                      >
                        {' '}
                        Buscar{' '}
                      </Button>
                    </Grid>
                    <Grid item md={1.2} sm={2} xs={6}>
                      <Button
                        fullWidth
                        color="primary"
                        variant="text"
                        onClick={() => {
                          Nuevo();
                        }}
                        startIcon={<InsertDriveFileRoundedIcon />}
                      >
                        Nuevo
                      </Button>
                    </Grid>

                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Fade>
        <Fade
          in
          style={{ transformOrigin: '0 0 0' }}
          timeout={1000}
        >
          <Box sx={{ ml: 3, mr: 3, p: 1 }} >
            <Accordion
              defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: 'white' }} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={estilosacordeon}
              >
                <Typography sx={{ fontWeight: 'bold' }}>Informe</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ borderRadius: '0.5rem' }}>
                <Box mb={1}>
                  <Grid container spacing={1} justifyContent="flex-end" >
                    <Grid item md={1.2} sm={2} xs={6} >
                      <Button
                        fullWidth
                        variant="text"
                        // eslint-disable-next-line camelcase
                        href={`${URLAPIGENERAL}/informesaldocliente/generarexcel?operador=${codigo_Usuario}&Fechadesde=${new Date(formulario.fdesde).toISOString()}&Fechahasta=${new Date(formulario.fhasta).toISOString()}&Tipofecha=${formulario.tipofecha}&Tipodocumento=${formulario.tipodoc}&Conexion=${formulario.empresa}`}
                        target="_blank"
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
                        href={`${URLAPIGENERAL}/informesaldocliente/generarpdf?operador=${codigo_Usuario}&Fechadesde=${new Date(formulario.fdesde).toISOString()}&Fechahasta=${new Date(formulario.fhasta).toISOString()}&Tipofecha=${formulario.tipofecha}&Tipodocumento=${formulario.tipodoc}&Conexion=${formulario.empresa}`}

                        target="_blank"
                        startIcon={<PictureAsPdfRoundedIcon />}
                      >
                        Pdf
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
                <Box
                  sx={estilosdetabla}
                >
                  <div
                    style={{
                      height: '60vh',
                      width: '100%',
                    }}
                  >
                    <DataGrid
                      density="compact"
                      rowHeight={28}
                      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                      rows={rows}
                      columns={columns}
                      getRowId={rows => rows.id}
                      sx={estilosdatagrid}
                      components={{
                        NoRowsOverlay: CustomNoRowsOverlay,
                      }}
                    />
                  </div>
                </Box>

                <Grid container sx={{ mt: 1 }} spacing={1} justifyContent="flex-end">
                  <Grid item xs={6}>{""}</Grid>
                  <Grid item container md={6} xs={12} spacing={1} justifyContent="flex-end">
                    <Grid item md={4} sm={4} xs={12}>
                      <Card variant="outlined">
                        <CardContent sx={{ p: 0, m: 0 }}>
                          <Grid container justifyContent="flex-end">
                            <Grid item xs={10}>
                              <Chip label="Saldo Chp. Pendientes" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(total.cheque)}</Typography>
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
                              <Chip label="Saldo Factura" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(total.factura)}</Typography>
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
                              <Chip label="Saldo Protesto" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(total.protesto)}</Typography>
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
                              <Chip label="Saldo N. Venta" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(total.ncredito)}</Typography>
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
                              <Chip label="Saldo N. Debito" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(total.ndebito)}</Typography>
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
                              <Chip label="Saldo Anticipo" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(total.anticipo)}</Typography>
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
                              <Chip label="Saldo Total" color="success" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(total.totalsaldo)}</Typography>
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
  )
}
