import React, { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
import {
    Grid,
    Card,
    Box,
    TextField,
    // IconButton,
    // InputAdornment,
    // Checkbox,
    // FormControlLabel,
    // Button,
    MenuItem,
    // FilledInput,
    // Typography
} from '@mui/material';
import axios from 'axios';
// import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
// import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
// import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
// import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import * as Yup from 'yup';

import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
// routes
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';
import { MenuMantenimiento } from '../../../../components/sistema/menumatenimiento';


export default function Usuario({ isEdit, currentUser }) {
    const { enqueueSnackbar } = useSnackbar();
    const navegacion = useNavigate();
    const messajeTool = (variant, msg) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    };
    const [categorias, setCategorias] = useState([]);
    const [userModel, setUserModel] = useState({
        id: 0,
        codigo: '',
        clave: '',
        nombre: '',
        estado: 'A',
        categoria: 1
    })
    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const axiosInst = axios.create({
        headers: {
            Authorization: `Bearer ${usuario.token}`,
        }
    })
    // Yup.setLocale(es);

    const schemaUser = Yup.object().shape({
        id: Yup.number().default(0),
        codigo: Yup.string().required().min(3),
        clave: Yup.string().required().min(3),
        nombre: Yup.string().required().min(5),
        estado: Yup.string().default('A'),
        categoria: Yup.number().default(1)
    });

    const GrabarUser = () => {
        // console.log(userModel)
        schemaUser.validate(userModel)
            .then(() => {
                const url = `${URLAPIGENERAL}/usuario`;
                // console.log(url);
                axiosInst.post(url, userModel)
                    .then(res => {
                        if (res.status === 200) {
                            messajeTool('success', 'Usuario creado con exito.');
                            navegacion('/sistema/parametro/usuario')
                        }
                    })
                    .catch(err => {
                        messajeTool('error', 'Problemas creando Usuario.');
                        console.log(err);
                    })
            })
            .catch(error => {
                messajeTool('error', error.response.data.message);
                // messajeToo('error','Problemas con la aplicacion', 'error');
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    messajeTool('error', error.response.data.message);
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                    messajeTool('error', error.response.data.message);
                }

            });
    }

    const limpiar = () => {
        setUserModel({
            id: 0,
            codigo: '',
            clave: '',
            nombre: '',
            estado: 'A',
            categoria: 1
        })
    }
    const Volver = () => {
        navegacion(`/sistema/parametro/usuario`);
      };
    const unFalse = false;

    React.useEffect(() => {
        axiosInst.get(`${URLAPIGENERAL}/catusuario/listar`)
            .then((res) => {
                if (res.status === 200) {
                    const cate = res.data.map((item) => ({
                        codigo: item.id,
                        nombre: item.nombre
                    }))
                    setCategorias(cate);
                    setUserModel({ ...userModel, categoria: cate[0].codigo })
                }
            }
            ).catch((error) => {
                messajeTool('error', error.response.data.message);
                // messajeToo('error','Problemas con la aplicacion', 'error');
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    messajeTool('error', error.response.data.message);
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                }
            });
    }, []);

    return (
        <>
            <HeaderBreadcrumbs
                heading="Creación de Usuario"
                links={[
                    { name: 'Inicio'},
                    { name: 'Usuarios'},
                    { name: 'Crear' },
                ]}
            />
            <MenuMantenimiento modo nuevo={() => limpiar()} grabar={() => GrabarUser()} volver={() => Volver()} />
          
            <Grid container spacing={2} sx={{ pr: 3 }}>
                {/* <Grid container spacing={2} justifyContent="flex-end" alignItems="rigth" >
                    <Grid item md={1} xs={4}>
                        <Button
                            variant="text"
                            startIcon={<InsertDriveFileRoundedIcon />}
                            onClick={() => limpiar()}
                        >
                            Nuevo
                        </Button>
                    </Grid>
                    <Grid item md={1} xs={4}>
                        <Button
                            // disabled={buttonDisabled}
                            variant="text"
                            onClick={() => GrabarUser()}
                            startIcon={<SaveRoundedIcon />}>
                            Grabar
                        </Button>
                    </Grid>
                </Grid> */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ p: 3 }}>
                        <Box
                            sx={{
                                display: 'grid',
                                columnGap: 1,
                                rowGap: 1
                            }}
                        >
                            <Grid item md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="text"
                                    label="Código"
                                    inputProps={{ maxLength: 3 }}
                                    value={userModel.codigo}
                                    name="codigo"
                                    variant="outlined"
                                    onChange={e => setUserModel({ ...userModel, codigo: e.target.value.toUpperCase() })}
                                // value={buscar}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="text"
                                    autoComplete='undefined'
                                    label="Nombre"
                                    inputProps={{ maxLength: 100 }}
                                    value={userModel.nombre}
                                    name="nombreuser"
                                    variant="outlined"
                                    onChange={e => setUserModel({ ...userModel, nombre: e.target.value.toUpperCase() })}
                                // value={buscar}
                                />
                            </Grid>
                            <Grid item md={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="password"
                                    label="Clave"
                                    inputProps={{ maxLength: 20 }}
                                    value={userModel.clave}
                                    name="claveuser"
                                    variant="outlined"
                                    onChange={e => setUserModel({ ...userModel, clave: e.target.value })}
                                // value={buscar}
                                />
                            </Grid>
                            <Grid item md={3} sm={6} xs={6}>
                                <TextField
                                    select
                                    label="Categoria"
                                    value={userModel.categoria}
                                    fullWidth
                                    size="small"
                                    onChange={e => {
                                        setUserModel({ ...userModel, categoria: e.target.value })
                                    }}
                                >
                                    {
                                        categorias.map(cat =>
                                            <MenuItem
                                                key={cat.codigo}
                                                value={cat.codigo}
                                            >
                                                {cat.nombre}
                                            </MenuItem>)
                                    }
                                </TextField>
                            </Grid>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}