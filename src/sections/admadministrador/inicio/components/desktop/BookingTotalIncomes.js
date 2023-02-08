import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { styled } from '@mui/material/styles';
import { Card, Typography, Stack } from '@mui/material';
// utils
import { fCurrency, fPercent } from '../../../../../utils/formatNumber';
// components
import Iconify from '../../../../../components/Iconify';
import BaseOptionChart from '../../../../../components/chart/BaseOptionChart';

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  boxShadow: 'none',
  padding: theme.spacing(3),
  color: theme.palette.primary.darker,
  backgroundColor: theme.palette.primary.light,
}));


export default function BookingTotalIncomes(props) {

  const { total, titulo, porcentaje, seriesDir, seriesPos } = props;

  const CHART_DATA = [
    { data: seriesPos.slice(-50) || [], name: 'Pos' },
    { data: seriesDir || [], name: 'Directas' }
  ];

  const chartOptions = merge(BaseOptionChart(), {
    chart: { sparkline: { enabled: true } },
    xaxis: { labels: { show: false } },
    yaxis: { labels: { show: false } },
    stroke: { width: 3 },
    legend: { show: true },
    grid: { show: false },
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fCurrency(seriesName),
        title: {
          formatter: () => '',
        },
      },
    },
    fill: { gradient: { opacityFrom: 1, opacityTo: 0 } },
  });



  return (
    <RootStyle>
      <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
        <div>
          <Typography sx={{ mb: 2, typography: 'subtitle2' }}>{titulo}</Typography>
          <Typography sx={{ typography: 'h3' }}>{fCurrency(total)}</Typography>
        </div>

        <div>
          {/* <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{ mb: 0.6 }}>
            <Iconify width={20} height={20} icon={porcentaje >= 0 ? 'eva:trending-up-fill' : 'eva:trending-down-fill'} />
            <Typography variant="subtitle2" component="span" sx={{ ml: 0.5 }}>
              {porcentaje > 0 && '+'}
              {fPercent(porcentaje)}
            </Typography>
          </Stack> */}
          {/* <Typography variant="body2" component="span" sx={{ opacity: 0.72 }}>
            &nbsp;de diferencia.
          </Typography> */}
        </div>
      </Stack>

      <ReactApexChart type="area" series={CHART_DATA} options={chartOptions} height={132} />
    </RootStyle>
  );
}
