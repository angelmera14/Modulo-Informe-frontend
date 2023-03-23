import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, Stack, Box } from '@mui/material';
// utils
// import { fCurrency } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  padding: theme.spacing(3),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.light,
}));

TarjetaTotalHoy.propTypes = {
  descripcion: PropTypes.string,
  valor: PropTypes.number,
  imagen: PropTypes.string,
};

function TarjetaTotalHoy(props) {
  const { descripcion, valor, imagen } = props;
  return (
    <RootStyle>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          <Typography sx={{ mb: 2, typography: 'subtitle2' }}>{descripcion}</Typography>
          <Typography sx={{ typography: 'h3' }}>{valor.toFixed(0)}</Typography>
        </div>
        <Box
          sx={{
            width: 130,
            height: 130,
            lineHeight: 0,
            borderRadius: '50%',
            bgcolor: 'background.neutral',
          }}
        >
          <img alt="imagen" src={imagen} />
        </Box>
      </Stack>
    </RootStyle>
  );
}

export default TarjetaTotalHoy;
