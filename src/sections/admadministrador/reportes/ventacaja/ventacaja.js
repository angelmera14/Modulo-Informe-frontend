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


const tipodocumentos = [
    {
        tipo: 'FAC',
        nombre: 'FACTURAS'
    },
    {
        tipo: 'NVT',
        nombre: 'NOTA DE VENTAS'
    },
    {
        tipo: 'todos',
        nombre: 'TODOS'
    }
];

const columns = [
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
        field: 'razonsocial',
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
        field: 'secuencial',
        headerName: 'Secuencial',
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
        field: 'nombrevendedor',
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
    });
    const [formulario, setFormulario] = useState({
        empresa: 'BDADM1',
        fdesde: new Date(),
        fhasta: new Date(),
        criterioagrupacion: 'SIM',
        ordenar: 'NOM',
        tipodoc: 'todos'
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

    // datos a enviar
    const obtenerInforme = async () => {
        try {

            const enviarjson = {

                secuencial: "string",
                cliente: "string",
                tipo: "string",
                serie: "string",
                fecha: "2022-06-27T09:49:11.945Z",
                operador: "string",
                neto: 0,
                estado: "string",
                observa: "string",
                seccon: "string",
                razonsocial: "string",
                ruc: "string",
                vendedor: "string",
                nombrevendedor: "string",
                fechadesde: /* '2020-07-01' */ formulario.fdesde.toISOString().substring(0,10) ,
                fechahasta: /* '2022-07-08' */ formulario.fhasta.toISOString().substring(0,10) ,
                tipodocumento: formulario.tipodoc,
                conexion: formulario.empresa

            }
            // console.log(enviarjson)
            const esfechaValida = formulario.fdesde <= formulario.fhasta;
            // console.log(enviarjson)
            // if (!existedocs) mensajeSistema('Seleccion al menos un tipo', 'error');
            if (esfechaValida) {

                const { data } = await axios.post(`${URLAPIGENERAL}/informeventacaja/listar`, enviarjson, config, setProgreso(true));
                // console.log("mira", data)
                if (data.length > 0) {
                    const listareporte = data;
                    let listaorden = [];
                    let id = 0;

                    if (listareporte.length > 0) {
                        let totalsaldogeneral = 0;
                        let totalfactura = 0;
                        let totalnventa = 0;
                        listareporte.forEach(l => {
                            totalsaldogeneral += parseFloat(l.neto);
                            if (l.tipo === 'FAC') totalfactura += parseFloat(l.neto);
                            if (l.tipo === 'NVT') totalnventa += parseFloat(l.neto);
                        });
                        setTotales({
                            neto: totalsaldogeneral.toFixed(2),
                            factura: totalfactura.toFixed(2),
                            nventa: totalnventa.toFixed(2),

                        })
                        /* ORDENAR POR */
                        // NOMBRE
                        if (formulario.ordenar === 'NOM') {
                            listaorden = ordenarListaJson(listareporte, 'razonsocial', 'asc');
                            // console.log('mira', listaorden);
                        }
                        // FECHA EMISION
                        if (formulario.ordenar === 'FEC') {
                            listaorden = ordenarListaJson(listareporte, 'fecha', 'asc');
                            // console.log('mira', listaorden);
                        }
                        /* AGRUPACION */
                        // SIN AGRUPAR
                        if (formulario.criterioagrupacion === 'SIM') {
                            listaorden.forEach(l => {
                                id += 1;
                                l.id = id;
                            });

                            // console.log(totalsaldogeneral);
                            listaorden.push({ id: id + 1, razonsocial: '𝐓𝐎𝐓𝐀𝐋 𝐕𝐄𝐍𝐓𝐀𝐒 -->', neto: totalsaldogeneral });
                            setItems(listaorden);
                        }
                        // POR CLIENTE
                        if (formulario.criterioagrupacion === 'OCLIE') {
                            let totalporcliente = 0;
                            const listagrupada = [];
                            let pivotecliente = listaorden[0].cliente;
                            let siguientecliente;
                            // nombre del cliente
                            listagrupada.push({
                                razonsocial: `${listaorden[0].cliente} - ${listaorden[0].razonsocial}`
                            });
                            for (let index = 0; index < listaorden.length; index += 1) {
                                siguientecliente = listaorden[index].cliente;
                                if (pivotecliente === siguientecliente) {
                                    // total por cliente
                                    totalporcliente += parseFloat(listaorden[index].neto);
                                    // detalles del cliente
                                    listagrupada.push({
                                        cliente: listaorden[index].cliente,
                                        razonsocial: listaorden[index].razonsocial,
                                        ruc: listaorden[index].ruc,
                                        vendedor: listaorden[index].vendedor,
                                        nombrevendedor: listaorden[index].nombrevendedor,
                                        tipo: listaorden[index].tipo,
                                        serie: listaorden[index].serie,
                                        secuencial: listaorden[index].secuencial,
                                        fecha: listaorden[index].fecha,
                                        operador: listaorden[index].operador,
                                        neto: listaorden[index].neto,
                                        motivo: listaorden[index].motivo,
                                        estado: listaorden[index].estado,
                                        observa: listaorden[index].observa,
                                        seccon: listaorden[index].seccon
                                    });

                                    // AGREGA EL TOTAL DEL ULTIMO CLIENTE
                                    if (listaorden.length - 1 === index) {
                                        listagrupada.push({
                                            razonsocial: 'TOTAL SALDO CLIENTE 🡆🡆🡆',
                                            neto: totalporcliente
                                        });
                                    }
                                } else {
                                    listagrupada.push({
                                        razonsocial: 'TOTAL SALDO CLIENTE 🡆🡆🡆',
                                        neto: totalporcliente
                                    });
                                    listagrupada.push({
                                        razonsocial: `${listaorden[index].cliente} - ${listaorden[index].razonsocial}`
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
                                razonsocial: '𝐓𝐎𝐓𝐀𝐋 𝐕𝐄𝐍𝐓𝐀𝐒 -->',
                                neto: totalsaldogeneral
                            });
                            // console.log('mira esta lista agrupada', listagrupada);
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
            criterioagrupacion: 'SIM',
            ordenar: 'NOM',
            tipodoc: 'FAC'
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



    return (
        <>
            <CircularProgreso open={progreso} handleClose1={() => { setProgreso(false) }} />
            <Page title='Informe de Ventas'>
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <HeaderBreadcrumbs
                            heading='Informe de Ventas'
                            links={[
                                { name: 'Informe' },
                                { name: 'Informe de Ventas' },
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
                                                <MenuItem value="FEC">FECHA</MenuItem>
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
                                                href={`${URLAPIGENERAL}/informeventacaja/generarexcel?operador=${codigo_Usuario}&Fechadesde=${new Date(formulario.fdesde).toISOString()}&Fechahasta=${new Date(formulario.fhasta).toISOString()}&Tipodocumento=${formulario.tipodoc}&Conexion=${formulario.empresa}`}
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
                                                href={`${URLAPIGENERAL}/informeventacaja/generarpdf?operador=${codigo_Usuario}&Fechadesde=${new Date(formulario.fdesde).toISOString()}&Fechahasta=${new Date(formulario.fhasta).toISOString()}&Tipodocumento=${formulario.tipodoc}&Conexion=${formulario.empresa}`}
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
                                                            <Chip label="Total Documentos" color="success" sx={{ color: 'white' }} />
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
                                        <Grid item md={4} sm={4} xs={12}>
                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 0, m: 0 }}>
                                                    <Grid container justifyContent="flex-end">
                                                        <Grid item xs={10}>
                                                            <Chip label="Total Factura" color="info" />
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
                                                            <Chip label="Total N. Venta" color="info" />
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
