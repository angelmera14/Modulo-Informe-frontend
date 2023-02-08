import { useContext } from 'react';
import { Grid, TextField, InputAdornment, IconButton, Button, FormControlLabel, Checkbox } from '@mui/material';
import es from 'date-fns/locale/es';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
// import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import { InformeSoporteContext } from '../contextos/informeSoporteContexto';

function FormularioInformeSoporte() {
  const {
    formulario,
    cambiarFechaDesde,
    cambiarFechaHasta,
    cambiarEmpresa,
    cambiarOperador,
    cambiarSolucion,
    cambiarFiltroOperador,
    cambiarEnviadoCorreo,
  } = useContext(InformeSoporteContext);
  return (
    <Grid container spacing={1}>
      <Grid item md={1.5} sm={4} xs={12}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
          <DesktopDatePicker
            label="Fecha desde"
            value={formulario.fechaDesde}
            onChange={(e) => {
              cambiarFechaDesde(e);
            }}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => <TextField {...params} fullWidth size="small" />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item md={1.5} sm={4} xs={12}>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
          <DesktopDatePicker
            label="Fecha hasta"
            value={formulario.fechaHasta}
            onChange={(e) => {
              cambiarFechaHasta(e);
            }}
            inputFormat="dd/MM/yyyy"
            renderInput={(params) => <TextField {...params} fullWidth size="small" />}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item md={2.5} sm={6} xs={12}>
        <TextField
          fullWidth
          size="small"
          label="Empresa"
          value={formulario.nombreEmpresa}
          onChange={(e) => cambiarEmpresa(e)}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => {}}>
                  <SearchRoundedIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item md={2.5} sm={6} xs={12}>
        <TextField
          required
          size="small"
          fullWidth
          label="Operador"
          value={formulario.nombreOperador}
          onChange={(e) => cambiarOperador(e)}
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" onClick={() => {}}>
                  <SearchRoundedIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Grid>
      <Grid item md={1.5} sm={6} xs={12}>
        <FormControlLabel
          control={<Checkbox checked={formulario.esSolucion} onChange={(e) => cambiarSolucion(e)} />}
          label="Solucionado"
        />
      </Grid>
      <Grid item md={2} sm={6} xs={12}>
        <FormControlLabel
          control={<Checkbox checked={formulario.fitroOperador} onChange={(e) => cambiarFiltroOperador(e)} />}
          label="No filtar por operador"
        />
      </Grid>
      <Grid item md={2} sm={6} xs={12}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formulario.enviadoCorreo}
              onChange={(e) => {
                cambiarEnviadoCorreo(e);
              }}
            />
          }
          label="Enviador por correo"
        />
      </Grid>
      <Grid item md={1.2} sm={4} xs={12}>
        <Button fullWidth variant="text" startIcon={<SearchRoundedIcon />} onClick={() => {}}>
          Buscar
        </Button>
      </Grid>
      <Grid item md={1.2} sm={4} xs={12}>
        <Button fullWidth variant="text" startIcon={<EmailRoundedIcon />} onClick={() => {}}>
          Correo
        </Button>
      </Grid>
      {/* <Grid item md={1.2} sm={4} xs={12}>
        <Button disabled fullWidth variant="text" startIcon={<ViewComfyRoundedIcon />} onClick={() => {}}>
          Excel
        </Button>
      </Grid> */}
    </Grid>
  );
}

export default FormularioInformeSoporte;
