import * as React from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Grid, TextField, Box, Card, Fade, Checkbox, FormControlLabel } from '@mui/material';
import { useSnackbar } from 'notistack';
import { MenuMantenimiento } from '../../../../../components/sistema/menumatenimiento';
import { PATH_OPSISTEMA } from '../../../../../routes/paths';
import { URLAPIGENERAL, usuario } from '../../../../../config';
import Page from '../../../../../components/Page';

export default function nuevacategoría() {
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
    nombre: '',
    estado: false,
  });

  const limpiar = () => {
    setnuevo({
      codigo: dataNuevo.codigo,
      nombre: '',
      estado: false,
    });
    setError(false);
  };

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [error, setError] = React.useState(false);

  const validation = () => {
    const nombre = dataNuevo.nombre.length;

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
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [numerosecuencial, setNumeroSecuencial] = React.useState(0);

  const Grabar = async () => {
    if (validation() === false) {
      return 0;
    }

    const estadovalor = dataNuevo.estado === true ? 'A' : 'I';

    const Json = {
      codigo: dataNuevo.codigo.trim(),
      nombre: dataNuevo.nombre.trim(),
      estado: estadovalor,
    };

    try {
      const { data } = await axios.post(`${URLAPIGENERAL}/categorias`, Json, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data === 200) {
        navegacion(`/sistema/inventario/mcategoria`);
        messajeTool('success', 'Grabado con exito!!');
      }
    } catch (error) {
      messajeTool('error', 'Error al Grabar en el servidor');
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
    const letra = await axios(`${URLAPIGENERAL}/inicales/listar?opcion=ADMCATEGORIA`, {
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
    navegacion(`/sistema/inventario/mcategoria`);
  };

  return (
    <>
      <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
        <Page title="Nueva Categoría">
          <MenuMantenimiento modo nuevo={() => limpiar()} grabar={() => Grabar()} volver={() => Volver()} />
          <Box sx={{ ml: 3, mr: 3, p: 1 }} style={{ fontWeight: '400px' }}>
            <h1>Nueva Categoría</h1>
          </Box>
          <Card sx={{ ml: 3, mr: 3, mb: 2, p: 1 }}>
            <Box sx={{ width: '100%', p: 2 }}>
              <Grid container spacing={2} justifyContent="flex-start" style={{ fontWeight: '400px' }}>
                <Grid item container spacing={1} md={6}>
                  <Grid item sm={3} xs={12} md={4}>
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

                  <Grid item sm={9} xs={12} md={8}>
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
