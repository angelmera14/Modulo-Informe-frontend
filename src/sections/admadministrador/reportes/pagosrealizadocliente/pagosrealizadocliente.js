import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  Grid,
  Fade,
  Chip,
  // IconButton,
  Card,
  CardContent,
  Typography,
  // InputAdornment,
  MenuItem,
  // Tooltip
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { DataGrid, esES } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import es from "date-fns/locale/es";
import { useSnackbar } from 'notistack';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PaidOutlinedIcon from '@mui/icons-material/PaidOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';
import Page from '../../../../components/Page';
import { URLAPILOCAL } from "../../../../config";
import { estilosacordeon, estilosdetabla } from '../../../../utils/csssistema/estilos';
import { columns } from './components/columnas';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
// import Empresa from './components/empresa';
// import TotalesDocumento from './components/TotalesDocumento';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { fCurrency } from '../../../../utils/formatNumber';


export default function PagosRealizadosxClientes() {
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const axiosInst = axios.create({
    headers: {
      Authorization: `Bearer ${usuario.token}`,
    }
  });
  const navegacion = useNavigate();
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
  // const [rows, setRows] = React.useState([]);
  const [empresa, setEmpresas] = React.useState([]);
  const [conexion, setConexion] = React.useState([]);
  const [valueDate, setValueDate] = useState(new Date());
  const [valueDate2, setValueDate2] = useState(new Date());
  const [tipoPag, setTipoPag] = useState('todos');
  const [agrupadoPor, setAgrupadoPor] = useState('');
  // const [formulario, setFormulario] = React.useState({
  //   empresa: 0
  // })

  const [fullRow, setFullRows] = useState([]);
  const [reporteRows, setReporteRows] = useState([]);
  const [enableButtons, setEnableButtons] = useState(true);

  const noGroup = () => {
    setReporteRows(fullRow);
  }

  const [totales, setTotales] = useState({
    cheque: 0,
    deposito: 0,
    transferencia: 0,
    tarjetacre: 0,
    efectivo: 0,
    neto: 0,
    retfuente: 0,
    retiva: 0,
    ctacontable: 0
  })


  const calculoTotales = () => {
    const sumaEfec = Object.values(fullRow).reduce((previous, current) => {
      // console.log(current);
      if (current.tipopag === 'EFE') {
        return previous + current.monto;
      }
      return previous + 0;
    }, 0);

    const sumaChq = Object.values(fullRow).reduce((previous, reg) => {
      if (reg.tipopag === 'CHQ') {
        return previous + reg.monto;
      }
      return previous + 0;
    }, 0);

    const sumaTdc = Object.values(fullRow).reduce((previous, reg) => {
      if (reg.tipopag === 'TCR') {
        return previous + reg.monto;
      }
      return previous + 0;
    }, 0);

    const sumaDep = Object.values(fullRow).reduce((previous, reg) => {
      if (reg.tipopag === 'DEP') {
        return previous + reg.monto;
      }
      return previous + 0;
    }, 0);

    const sumaTRA = Object.values(fullRow).reduce((previous, reg) => {
      if (reg.tipopag === 'TRA') {
        return previous + reg.monto;
      }
      return previous + 0;
    }, 0);
    const sumaRTF = Object.values(fullRow).reduce((previous, reg) => {
      if (reg.tipopag === 'RTF') {
        return previous + reg.monto;
      }
      return previous + 0;
    }, 0);
    const sumaRTI = Object.values(fullRow).reduce((previous, reg) => {
      if (reg.tipopag === 'RTI') {
        return previous + reg.monto;
      }
      return previous + 0;
    }, 0);
    const sumaCUE = Object.values(fullRow).reduce((previous, reg) => {
      if (reg.tipopag === 'CUE') {
        return previous + reg.monto;
      }
      return previous + 0;
    }, 0);
    setTotales({
      ...totales,
      efectivo: parseFloat(sumaEfec).toFixed(2),
      cheque: parseFloat(sumaChq).toFixed(2),
      tarjetacre: parseFloat(sumaTdc).toFixed(2),
      deposito: parseFloat(sumaDep).toFixed(2),
      transferencia: parseFloat(sumaTRA).toFixed(2),
      retfuente: parseFloat(sumaRTF).toFixed(2),
      retiva: parseFloat(sumaRTI).toFixed(2),
      ctacontable: parseFloat(sumaCUE).toFixed(2),
      neto: sumaTRA + sumaEfec + sumaChq + sumaTdc + sumaDep + sumaRTF + sumaRTI + sumaCUE
    })
  }

  React.useEffect(() => {
    calculoTotales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullRow])

  const groupByClient = () => {
    const result = fullRow.reduce((r, a) => {
      r[a.cliente] = r[a.cliente] || [];
      r[a.cliente].push(a);
      return r;
    }, Object.create(null));

    const agrupacionList = [];

    Object.keys(result).forEach(key => {
      const cabecera = {
        id: `cab_${key}`,
        cajac: 0,
        cliente: result[key][0].cliente,
        cuenta: "---",
        fechaven: new Date(),
        monto: 0,
        numchq: "---",
        numero: 0,
        operador: "---",
        razonsocial: result[key][0].razonsocial,
        ruc: result[key][0].ruc,
        secuencial: '---',
        tipopag: "---"
      };

      agrupacionList.push(cabecera);

      const pagosCli = result[key];

      Object.values(pagosCli).forEach(el => {
        agrupacionList.push(el);
      });

      const sumaDeNetos = Object.keys(pagosCli).reduce((previous, key2) => previous + pagosCli[key2].monto, 0);

      const cliSuma = {
        id: `CLiSum_:${key}`,
        cajac: 0,
        cliente: ' ',
        cuenta: "---",
        fechaven: new Date(),
        monto: `${sumaDeNetos} $`,
        numchq: "--",
        numero: 0,
        operador: "---",
        razonsocial: 'Total Cliente ===>',
        ruc: '',
        secuencial: `---`,
        tipopag: "---"
      };
      agrupacionList.push(cliSuma);
    });
    setReporteRows(agrupacionList);
    // console.log(agrupacionList)
  }


  const printPDF = () => {
    // eslint-disable-next-line no-constant-condition
    if (true) {
      window.open(`${URLAPILOCAL}/pagosclientes/generarpdf?desde=${valueDate.toISOString().split('T')[0]}&hasta=${valueDate2.toISOString().split('T')[0]}&tipopag=${tipoPag}&empresa=${conexion}`);
    } else {
      // console.log('secuencial vacio');
    }
  }

  const exportExcel = () => {
    // /pagosclientes/generarexcel
    // eslint-disable-next-line no-constant-condition
    if (true) {
      window.open(`${URLAPILOCAL}/pagosclientes/generarexcel?desde=${valueDate.toISOString().split('T')[0]}&hasta=${valueDate2.toISOString().split('T')[0]}&tipopag=${tipoPag}&empresa=${conexion}`);
    } else {
      // console.log('secuencial vacio');
    }
  }

  const limpiar = () => {
    setEnableButtons(true);
    setFullRows([]);
    setReporteRows([]);
    setAgrupadoPor('no');
  }

  const busqueda = () => {
    setEnableButtons(true);
    setAgrupadoPor('no')
    const dataR = {
      desde: valueDate.toISOString().substring(0,10),
      hasta: valueDate2.toISOString().substring(0,10),
      empresa: conexion,
      tipopag: tipoPag
    }
    // console.log("mira",dataR);
    axiosInst.post(`${URLAPILOCAL}/pagosclientes`, dataR)
      .then((res) => {
        // console.log(res.data);
        if (res.status === 200) {

          if (res.data.length > 0) {
            setEnableButtons(false);
          }
          const report = res.data.map((el) => ({
            id: el.secuencial,
            cajac: el.cajac,
            cliente: el.cliente,
            cuenta: el.cuenta,
            fechaven: el.fechaven,
            monto: el.monto,
            numchq: el.numchq,
            numero: el.numero,
            operador: el.operador,
            razonsocial: el.razonsocial,
            ruc: el.ruc,
            secuencial: el.secuencial,
            tipopag: el.tipopag
          }))
          setReporteRows(report);
          setFullRows(report);
        }
      }
      ).catch((error) => {
        // console.log(error.message)
        mensajeSistema('Problemas con la aplicacion', 'error');
        if (error.response.status === 401) {
          navegacion(`${PATH_AUTH.login}`);
          mensajeSistema("Su inicio de sesion expiro", "error");
        }
        if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        }
      });
  }


  React.useEffect(() => {

    // Consultar Empresas
    axiosInst.get(`${URLAPILOCAL}/conexiones/listar`)
      .then((res) => {
        if (res.status === 200) {
          const empresaLs = res.data.map((item) => ({
            conexion: item.conexion,
            nombre: item.nombre
          }))
          setEmpresas(empresaLs);
          setConexion(empresaLs[0].conexion);
        }
      }
      ).catch((error) => {
        mensajeSistema('Problemas con la aplicacion', 'error');
        if (error.response.status === 401) {
          navegacion(`${PATH_AUTH.login}`);
          mensajeSistema("Su inicio de sesion expiro", "error");
        }
        if (error.response.status === 500) {
          navegacion(`${PATH_PAGE.page500}`);
        }
      });

    setAgrupadoPor('no');

    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    setValueDate(firstDay)
    setValueDate2(lastDay)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Page title='Pagos realizados por Clientes'>
        <Fade
          in
          style={{ transformOrigin: '0 0 0' }}
          timeout={1000}
        >
          <Box sx={{ ml: 3, mr: 3, p: 1 }}>
            <HeaderBreadcrumbs
              heading='Pagos Realizados por Clientes'
              links={[
                { name: 'Inicio' },
                { name: 'Pagos Realizados por Clientes' },
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
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
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
                          value={valueDate}
                          label="Fecha Desde"
                          onChange={(newValue) => {
                            setValueDate(newValue);
                            setReporteRows([]);
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12}>
                      <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                          value={valueDate2}
                          label="Fecha Hasta"
                          onChange={(newValue) => {
                            setValueDate2(newValue);
                            setReporteRows([]);
                          }}
                          renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                  <Grid item container md={3.5} sm={4} xs={12} spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        select
                        label="Empresa"
                        value={conexion}
                        fullWidth
                        size="small"
                        onChange={e => {
                          setConexion(e.target.value);
                          setReporteRows([]);
                        }}
                      >
                        {
                          empresa.map(emp =>
                            <MenuItem
                              key={emp.conexion}
                              value={emp.conexion}
                            >
                              {emp.nombre}
                            </MenuItem>)
                        }
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        variant="outlined"
                        label="Tipo de Documentos"
                        value={tipoPag}
                        onChange={(e) => { setTipoPag(e.target.value); setReporteRows([]); }}
                      >
                        <MenuItem value="todos">Todos</MenuItem>
                        <MenuItem value="EFE">Efectivo</MenuItem>
                        <MenuItem value="CHQ">Cheques</MenuItem>
                        <MenuItem value="TRA">Transferencia</MenuItem>
                        <MenuItem value="DEP">Deposito</MenuItem>
                        <MenuItem value="TDC">Tarjeta de Credito</MenuItem>
                        <MenuItem value="CHQ">Cheques</MenuItem>

                        <MenuItem value="RTF">Retencion a la Fuente</MenuItem>
                        <MenuItem value="RTI">Retencion al Iva</MenuItem>
                        <MenuItem value="CUE">Cuenta Contable</MenuItem>
                      </TextField>
                    </Grid>

                  </Grid>
                  <Grid item container md={2} sm={3} xs={12} spacing={1}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        size="small"
                        variant="outlined"
                        value={agrupadoPor}
                        label="Criterios de Agrupacion"
                        onChange={(e) => { setAgrupadoPor(e.target.value); setReporteRows([]); }}
                      >
                        <MenuItem
                          value='no'
                          onClick={() => {
                            noGroup();
                          }}
                        >
                          Sin Agrupacion
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            groupByClient();
                          }}
                          value="porcliente">
                          Por Cliente
                        </MenuItem>
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
                          busqueda();
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
                          limpiar();
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
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls='panel1a-content'
                sx={estilosacordeon}
              >
                <Typography sx={{ fontWeight: 'bold' }}>Informe</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box mb={1}>
                  <Grid container spacing={1} justifyContent="flex-end" >
                    <Grid item md={1.2} sm={4} xs={6} >
                      <Button
                        disabled={enableButtons}
                        fullWidth
                        variant="text"
                        startIcon={<ViewComfyRoundedIcon />}
                        onClick={() => exportExcel()}
                      >
                        Excel
                      </Button>
                    </Grid>
                    <Grid item md={1.2} sm={4} xs={6}>
                      <Button
                        disabled={enableButtons}
                        fullWidth
                        variant="text"
                        onClick={() => printPDF()}
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
                      width: '100%'
                    }}
                  >
                    <DataGrid
                      rowHeight={28}
                      localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                      components={{
                        NoRowsOverlay: CustomNoRowsOverlay,
                      }}
                      rows={reporteRows}
                      columns={columns}
                      density="compact"
                      getRowId={rows => rows.id}
                      sx={{
                        '& .MuiDataGrid-cell': {
                          border: 'none',
                        },
                        '& .scrollArea--right': {
                          border: '20px'
                        }, '& .like-grid-blue': {
                          background: '#d0f2ff'
                        },
                        '& .like-grid-yellow': {
                          background: '#fff7cd'
                        },
                        '& .like-grid-red': {
                          background: '#ffe7d9'
                        }
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
                              <Chip label="Efectivo" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(totales.efectivo)}</Typography>
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
                              <Chip label="Cheque" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(totales.cheque)}</Typography>
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
                              <Chip label="Transferencia" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(totales.transferencia)}</Typography>
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
                              <Chip label="Tarjeta Credito" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(totales.tarjetacre)}</Typography>
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
                              <Chip label="Depositos" color="warning" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(totales.deposito)}</Typography>
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
                              <Chip label="Ret. Fuente" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(totales.retfuente)}</Typography>
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
                              <Chip label="Ret Iva" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(totales.retiva)}</Typography>
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
                              <Chip label="Cta. contable" color="info" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(totales.ctacontable)}</Typography>
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
                              <Chip label="Neto" color="error" />
                            </Grid>
                            <Grid item xs={2} fontSize="1rem">
                              <PaidOutlinedIcon />
                            </Grid>
                            <Grid item xs={8}>
                              <Typography variant="h6">{fCurrency(totales.neto)}</Typography>
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
        {/* <Grid container>
          <Grid item sm={12}>
            <Box display="flex" justifyContent="flex-end">
              <TotalesDocumento
                tra={totales.transferencia}
                efe={totales.efectivo}
                dep={totales.deposito}
                tdc={totales.tarjetacre}
                chq={totales.cheque}
                neto={parseFloat(totales.neto).toFixed(2)}
              />
            </Box>
          </Grid>
        </Grid> */}
      </Page>
    </>
  )
}