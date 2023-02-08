import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Fade, Grid, Typography } from '@mui/material';
import Page from '../../../components/Page';
import { estilobox } from '../../../utils/csssistema/estilos';
import CardTicket from './componentes/tarjeta';
import { URLAPIGENERAL } from '../../../config';
import imgticket from '../../../assets/images/sistema/noticket.png';

function Inicio() {
    const [listTicket, setListTicket] = useState([]);
    useEffect(() => {
        async function getTickets() {
            const urlFinal = `${URLAPIGENERAL}/listarticketpendientes`;
            axios.get(urlFinal).then(res => {
                const dataC = res.data;
                const newListTicket = dataC.data.filter(item => item.operador !== 0);
                // console.log(dataC)
                // const newListTicket = dataC.data
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
                            nombreEmpresa,
                            tipo,
                            nombreContacto,
                            descripcion,
                            estado,
                            creado,
                            operador
                        })
                    )
                );
            });
        }
        getTickets();
    }, []);
    console.log(listTicket);
    return (
        <>
            <Page title="Ticket">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={estilobox} >
                        <Grid container spacing={1} >
                            {listTicket.length > 0 ?

                                listTicket.map(m => (
                                    <Grid key={m.idticket} item md={4} sm={6} xs={12} >
                                        <CardTicket data={m} />
                                    </Grid>
                                )) : (
                                    <>
                                        <Grid item container spacing={1} alignContent="center" justifyContent="center" textAlign="center">
                                            <Grid item xs={12}>
                                                <div style={{ display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                                    <img alt='ticket'  src={imgticket} />
                                                </div>
                                            </Grid>
                                            <Grid item xs={12} >
                                                <Typography variant='h3'>No existen tickets en proceso</Typography>
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
    )
}

export default Inicio;