import { memo } from "react";
// import PropTypes from 'prop-types';
import {
    // Box,
    // TextField,
    // Grid,
    // Fade,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    CardHeader,
    Typography,
    Avatar,
    Button
} from '@mui/material';

import imgticket from '../../../../assets/images/sistema/ticket.jpg';


const CardTicket = (props) => {
    // eslint-disable-next-line react/prop-types
    const { data } = props;
    return (
        <Card sx={{ p: 3 }}>
            <CardHeader
                avatar={
                    <Avatar aria-label="recipe">
                        {/* eslint-disable-next-line react/prop-types */}
                        {data.idticket}
                    </Avatar>
                }
                
                // eslint-disable-next-line react/prop-types
                title={data.nombreEmpresa}
                // eslint-disable-next-line react/prop-types
                subheader={data.creado}
            />
            <CardActionArea>
                <CardMedia
                    // className={classes.media}
                    image={imgticket}
                    // eslint-disable-next-line react/prop-types
                    title={data.nombreContacto}
                />
                <CardContent>
                    <Typography gutterBottom variant="h6" component="h2">
                        {/* eslint-disable-next-line react/prop-types */}
                        {data.nombreContacto}
                    </Typography>
                   {/* eslint-disable-next-line react/prop-types */}
                    {data.tipo}

                    <Typography
                        variant="body2"
                        color="textSecondary"
                        component="p"

                    >
                        {/* eslint-disable-next-line react/prop-types */}
                        {data.descripcion.substring(0, 220)}
                    </Typography>

                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button size="small" color="primary" variant="contained">
                    Detalles
                </Button>
                {/* <IconButton color="primary" aria-label="Guardar" className={classes.saveButon}>
                                    <CloseIcon />
                                </IconButton> */}
            </CardActions>
        </Card>
    )
}



export default memo(CardTicket);