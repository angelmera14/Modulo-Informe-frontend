import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { TextField, Grid, IconButton, InputAdornment } from '@mui/material';
import SearchRounded from '@mui/icons-material/SearchRounded';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';
import ModalGenerico from "../../../../../components/modalgenerico";
import { PATH_AUTH, PATH_PAGE } from "../../../../../routes/paths";

CajaGenerica.propTypes = {
    nombremodal: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    disparador: PropTypes.func.isRequired,
    estadoinicial: PropTypes.object.isRequired,
    descativarbusqueda: PropTypes.bool,
    desactivar: PropTypes.bool,

}

function CajaGenerica(props) {
    const { nombremodal, url, disparador, estadoinicial, descativarbusqueda, desactivar, error } = props;
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    const { token } = JSON.parse(window.localStorage.getItem("usuario"));
    const navegacion = useNavigate();
    const [formulario, setFormulario] = React.useState(estadoinicial)
    const { enqueueSnackbar } = useSnackbar();
    // eslint-disable-next-line no-unused-vars
    const [tiposBusquedas, setTiposBusqueda] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }, { tipo: 'estado' }]);
    const [openModal, setOpenModal] = React.useState(false);
    const toggleShow = () => setOpenModal(p => !p);
    const handleCallbackChild = (e) => {
        const item = e.row;
        setFormulario({
            codigo: item.codigo,
            nombre: item.nombre,
            estado: item.estado
        })
        disparador(e.row);
        toggleShow();
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
    const [listar, setListar] = React.useState([]);

    React.useEffect(() => {
        const obtener = async () => {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            try {

                if(String(nombremodal).toLocaleLowerCase() !== ' '){
                    const { data } = await axios(`${url}`, config,{
                        
                    }, setMostrarProgreso(true))
                    const datos = data.map(c => ({
                        codigo: c.codigo,
                        nombre: c.nombre,
                        estado: c.estado
                    }))
                    setListar(datos);
                }
                else {
                    const { data } = await axios(`${url}`, {
                        
                    }, setMostrarProgreso(true))
                    setListar(data);
                }

                setFormulario(estadoinicial)

            } catch(error) {
                setFormulario(estadoinicial)
                setListar([]);
                // eslint-disable-next-line react/prop-types
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                }
                // mensajeSistema("Problemas con la Conexion al servidor", "error");
            } finally {
                setMostrarProgreso(false);
            }

        }
        obtener();
        // tenia estadoinicial,url
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [url, estadoinicial])
    return (
        <>
            {/* <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} /> */}
            {/* MODAL DE PROVINCIA */}
            <ModalGenerico
                nombre={nombremodal}
                openModal={openModal}
                busquedaTipo={tiposBusquedas}
                toggleShow={toggleShow}
                rowsData={listar}
                parentCallback={handleCallbackChild}
            />
            <Grid container item xs={12} spacing={1}>
                <Grid item md={4} sm={4} xs={12}>
                    <TextField
                        error={error}
                        disabled={desactivar}
                        label={nombremodal}
                        fullWidth
                        size="small"
                        value={formulario.codigo}
                        onChange={(e) => {
                            setFormulario({
                                ...formulario,
                                codigo: e.target.value
                            })
                        }}
                        InputProps={{
                            readOnly: true,
                            endAdornment: (
                                <InputAdornment position="end">
                                    {
                                        !descativarbusqueda ?
                                            <IconButton size="small" onClick={() => { setOpenModal(true) }}>
                                                <SearchRounded />
                                            </IconButton> : ''
                                    }
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>
                <Grid item md={8} sm={8} xs={12}>
                    <TextField
                        error={error}
                        disabled={desactivar}
                        label={`Nombre de ${nombremodal}`}
                        fullWidth size="small"
                        value={formulario.nombre}
                        onChange={(e) => {
                            setFormulario({
                                ...formulario,
                                nombre: e.target.value
                            })
                        }}
                        InputProps={{
                            readOnly: true
                        }}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default React.memo(CajaGenerica);
