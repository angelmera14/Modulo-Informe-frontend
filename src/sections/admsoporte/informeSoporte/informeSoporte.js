import { Fade, Box } from '@mui/material';
import Page from '../../../components/Page';
import { InformeSoporteProvider } from './contextos/informeSoporteContexto';
import FormularioInformeSoporte from './componentes/formulario';
import InformeDatosSoporte from './componentes/informe';
import CabeceraInforme from './componentes/cabecera';

function InformeSoporte() {
  return (
    <InformeSoporteProvider>
      <Page title="INFORME">
        <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
          <Box ml={3} mr={3}>
            <CabeceraInforme />
            <FormularioInformeSoporte />
            <InformeDatosSoporte />
          </Box>
        </Fade>
      </Page>
    </InformeSoporteProvider>
  );
}

export default InformeSoporte;
