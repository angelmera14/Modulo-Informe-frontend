import { useContext } from 'react';
import {
  Grid,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControlLabel,
  Checkbox,
  Chip,
  Avatar,
} from '@mui/material';
import es from 'date-fns/locale/es';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
// import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import ModalGenerico from '../../../../components/modalgenerico';
import { InformeSoporteContext } from '../contextos/informeSoporteContexto';
import FormularioCorreo from './correo';

function FormularioInformeSoporte() {
  const {
    formulario,
    modalEmpresa,
    modalOperador,
    listaEmpresa,
    listaOperador,
    cambiarFechaDesde,
    cambiarFechaHasta,
    cambiarEmpresa,
    cambiarOperador,
    cambiarSolucion,
    // cambiarFiltroOperador,
    abrirModalCorreo,
    cambiarEnviadoCorreo,
    buscar,
    abrirModalEmpresa,
    cerrarModalEmpresa,
    abrirModalOperador,
    cerrarModalOperador,
  } = useContext(InformeSoporteContext);
  return (
    <>
      <FormularioCorreo />
      <ModalGenerico
        nombre="Empresa"
        openModal={modalEmpresa}
        // busquedaTipo={tiposBusquedas}
        toggleShow={cerrarModalEmpresa}
        rowsData={listaEmpresa}
        parentCallback={(e) => cambiarEmpresa(e.row)}
      />
      <ModalGenerico
        nombre="Operador"
        openModal={modalOperador}
        // busquedaTipo={tiposBusquedas}
        toggleShow={cerrarModalOperador}
        rowsData={listaOperador}
        parentCallback={(e) => cambiarOperador(e.row)}
      />
      <Grid container spacing={1} sx={{ mb: 3 }}>
        <Grid item md={2} sm={6} xs={12}>
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
        <Grid item md={2} sm={6} xs={12}>
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
        <Grid item md={4} sm={6} xs={12}>
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
                  <IconButton size="small" onClick={() => abrirModalEmpresa()}>
                    <SearchRoundedIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item md={4} sm={6} xs={12}>
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
                  <IconButton size="small" onClick={() => abrirModalOperador()}>
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
        {/* <Grid item md={2.5} sm={6} xs={12}>
          <FormControlLabel
            control={<Checkbox checked={formulario.fitroOperador} onChange={(e) => cambiarFiltroOperador(e)} />}
            label="No filtar por operador"
          />
        </Grid> */}
        <Grid item md={2.5} sm={6} xs={12}>
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
          <Button fullWidth variant="text" startIcon={<SearchRoundedIcon />} onClick={() => buscar()}>
            Buscar
          </Button>
        </Grid>
        <Grid item md={1.2} sm={4} xs={12}>
          <Button fullWidth variant="text" startIcon={<EmailRoundedIcon />} onClick={() => abrirModalCorreo()}>
            Correo
          </Button>
        </Grid>
        <Grid item xs={12}>
          {/*  */}
        </Grid>
        <Grid item md={4} sm={12} xs={12}>
          <Chip avatar={<Avatar>I</Avatar>} label="Recuerde que debe elegir una empresa" />
        </Grid>
        <Grid item md={8} sm={12} xs={12}>
          <Chip
            avatar={<Avatar>A</Avatar>}
            label="Si no escoge ningun operador, por defecto se filtrara por todos los operadores"
          />
        </Grid>
        {/* <Grid item md={1.2} sm={4} xs={12}>
        <Button disabled fullWidth variant="text" startIcon={<ViewComfyRoundedIcon />} onClick={() => {}}>
          Excel
        </Button>
      </Grid> */}
      </Grid>
    </>
  );
}

export default FormularioInformeSoporte;
