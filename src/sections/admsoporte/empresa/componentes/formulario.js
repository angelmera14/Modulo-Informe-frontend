import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import {
    Box,
    // Fade,
    Grid,
    Typography,
    TextField,
    Card,
    // InputAdornment,
    // Button,
} from '@mui/material';
import { MenuMantenimiento } from '../../../../components/sistema/menumatenimiento';
import { URLAPIGENERAL } from '../../../../config';
import { estilobox } from '../../../../utils/csssistema/estilos';
import { PATH_OPSISTEMA } from '../../../../routes/paths';

function Formulario() {
    const navegacion = useNavigate();
    const { state } = useLocation();
    const { modo, datos } = state;
    const { enqueueSnackbar } = useSnackbar();
    const [data, setData] = useState({
        idempresa: '',
        nombre_empresa: '',
        password: '',
        ruc: '',
        representante: '',
        email: '',
        tlf_contacto: ''
    });
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
    function handle(e) {
        setData({
            ...data,
            [e.target.name]: e.target.value.toUpperCase()
        });
    }
    const handleNumber = (e, maxlng) => {
        const value = e.target.value.replace(/\D/g, '');
        setData({
            ...data,
            [e.target.name]: value.substring(0, maxlng)
        });
    };

    function handleSave() {
        // const dataForm = data;
        try {
            if (modo === 'nuevo') {
                axios({
                    url: `${URLAPIGENERAL}/grabaempresa`,
                    method: 'POST',
                    data: {
                        idemp: data.idempresa,
                        nombre: data.nombre_empresa,
                        password: data.password,
                        ruc: data.ruc,
                        representante: data.representante,
                        email: data.email,
                        contacto: data.tlf_contacto
                    }
                }).then(
                    response => {
                        const dataResponse = response.data;
                        const statust = dataResponse.status;
                        if (statust === true) {
                            
                            mensajeSistema('Empresa Registrada con exito.', 'success')
                            navegacion(PATH_OPSISTEMA.mantenimiento.empresa.inicio)

                        }
                    },
                    error => {
                        mensajeSistema(`Inconveniente al Registrar empresa. Causa: ${error.message}`, 'error')

                    }
                );
            } else {
                axios({
                    url: `${URLAPIGENERAL}/editarempresa`,
                    method: 'POST',
                    data: {
                        dataEmpresa: {
                            idemp: data.idempresa,
                            nombre: data.nombre_empresa,
                            password: data.password,
                            ruc: data.ruc,
                            representante: data.representante,
                            email: data.email,
                            contacto: data.tlf_contacto
                        }
                    }
                }).then(
                    response => {
                        const dataResponse = response.data;
                        console.log(dataResponse);
                        const statust = dataResponse.status;
                        if (statust === true) {
                            mensajeSistema('Empresa Actualizada con exito.', 'success')
                            navegacion(PATH_OPSISTEMA.mantenimiento.empresa.inicio)
                            // UpdateEmpresa();
                        }
                    },
                    error => {
                        mensajeSistema(`Inconveniente al actualizar empresa. Causa: ${error.message}`, 'error')
                    }
                );
            }
        } catch (err) {
            console.log(err);
        }
        // setUpdate(false);
    }
    console.log(datos);
    useEffect(() => {
        if (modo === 'editar') setData(datos);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <>
            <Box sx={estilobox} >
                <Grid container spacing={1} justifyContent="space-between">
                    <Grid item md={6} sm={6} xs={12} container spacing={1} >
                        <Typography variant='h3' >Formulario Empresa</Typography>
                    </Grid>
                </Grid>
            </Box>
            <MenuMantenimiento
                modo
                nuevo={() => { }}
                grabar={() => { handleSave() }}
                volver={() => { navegacion(PATH_OPSISTEMA.mantenimiento.empresa.inicio) }}
            />

            <Box sx={estilobox}>
                <Card sx={{ p: 3 }} >
                    <Grid container spacing={1} >
                        <Grid item xs={12} container spacing={1} >
                            <Grid item md={4} sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Nombre"
                                    name="nombre_empresa"
                                    value={data.nombre_empresa}
                                    onChange={e => handle(e)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container spacing={1} >
                            <Grid item md={4} sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Representante"
                                    name="representante"
                                    value={data.representante}
                                    onChange={e => handle(e)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container spacing={1} >
                            <Grid item md={3} sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Ruc"
                                    name="ruc"
                                    value={data.ruc}
                                    onChange={e => handleNumber(e, 13)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container spacing={1} >
                            <Grid item md={3} sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Correo"
                                    name="email"
                                    value={data.email}
                                    onChange={e => handle(e)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container spacing={1} >
                            <Grid item md={3} sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Telefono"
                                    name="tlf_contacto"
                                    value={data.tlf_contacto}
                                    onChange={e => handleNumber(e, 10)}
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={12} container spacing={1} >
                            <Grid item md={3} sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Clave"
                                    name="password"
                                    value={data.password}
                                    onChange={e => handle(e)}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Box>
        </>
    )
}
export default Formulario;