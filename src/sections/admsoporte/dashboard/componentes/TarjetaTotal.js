import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, Box } from '@mui/material';
// utils
import { fShortenNumber } from '../../../../utils/formatNumber';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2, 2, 2, 3),
}));

// ----------------------------------------------------------------------

TarjetaTotal.propTypes = {
  icono: PropTypes.any,
  descripcion: PropTypes.string,
  valor: PropTypes.number,
};

function TarjetaTotal(props) {
  const { descripcion, valor, icono } = props;
  return (
    <RootStyle>
      <div>
        <Typography variant="h3">{fShortenNumber(valor)}</Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
          {descripcion}
        </Typography>
      </div>
      <Box
        sx={{
          width: 120,
          height: 120,
          lineHeight: 0,
          borderRadius: '50%',
          bgcolor: 'background.neutral',
        }}
      >
        {icono}
      </Box>
    </RootStyle>
  );
}

export default TarjetaTotal;
