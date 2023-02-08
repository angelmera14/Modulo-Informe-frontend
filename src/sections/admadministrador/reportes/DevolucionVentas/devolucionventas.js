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
    CardContent,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
import CircularProgreso from '../../../../components/Cargando';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { fCurrency } from '../../../../utils/formatNumber';

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

const columns = [
    {
        field: 'id',
        headerName: 'item',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        hide: true,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'cliente',
        headerName: 'Cliente',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'nombre_cliente',
        headerName: 'Nombre',
        width: 250,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'ruc',
        headerName: 'Ruc',
        width: 120,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'tipo',
        headerName: 'Tipo Doc.',
        width: 80,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'serie',
        headerName: 'Serie',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'docrel',
        headerName: 'Tipo Rel',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'numerorel',
        headerName: 'Nº Rel',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'serierel',
        headerName: 'Serie Rel',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'motivo',
        headerName: 'Motivo',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },

    {
        field: 'vendedor',
        headerName: 'Vendedor',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'nombre_vendedor',
        headerName: 'Nombre',
        width: 150,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'operador',
        headerName: 'Operador',
        width: 90,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'seccon',
        headerName: 'Sec. Con.',
        width: 90,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    },
    {
        field: 'subtotal0',
        headerName: 'SubTotal0',
        width: 90,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'subtotal',
        headerName: 'SubTotal',
        width: 90,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'iva',
        headerName: 'Iva',
        width: 90,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'neto',
        headerName: 'Neto',
        width: 100,
        headerClassName: 'columnclass',
        sortable: false,
        type: 'number',
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return fCurrency(params.value);
        }
    },
    {
        field: 'fecha',
        headerName: 'Fecha',
        width: 100,
        headerClassName: 'columnclass',
        type: 'date',
        sortable: false,

        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            if (typeof params.value === 'undefined') {
                return '----'
            }
            const valueFormatted = formaterarFecha(params.value, '-', '/');
            return valueFormatted;
        }
    },
    {
        field: 'observa',
        headerName: 'Observacion',
        width: 300,
        headerClassName: 'columnclass',
        sortable: false,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }
            return params.value;
        }
    }
];

