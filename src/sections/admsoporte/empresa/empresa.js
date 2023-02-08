import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
    Box,
    Fade,
    Grid,
    TextField,
    Card,
    InputAdornment,
    Button,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import TablaDatos from '../../../components/sistema/tabladatos';
import { estilobox, styleActive, styleInactive } from '../../../utils/csssistema/estilos';
// import CardTicketAsignacion from './componentes/tarjeta';
import { URLAPIGENERAL } from '../../../config';
import { PATH_OPSISTEMA } from '../../../routes/paths';

const cabezera = [
    { field: 'nombre_empresa', headerName: 'Nombre', width: 300 },
    { field: 'representante', headerName: 'Representante', width: 200 },
    { field: 'tlf_contacto', headerName: 'Tlf.Contacto', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'ruc', headerName: 'Ruc', width: 150 },
    {
        field: 'activo', headerName: 'Estado', width: 100, renderCell: (param) => (
            param.row.activo === 1 ? <Button variant="containded" style={styleActive}>Activo</Button> : <Button variant="containded" style={styleInactive}>Inactivo</Button>
        ),
    }
];

const style = {
    height: '55vh',
    width: '100%'
}


function Empresa() {
    const navegacion = useNavigate();
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
    const [listafiltro, setListafiltro] = useState([])
    const [sxtabla, setSxTabla] = useState({
        columns: cabezera,
        rows: [],
        getRowId: (rows) => rows.idempresa,
        onRowDoubleClick: (e) => { registroEditar(e) }
    })
    const [buscar, setBuscar] = useState("");
    const Buscar = (e) => {
        // console.log(e.target.value);
        setBuscar(e.target.value);
        const texto = `${e.target.value}`.toLocaleUpperCase();
        const resultado = listafiltro.filter(b =>
            `${b.nombre_empresa}`.toLocaleUpperCase().includes((texto)) ||
            `${b.representante}`.toLocaleUpperCase().includes((texto)) ||
            `${b.ruc}`.toLocaleUpperCase().includes((texto))
        );

        setSxTabla({ ...sxtabla, rows: resultado })
    }
    const registroNuevo = () => {
        navegacion(PATH_OPSISTEMA.mantenimiento.empresa.formulario, { state: { modo: 'nuevo' } })
    }
    const registroEditar = (e) => {
        console.log(e);
        navegacion(PATH_OPSISTEMA.mantenimiento.empresa.formulario, { state: { modo: 'editar', datos: e.row } })
    }
    const UpdateEmpresa = () => {
        axios.get(`${URLAPIGENERAL}/listarempresa`).then(res => {
            setListafiltro(res.data.data);
            setSxTabla({ ...sxtabla, rows: res.data.data })
        }).catch(() => {
            mensajeSistema('Problemas con el servidor', 'error');
        })
    };
    useEffect(() => {
        UpdateEmpresa();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Page title="Empresa">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={estilobox} >
                        <HeaderBreadcrumbs
                            heading="Empresa"
                            links={[
                                { name: 'Inicio' },
                                { name: 'Empresa' },
                                { name: 'Lista' },
                            ]}
                            action={
                                <Button
                                    fullWidth
                                    variant="contained"
                                    onClick={() => { registroNuevo() }}
                                    startIcon={<AddCircleOutlinedIcon />}
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
                            <Grid container spacing={1} sx={{ mb: 1 }}>
                                <Grid item md={3} sm={6} xs={12}>
                                    <TextField
                                        size="small"
                                        type="text"
                                        label="Buscar"
                                        value={buscar}
                                        onChange={Buscar}
                                        variant="outlined"
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
                            <TablaDatos sx={sxtabla} style={style} />
                        </Card>
                    </Box>
                </Fade>

            </Page>
        </>
    );
}
export default Empresa;
