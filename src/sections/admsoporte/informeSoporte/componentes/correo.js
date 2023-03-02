import { useContext } from 'react';
import { Modal, Box, Backdrop, Grid, Typography, Button, TextField } from '@mui/material';
import { estilobox, estilomodal } from '../../../../utils/csssistema/estilos';
import { InformeSoporteContext } from '../contextos/informeSoporteContexto';

function FormularioCorreo() {
  const { formularioCorreo, modalCorreo, cambiarCorreo, cambiarMensaje, cerrarModalCorreo, enviarCorreo } =
    useContext(InformeSoporteContext);
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={modalCorreo}
      onClose={cerrarModalCorreo}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Box sx={estilomodal}>
        <Box sx={estilobox}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography variant="h5">Correo Electronico</Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField disabled size="small" fullWidth label="Empresa" value="SOFTGREEN" />
            </Grid>
            <Grid item xs={12}>
              <TextField
                size="small"
                fullWidth
                label="Correo"
                value={formularioCorreo.correo}
                onChange={(e) => cambiarCorreo(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                multiline
                rows={2}
                fullWidth
                size="small"
                maxRows={2}
                label="Mensaje"
                value={formularioCorreo.mensaje}
                onChange={(e) => cambiarMensaje(e)}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="text" onClick={() => enviarCorreo()}>
                Enviar
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
}

export default FormularioCorreo;
