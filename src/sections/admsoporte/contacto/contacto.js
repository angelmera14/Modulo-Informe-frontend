import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
    Box,
    Fade,
    Grid,
    TextField,
    Typography,
    MenuItem,
    Card,
    Button,
    IconButton,
    InputAdornment
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import { SaveRounded } from '@mui/icons-material';
import Page from '../../../components/Page';
import ModalGenerico from '../../../components/modalgenerico';
import { estilobox } from '../../../utils/csssistema/estilos';
// import CardTicketAsignacion from './componentes/tarjeta';
import { URLAPIGENERAL } from '../../../config';
// import imgticket from '../../../assets/images/sistema/noticket.png';


function Contacto() {
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
    const [formulario, setFormulario] = useState({
        // eslint-disable-next-line camelcase
        nombre_contacto: '',
        // eslint-disable-next-line camelcase
        email_contacto: '',
        nombre_empresa: '----',
        tlf_contacto: '',
        cargo: 'EMPLEADO',
        empresa: 2
    });
    const [empresa, setEmpresa] = useState([]);
    const grabarConacto = async () => {
        try {
            const validar = formulario.nombre_contacto.trim().length === 0 ||
                formulario.email_contacto.trim().length === 0 ||
                formulario.tlf_contacto.trim().length === 0 ||
                formulario.nombre_empresa === "----"
            if (validar) {
                mensajeSistema('Complete todos los campos', 'error')
                return
            }
            const { data } = await axios.post(`${URLAPIGENERAL}/grabacontacto`, formulario);
            if (data.status) {
                mensajeSistema(`Contacto guardado con exito`, 'success');
                setFormulario({
                    // eslint-disable-next-line camelcase
                    nombre_contacto: '',
                    // eslint-disable-next-line camelcase
                    email_contacto: '',
                    nombre_empresa: '----',
                    tlf_contacto: '',
                    cargo: 'EMPLEADO',
                    empresa: 2
                })

            } else {
                mensajeSistema(`Error al guardar contacto`, 'error')

            }
        } catch (error) {
            mensajeSistema(`Error al guardar contacto`, 'error')

        }
    };
    // eslint-disable-next-line no-unused-vars
    const [tiposBusquedas, setTiposBusqueda] = useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);

    const [openModal, setOpenModal] = useState(false);
    const toggleShow = () => setOpenModal(p => !p);
    const handleCallbackChild = async (e) => {
        const item = e.row;
        setFormulario({ ...formulario, empresa: item.codigo, nombre_empresa: item.nombre });
        toggleShow();
    }
    useEffect(() => {
        async function obtenerEmpresa() {
            const { data } = await axios(`${URLAPIGENERAL}/listarempresa`);
            console.log(data);
            const listaempresa = data.data.map(m => ({ codigo: m.idempresa, nombre: m.nombre_empresa }))
            setEmpresa(listaempresa);
        }
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
            <Page title="Contacto">
                <Box sx={estilobox} >
                    <Grid container spacing={1} justifyContent="space-between">
                        <Grid item md={6} sm={6} xs={12} container spacing={1} >
                            <Typography variant='h3' >Formulario Contacto</Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >

                    <Box sx={estilobox} >
                        <Card style={{ padding: '2rem' }}>
                            <Grid container spacing={1} sx={{ p: 1 }} >
                                <Grid container spacing={1} item xs={12}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label="Nombre"
                                            value={formulario.nombre_contacto}
                                            onChange={e => {
                                                setFormulario({
                                                    ...formulario,
                                                    // eslint-disable-next-line camelcase
                                                    nombre_contacto: e.target.value
                                                });
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} item xs={12}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <TextField
                                            size="small"
                                            type="email"
                                            fullWidth
                                            label="Correo"
                                            value={formulario.email_contacto}
                                            onChange={e => {
                                                setFormulario({
                                                    ...formulario,
                                                    // eslint-disable-next-line camelcase
                                                    email_contacto: e.target.value
                                                });
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} item xs={12}>
                                    <Grid item md={4} sm={12} xs={12}>
                                        <TextField
                                            size="small"
                                            type="number"
                                            fullWidth
                                            label="Telefono"
                                            value={formulario.tlf_contacto}
                                            onChange={e => {
                                                setFormulario({
                                                    ...formulario,
                                                    // eslint-disable-next-line camelcase
                                                    tlf_contacto: e.target.value
                                                });
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} item xs={12} md={4}>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            select
                                            fullWidth
                                            label="Cargo"
                                            value={formulario.cargo}
                                            onChange={e => {
                                                setFormulario({
                                                    ...formulario,
                                                    // eslint-disable-next-line camelcase
                                                    cargo: e.target.value
                                                });
                                            }}
                                        >
                                            <MenuItem value="EMPLEADO">EMPLEADO</MenuItem>
                                            <MenuItem value="GERENTE">GERENTE</MenuItem>
                                            <MenuItem value="SUPERVISOR">SUPERVISOR</MenuItem>
                                            <MenuItem value="ASISTENTE">ASISTENTE</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            size="small"
                                            fullWidth
                                            label="Empresa"
                                            value={formulario.nombre_empresa}
                                            InputProps={{
                                                readOnly: true,
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton size="small" onClick={() => { setOpenModal(true) }}>
                                                            <SearchRoundedIcon />
                                                        </IconButton>
                                                    </InputAdornment>
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} item xs={12}>
                                    <Grid item md={2} sm={4} xs={12}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={() => {
                                                grabarConacto();
                                            }}
                                        >
                                            Grabar
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>

                    </Box>

                </Fade>

            </Page>
        </>
    );
}
export default Contacto;
