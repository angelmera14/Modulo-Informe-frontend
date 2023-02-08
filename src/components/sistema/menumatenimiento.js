import { Button, Grid, Fade } from "@mui/material";
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
// import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
// 
// import { SearchRounded } from "@mui/icons-material";


MenuMantenimiento.propTypes = {
    modo: PropTypes.bool.isRequired,
    nuevo: PropTypes.func.isRequired,
    grabar: PropTypes.func.isRequired,
    eliminar: PropTypes.func,
    volver: PropTypes.func,
    nomostrarvolver: PropTypes.bool,
    // solo para asignacion de precios
    mostraradd: PropTypes.bool,
    mostrareliminar: PropTypes.bool,
    agregar: PropTypes.func,
}


export function MenuMantenimiento(props) {
    // eslint-disable-next-line no-unused-vars
    const { modo, nuevo, grabar, volver, agregar, mostraradd, nomostrarvolver, mostrareliminar, eliminar } = props;
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
                                <Grid item md={1.2} sm={2} xs={6}>
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
                        {/* <Grid item md={1.2} sm={2} xs={6}>
                            <Button
                                fullWidth
                                variant="text"
                                onClick={() => nuevo()}
                                startIcon={modo ? <InsertDriveFileRoundedIcon /> : <AddCircleRoundedIcon />}
                            > Nuevo
                            </Button>
                        </Grid> */}
                        <Grid item md={1.2} sm={2} xs={6}>
                            <Button
                                fullWidth
                                onClick={() => grabar()}
                                variant="text"
                                startIcon={<SaveRoundedIcon />}
                            >
                                Grabar
                            </Button>
                        </Grid>
                        {mostrareliminar ?
                            <Grid item md={1.2} sm={2} xs={6}>
                                <Button fullWidth variant="text" onClick={() => eliminar()} startIcon={<DeleteRoundedIcon />}> Eliminar </Button>
                            </Grid> : ''
                        }
                        {
                            !nomostrarvolver ?
                                <Grid item md={1.2} sm={2} xs={6}>
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

                    </Grid>
                </Box>
            </Fade>
        </>
    )
}