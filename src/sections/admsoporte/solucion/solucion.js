import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
    Box,
    Fade,
    Grid,
    TextField,
    Typography,
    Card,
    InputAdornment,
    IconButton,
    Button,
    Modal,
    Backdrop,
    MenuItem
} from '@mui/material';
import es from "date-fns/locale/es";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import { DateTimePicker } from '@mui/lab';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import ModalGenerico from '../../../components/modalgenerico';
import TablaDatos from '../../../components/sistema/tabladatos';
import { estilobox, styleActive, styleInactive, estilomodal } from '../../../utils/csssistema/estilos';
import { URLAPIGENERAL } from '../../../config';
import { formaterarFecha } from '../../../utils/admsoporte/funciones';


const cabezera = [
    {
        field: 'nombre_empresa',
        headerName: 'Empresa',
        width: 200,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }

            return `${params.value}`.toUpperCase();
        }
    },
    {
        field: 'tipo',
        headerName: 'Requerimiento',
        width: 130,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }

            return `${params.value}`.toUpperCase();
        }
    },
    {
        field: 'descripcion',
        headerName: 'Descripcion',
        width: 300,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }

            return `${params.value}`.toUpperCase();
        }
    },
    {
        field: 'nombre_contacto',
        headerName: 'Contacto',
        width: 200,
        valueFormatter: params => {
            if (params.value == null) {
                return '----';
            }

            return `${params.value}`.toUpperCase();
        }
    },
    { field: 'creado', headerName: 'Registrado', width: 130 },

    {
        field: 'estado', headerName: 'Solucionado', width: 100, renderCell: (param) => (
            param.row.activo === 1 ? <Button variant="containded" style={styleActive}>Si</Button> : <Button variant="containded" style={styleInactive}>No</Button>
        ),
    }
];

const style = {
    height: '55vh',
    width: '100%'
}