export default function VentaCaja() {
    // eslint-disable-next-line camelcase
    const { token, codigo_Usuario } = JSON.parse(window.localStorage.getItem("usuario"));
    const { enqueueSnackbar } = useSnackbar();
    const navegacion = useNavigate();
    const [progreso, setProgreso] = useState(false);
    const [rows, setItems] = useState([]);
    const [total, setTotales] = useState({
        neto: "0",
        factura: "0",
        nventa: "0",
        subtotal00: "0",
    });
    const [formulario, setFormulario] = useState({
        empresa: 'BDADM',
        fdesde: new Date(),
        fhasta: new Date(),
        ordenar: 'NOM',
        tipodoc: 'todos',
    });
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


    // limpiar campos
    const Nuevo = () => {
        setFormulario({
            empresa: 'BDADM1',
            fdesde: new Date(),
            fhasta: new Date(),
            ordenar: 'NOM',
            tipodoc: 'todos'
        });
        setItems([]);
        setTotales({
            neto: "0",
            factura: "0",
            nventa: "0",
            subtotal00: "0",
        });
    };

    const [empresas, setEmpresas] = useState([]);

    useEffect(() => {
        async function obtenerEmpresas() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/conexiones/listar`, config, setProgreso(true));
                // console.log(data);
                setEmpresas(data);
            } catch (error) {
                setFormulario({ ...formulario, empresa: '---', tipodoc: '---' });
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
        const date = new Date();
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        setFormulario({
            ...formulario,
            fdesde: firstDay,
            fhasta: lastDay
        })
        obtenerEmpresas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [DocumentoNCR, setTipodocumento] = useState([]);

    useEffect(() => {
        async function obtenerEmpresas() {

            // COLOCAR NCR = NOTEA DE CREDITO

            try {
                const { data } = await axios(`${URLAPIGENERAL}/motivos/listar?c_tipodoc=NCR
                `, config, setProgreso(true));
                // console.log(data);
                setTipodocumento(data);
            } catch (error) {

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // datos a enviar
    const obtenerInforme = async () => {
        try {

            const enviarjson = {

                bodega: 0,
                numero: 0,
                serie: "string",
                secuencial: 0,
                numseccompra: 0,
                docrel: "string",
                numerorel: 0,
                serierel: "string",
                fecha: "2022-06-30T22:03:12.806Z",
                operador: "string",
                cliente: "string",
                vendedor: "string",
                proveedor: "string",
                subtotal0: 0,
                subtotal: 0,
                descuento: 0,
                iva: 0,
                neto: 0,
                transporte: 0,
                recargo: 0,
                peso: 0,
                motivo: "string",
                observa: "string",
                comenta: "string",
                intecxc: "string",
                estado: "string",
                registrado: "string",
                integrado: "string",
                seccon: 0,
                deuda: "string",
                nofac: 0,
                retfue: "string",
                fechaemi: "2022-06-30T22:03:12.806Z",
                aplsri: "string",
                numauto: "string",
                hora: "string",
                nombrePC: "string",
                claseajuingreso: "string",
                estadodoc: "string",
                fechacaduca: "2022-06-30T22:03:12.806Z",
                gravaiva: "string",
                camion: "string",
                secautoventa: 0,
                ctarcre: "string",
                tipocliente: "string",
                act_sct: "string",
                numproduccion: 0,
                bodegaori: 0,
                tipodoccom: "string",
                subido: "string",
                enviadonestle: "string",
                cajac: 0,
                modulo: "string",
                valorapagar: 0,
                estadotra: "string",
                operaaprueba: "string",
                fechaaprueba: "2022-06-30T22:03:12.806Z",
                maquinaaprueba: "string",
                horaaprueba: "string",
                numpesaje: 0,
                estadoliq: "string",
                secordentrabajo: 0,
                fechadesde: formulario.fdesde,
                fechahasta: formulario.fhasta,
                tipodocumento: formulario.tipodoc,
                conexion: formulario.empresa

            }
            console.log(enviarjson)
            const esfechaValida = formulario.fdesde <= formulario.fhasta;
            // if (!existedocs) mensajeSistema('Seleccion al menos un tipo', 'error');



            if (esfechaValida) {
                console.log(enviarjson);
                const { data } = await axios.post(`${URLAPIGENERAL}/informedevolucionventas/listar`, enviarjson, config, setProgreso(true));
                console.log(data)
                if (data.length > 0) {
                    const listareporte = data;
                    let listaorden = [];


                    if (listareporte.length > 0) {
                        let TotalNeto = 0;
                        let totalIVA = 0;
                        let Subtotal = 0;
                        let subtotl00 = 0;
                        listareporte.forEach(l => {
                            TotalNeto += parseFloat(l.neto);
                            if (l.tipo === 'NCR') totalIVA += parseFloat(l.iva);
                            if (l.tipo === 'NCR') Subtotal += parseFloat(l.subtotal);
                            if (l.tipo === 'NCR') subtotl00 += parseFloat(l.subtotal0);
                        });
                        setTotales({
                            neto: TotalNeto.toFixed(2),
                            factura: totalIVA.toFixed(2),
                            nventa: Subtotal.toFixed(2),
                            subtotal00: subtotl00.toFixed(2),

                        })
                    }


                    if (formulario.ordenar === 'NOM') {
                        listaorden = ordenarListaJson(listareporte, 'nombre_cliente', 'asc');


                    }
                    // FECHA EMISION
                    if (formulario.ordenar === 'NET') {
                        listaorden = ordenarListaJson(listareporte, 'neto', 'asc');

                    }

                    setItems(listaorden);
                }

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
            setItems([]);
        } finally {
            setProgreso(false);
        }
    };

    let id = 0
    rows.forEach(e => {
        id += 1
        e.id = id
    })

    return (
        <>

            <CircularProgreso open={progreso} handleClose1={() => { setProgreso(false) }} />
            <Page title='Devolución de ventas'>
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <HeaderBreadcrumbs
                            heading='Devolución de ventas'
                            links={[
                                { name: 'Informe' },
                                { name: 'Devolución de ventas' },
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
                                                                'La Fecha de inicio debe ser menor o igual a la fecha final',
                                                                'error'
                                                            );
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
                                                                'La Fecha de inicio debe ser menor o igual a la fecha final',
                                                                'error'
                                                            );
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
                                                }}
                                            >
                                                {empresas.map(em => (
                                                    <MenuItem
                                                        key={em.conexion}
                                                        value={em.conexion}
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
                                                label="Motivo"
                                                value={formulario.tipodoc}
                                                onChange={(e) => {
                                                    setFormulario({
                                                        ...formulario,
                                                        tipodoc: e.target.value
                                                    })
                                                }}
                                            >
                                                {DocumentoNCR.map(tc => (
                                                    <MenuItem key={tc.codigo} value={tc.codigo}>
                                                        {tc.nombre}
                                                    </MenuItem>
                                                ))}
                                                <MenuItem value="todos">TODOS</MenuItem>
                                            </TextField>
                                        </Grid>
                                    </Grid>

                                    <Grid item container md={5} sm={6} xs={12} spacing={1}>

                                        <Grid item xs={12} md={5} sm={6}>
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
                                                }}
                                            >
                                                <MenuItem value="NOM">CLIENTE</MenuItem>
                                                <MenuItem value="NET">NETO</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={7} sm={6}>{''}</Grid>
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
                                                href={`${URLAPIGENERAL}/informedevolucionventas/generarexcel?operador=${codigo_Usuario}&Fechadesde=${new Date(formulario.fdesde).toISOString()}&Fechahasta=${new Date(formulario.fhasta).toISOString()}&Tipodocumento=${formulario.tipodoc}&Conexion=${formulario.empresa}`}
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
                                                href={`${URLAPIGENERAL}/informedevolucionventas/generarpdf?operador=${codigo_Usuario}&Fechadesde=${new Date(formulario.fdesde).toISOString()}&Fechahasta=${new Date(formulario.fhasta).toISOString()}&Tipodocumento=${formulario.tipodoc}&Conexion=${formulario.empresa}`}
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
                                    <Grid item container md={9} xs={12} spacing={1} justifyContent="flex-end">
                                        <Grid item md={3} sm={4} xs={12}>
                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 0, m: 0 }}>
                                                    <Grid container justifyContent="flex-end">
                                                        <Grid item xs={10}>
                                                            <Chip label="SubTotal 0" color="info" />
                                                        </Grid>
                                                        <Grid item xs={2} fontSize="1rem">
                                                            <PaidOutlinedIcon />
                                                        </Grid>
                                                        <Grid item xs={8}>
                                                            <Typography variant="h6">{fCurrency(total.subtotal0)}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item md={3} sm={4} xs={12}>
                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 0, m: 0 }}>
                                                    <Grid container justifyContent="flex-end">
                                                        <Grid item xs={10}>
                                                            <Chip label="SubTotal Iva" color="info" />
                                                        </Grid>
                                                        <Grid item xs={2} fontSize="1rem">
                                                            <PaidOutlinedIcon />
                                                        </Grid>
                                                        <Grid item xs={8}>
                                                            <Typography variant="h6">{fCurrency(total.nventa)}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item md={3} sm={4} xs={12}>

                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 0, m: 0 }}>
                                                    <Grid container justifyContent="flex-end">
                                                        <Grid item xs={10}>
                                                            <Chip label="Total Iva" color="info" />
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

                                        <Grid item md={3} sm={4} xs={12}>
                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 0, m: 0 }}>
                                                    <Grid container justifyContent="flex-end">
                                                        <Grid item xs={10}>
                                                            <Chip label="Total Devolución" color="success" sx={{ color: 'white' }} />
                                                        </Grid>
                                                        <Grid item xs={2} fontSize="1rem">
                                                            <PaidOutlinedIcon />
                                                        </Grid>
                                                        <Grid item xs={8}>
                                                            <Typography variant="h6">{fCurrency(total.neto)}</Typography>
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
