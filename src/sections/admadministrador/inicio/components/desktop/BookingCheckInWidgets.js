import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Typography, Stack, Divider } from '@mui/material';
// hooks
import useResponsive from '../../../../../hooks/useResponsive';
// utils
import { fNumber } from '../../../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../../../components/chart';


// ----------------------------------------------------------------------

const CHART_SIZE = { width: 106, height: 106 };



export default function BookingCheckInWidgets(props) {
  const theme = useTheme();
  const ventaspos = props.ventaspos;
  const ventasdirecta = props.ventasdirecta;
  const isDesktop = useResponsive('up', 'sm');

  console.log(ventasdirecta);
  const porVentaD = (ventasdirecta * 100) / (ventasdirecta + ventaspos)
  const porVentaP = (ventaspos * 100) / (ventasdirecta + ventaspos)



  const chartOptionsCheckIn = merge(BaseOptionChart(), {
    chart: { sparkline: { enabled: true } },
    grid: {
      padding: {
        top: -9,
        bottom: -9,
      },
    },
    legend: { show: false },
    plotOptions: {
      radialBar: {
        hollow: { size: '64%' },
        track: { margin: 0 },
        dataLabels: {
          name: { show: false },
          value: {
            offsetY: 6,
            fontSize: theme.typography.subtitle2.fontSize,
          },
        },
      },
    },
  });

  const chartOptionsCheckOut = {
    ...chartOptionsCheckIn,
    colors: [theme.palette.chart.yellow[0]],
  };

  return (
    <Card>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={
          <Divider orientation={isDesktop ? 'vertical' : 'horizontal'} flexItem sx={{ borderStyle: 'dashed' }} />
        }
      >
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ width: 1, py: 5 }}>
          
          <ReactApexChart type="radialBar" series={[parseFloat(porVentaD).toFixed(2) ]} options={chartOptionsCheckIn} {...CHART_SIZE} />
          <div>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
            $ {ventasdirecta}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              Facturado Venta Directa
            </Typography>
          </div>
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="center" spacing={3} sx={{ width: 1, py: 5 }}>
          <ReactApexChart
            type="radialBar"
            series={[parseFloat(porVentaP).toFixed(2)]}
            options={chartOptionsCheckOut}
            {...CHART_SIZE}
          />
          <div>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
            $ {  ventaspos} 
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              Facturado Venta Pos
            </Typography>
          </div>
        </Stack>
      </Stack>
    </Card>
  );
}
