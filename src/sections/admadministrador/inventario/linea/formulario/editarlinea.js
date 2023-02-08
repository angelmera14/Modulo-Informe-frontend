/* eslint-disable no-unused-vars */
import * as React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Button,
  Grid,
  TextField,
  Box,
  Card,
  Fade,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';
import axios from 'axios';
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'notistack';
import CircularProgreso from '../../../../../components/Cargando';
import { MenuMantenimiento } from '../../../../../components/sistema/menumatenimiento';
import ModalGenerico from '../Componentes/ModalGenerico';
import { PATH_DASHBOARD, PATH_OPSISTEMA } from '../../../../../routes/paths';
import { CORS, URLAPIGENERAL, usuario } from '../../../../../config';
import Page from '../../../../../components/Page';

export default function editarmarca() {
  // eslint-disable-next-line camelcase
  const { token, codigo_Usuario } = JSON.parse(window.localStorage.getItem('usuario'));
  // eslint-disable-next-line react-hooks/rules-of-hooks
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
    categoria: '',
    nombre_categoria: '',
    familia: '',
    nombre_familia: '',
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
      messajeTool('error', 'Debe asignar un nombre a la familia.');
      setError(true);
      return false;
    }

    return true;
  };

  // eslint-disable-next-line consistent-return
  const actualizar = async () => {
    if (validation() === false) {
      return 0;
    }
    try {
      const estadovalor = formulario.estado === true ? 'A' : 'I';

      const Jsonenvio = {
        codigo: formulario.codigo,
        categoria: formulario.categoria,

        familia: formulario.familia,

        nombre: formulario.nombre,
        estado: estadovalor,
      };

      const { data } = await axios.put(`${URLAPIGENERAL}/linea`, Jsonenvio, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      messajeTool('success', 'Datos actualizados con exito!!!');
      navegacion(`/sistema/inventario/mlinea`);
    } catch (error) {
      messajeTool('error', 'Error al actualizar el registro');
    }
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function obtenerCategoria() {
      try {
        const res = await axios(`${URLAPIGENERAL}/linea/buscar?codigo=${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },setMostrarProgreso(true));
        setFormulario({
          codigo: res.data[0].codigo.trim(),
          categoria: res.data[0].categoria.trim(),
          nombre_categoria: res.data[0].nombre_categoria.trim(),
          familia: res.data[0].familia.trim(),
          nombre_familia: res.data[0].nombre_familia.trim(),
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
    navegacion(`/sistema/inventario/nuevalinea`);
  };

  const Volver = () => {
    navegacion(`/sistema/inventario/mlinea`);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [cateProv, setCateProv] = React.useState({});
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tiposBusquedas, setTiposBusqueda] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [rowsParaModal, setRowsparaModal] = React.useState();
  // PROVINCIA
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openModalnivel1, setOpenModalnivel1] = React.useState(false);
  const toggleShownivel1 = () => setOpenModalnivel1((p) => !p);
  const handleCallbackChildnivel1 = (e) => {
    const item = e.row;
    setFormulario({ ...formulario, categoria: item.codigo, nombre_categoria: item.nombre });
    toggleShownivel1();
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getDatos() {
      const response = await axios(`${URLAPIGENERAL}/categorias/listar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataRes = response.data;
      const cateprov = dataRes.map((el) => ({
        codigo: el.codigo,
        nombre: el.nombre,
        estado: el.estado,
      }));
      setCateProv(cateprov);
      setRowsparaModal(cateprov);
    }
    getDatos();
  }, []);

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [Listfamily, setFAMILIA] = React.useState({});
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tiposBusquedasfamilia, setTiposBusquedafamilia] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openModalfamilia, setOpenModalfamilia] = React.useState(false);

  const toggleShowfamilia = () => setOpenModalfamilia((p) => !p);

  const handleCallbackChildfamilia = (e) => {
    const item = e.row;
    setFormulario({ ...formulario, familia: item.codigo, nombre_familia: item.nombre });
    toggleShowfamilia();
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getfamilia() {
      const res = await axios(`${URLAPIGENERAL}/familia/listar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const Res = res.data;
      const ListFamily = Res.map((el) => ({
        codigo: el.codigo,
        nombre: el.nombre,
        estado: el.estado,
      }));
      setFAMILIA(ListFamily);
    }
    getfamilia();
  }, []);

  return (
    <>
      <CircularProgreso
        open={mostrarprogreso}
        handleClose1={() => {
          setMostrarProgreso(false);
        }}
      />
      <ModalGenerico
        nombre="Categorías"
        openModal={openModalnivel1}
        busquedaTipo={tiposBusquedas}
        toggleShow={toggleShownivel1}
        rowsData={cateProv}
        parentCallback={handleCallbackChildnivel1}
      />

      <ModalGenerico
        nombre="Familia"
        openModal={openModalfamilia}
        busquedaTipo={tiposBusquedasfamilia}
        toggleShow={toggleShowfamilia}
        rowsData={Listfamily}
        parentCallback={handleCallbackChildfamilia}
      />

      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Page title="Editar Línea">
          <MenuMantenimiento modo={false} nuevo={() => Nuevo()} volver={() => Volver()} grabar={() => actualizar()} />

          <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
            <h1>Editar Línea</h1>
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

                  <Grid item sm={4} xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="Categoría"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          categoria: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.categoria}
                      onClick={() => {
                        setOpenModalnivel1(true);
                      }}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton aria-label="SearchIcon">
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={8} md={8}>
                    <TextField
                      fullWidth
                      name="nombre_categoria"
                      label="Nombre de la Categoría"
                      id="outlined-size-small"
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          nombre_categoria: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.nombre_categoria}
                    />
                  </Grid>
                  <Grid item sm={4} xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      label="Familia"
                      id="outlined-size-small"
                      size="small"
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          familia: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.familia}
                      onClick={() => {
                        setOpenModalfamilia(true);
                      }}
                      InputProps={{
                        readOnly: true,
                        endAdornment: (
                          <InputAdornment position="start">
                            <IconButton aria-label="SearchIcon">
                              <SearchIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={8} md={8}>
                    <TextField
                      fullWidth
                      name="nombre_familia"
                      label="Nombre de la Familia"
                      id="outlined-size-small"
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                      onChange={(e) => {
                        setFormulario({
                          ...formulario,
                          nombre_familia: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={formulario.nombre_familia}
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
