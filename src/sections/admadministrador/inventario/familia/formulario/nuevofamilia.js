import * as React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
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
import SearchIcon from '@mui/icons-material/Search';
import { useSnackbar } from 'notistack';
import { MenuMantenimiento } from '../../../../../components/sistema/menumatenimiento';
import ModalGenerico from '../Componentes/ModalGenerico';
import { PATH_OPSISTEMA } from '../../../../../routes/paths';
import { URLAPIGENERAL, usuario } from '../../../../../config';
import Page from '../../../../../components/Page';

export default function categoría() {
  // eslint-disable-next-line camelcase
  const { token, codigo_Usuario } = JSON.parse(window.localStorage.getItem('usuario'));
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const navegacion = useNavigate();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { id } = useParams();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { enqueueSnackbar } = useSnackbar();

  // MENSAJE GENERICO
  const messajeTool = (variant, msg) => {
    enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [dataNuevo, setnuevo] = React.useState({
    codigo: '',
    categoria: '',
    nombre_categoria: '',
    nombre: '',
    estado: false,
  });

  const limpiar = () => {
    setnuevo({
      codigo: dataNuevo.codigo,
      categoria: '',
      nombre_categoria: '',
      nombre: '',
      estado: false,
    });
    setError(false);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = React.useState(false);

  const validation = () => {
    const nombre = dataNuevo.nombre.length;
    const categoria = dataNuevo.categoria.trim();

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

    if (categoria === '') {
      messajeTool('error', 'Debe asignar una categoría.');
      setError(true);
      return false;
    }

    return true;
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [numerosecuencial, setNumeroSecuencial] = React.useState(0);

  const Grabar = async () => {
    if (validation() === false) {
      return 0;
    }

    const estadovalor = dataNuevo.estado === true ? 'A' : 'I';

    const Json = {
      codigo: dataNuevo.codigo.trim(),
      categoria: dataNuevo.categoria.trim(),
      nombre: dataNuevo.nombre.trim(),
      estado: estadovalor,
    };

    try {
      const { data } = await axios.post(`${URLAPIGENERAL}/familia`, Json, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data === 200) {
        navegacion(`/sistema/inventario/mfamilia`);
        messajeTool('success', 'Grabado con exito!!');
      }
    } catch (error) {
      if (error.response.status === 401) {
        navegacion(`/auth/login`);
        messajeTool('error', 'Su inicio de sesión expiro.');
      }
      if (error.response.status !== 401) {
        messajeTool('error', 'Error al Grabar en el servidor');
      }
    }
  };

  const generarCodigo = (letra, num) => {
    const ceros = '00000';
    const nums = num.toString();
    const cero1 = ceros.split('');
    // eslint-disable-next-line no-plusplus
    for (let step = 0; step < nums.length; step++) {
      cero1.pop();
    }
    const cero2 = cero1.join('');
    return `${letra}${cero2}${num}`;
  };

  async function contarDatos() {
    const letra = await axios(`${URLAPIGENERAL}/inicales/listar?opcion=ADMFAMILIA`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const letraa = letra.data[0].inicial;
    const numbsecuencial = letra.data[0].numero + 1;
    setNumeroSecuencial(numbsecuencial);
    const codigo = generarCodigo(letraa.trim(), numbsecuencial);

    setnuevo({
      ...dataNuevo,
      codigo,
    });
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    contarDatos();
  }, []);

  const Volver = () => {
    navegacion(`/sistema/inventario/mfamilia`);
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
    setnuevo({ ...dataNuevo, categoria: item.codigo, nombre_categoria: item.nombre });
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


  return (
    <>
      <ModalGenerico
        nombre="Categoría"
        openModal={openModalnivel1}
        busquedaTipo={tiposBusquedas}
        toggleShow={toggleShownivel1}
        rowsData={cateProv}
        parentCallback={handleCallbackChildnivel1}
      />


      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Page title="Nueva Familia">
          <MenuMantenimiento modo nuevo={() => limpiar()} grabar={() => Grabar()} volver={() => Volver()} />
          <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
            <h1>Nueva Familia</h1>
          </Box>
          <Card sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={2} justifyContent="flex-start" style={{ fontWeight: '400px' }}>
                <Grid item container spacing={1} md={6}>
                  <Grid item sm={4} xs={12} md={4}>
                    <TextField
                      fullWidth
                      required
                      name="codigo"
                      // InputProps={{
                      //   readOnly: true,
                      // }}
                      disabled
                      label="Código"
                      onChange={(e) => {
                        setnuevo({
                          ...dataNuevo,
                          codigo: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataNuevo.codigo}
                      id="outlined-size-small"
                      size="small"
                    />
                  </Grid>

                  <Grid item sm={8} xs={12} md={8}>
                    <TextField
                      error={error}
                      fullWidth
                      required
                      label="Nombre"
                      onChange={(e) => {
                        setnuevo({
                          ...dataNuevo,
                          nombre: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataNuevo.nombre}
                      id="outlined-size-small"
                      size="small"
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
                        setnuevo({
                          ...dataNuevo,
                          categoria: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataNuevo.categoria}
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
                      name="Nombrenivel2"
                      label="Nombre de la Categoría"
                      id="outlined-size-small"
                      size="small"
                      InputProps={{
                        readOnly: true,
                      }}
                      onChange={(e) => {
                        setnuevo({
                          ...dataNuevo,
                          nombre_categoria: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataNuevo.nombre_categoria}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container direction="row" justifyContent="flex-end" alignItems="center">
                <Grid item md={7}>
                  <Grid>
                    <FormControlLabel
                      onChange={(e) => {
                        setnuevo({ ...dataNuevo, estado: e.target.checked });
                      }}
                      control={<Checkbox checked={dataNuevo.estado} />}
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
