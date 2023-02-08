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
    familia: '',
    nombre_familia: '',
    nombre: '',
    estado: false,
  });

  const limpiar = () => {
    setnuevo({
      codigo: dataNuevo.codigo,
      categoria: '',
      nombre_categoria: '',
      familia: '',
      nombre_familia: '',
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
    const familia = dataNuevo.familia.trim();

    if (nombre < 3) {
      messajeTool('error', 'El Nombre debe tener al menos 3 caracteres.');
      setError(true);
      return false;
    }

    if (nombre === '') {
      messajeTool('error', 'Debe asignar un nombre de la marca.');
      setError(true);
      return false;
    }

    if (categoria === '') {
      messajeTool('error', 'Debe asignar una categoría.');
      setError(true);
      return false;
    }

    if (familia === '') {
      messajeTool('error', 'Debe asignar una familia.');
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
      familia: dataNuevo.familia.trim(),
      nombre: dataNuevo.nombre,
      estado: estadovalor,
    };

    try {
      const { data } = await axios.post(`${URLAPIGENERAL}/linea`, Json, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data === 200) {
        navegacion(`/sistema/inventario/mlinea`);
        messajeTool('success', 'Grabado con exito!!');
      }
    } catch (error) {
      messajeTool('error', 'Error al Grabar en el servidor');
      if (error.response.status === 401) {
        navegacion(`/auth/login`);
        messajeTool('error', 'Su inicio de sesión expiro.');
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
    const { token } = JSON.parse(window.localStorage.getItem('usuario'));
    const letra = await axios(`${URLAPIGENERAL}/inicales/listar?opcion=ADMLINEA`, {
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
    navegacion(`/sistema/inventario/mlinea`);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [ListCategoria, setCateProv] = React.useState({});
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [tiposBusquedas, setTiposBusqueda] = React.useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [openModalcategoria, setOpenModalcategoria] = React.useState(false);

  const toggleShowcategoria = () => setOpenModalcategoria((p) => !p);

  const handleCallbackChildcategoria = (e) => {
    const item = e.row;
    setnuevo({ ...dataNuevo, categoria: item.codigo, nombre_categoria: item.nombre });
    toggleShowcategoria();
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  React.useEffect(() => {
    async function getcategoria() {
      const response = await axios(`${URLAPIGENERAL}/categorias/listar`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const dataRes = response.data;
      const ListCategoria = dataRes.map((el) => ({
        codigo: el.codigo,
        nombre: el.nombre,
        estado: el.estado,
      }));
      setCateProv(ListCategoria);
    }
    getcategoria();
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
    setnuevo({ ...dataNuevo, familia: item.codigo, nombre_familia: item.nombre });
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
        // nombre_categoria: el.nombre_categoria,
      }));
      setFAMILIA(ListFamily);
      console.log(ListFamily);
    }
    getfamilia();
  }, []);

  return (
    <>
      <ModalGenerico
        nombre="Categoría"
        openModal={openModalcategoria}
        busquedaTipo={tiposBusquedas}
        toggleShow={toggleShowcategoria}
        rowsData={ListCategoria}
        parentCallback={handleCallbackChildcategoria}
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
        <Page title="Nueva Línea">
          <MenuMantenimiento modo nuevo={() => limpiar()} grabar={() => Grabar()} volver={() => Volver()} />
          <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
            <h1>Nueva Línea</h1>
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
                        setOpenModalcategoria(true);
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
                        setnuevo({
                          ...dataNuevo,
                          nombre_categoria: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataNuevo.nombre_categoria}
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
                        setnuevo({
                          ...dataNuevo,
                          familia: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataNuevo.familia}
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
                        setnuevo({
                          ...dataNuevo,
                          nombre_familia: e.target.value.toLocaleUpperCase(),
                        });
                      }}
                      value={dataNuevo.nombre_familia}
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
