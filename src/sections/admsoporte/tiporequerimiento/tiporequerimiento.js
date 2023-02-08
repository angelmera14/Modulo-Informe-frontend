import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import {
    Box,
    Fade,
    Grid,
    TextField,
    Card,
    FormControlLabel,
    Button,
    Checkbox
} from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import TablaDatos from '../../../components/sistema/tabladatos';
import { estilobox, styleActive, styleInactive } from '../../../utils/csssistema/estilos';
// import CardTicketAsignacion from './componentes/tarjeta';
import { URLAPIGENERAL } from '../../../config';
// import { PATH_OPSISTEMA } from '../../../routes/paths';

const cabezera = [
    { field: 'tipo', headerName: 'Nombre', width: 300 },
    {
        field: 'estado', headerName: 'Estado', width: 100, renderCell: (param) => (
            param.row.estado === 'S' ? <Button variant="containded" style={styleActive}>Activo</Button> : <Button variant="containded" style={styleInactive}>Inactivo</Button>
        ),
    }
];

const style = {
    height: '55vh',
    width: '100%'
}


function TipoRequerimiento() {
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
        getRowId: (rows) => rows.idtipo_ticket,
        onRowClick: (e) => { onDataSelect(e) }
    })

    // estilos



    // DATOS A ENVIAR
    const [checked, setChecked] = useState(true);
    const handleChange = event => {
        setChecked(event.target.checked);
    };
    const [data, setData] = useState({
        // eslint-disable-next-line camelcase
        idtipo_ticket: '',
        descripcion: '',
        // estado: true
    });
    // VARIABLE MANEJADOR DE ESTADOS INSERT/UPDATE
    const [update, setUpdate] = useState(false);
    const onDataSelect = e => {
        setUpdate(true);
        setData({
            idtipo_ticket: e.row.idtipo_ticket,
            descripcion: e.row.tipo
        })
        setChecked(e.row.estado === 'S');
    };


    const UpdateTicket = () => {
        axios.get(`${URLAPIGENERAL}/tipoticket`).then(res => {
            const dataC = res.data.data;
            setSxTabla({ ...sxtabla, rows: dataC })
        });
    };
    
    function handle(e) {
        setData({
            ...data,
            [e.target.name]: e.target.value.toUpperCase()
        });
        // console.log(data)
    }
    const Nuevo = () => {
        setData({
            ...data,
            descripcion: ''
        })
        setChecked(true);
        setUpdate(false);
    }
    // funcion de guardado
    const onSubmit = (e) => {
        e.preventDefault();
        // const ruta = update ? 'actualizartipoticket' : 'grabartippoticket' 
        if (update === false) {
            try {
                // console.log(data.descripcion);
                axios({
                    url: `${URLAPIGENERAL}/grabartippoticket`,
                    method: 'POST',
                    data: {
                        tipo: data.descripcion,
                        estado: checked ? 'S' : 'N'
                    }
                }).then(
                    response => {
                        const dataResponse = response.data;
                        const respuesta = dataResponse.data.idtipo_ticket;

                        if (respuesta != null) {
                            mensajeSistema(`El tipo de requerimiento número ${respuesta} almacenado.`, 'success')
                            UpdateTicket();
                        }
                    },
                    // eslint-disable-next-line no-unused-vars
                    error => {
                        mensajeSistema(`Inconvenientes al almacenar el tipo de requerimiento`, 'error');
                    }
                );
            } catch (err) {
                // console.log(err);
            }
            setData({
                // eslint-disable-next-line camelcase
                idtipo_ticket: '',
                descripcion: ''
            });
            setChecked(false);
        } else {
            try {
                axios({
                    url: `${URLAPIGENERAL}/actualizartipoticket`,
                    method: 'POST',
                    data: {
                        datipoTicket: {
                            // eslint-disable-next-line camelcase
                            idtipo_ticket: data.idtipo_ticket, // idtipo,
                            tipo: data.descripcion,
                            estado: checked ? 'S' : 'N'
                        }
                    }
                }).then(
                    response => {
                        try {
                            console.log('esta es la respuesta');
                            const dataResponse = response.data;
                            console.log(dataResponse);
                            // const respuesta = dataResponse.data.idtipo_ticket
                            // console.log(dataResponse.data[0])
                            if (dataResponse.status === true) {
                                mensajeSistema(`El ticket número ${data.idtipo_ticket} se actualizo correctamente.`, 'success')
                                UpdateTicket();
                            } else {
                                // sin definir
                            }
                        } catch {
                            mensajeSistema(`El ticket número ${data.idtipo_ticket} no se actualizo.`, 'error')
                        }
                    },
                    // eslint-disable-next-line no-unused-vars
                    error => {
                        mensajeSistema(`Un imporvisto ha acontencido en el sistema`, 'error');
                    }
                );
                // setUpdate(false)
            } catch (err) {
                // console.log(err);
            }
            setUpdate(false);
            setData({
                // eslint-disable-next-line camelcase
                idtipo_ticket: '',
                descripcion: ''
            });
            setChecked(false);
        }
    };

    // RENDERIZADO
    useEffect(() => {
        UpdateTicket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Page title="Tipo de Requerimiento">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={estilobox} >
                        <HeaderBreadcrumbs
                            heading="Tipo de Requerimiento"
                            links={[
                                { name: 'Inicio' },
                                { name: 'Tipo de Requerimiento' },
                                { name: 'Lista' },
                            ]}

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
                                    <Grid item md={3} sm={6} xs={12}>
                                        <TextField
                                            fullWidth
                                            autoFocus
                                            size="small"
                                            label="Descripcion"
                                            name="descripcion"
                                            value={data.descripcion}
                                            onChange={e => handle(e)}
                                            required
                                        />
                                    </Grid>
                                    <Grid item md={1.2} sm={6} xs={12}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox name="estadp" checked={checked} onChange={handleChange} />
                                            }
                                            label="Estado"
                                        />
                                    </Grid>
                                    <Grid item md={1.2} sm={4} xs={12}>
                                        <Button fullWidth variant="text" type="submit" startIcon={<SaveRoundedIcon />}>
                                            Guardar
                                        </Button>
                                    </Grid>
                                    <Grid item md={1.2} sm={4} xs={12}>
                                        <Button fullWidth variant="text" type="button" onClick={()=>{ Nuevo() }} startIcon={<InsertDriveFileRoundedIcon />}>
                                            Nuevo
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
export default TipoRequerimiento;
