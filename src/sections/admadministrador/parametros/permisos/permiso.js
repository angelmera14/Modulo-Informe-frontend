import { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Grid,
    Fade,
    MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';
import { DataGrid, esES } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { useSnackbar } from 'notistack';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import { PATH_DASHBOARD, PATH_OPSISTEMA, PATH_AUTH, PATH_PAGE } from "../../../../routes/paths";
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';
import CircularProgreso from '../../../../components/Cargando';
import Page from '../../../../components/Page';
import { URLAPIGENERAL } from "../../../../config";
import { estilosdatagrid, estilosdetabla, styleActive, styleInactive } from '../../../../utils/csssistema/estilos'
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';


export const columns = [
    {
        field: 'nombre',
        headerName: 'Nombre',
        width: 250,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true
    },
    {
        field: 'estado',
        headerName: 'Permitido',
        width: 180,
        headerClassName: 'columnclass',
        sortable: false,
        disableColumnMenu: true,
        renderCell: (param) => (
            param.row.estado === true ?
                <Button variant="containded" style={styleActive}>SI</Button> :
                <Button variant="containded" style={styleInactive}>NO</Button>
        ),
    }
];
function FormularioPermisos() {
    // eslint-disable-next-line camelcase
    const { token, codigo_Usuario } = JSON.parse(window.localStorage.getItem('usuario'));
    const { enqueueSnackbar } = useSnackbar();
    const navegacion = useNavigate();
    const [formulario, setFormulario] = useState({
        operador: ''
    })
    const [progreso, setProgreso] = useState(false);
    const [selectionModel, setSelectionModel] = useState([]);
    const [rowss, setItems] = useState([]);
    const [operador, setOperador] = useState([]);
    const [accesos, setAccesos] = useState([]);
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
    const cambiarAccesosPorOperador = async (e) => {
        setFormulario({
            ...formulario,
            operador: e.target.value
        })
        obtenerAccesosTabla(e.target.value.trim());
    }
    const obtenerAccesosTabla = async (operador) => {
        try {
            const { data } = await axios(`${URLAPIGENERAL}/accesos/listarxoperador?operador=${operador}`, config, setProgreso(true));
            // aqui vamos a llenar el datagrid
            const accesostabla = [];
            accesos.forEach(a => {
                data.forEach(d => {
                    const condicion = a.id === d.opcion;
                    if (condicion) {
                        accesostabla.push({
                            nombre: a.nombre,
                            opcion: d.opcion,
                            estado: !!condicion
                        })
                    }
                })
            })
            // 
            accesos.forEach(a => {
                const entabla = accesostabla.filter(f => f.opcion === a.id);
                if (!entabla.length > 0) {
                    accesostabla.push({
                        nombre: a.nombre,
                        opcion: a.id,
                        estado: false
                    })
                }

            })
            setItems(accesostabla);
        } catch (error) {
            mensajeSistema("Error al buscar informacion", "error");
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
    const grabarPermisos = async () => {
        try {
            if (selectionModel.length === 0) {
                mensajeSistema("Seleccione un permiso antes de guardar", "error");
                return
            }
            // eslint-disable-next-line camelcase
            const listapermiso = selectionModel.map(p => ({ id: 0, nombre: '', operador: formulario.operador, operadorpermiso: codigo_Usuario, opcion: p }))
            const { data } = await axios.post(`${URLAPIGENERAL}/accesos/asignarpermisos`, listapermiso, config, setProgreso(true))
            if (data === 200) {
                obtenerAccesosTabla(formulario.operador);
                mensajeSistema('Permisos guardados correctamente debe iniciar sesion nuevamente para completar los cambios', 'success');
            }
        } catch (error) {
            mensajeSistema("Error al buscar informacion", "error");
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
    useEffect(() => {
        async function obtenerAccesos() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/accesos/listar`, config, setProgreso(true));
                setAccesos(data);
            } catch (error) {
                mensajeSistema("Error al buscar informacion", "error");
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
        async function obtenerOperador() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/usuario`, config, setProgreso(true));
                setOperador(data);
            } catch (error) {
                mensajeSistema("Error al buscar informacion", "error");
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
        obtenerAccesos();
        obtenerOperador();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <CircularProgreso open={progreso} handleClose1={() => { setProgreso(false) }} />
            <Page title="Permisos">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >

                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <HeaderBreadcrumbs
                            heading=" Permisos"
                            links={[
                                { name: 'Inicio'},
                                { name: 'Permisos'},
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
                        <Box mb={1}>
                            <Grid container spacing={1} justifyContent="flex-end" >

                                <Grid item md={4} sm={4} xs={12} >
                                    <TextField
                                        fullWidth
                                        select
                                        size="small"
                                        label="Usuario"
                                        value={formulario.operador}
                                        onChange={e => {
                                            cambiarAccesosPorOperador(e)
                                        }}
                                    >
                                        {
                                            operador.map(o => (
                                                <MenuItem key={o.id} value={o.codigo}>{o.nombre}</MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>
                                <Grid item md={1.2} sm={2} xs={12} >
                                    <Button
                                        fullWidth
                                        variant="text"
                                        onClick={() => { grabarPermisos() }}
                                        startIcon={<SaveRoundedIcon />}
                                    >
                                        Grabar
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>
                        <Box sx={estilosdetabla}>
                            <div
                                style={{
                                    // padding: '1rem',
                                    height: '50vh',
                                    width: '100%'
                                }}
                            >
                                <DataGrid
                                    rowHeight={28}
                                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                    components={{
                                        NoRowsOverlay: CustomNoRowsOverlay,
                                    }}
                                    rows={rowss}
                                    columns={columns}
                                    checkboxSelection
                                    onSelectionModelChange={newSelectionModel => {
                                        setSelectionModel(newSelectionModel);
                                    }}
                                    selectionModel={selectionModel}
                                    density="compact"
                                    getRowId={rows => rows.opcion}
                                    sx={estilosdatagrid}
                                />
                            </div>
                        </Box>
                    </Box>
                </Fade>
            </Page>
        </>
    )
}

export default FormularioPermisos;