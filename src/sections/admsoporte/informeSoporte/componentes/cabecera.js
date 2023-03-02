import { memo, useContext } from 'react';
import { Button } from '@mui/material';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
import { InformeSoporteContext } from '../contextos/informeSoporteContexto';

function CabeceraInforme() {
  const { nuevo } = useContext(InformeSoporteContext);
  return (
    <HeaderBreadcrumbs
      heading="Informe"
      links={[{ name: 'Inicio' }, { name: 'Informe' }, { name: 'Lista' }]}
      action={
        <Button fullWidth variant="contained" onClick={() => nuevo()} startIcon={<InsertDriveFileRoundedIcon />}>
          Nuevo
        </Button>
      }
    />
  );
}

export default memo(CabeceraInforme);
