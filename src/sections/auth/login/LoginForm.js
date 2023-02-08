import { useState } from 'react';
// import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, InputAdornment, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import KeyRoundedIcon from '@mui/icons-material/KeyRounded';
// import { URLAPIGENERAL } from '../../../config';
import { PATH_OPSISTEMA } from '../../../routes/paths';


// ----------------------------------------------------------------------

export default function LoginForm() {
  const { enqueueSnackbar } = useSnackbar();
  const navegacion = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formulario, setFormulario] = useState({
    codigo: '',
    clave: ''
  });

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

  const onLogin = async () => {
    try {
      // validaciones
      const noesvacio = formulario.codigo.trim().length > 0 && formulario.clave.trim().length > 0;
      if (noesvacio) {
        // const { data } = await axios.post(`${URLAPIGENERAL}/authlogin`, formulario, setLoading(true));
        // console.log(data);
        // window.localStorage.setItem('usuariosoporte',JSON.stringify(data.user[0].data))
        // console.log(PATH_OPSISTEMA.inicio)
        navegacion(PATH_OPSISTEMA.informeSoporte);
      } else {
        setError(true);
        mensajeSistema("Complete los campos requeridos", "error");
      }
    } catch (error) {
      mensajeSistema("Usuario o contraseña incorrecta", "error");
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* <LoginContext.Provider value={logincontext}> */}
      <Stack spacing={3}>
        <TextField
          error={error}
          label="Usuario*"
          fullWidth
          value={formulario.codigo}
          onChange={(e) => {
            setFormulario({
              ...formulario,
              codigo: e.target.value
            })
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonRoundedIcon />
              </InputAdornment>
            )
          }}
        />
        <TextField
          error={error}
          label="Contraseña*"
          type="password"
          fullWidth
          value={formulario.clave}
          onChange={(e) => {
            setFormulario({
              ...formulario,
              clave: e.target.value
            })
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <KeyRoundedIcon />
              </InputAdornment>
            )
          }}

        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
        {/*  */}
      </Stack>
      <LoadingButton fullWidth size="large" onClick={() => onLogin()} variant="contained" loading={loading} loadingIndicator="Accediendo...">
        Acceder
      </LoadingButton>
      {/* </LoginContext.Provider> */}
    </>
  );
}
