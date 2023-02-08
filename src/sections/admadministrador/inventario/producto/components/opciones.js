import { Button, Grid, Fade } from "@mui/material";
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
// import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
// import { SearchRounded } from "@mui/icons-material";


MenuMantenimiento.propTypes = {
    modo: PropTypes.bool,
    nuevo: PropTypes.func.isRequired,
    grabar: PropTypes.func.isRequired,
    volver: PropTypes.func,
    imprimir: PropTypes.func,
    // para vistas de una sola página
    nomostrarvolver: PropTypes.bool,
    nomostrarimprimir: PropTypes.bool,
    // solo para asignacion de precios
    mostraradd: PropTypes.bool,
    agregar: PropTypes.func,
}


export function MenuMantenimiento(props) {
    const { modo, nuevo, grabar, volver, agregar, mostraradd, nomostrarvolver, imprimir, nomostrarimprimir } = props;
    return (
        <>
            <Fade
                in
                style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <Box sx={{ ml: 3, mr: 3, p: 1 }}  >
                    <Grid container spacing={1} justifyContent="flex-end">
                        {
                            mostraradd ?
                                <Grid item md={1.2} sm={2} xs={3}>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        onClick={() => agregar()}
                                        startIcon={<AddCircleRoundedIcon />}
                                    >
                                        Añadir
                                    </Button>
                                </Grid> : ''
                        }
                        <Grid item md={1.2} sm={2} xs={3}>
                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => nuevo()}
                                startIcon={modo ? <InsertDriveFileRoundedIcon /> : <AddCircleRoundedIcon />}
                            > Nuevo
                            </Button>
                        </Grid>
                        <Grid item md={1.2} sm={2} xs={3}>
                            <Button
                                fullWidth
                                onClick={() => grabar()}
                                variant="text"
                                startIcon={<SaveRoundedIcon />}
                            >
                                Grabar
                            </Button>
                        </Grid>
                        {/* <Grid item md={2} sm={2} xs={6}>
                            <Button fullWidth variant="contained" startIcon={<DeleteRoundedIcon />}> Eliminar </Button>
                        </Grid> */}
                        {
                            !nomostrarvolver ?
                                <Grid item md={1.2} sm={2} xs={3}>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        onClick={() => volver()}
                                        startIcon={<ArrowCircleLeftRoundedIcon />}
                                    >
                                        Volver
                                    </Button>
                                </Grid>
                                : ''
                        }
                        {   
                            !nomostrarimprimir ?
                            <Grid item md={1.2} sm={2} xs={3}>
                                <Button
                                    fullWidth
                                    onClick={() => imprimir()}
                                    variant="text"
                                    startIcon={<LocalPrintshopRoundedIcon />}
                                >
                                    Imprimir
                                </Button>
                            </Grid>
                            : ''
                        }


                    </Grid>
                </Box>
            </Fade>
        </>
    )
}