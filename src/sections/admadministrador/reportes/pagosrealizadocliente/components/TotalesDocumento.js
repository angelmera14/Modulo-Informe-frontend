import { useState, useContext } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Chip,    
    TextField
} from '@mui/material';

import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';



export default function TotalesDocumento(props) {

    const {chq, efe, tra, dep, tdc, neto} = props;
    return (
        <Grid item md={6}>
            <Card elevation={1} sx={{ ml: 3, mr: 3, mb: 1, p: 1, mt: 1 }}>
                <Grid container>
                    <Grid item md={4} sm={6} xs={6} >
                        <Card variant="outlined">
                            <CardContent sx={{ p: 0, m: 0 }}>
                                <Grid container justifyContent="flex-end">
                                    <Grid item md={10}>
                                        <Chip
                                            label="Efectivo"
                                            color='info'
                                        />
                                    </Grid>
                                    <Grid item md={2} fontSize='1rem'>
                                        <MonetizationOnOutlinedIcon />
                                    </Grid>
                                    <Grid item md={8} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            value={efe}
                                            name="Nombre"
                                            variant="standard"
                                            
                                        // value={buscar}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={6} xs={6}  >
                        <Card variant="outlined">
                            <CardContent sx={{ p: 0, m: 0 }}>
                                <Grid container justifyContent="flex-end">
                                    <Grid item md={10}>
                                        <Chip
                                            label="Cheque"
                                            color='info'
                                        />
                                    </Grid>
                                    <Grid item md={2} fontSize='1rem'>
                                        <MonetizationOnOutlinedIcon />
                                    </Grid>
                                    <Grid item md={8} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            value={chq}
                                            name="Nombre"
                                            variant="standard"
                                        // value={buscar}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={6} xs={6}  >
                        <Card variant="outlined">
                            <CardContent sx={{ p: 0, m: 0 }}>
                                <Grid container justifyContent="flex-end">
                                    <Grid item md={10}>
                                        <Chip
                                            label="Transferencia"
                                            color='info'
                                        />
                                    </Grid>
                                    <Grid item md={2} fontSize='1rem'>
                                        <MonetizationOnOutlinedIcon />
                                    </Grid>
                                    <Grid item md={8} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            value={tra}
                                            name="Nombre"
                                            variant="standard"                                            
                                        // value={buscar}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={6} xs={6}  >
                        <Card variant="outlined">
                            <CardContent sx={{ p: 0, m: 0 }}>
                                <Grid container justifyContent="flex-end">
                                    <Grid item md={10}>
                                        <Chip
                                            label="Tarjeta Crédito"
                                            color='info'
                                        />
                                    </Grid>
                                    <Grid item md={2} fontSize='1rem'>
                                        <MonetizationOnOutlinedIcon />
                                    </Grid>
                                    <Grid item md={8} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            value={tdc}
                                            name="dec0"
                                            variant="standard"
                                        // value={buscar}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={6} xs={6}  >
                        <Card variant="outlined">
                            <CardContent sx={{ p: 0, m: 0 }}>
                                <Grid container justifyContent="flex-end">
                                    <Grid item md={10}>
                                        <Chip
                                            label="Depositos"
                                            color='warning'
                                        />
                                    </Grid>
                                    <Grid item md={2} fontSize='1rem'>
                                        <MonetizationOnOutlinedIcon />
                                    </Grid>
                                    <Grid item md={8} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            value={dep}
                                            name="iva"
                                            variant="standard"
                                           
                                        // value={buscar}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={4} sm={6} xs={6} >
                        <Card variant="outlined">
                            <CardContent sx={{ p: 0, m: 0 }}>
                                <Grid container justifyContent="flex-end">
                                    <Grid item md={10}>
                                        <Chip
                                            label="NETO"
                                            color='error'
                                        />
                                    </Grid>
                                    <Grid item md={2} fontSize='1rem'>
                                        <MonetizationOnOutlinedIcon />
                                    </Grid>
                                    <Grid item md={10} sm={12} xs={12}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            type="number"
                                            value={neto}
                                            name="Nombre"
                                            variant="standard"                                           
                                        // value={buscar}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )

}



