import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Fade,
    Grid,
    Typography,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    CardHeader,
    Avatar,
    Button,
    IconButton
} from '@mui/material';
import { SaveRounded } from '@mui/icons-material';
import Page from '../../../components/Page';
import { estilobox } from '../../../utils/csssistema/estilos';
import { URLAPIGENERAL } from '../../../config';
import imgticket from '../../../assets/images/sistema/noticket.png';
import SimpleDialog from './componentes/dialogo';
// servicios
import { obtenerTicketsPendientes } from '../../../services/api/ticketService';
// Mensaje
import useMensaje from '../../../hooks/admsoporte/useMensaje';
// errores
import ErrorHttpSistema from '../../../components/admsoporte/ErrorSistema';

function Asignacion() {
    const { mensajeSistema } = useMensaje();
    const [ticketpendientes, setTicketsPendientes] = useState([]);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState({
        estado: false,
        tipo: null
    });
    const [ticketActual, setTicket] = useState(0); // Setear el Ticket a manipular
    // eslint-disable-next-line no-unused-vars
    const [selectedValue, setSelectedValue] = useState([
        {
            email: '...',
            idOperador: 1,
            ticketNumber: 0
        }
    ]);
    const [listTicket, setListTicket] = useState([]);

    const hadleDoubleFuctions = function fun(props) {
        setTicket(props);
        setOpen(true);
    };

    const handleClose = (value, id, ticket) => {
        setOpen(false);
        const newListTicket = listTicket.map(item => {
            if (item.idticket === ticket) {
                const ticketUpdate = {
                    ...item,
                    operador: id,
                    opeNombre: value
                };
                return ticketUpdate;
            }
            return item;
        });
        setListTicket(newListTicket);
    };

    const handleSave = function fun(tk, ope) {
        if (ope === 0) {
            mensajeSistema(`Debe asignar un Operador al ticket ${tk}`, 'error');
        } else {
            const urlupdate = `${URLAPIGENERAL}/actualizaticket`;
            const dataForm = {
                idticket: tk,
                idoperador: ope,
                estado: 0,
                idempresa: null,
                contacto: 1,
                solucion: null
            };

            try {
                axios({
                    url: urlupdate,
                    method: 'POST',
                    data: { dataticket: dataForm }
                }).then(
                    response => {
                        const dataResponse = response.data;
                        const statust = dataResponse.status;
                        if (statust === true) {
                            const newListTicket = listTicket.filter(item => item.idticket !== tk);
                            setListTicket(newListTicket);
                            mensajeSistema(`Asignacion Exitosa del Ticket ${tk}`, 'success');

                        }
                    },
                    // eslint-disable-next-line no-unused-vars
                    error => {
                        mensajeSistema(`Problemas al asignar operador al ticket ${tk}`, 'error');

                    }
                );
            } catch (err) {
                console.log(err);
            }
        }
    };

    useEffect(() => {
        Promise.all([
            obtenerTicketsPendientes()
        ]).then((respuesta) => {

            console.log("mira", respuesta[0].data);
            const newListTicket = respuesta[0].data.filter(item => item.operador === 0);
            console.log(newListTicket)
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
                        nombre_empresa: nombreEmpresa,
                        tipo,
                        nombreContacto,
                        descripcion,
                        estado,
                        creado,
                        operador
                    })
                )
            )
        }).catch(error => setError({ estado: true, tipo: error.response.status }))
        
    }, []);

    return (
        <>
            {error.estado ? <ErrorHttpSistema error={error.tipo} /> : ''}
            <SimpleDialog
                selectedValue={selectedValue.idOperador}
                ticketusando={ticketActual}
                open={open}
                onClose={handleClose}
            />
            <Page title="Asignacion">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={estilobox} >
                        <Grid container spacing={1}>
                            {
                                listTicket.length > 0 ?
                                    listTicket.map(tk => (
                                        <Grid key={tk.idticket} item md={4} sm={6} xs={12} >
                                            <Card key={tk.idticket} sx={{ p: 1 }}>
                                                <CardHeader
                                                    avatar={
                                                        <Avatar aria-label="recipe">
                                                            {tk.idticket}
                                                        </Avatar>
                                                    }
                                                    title={tk.nombre_empresa}
                                                    subheader={tk.creado}
                                                />
                                                <CardActionArea>
                                                    <CardMedia
                                                        heigth={100}
                                                        image={imgticket}
                                                        title={tk.nombreContacto}
                                                    />
                                                    <CardContent>
                                                        <Typography gutterBottom variant="h6" component="h2">
                                                            {tk.nombreContacto}
                                                        </Typography>
                                                        {tk.tipo}
                                                        <div>
                                                            <Typography variant="subtitle2"> Operador: {tk.opeNombre} </Typography>
                                                        </div>


                                                        <Typography
                                                            variant="body2"
                                                            color="textSecondary"
                                                            component="p"

                                                        >
                                                            {tk.descripcion.substring(0, 220)}
                                                        </Typography>

                                                    </CardContent>
                                                </CardActionArea>
                                                <CardActions>
                                                    <Button
                                                        size="small"
                                                        color="primary"
                                                        variant="contained"
                                                        onClick={() => hadleDoubleFuctions(tk.idticket)}
                                                    >
                                                        Asignar
                                                    </Button>
                                                    <IconButton
                                                        color="primary"
                                                        aria-label="Guardar"
                                                        onClick={() => handleSave(tk.idticket, tk.operador)}
                                                    >
                                                        <SaveRounded />
                                                    </IconButton>
                                                </CardActions>
                                            </Card>
                                        </Grid>
                                    )) : (
                                        <>
                                            <Grid item container spacing={1} alignContent="center" justifyContent="center" textAlign="center">
                                                <Grid item xs={12}>
                                                    <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                        <img alt='ticket' src={imgticket} />
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} >
                                                    <Typography variant='h3'>No existen tickets por asignar</Typography>
                                                </Grid>
                                            </Grid>

                                        </>
                                    )
                            }
                        </Grid>
                    </Box>

                </Fade>

            </Page>
        </>
    );
}
export default Asignacion;