function Solucion() {
    // const navegacion = useNavigate();
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
    // const [listafiltro, setListafiltro] = useState([])
    const [sxtabla, setSxTabla] = useState({
        columns: cabezera,
        rows: [],
        getRowId: (rows) => rows.idticket,
        onRowClick: (e) => { postTicket(e) }
    })

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

    const [resultadobusqueda, setResultadoBusqueda] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [data, setData] = useState({
        idoperador: 0,
        fecha: new Date(),
        empresa: 0,
        contacto: 0,
        requerimiento: '',
        trequerimiento: 0,
        solucion: ''
    });


    const [empresa, setEmpresa] = useState([]);
    // eslint-disable-next-line no-unused-vars
    const [listTicket, setListTicket] = useState([]);
    function getTickets() {
        const urlFinal = `${URLAPIGENERAL}/listarticketpendientes`;
        axios.get(urlFinal).then(res => {
            const dataC = res.data;
            console.log(dataC);
            const newListTicket = dataC.data.filter(item => item.operador !== 0);
            setListTicket(
                newListTicket.map(
                    ({
                        idticket,
                        nombre_empresa: nombreEmpresa,
                        tipo,
                        nombre_contacto: nombreContacto,
                        descripcion,
                        estado,
                        creado,
                        operador
                    }) => ({
                        idticket,
                        nombreEmpresa,
                        tipo,
                        nombreContacto,
                        descripcion,
                        estado,
                        creado,
                        operador
                    })
                )
            );
        });
    }
    useEffect(() => {
        // getTickets();
    }, []);
    const handleDateChange = date => {
        setSelectedDate(date);
        setData({
            ...data
        });
        console.log(date);
    };
    // Constantes del Modal add ticket
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [formulario, setFormulario] = useState({
        idticket: '',
        operador: '',
        nombre_operador: '',
        empresa: '',
        nombre_empresa: '',
        contacto: '',
        nombre_contacto: '',
        requerimiento: '',
        tiporequerimiento: '',
        solucion: '',
        fechaingreso: new Date()
    })
    const cambiarFormulario = e => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value
        });
        // console.log(e.target.value);
        // console.log(data)
    };
    // logica de agregar ticket
    const [tipoTickerList, setTipoTicket] = useState([{ label: 'Cargando...', value: 'Cargando' }]);
    const [contactoticket, setContactoTicket] = useState([]);
    const [formularioticket, setFormularioticket] = useState({
        idticket: '',
        operador: '',
        nombre_operador: '',
        empresa: '',
        nombre_empresa: '',
        contacto: '',
        nombre_contacto: '',
        descripcion: '',
        tiporequerimiento: 1,
        fechaingreso: new Date()
    })
    const [openModalEmpresaTicket, setOpenModalEmpresaTicket] = useState(false);
    const toggleShowEmpresaTicket = () => setOpenModalEmpresaTicket(p => !p);
    const handleCallbackChildEmpresaTicket = async (e) => {
        const item = e.row;
        // console.log(item.codigo)
        // console.log(contactoticket)
        const listacontacto = contactoticket.filter(f => f.empresa === item.codigo)
        // console.log(listacontacto)
        setFormularioticket({ ...formularioticket, empresa: item.codigo, nombre_empresa: item.nombre });
        setContactoTicket(listacontacto)
        toggleShowEmpresaTicket();
    }
    const [openModalContactoTicket, setOpenModalContactoTicket] = useState(false);
    const toggleShowContactoTicket = () => setOpenModalContactoTicket(p => !p);
    const handleCallbackChildContactoTicket = async (e) => {
        const item = e.row;
        setFormularioticket({ ...formularioticket, contacto: item.codigo, nombre_contacto: item.nombre });
        toggleShowContactoTicket();
    }


    const UpdateTicket = () => {
        axios.get(`${URLAPIGENERAL}/listarticketpendientes`).then(res => {
            const dataC = res.data;
            const newListTicket = dataC.data.filter(item => item.operador !== 0);
            setSxTabla({ ...sxtabla, rows: newListTicket })
            setResultadoBusqueda(newListTicket);
        });
    };
    // Buscador de tickets

    // consultar tickets

    // eslint-disable-next-line no-unused-vars
    const [datosticket, setTicket] = useState('');
    // const jsondata = []; // almacena la lista de resultados de la busqueda


    const postTicket = e => {
        // e.preventDefault()
        // console.log(e)
        try {
            const url = `${URLAPIGENERAL}/listicketxid/${e.row.idticket}`;
            axios({
                url
            }).then(
                response => {
                    const dataResponse = response.data;
                    console.log(dataResponse);
                    if (dataResponse.status) {
                        const datos = dataResponse.data[0];
                        setFormulario({
                            ...formulario,
                            idticket: datos.idticket,
                            operador: datos.operador,
                            nombre_operador: datos.nombre_operador,
                            empresa: datos.idempresa,
                            nombre_empresa: datos.nombre_empresa,
                            contacto: datos.contacto,
                            nombre_contacto: datos.nombre_contacto,
                            requerimiento: datos.descripcion,
                            tiporequerimiento: datos.tipo
                        })
                    } else {
                        mensajeSistema(`El ticket número ${e.row.idticket} no se encuentra registrado.`, 'error');
                    }
                },
                // eslint-disable-next-line no-unused-vars
                error => {
                    mensajeSistema(`Inconvenientes al almacenar el tipo de requerimiento`, 'error')
                }
            ).catch(() => mensajeSistema(`El ticket no se encuentra registrado.`, 'error'))
        } catch (err) {
            console.log(err);
        }
    };

    // funcion de guardado
    const onSubmit = (e) => {
        e.preventDefault();

        try {

            axios({
                url: `${URLAPIGENERAL}/actualizaticket`,
                method: 'POST',
                data: {
                    dataticket: {
                        idticket: formulario.idticket, // idTicket,
                        idoperador: formulario.operador, // op, // data.idoperador,
                        estado: 1,
                        idempresa: formulario.empresa, // emp,
                        contacto: formulario.contacto, // cont,
                        solucion: formulario.solucion,
                        terminado: formulario.fechaingreso.toISOString().substring(0, 10),
                        essolucion: 1
                    }
                }
            }).then(
                response => {
                    const dataResponse = response.data;
                    // const respuesta = dataResponse.data.idtipo_ticket
                    getTickets();
                    setData({
                        idoperador: ' '
                    });
                    setFormulario({
                        idticket: '',
                        operador: '',
                        nombre_operador: '',
                        empresa: '',
                        nombre_empresa: '',
                        contacto: '',
                        nombre_contacto: '',
                        requerimiento: '',
                        tiporequerimiento: '',
                        solucion: ''
                    })

                    if (dataResponse.status) {
                        mensajeSistema(`El ticket número ${formulario.idticket} se soluciono.`, 'success');
                        UpdateTicket();
                    }
                },
                // eslint-disable-next-line no-unused-vars
                error => {
                    mensajeSistema(`Error al Guardar la solucion`, 'error');
                }
            );
        } catch (err) {
            // console.log(err);
        }
    };
    const onSubmitticket = (e) => {
        e.preventDefault();
        const numberOfMlSeconds = formularioticket.fechaingreso.getTime();
        const addMlSeconds = 300 * 60000;
        const creado = new Date(numberOfMlSeconds - addMlSeconds)
        try {
            axios({
                url: `${URLAPIGENERAL}/grabarticket`,
                method: 'POST',
                data: {
                    idempresa: formularioticket.empresa,
                    tipo: formularioticket.tiporequerimiento,
                    contacto: formularioticket.contacto,
                    creado,
                    descripcion: formularioticket.descripcion
                }
            }).then(
                response => {
                    const dataResponse = response.data;

                    if (dataResponse.status) {
                        const numT = dataResponse.data[0].nticket;
                        mensajeSistema(`Requerimiento número ${numT} almacenado.`, 'success')
                        handleClose();
                    } else {
                        mensajeSistema(`Inconvenientes al almacenar requerimiento`, 'error')

                    }
                },
                // eslint-disable-next-line no-unused-vars
                error => {
                    mensajeSistema(`Inconvenientes al almacenar requerimiento`, 'error')

                }
            );
        } catch (err) {
            // console.log(err);
        }

    };

    useEffect(() => {
        UpdateTicket();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        async function obtenerEmpresa() {
            const { data } = await axios(`${URLAPIGENERAL}/listarempresa`);
            const listaempresa = data.data.map(m => ({ codigo: m.idempresa, nombre: m.nombre_empresa }))
            setEmpresa(listaempresa);
        }
        async function obtenerContacto() {
            const { data } = await axios(`${URLAPIGENERAL}/listarcontacto`);
            const lista = data.data.map(m => ({ codigo: m.idcontacto, nombre: m.nombre_contacto, empresa: m.empresa }))
            setContactoTicket(lista);
        }
        async function obtenerTipoTicket() {
            const { data } = await axios(`${URLAPIGENERAL}/tipoticket`);
            const lista = data.data.map(m => ({ label: m.tipo, value: m.idtipo_ticket }))
            setTipoTicket(lista);
            setContactoTicket(lista);
        }
        obtenerTipoTicket();
        obtenerContacto();
        obtenerEmpresa();
    }, []);
    return (
        <>
            <ModalGenerico
                nombre="Empresa"
                openModal={openModal}
                busquedaTipo={tiposBusquedas}
                toggleShow={toggleShow}
                rowsData={empresa}
                parentCallback={handleCallbackChild}
            />
            <ModalGenerico
                nombre="Empresa"
                openModal={openModalEmpresaTicket}
                busquedaTipo={tiposBusquedas}
                toggleShow={toggleShowEmpresaTicket}
                rowsData={empresa}
                parentCallback={handleCallbackChildEmpresaTicket}
            />
            <ModalGenerico
                nombre="Contacto"
                openModal={openModalContactoTicket}
                busquedaTipo={tiposBusquedas}
                toggleShow={toggleShowContactoTicket}
                rowsData={contactoticket}
                parentCallback={handleCallbackChildContactoTicket}
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
                        <form onSubmit={onSubmitticket}>
                            <Grid container spacing={1}>
                                <Grid item xs={12} >
                                    <Typography variant='h4' >Nuevo Ticket</Typography>
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <TextField
                                        required
                                        size="small"
                                        fullWidth
                                        label="Empresa"
                                        value={formularioticket.nombre_empresa}
                                        InputProps={{
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => { setOpenModalEmpresaTicket(true) }}>
                                                        <SearchRoundedIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <TextField
                                        required
                                        size="small"
                                        fullWidth
                                        label="Contacto"
                                        value={formularioticket.nombre_contacto}
                                        InputProps={{
                                            readOnly: true,
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton size="small" onClick={() => { setOpenModalContactoTicket(true) }}>
                                                        <SearchRoundedIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid item md={4} sm={6} xs={12}>
                                    <TextField
                                        required
                                        select
                                        size="small"
                                        fullWidth
                                        label="Tipo"
                                        value={formularioticket.tiporequerimiento}
                                        onChange={e => {
                                            setFormularioticket({
                                                ...formularioticket,
                                                tiporequerimiento: e.target.value
                                            })
                                        }}
                                    >
                                        {
                                            tipoTickerList.map(m => (
                                                <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                {/* <Grid item md={3} sm={4} xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                        <MobileDatePicker
                                            label="Fecha de registro"
                                            value={formularioticket.fechaingreso}
                                            onChange={newValue => {
                                                setFormularioticket({
                                                    ...formularioticket,
                                                    fechaingreso: newValue
                                                })
                                            }}
                                            inputFormat="dd/MM/yyyy"
                                            renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                        />
                                    </LocalizationProvider>
                                </Grid> */}
                                <Grid item md={4} sm={6} xs={12}>
                                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                        <DateTimePicker
                                            renderInput={(props) => <TextField fullWidth {...props} size="small" />}
                                            label="Fecha de registro"
                                            value={formularioticket.fechaingreso}
                                            onChange={(newValue) => {
                                                setFormularioticket({
                                                    ...formularioticket,
                                                    fechaingreso: newValue
                                                });
                                            }}

                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        multiline
                                        rows={2}
                                        fullWidth
                                        size="small"
                                        maxRows={4}
                                        label="Descripcion"
                                        value={formularioticket.descripcion}
                                        onChange={e => {
                                            setFormularioticket({
                                                ...formularioticket,
                                                descripcion: e.target.value
                                            })
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Button fullWidth color="primary" variant="text" type="submit" startIcon={<SaveRoundedIcon />}>
                                        Guardar
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </Box>
                </Box>
            </Modal>
            <Page title="Solucion">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={estilobox} >
                        <HeaderBreadcrumbs
                            heading="Solucion"
                            links={[
                                { name: 'Inicio' },
                                { name: 'Solucion' },
                                { name: 'Lista' },
                            ]}
                            action={
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => { handleOpen() }}
                                    startIcon={<AddCircleOutlinedIcon />}
                                >
                                    Agregar Ticket
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
                                        <TextField
                                            fullWidth
                                            label="Operador"
                                            size="small"
                                            type="text"
                                            required
                                            disabled
                                            value={formulario.nombre_operador}
                                            name='nombre_operador'
                                            onChange={e => cambiarFormulario(e)}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Empresa"
                                            type="text"
                                            disabled
                                            value={formulario.nombre_empresa}
                                            name="nombre_empresa"
                                            onChange={e => cambiarFormulario(e)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>

                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Contacto"
                                            disabled
                                            value={formulario.nombre_contacto}
                                            name="nombre_contacto"
                                            onChange={e => cambiarFormulario(e)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="text"
                                            label="Requerimiento"
                                            disabled
                                            value={formulario.requerimiento}
                                            name="requerimiento"
                                            onChange={e => cambiarFormulario(e)}
                                            required
                                        />
                                    </Grid>
                                    <Grid style={{ display: 'none' }} item md={2} sm={4} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            disabled
                                            value={formulario.tiporequerimiento}
                                            name="tiporequerimiento"
                                            onChange={e => cambiarFormulario(e)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={4} xs={12}>
                                        <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                                            <MobileDatePicker
                                                label="Fecha de registro"
                                                // disabled
                                                value={formulario.fechaingreso}
                                                onChange={newValue => {
                                                    setFormulario({
                                                        ...formulario,
                                                        fechaingreso: newValue
                                                    })
                                                }}
                                                inputFormat="dd/MM/yyyy"
                                                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                    <Grid item md={6} sm={4} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            label="Solucion"
                                            type="text"
                                            name="solucion"
                                            value={formulario.solucion}
                                            onChange={e => cambiarFormulario(e)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <Button fullWidth color="primary" variant="text" type="submit" startIcon={<SaveRoundedIcon />}>
                                            Guardar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                            <Box sx={{ mt: 2, mb: 1 }} >
                                <Grid container spacing={1} justifyContent="flex-end">
                                    <Grid item md={4} sm={4} xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label="Buscar Ticket"
                                            name="dataticket"
                                            onChange={e => {
                                                const filtro = resultadobusqueda.filter(
                                                    f =>
                                                        `${f.descripcion}`
                                                            .toUpperCase()
                                                            .includes(e.target.value.toUpperCase()) ||
                                                        `${f.nombre}`
                                                            .toUpperCase()
                                                            .includes(e.target.value.toUpperCase()) ||
                                                        `${f.nombre_contacto}`
                                                            .toUpperCase()
                                                            .includes(e.target.value.toUpperCase()) ||
                                                        `${f.nombre_empresa}`
                                                            .toUpperCase()
                                                            .includes(e.target.value.toUpperCase())
                                                );
                                                setSxTabla({ ...sxtabla, rows: filtro })
                                                setTicket(e.target.value);
                                            }}
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchRoundedIcon />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Box>
                            <TablaDatos sx={sxtabla} style={style} />
                        </Card>
                    </Box>
                </Fade>

            </Page>
        </>
    );
}
export default Solucion;
