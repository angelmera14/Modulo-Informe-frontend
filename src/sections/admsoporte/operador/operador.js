import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
    Box,
    Fade,
    Grid,
    TextField,
    Typography,
    Card,
    Button,
} from '@mui/material';
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import { SaveRounded } from '@mui/icons-material';
import Page from '../../../components/Page';
// import ModalGenerico from '../../../components/modalgenerico';
import { estilobox } from '../../../utils/csssistema/estilos';
// import CardTicketAsignacion from './componentes/tarjeta';
import { URLAPIGENERAL } from '../../../config';
// import imgticket from '../../../assets/images/sistema/noticket.png';


function Operador() {
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

    // mensajes

    const [data, setData] = useState({
        nombre: '',
        email: '',
        departamento: '',
        telefono: '',
        detalle: '',
        clave: '',
        estado: ''
    });
    // evento se cambio del input
    function handle(e) {
        setData({
            // data.descripcion,
            ...data,
            [e.target.name]: e.target.value
        });
        // console.log(data)
    }
    // funcion de guardado
    // eslint-disable-next-line func-names
    const onSubmit = function (e) {
        e.preventDefault();
        // eslint-disable-next-line no-unused-vars
        const dataForm = data;
        try {
            // console.log(data.nombre);
            // console.log(data.email);
            // console.log(data.descripcion);
            axios({
                url: `${URLAPIGENERAL}/grabaroperador`,
                method: 'POST',
                data: {
                    nombre: data.nombre,
                    email: data.email,
                    departamento: data.departamento,
                    telefono: data.telefono,
                    detalle: data.detalle,
                    clave: data.clave,
                    estado: true
                }
            }).then(
                response => {
                    const dataResponse = response.data;
                    const { status } = response.data;
                    // const respuesta = dataResponse.data.idtipo_ticket
                    // console.log(dataResponse);
                    // // console.log(respuesta);
                    // console.log(dataResponse.data);
                    // console.log(data.descripcion)
                    // console.log(dataResponse.data.estado)
                    // console.log();
                    if (status) {
                        mensajeSistema(`El operador  ${dataResponse.data.nombre} se almaceno correctamente.`, 'success')
                        setData({
                            nombre: '',
                            email: '',
                            departamento: '',
                            telefono: '',
                            detalle: '',
                            clave: '',
                            estado: ''
                        })
                    } else {
                        mensajeSistema(`${response.data.error}`, 'error')
                    }
                },
                // eslint-disable-next-line no-unused-vars
                error => {
                    mensajeSistema(`Inconvenientes al almacenar el operador`, 'error')

                }
            );
        } catch (err) {
            // console.log(err);
            mensajeSistema(`Inconvenientes al almacenar el operador`, 'error')
        }
    };

    return (
        <>

            <Page title="Operador">
                <Box sx={estilobox} >
                    <Grid container spacing={1} justifyContent="space-between">
                        <Grid item md={6} sm={6} xs={12} container spacing={1} >
                            <Typography variant='h3' >Formulario Operador</Typography>
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
                            <form onSubmit={onSubmit} >
                                <Grid container spacing={1} sx={{ p: 1 }} >
                                    <Grid container spacing={1} item xs={12}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="email"
                                                label="Email"
                                                name="email"
                                                onChange={e => handle(e)}
                                                autoFocus
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} item xs={12}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                type="password"
                                                label="Clave"
                                                name="clave"
                                                onChange={e => handle(e)}
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} item xs={12}>
                                        <Grid item md={4} sm={12} xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Nombre y Apellidos"
                                                name="nombre"
                                                onChange={e => handle(e)}
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} item xs={12} md={4}>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Departamento"
                                                name="departamento"
                                                onChange={e => handle(e)}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Telefono"
                                                name="telefono"
                                                onChange={e => handle(e)}
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} item xs={12}>
                                        <Grid item md={4} sm={4} xs={12}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Observacion"
                                                name="detalle"
                                                onChange={e => handle(e)}
                                                required
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={1} item xs={12}>
                                        <Grid item md={2} sm={4} xs={12}>
                                            <Button size="small" fullWidth variant="contained" type="submit">
                                                Guardar
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </form>
                        </Card>
                    </Box>

                </Fade>

            </Page>
        </>
    );
}
export default Operador;
