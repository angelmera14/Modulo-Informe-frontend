import React from 'react'
import axios from 'axios';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { TextField, Button, Card, Grid, InputAdornment, Fade } from "@mui/material";
import { DataGrid, esES } from "@mui/x-data-grid";
import { Box } from '@mui/system'
import { useSnackbar } from 'notistack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import Page from '../../../../components/Page';
import { URLAPIGENERAL, URLAPILOCAL } from "../../../../config";
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import {  PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';

export default function Productos() {

    const { token } = JSON.parse(window.localStorage.getItem("usuario"));
    const navegacion = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
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

    // Formatear columna de tipo money
    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    });
    const usdPrice = {
        type: 'number',
        width: 130,
        valueFormatter: ({ value }) => currencyFormatter.format(Number(value)),
        cellClassName: 'font-tabular-nums',
    };

    const estilosdetabla = {
        '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'background.neutral',
            borderRadius: '0.5rem'
        },
        '.blueCell': {
            backgroundColor: 'grid.azul'
        },
        '.orangeCell': {
            backgroundColor: 'grid.rojo'
        },
        '.yellowCell': {
            backgroundColor: 'grid.amarillo'
        }
    }


    const cabecera = [
        { field: 'item', headerName: 'Codigo', width: 100, headerClassName: 'super-app-theme--header' },
        { field: 'codbarra', headerName: 'Codigo de Barra', width: 200, headerClassName: 'super-app-theme--header' },
        { field: 'nombre', headerName: 'Nombre', width: 250, headerClassName: 'super-app-theme--header' },
        { field: 'estado', headerName: 'Estado', width: 100, headerClassName: 'super-app-theme--header' },
        { field: 'iva', headerName: 'IVA', width: 100, headerClassName: 'super-app-theme--header' },
        { field: 'precio1', headerName: 'Precio 1', width: 150, headerClassName: 'super-app-theme--header', ...usdPrice },
        { field: 'precio2', headerName: 'Precio 2', width: 150, headerClassName: 'super-app-theme--header', ...usdPrice },
        { field: 'precio3', headerName: 'Precio 3', width: 150, headerClassName: 'super-app-theme--header', ...usdPrice },
        { field: 'precio4', headerName: 'Precio 4', width: 150, headerClassName: 'super-app-theme--header', ...usdPrice },
        { field: 'precio5', headerName: 'Precio 5', width: 150, headerClassName: 'super-app-theme--header', ...usdPrice },
    ]

    const [datosfilas, setDatosFilas] = React.useState([]);
    const [buscar, setBuscar] = React.useState("");
    const [resultadobusqueda, setResultadoBusqueda] = React.useState([]);
    const Buscar = (e) => {
        setBuscar(e.target.value);
        const texto = String(e.target.value).toLocaleUpperCase();
        const resultado = resultadobusqueda.filter(b => String(b.nombre).toLocaleUpperCase().includes((texto)));
        setDatosFilas(resultado);
    }

    const Editar = (e) => {
        navegacion(`/sistema/inventario/editarproducto`, { state: { id: e.id } });
        // navegacion(`${PATH_DASHBOARD.nuevoprecio}`, { state: { id: e.id } });
    };

    React.useEffect(() => {
        async function cargarDatos() {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            try {
                const { data } = await axios(`${URLAPIGENERAL}/productos/listar`, config);
                setDatosFilas(data);
                setResultadoBusqueda(data);
                console.log(data);
            } catch (error) {
                setDatosFilas([]);
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                }
            }
        };
        cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Page title="Productos">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <HeaderBreadcrumbs
                            heading='Productos'
                            links={[
                                { name: 'Inicio', href: '#' },
                                { name: 'Productos', href: '#' },
                                { name: 'Lista' }
                            ]}
                            action={
                                <Button
                                    fullWidth
                                    variant="contained"
                                    component={RouterLink}
                                    to="/sistema/inventario/nuevoproducto"
                                    startIcon={<AddCircleRoundedIcon />}
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
                    <Card sx={{ ml: 3, mr: 3, p: 1, mt: 1 }}>
                        <Box sx={{ ml: 2, mt: 2 }}>
                            <Grid container spacing={1} directio='row' justifyContent='space-between'>
                                <Grid item md={3} sm={6} xs={12}>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        label="Buscar"
                                        variant="outlined"
                                        value={buscar}
                                        onChange={Buscar}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchRoundedIcon sx={{ color: 'text.primary' }} />
                                                </InputAdornment>
                                            ),
                                        }} />
                                </Grid>
                                <Grid item container spacing={1} md={9} sm={6} xs={12} justifyContent='flex-end'>
                                    <Grid item md={1.2} sm={4} xs={6}>
                                        <Button
                                            fullWidth
                                            variant='text'
                                            href={`${URLAPIGENERAL}/productos/generarexcel`}
                                            tagert='_blank'
                                            startIcon={<ViewComfyRoundedIcon />}
                                        >
                                            Excel
                                        </Button>
                                    </Grid>
                                    <Grid item md={1.2} sm={4} xs={6}>
                                        <Button
                                            fullWidth
                                            variant="text"
                                            href={`${URLAPIGENERAL}/productos/generarpdf`}
                                            target="_blank"
                                            startIcon={<PictureAsPdfRoundedIcon />}
                                        >
                                            Pdf
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={estilosdetabla}>
                            <div
                                style={{
                                    padding: '1rem',
                                    height: '55vh',
                                    width: '100%'
                                }}
                            >
                                <DataGrid
                                    density="compact"
                                    rowHeight={28}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    onRowDoubleClick={e => Editar(e)}
                                    // checkboxSelection
                                    sx={{
                                        '& .MuiDataGrid-cell': {
                                            border: 'none'
                                        },
                                        '& .scrollArea--right': {
                                            border: '20px'
                                        },
                                        // '& .MuiDataGrid-columnSeparator--sideRight': {
                                        //     display: 'none',
                                        // },


                                    }}
                                    rows={datosfilas}
                                    columns={cabecera}
                                    getRowId={rows => rows.item}
                                    components={{
                                        NoRowsOverlay: CustomNoRowsOverlay,
                                    }}
                                />
                            </div>
                        </Box>
                    </Card>
                </Fade>
            </Page>
        </>
    )
}
