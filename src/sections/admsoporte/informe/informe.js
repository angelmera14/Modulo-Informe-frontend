import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
    Box,
    Fade,
    Grid,
    TextField,
    Card,
    InputAdornment,
    IconButton,
    Button,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Modal,
    Backdrop,
    Typography
} from '@mui/material';
import es from "date-fns/locale/es";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import TablaDatos from '../../../components/sistema/tabladatos';
import ModalGenerico from '../../../components/modalgenerico';
import CircularProgreso from '../../../components/Cargando';
import { estilobox, styleActive, styleInactive, estilomodal } from '../../../utils/csssistema/estilos';
// import CardTicketAsignacion from './componentes/tarjeta';
import { URLAPIGENERAL } from '../../../config';


const cabezera = [
    { field: 'nombre_empresa', headerName: 'Empresa', width: 200 },
    { field: 'creado', headerName: 'Fecha', width: 130 },
    { field: 'nombre_contacto', headerName: 'Contacto', width: 200 },
    { field: 'tipo', headerName: 'Tipo', width: 130 },
    { field: 'descripcion', headerName: 'Requerimiento', width: 350 },
    {
        field: 'solucion', headerName: 'Solucion', width: 300, valueFormatter: (params) => {
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
        field: 'escorreo', headerName: 'Enviados', width: 100, renderCell: (param) => (
            param.row.escorreo === 1 ? <Button variant="containded" style={styleActive}>Si</Button> : <Button variant="containded" style={styleInactive}>No</Button>
        ),
    },
    {
        field: 'Estado', headerName: 'Estado', width: 100, renderCell: (param) => (
            `${param.row.Estado}`.toLowerCase().trim() === 'solucionado' ? <Button variant="containded" style={styleActive}>Solucionado</Button> : <Button variant="containded" style={styleInactive}>Pendiente</Button>
        ),
    }
];

const style = {
    height: '55vh',
    width: '100%'
}


function Informe() {

    const { enqueueSnackbar } = useSnackbar();
    // MENSAJE GENERICO
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

    const [sxtabla, setSxTabla] = useState({
        columns: cabezera,
        rows: [],
        getRowId: (rows) => rows.idticket,
        // onRowDoubleClick: (e) => { registroEditar(e) }
    })
    // Constantes del Modal add ticket
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [copiaticket, setCopiaticket] = useState([]);
    const [empresa, setEmpresa] = useState([]);
    const [filtroperador, setFiltroperador] = useState(true);
    const [enviadocorreo, setEnviadoCorreo] = useState(true);
    const [cargando, setCargando] = useState(false);
    const [operador, setOperador] = useState([]);
    const [formulario, setFormulario] = useState({
        fdesde: new Date(),
        fhasta: new Date(),
        operador: 56,
        nombre_operador: '',
        empresa: '',
        nombre_empresa: '',
        estado: true,
        enviadorcorreo: true
    })
    const [formularioemail, setFormularioemail] = useState({
        nombre: 'SOFTGREEN S.A.',
        email: '',
        mensaje: ''
    });
    // eslint-disable-next-line no-unused-vars
    const [tiposBusquedas, setTiposBusqueda] = useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);

    // empresa principal
    const [openModal, setOpenModal] = useState(false);
    const toggleShow = () => setOpenModal(p => !p);
    const handleCallbackChild = async (e) => {
        const item = e.row;
        setFormulario({ ...formulario, empresa: item.codigo, nombre_empresa: item.nombre });
        toggleShow();
    }
    // const [buscar, setBuscar] = useState("");
    // const Buscar = (e) => {
    //     // console.log(e.target.value);
    //     setBuscar(e.target.value);
    //     const texto = `${e.target.value}`.toLocaleUpperCase();
    //     const resultado = listafiltro.filter(b =>
    //         `${b.nombre_empresa}`.toLocaleUpperCase().includes((texto)) ||
    //         `${b.representante}`.toLocaleUpperCase().includes((texto)) ||
    //         `${b.ruc}`.toLocaleUpperCase().includes((texto))
    //     );

    //     setSxTabla({ ...sxtabla, rows: resultado })
    // }
    const onSubmit = (e) => {
        e.preventDefault();
        try {

            if (formulario.nombre_empresa.trim().length === 0) {
                mensajeSistema('Elija una empresa', 'error');
                return
            }
            if (formulario.fdesde <= formulario.fhasta) {

                axios({
                    url: `${URLAPIGENERAL}/listartiporequerimientos`,
                    method: 'POST',
                    data: {
                        filtros: {
                            fechadesde: formulario.fdesde,
                            fechahasta: formulario.fhasta,
                            estado: formulario.estado,
                            operador: formulario.operador,
                            idempresa: formulario.empresa,
                            escorreo: enviadocorreo
                        }
                    }
                }).then(
                    response => {
                        const dataResponse = response.data;
                        console.log(response.data);

                        if (dataResponse.status) {
                            if (dataResponse.length === 0) mensajeSistema('No existen registro con la caracteristicas proporcionadas', 'error')
                            setSxTabla({ ...sxtabla, rows: dataResponse.data })
                            setCopiaticket(dataResponse.data)
                        }
                    },
                    // eslint-disable-next-line no-unused-vars
                    error => {
                        mensajeSistema(`El servicio no se encuentra disponible`, 'error')

                    }
                ).catch(() => {
                    mensajeSistema('No existen registro con la caracteristicas proporcionadas', 'error')
                })
            } else {
                mensajeSistema(`La fecha de inicio tiene que ser menor a la fecha de fin`, 'error');
            }

            // console.log(data.descripcion);
        } catch (err) {
            // console.log(err);
        }
    };
    const onSubmitEmail = e => {
        e.preventDefault();
        // console.log('Datos enviados: ',sxtabla.rows );
        // const dataForm = data;
        try {
            // clistaTickets);
            if (sxtabla.rows.length !== 0) {
                axios({
                    url: `${URLAPIGENERAL}/enviacorreo`,
                    method: 'POST',
                    data: {
                        daTicket: {
                            data: {
                                nombre: formularioemail.nombre,
                                email: formularioemail.email,
                                mensaje: formularioemail.mensaje
                            },
                            list: sxtabla.rows,
                            fi: formulario.fdesde,
                            ff: formulario.fhasta
                        }
                    }
                }, setCargando(true)).then(
                    response => {
                        const dataResponse = response.data;
                        console.log(dataResponse);
                        if (dataResponse.status === true) {
                            mensajeSistema(`El correo se envio correctamento a ${formularioemail.email}`, 'success')
                            setFormularioemail({
                                nombre: 'SOFTGREEN S.A.',
                                email: '',
                                mensaje: ''
                            })
                            obtenerTicket();
                            setOpen(false)
                        }
                        
                    },
                    // eslint-disable-next-line no-unused-vars
                    error => {
                        mensajeSistema(`El correo no se pudo enviar`, 'error')

                    }
                ).finally(() => { setCargando(false) })
            } else {
                mensajeSistema(`No se encuentra registros en el informe`, 'error')

            }
        } catch (err) {
            // dispatch(
            //     showMessage({
            //         message: `Berifique si el correo se ha enviado correctamente`,
            //         variant: 'error',
            //         autoHideDuration: 5000,
            //         anchorOrigin: {
            //             vertical: 'top', // top bottom
            //             horizontal: 'center' // left center right
            //         }
            //     })
            // );
            // console.log(err);
        }
    };

    async function obtenerTicket() {
        const { data } = await axios(`${URLAPIGENERAL}/listarticketodos`);
        console.log(data.data[0].escorreo.data[0])
        const listatickets = data.data.filter(m => m.operador !== 0);
        listatickets.forEach(e => {
            e.escorreo = e.escorreo.data[0]
        })
        console.log(listatickets)
        setSxTabla({ ...sxtabla, rows: listatickets })
        setCopiaticket(listatickets)
        // setOperador(data.data);
    }
    useEffect(() => {
        async function obtenerEmpresa() {
            const { data } = await axios(`${URLAPIGENERAL}/listarempresa`);
            const listaempresa = data.data.map(m => ({ codigo: m.idempresa, nombre: m.nombre_empresa }))
            setEmpresa(listaempresa);
        }
        async function obtenerOperador() {
            const { data } = await axios(`${URLAPIGENERAL}/listaroperador`);
            setOperador(data.data);
        }

        obtenerTicket();
        obtenerEmpresa();
        obtenerOperador();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <CircularProgreso
                open={cargando}
                handleClose1={() => {
                    setCargando(false);
                }}
            />
            <ModalGenerico
                nombre="Empresa"
                openModal={openModal}
                busquedaTipo={tiposBusquedas}
                toggleShow={toggleShow}
                rowsData={empresa}
                parentCallback={handleCallbackChild}
            />
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Box sx={estilomodal}>
                    <Box sx={estilobox} >
                        <form onSubmit={onSubmitEmail}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} >
                                    <Typography variant='h4' >Correo Electronico</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        disabled
                                        size="small"
                                        fullWidth
                                        label="Nombre"
                                        value={formularioemail.nombre}

                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        size="small"
                                        fullWidth
                                        label="Correo"
                                        value={formularioemail.email}
                                        onChange={e => {
                                            setFormularioemail({
                                                ...formularioemail,
                                                email: e.target.value
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        multiline
                                        rows={2}
                                        fullWidth
                                        size="small"
                                        maxRows={2}
                                        label="Asunto"
                                        value={formularioemail.mensaje}
                                        onChange={e => {
                                            setFormularioemail({
                                                ...formularioemail,
                                                mensaje: e.target.value
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth color="primary" variant="text" type="submit" >
                                        Enviar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </Modal>
            <Page title="Informe">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={estilobox} >
                        <HeaderBreadcrumbs
                            heading="Informe"
                            links={[
                                { name: 'Inicio' },
                                { name: 'Informe' },
                                { name: 'Lista' },
                            ]}
                            action={
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => { obtenerTicket() }}
                                    startIcon={<InsertDriveFileRoundedIcon />}
                                >
                                    Nuevo
                                </Button>
                            }
                        />
                    </Box>

                </Fade>
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box>
                        <Card sx={{ ml: 3, mr: 3, p: 2, mt: 1 }}>
                            <form onSubmit={onSubmit}>
                                <Grid container spacing={1} sx={{ mb: 1 }}>
                                    <Grid item md={2} sm={4} xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                            <MobileDatePicker
                                                label="Fecha desde"
                                                value={formulario.fdesde}
                                                onChange={(newValue => {
                                                    setFormulario({
                                                        ...formulario,
                                                        fdesde: newValue
                                                    })
                                                })}
                                                inputFormat="dd/MM/yyyy"
                                                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                            <MobileDatePicker
                                                label="Fecha hasta"
                                                value={formulario.fhasta}
                                                onChange={(newValue => {
                                                    setFormulario({
                                                        ...formulario,
                                                        fhasta: newValue
                                                    })
                                                })}
                                                inputFormat="dd/MM/yyyy"
                                                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item md={2.5} sm={6} xs={12}>
                                        <TextField
                                            required
                                            size="small"
                                            fullWidth
                                            label="Empresa"
                                            value={formulario.nombre_empresa}
                                            InputProps={{
                                                readOnly: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => { setOpenModal(true) }}
                                                        >
                                                            <SearchRoundedIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <TextField
                                            select
                                            disabled={filtroperador}
                                            required
                                            size="small"
                                            fullWidth
                                            label="Operador"
                                            value={formulario.operador}
                                            onChange={

                                                e => {
                                                    console.log(e.target.value)
                                                    const filtro = copiaticket.filter(f => f.idoperador === e.target.value);
                                                    setSxTabla({ ...sxtabla, rows: filtro });
                                                    setFormulario({
                                                        ...formulario,
                                                        operador: e.target.value
                                                    })
                                                }
                                            }
                                        >
                                            {
                                                operador.map(m => (
                                                    <MenuItem key={m.idoperador} value={m.idoperador}>{m.nombre}</MenuItem>
                                                ))
                                            }
                                        </TextField>
                                    </Grid>
                                    <Grid item md={1.5} sm={6} xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={formulario.estado}
                                                    onChange={
                                                        e => {
                                                            setFormulario({
                                                                ...formulario,
                                                                estado: e.target.checked
                                                            })
                                                        }
                                                    }
                                                />
                                            }
                                            label="Solucionado"
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={filtroperador}
                                                    onChange={
                                                        e => {
                                                            setFiltroperador(
                                                                e.target.checked
                                                            )
                                                        }
                                                    }
                                                />
                                            }
                                            label="No filtar por operador"
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={enviadocorreo}
                                                    onChange={
                                                        e => {
                                                            setEnviadoCorreo(
                                                                e.target.checked
                                                            )
                                                        }
                                                    }
                                                />
                                            }
                                            label="Enviador por correo"
                                        />
                                    </Grid>
                                    <Grid item md={1.2} sm={4} xs={12}>
                                        <Button fullWidth variant="text" type="submit" startIcon={<SearchRoundedIcon />}>
                                            Buscar
                                        </Button>
                                    </Grid>
                                    <Grid item md={1.2} sm={4} xs={12}>
                                        <Button fullWidth variant="text" startIcon={<EmailRoundedIcon />} onClick={() => { handleOpen() }} >
                                            Correo
                                        </Button>
                                    </Grid>
                                    <Grid item md={1.2} sm={4} xs={12}>
                                        <Button disabled fullWidth variant="text" startIcon={<ViewComfyRoundedIcon />} onClick={() => { console.log(sxtabla.rows) }}>
                                            Excel
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                            <TablaDatos sx={sxtabla} style={style} />
                        </Card>
                    </Box>
                </Fade>

            </Page>
        </>
    );
}
export default Informe;
