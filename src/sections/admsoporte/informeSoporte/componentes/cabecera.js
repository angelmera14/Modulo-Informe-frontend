import { memo } from 'react';
import { Button } from '@mui/material';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';

function CabeceraInforme() {
  return (
    <HeaderBreadcrumbs
      heading="Informe"
      links={[{ name: 'Inicio' }, { name: 'Informe' }, { name: 'Lista' }]}
      action={
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
          }}
          startIcon={<InsertDriveFileRoundedIcon />}
        >
          Nuevo
        </Button>
      }
    />
  );
}

export default memo(CabeceraInforme);
