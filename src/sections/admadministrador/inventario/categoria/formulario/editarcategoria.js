/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Button, Grid, TextField, Box, Card, Fade, Checkbox, FormControlLabel } from '@mui/material';
import axios from 'axios';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ArrowCircleLeftRoundedIcon from '@mui/icons-material/ArrowCircleLeftRounded';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import { useSnackbar } from 'notistack';
import CircularProgreso from '../../../../../components/Cargando';
import { MenuMantenimiento } from '../../../../../components/sistema/menumatenimiento';
// import ModalGenericoDelete from '../Componentes/ModalGenericoDelete';
import { PATH_DASHBOARD, PATH_OPSISTEMA } from '../../../../../routes/paths';
import { CORS, URLAPIGENERAL, usuario } from '../../../../../config';
import Page from '../../../../../components/Page';

export default function editarcategoria() {
  // eslint-disable-next-line camelcase
  const { token, codigo_Usuario } = JSON.parse(window.localStorage.getItem('usuario'));
  //  eslint-disable-next-line react-hooks/rules-of-hooks
  const locacion = useLocation();
  const { id } = locacion.state;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = React.useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navegacion = useNavigate();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { enqueueSnackbar } = useSnackbar();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [mostrarprogreso, setMostrarProgreso] = React.useState(false);

  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [formulario, setFormulario] = React.useState({
    codigo: '',
    nombre: '',
    estado: false,
  }); // Formulario trae datos anteriores

  const validation = () => {
    const nombre = formulario.nombre.length;

    if (nombre < 3) {
      messajeTool('error', 'El Nombre debe tener al menos 3 caracteres.');
      setError(true);
      return false;
    }

    if (nombre === '') {
      messajeTool('error', 'Debe asignar un nombre a la categoría.');
      setError(true);
      return false;
    }

    return true;
  };

  const actualizar = async () => {
    if (validation() === false) {
      return 0;
    }
    try {
      const estadovalor = formulario.estado === true ? 'A' : 'I';

      const Jsonenvio = {
        codigo: formulario.codigo.trim(),
        nombre: formulario.nombre.trim(),
        estado: estadovalor,
      };

      // realiza el envio actualizado

      const { data } = await axios.put(`${URLAPIGENERAL}/categorias`, Jsonenvio, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      messajeTool('success', 'Datos actualizados con exito!!!');
      navegacion(`/sistema/inventario/mcategoria`);
    } catch (error) {
      messajeTool('error', 'Error al actualizar el registro');
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function obtenerCategoria() {
      try {
        const res = await axios(`${URLAPIGENERAL}/categorias/buscar?codigo=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }, setMostrarProgreso(true));
        setFormulario({
          codigo: res.data[0].codigo.trim(),
          nombre: res.data[0].nombre.trim(),
          estado: res.data[0].estado === 'A',
        });
      } catch {
        if (error.response.status === 401) {
          navegacion(`/auth/login`);
          messajeTool('error', 'Su inicio de sesión expiro.');
        }
        if (error.response.status !== 401) {
          messajeTool('error', 'Error, al traer los datos del servidor.');
        }
      } finally {
        setMostrarProgreso(false);
      }
    }
    obtenerCategoria();
  }, [id]);

  const Nuevo = () => {
    navegacion(`/sistema/inventario/nuevacategoria`);
  };

  const Volver = () => {
    navegacion(`/sistema/inventario/mcategoria`);
  };

  return (
    <>
      <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      />
      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Page title="Editar Categoría">
          <MenuMantenimiento modo={false} nuevo={() => Nuevo()} volver={() => Volver()} grabar={() => actualizar()} />

          <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
            <h1>Editar Categoría</h1>
          </Box>
          <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={2}>
                <Grid item container spacing={1} md={6}>
                  <Grid item sm={4} xs={12} md={4}>
                    <TextField
                      fullWidth
                      disabled
                      required
                      label="Código"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          codigo: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.codigo}
                    />
                  </Grid>
                  <Grid item sm={8} xs={12} md={8}>
                    <TextField
                      fullWidth
                      error={error}
                      label="Nombre"
                      required
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          nombre: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.nombre}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                <Grid item md={7}>
                  <Grid>
                    <FormControlLabel
                      onChange={(e) => {
                        setFormulario({ ...formulario, estado: e.target.checked });
                      }}
                      control={<Checkbox checked={formulario.estado} />}
                      label="Activo."
                      name="estado"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Page>
      </Fade>
    </>
  );
}
