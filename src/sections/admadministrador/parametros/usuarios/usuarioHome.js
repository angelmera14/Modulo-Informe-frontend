import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';
import {
    Grid,
    Card,
    Box,
    // TextField,
    // IconButton,
    // InputAdornment,
    // Checkbox,
    // FormControlLabel,
    Button,
    // MenuItem,
    // FilledInput,
    // Typography
} from '@mui/material';
import axios from 'axios';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
// import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
// import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
// import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
// import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { DataGrid, esES } from '@mui/x-data-grid';
// form
// import { useForm, Controller } from 'react-hook-form';
// import { yupResolver } from '@hookform/resolvers/yup';
// @mui
// import { LoadingButton } from '@mui/lab';
// routes
import { PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { URLAPIGENERAL } from '../../../../config';
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';
import { estilosdatagrid, estilosdetabla, styleActive, styleInactive } from '../../../../utils/csssistema/estilos';
// import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';



export default function UsuarioHome({ isEdit, currentUser }) {
    const { enqueueSnackbar } = useSnackbar();
    const navegacion = useNavigate();
    const messajeTool = (variant, msg) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    };
    const navigate = useNavigate();
    const columns = [
        { field: 'codigo', headerName: 'Codigo', width: 150, headerClassName: 'super-app-theme--header' },
        { field: 'nombre', headerName: 'Nombre', width: 150, headerClassName: 'super-app-theme--header' },
        {
            field: 'estado', headerName: 'Estado', width: 150, headerClassName: 'super-app-theme--header',
            renderCell: (param) => (
                param.row.estado === 'A' ? <Button variant="containded" style={styleActive}>SI</Button> : <Button variant="containded" style={styleInactive}>NO</Button>
            ),
        }
    ];
    // const rowsFilter = [
    //     { codigo: 'SER', nombre: 'SERVICIOS', estado: true },
    //     { codigo: 'DRE', nombre: 'ACTUALIZACION', estado: true }
    // ];
    const [usuarios, setUsuarios] = useState({});

    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const axiosInst = axios.create({
        headers: {
            Authorization: `Bearer ${usuario.token}`,
        }
    })


    React.useEffect(() => {
        axiosInst.get(`${URLAPIGENERAL}/usuario`)
            .then((res) => {
                if (res.status === 200) {
                    const users = res.data.map((item) => ({
                        codigo: item.codigo,
                        nombre: item.nombre,
                        estado: item.estado
                    }))
                    setUsuarios(users);
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
                heading="Lista de Usuarios"
                links={[
                    { name: 'Inicio' },
                    { name: 'Usuarios' },
                    { name: 'Listado' },
                ]}
            />
            <Grid container spacing={2} sx={{ pr: 3 }}>

                <Grid container spacing={2} justifyContent="flex-end" alignItems="rigth">
                    <Grid item md={1} xs={4}>
                        <Button variant="text"
                            onClick={() => navigate(`/sistema/parametro/nuevousuario`, { state: { id: 'nuevo' } })}
                            startIcon={<InsertDriveFileRoundedIcon />}>
                            Nuevo
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>

                        <Box
                            sx={estilosdetabla}
                        >
                            <div
                                style={{
                                    // padding: '1rem',
                                    height: '45vh',
                                    width: '100%',
                                }}
                            >
                                <DataGrid
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    density="compact"
                                    rowHeight={28}
                                    sx={estilosdatagrid}
                                    // onRowDoubleClick={e => onTrigger(e)}
                                    columns={columns}
                                    rows={usuarios}
                                    getRowId={row => row.codigo}
                                />
                            </div>
                        </Box>

                    </Card>
                </Grid>
            </Grid>
        </>
    );
}