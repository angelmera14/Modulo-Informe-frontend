import { useState, useEffect } from 'react';
// @mui
import { Grid, Container, TextField, MenuItem } from '@mui/material';
import DatePicker from '@mui/lab/DatePicker/DatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import es from "date-fns/locale/es";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import axios from 'axios';
import useSettings from '../../../hooks/useSettings';
import Page from '../../../components/Page';
import {
  BookingDetails,
  BookingBookedRoom,
  BookingTotalIncomes,
  BookingRoomAvailable,
  BookingNewestBooking,
  BookingWidgetSummary,
  BookingCheckInWidgets,
  BookingCustomerReviews,
  BookingReservationStats,
} from './components/desktop';
// assets
import { BookingIllustration, CheckInIllustration, DocIllustration, CheckOutIllustration, OrderCompleteIllustration }
  from '../../../assets';
import { URLAPILOCAL, URLAPIGENERAL } from '../../../config';

// ----------------------------------------------------------------------

export default function Desktop() {
  const { themeStretch } = useSettings();
  const [empresas, setEmpresas] = useState([]);
  const usuario = JSON.parse(window.localStorage.getItem('usuario'));
  const axiosInst = axios.create({
    headers: {
      Authorization: `Bearer ${usuario.token}`,
    }
  })
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [conexion, setCnexion] = useState('');
  const [produc, setProduct] = useState([]);
  const [seriesPos, setSeriesPos] = useState([]);
  const [seriesDir, setSeriesDir] = useState([]);
  const [seriesPago,setSeriesPago] = useState([]);
  const [seriesPagop,setSeriesPagop] = useState([]);
  const [dataDash, setDataDash] = useState({
    empresa: "",
    cantidadClientes: 0,
    cobrosDia: 0,
    ventasMes: 0,
    facturadoVentaDirecta: 0,
    facturadoVentaPos: 0,
    netoFacturado: 0,
    numeroDocumentos: 0,
    productosMasVendidos: []
  });

  useEffect(() => {
    axiosInst.get(`${URLAPIGENERAL}/conexiones/listar`)
      .then((res) => {
        if (res.status === 200) {
          const empresaLs = res.data.map((item) => ({
            conexion: item.conexion,
            nombre: item.nombre
          }))
          setEmpresas(empresaLs);
          setCnexion(empresaLs[0].conexion);
        }
      }
      ).catch((error) => {
        // messajeTool('error', error.response.data.message);
      });
  }, []);

  useEffect(() => {
    if (conexion !== '') {
      const year = selectedDate.getFullYear();
      axiosInst.get(`${URLAPILOCAL}/dashboard?empresa=${conexion}&year=${year}`)
        .then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            setDataDash(res.data);
            const productosD = res.data.productosMasVendidos;
            const productosP = res.data.productosMasVendidosP;
            const allProducts = [...productosD, ...productosP];
            setProduct(allProducts);
            setSeriesPos(res.data.seriesFacPos);
            setSeriesDir(res.data.seriesFacDirecta);
            setSeriesPago(res.data.seriePago);
            setSeriesPagop(res.data.seriePagoPos);

          }
        }
        ).catch((error) => {
          // messajeTool('error', error.response.data.message);
        });
    }
  }, [conexion,selectedDate]);

  return (
    <Page title="General: Banking">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container>
          <Grid item md={8} sx={{ pb: 2 }}>
            <Grid item md={6} sm={6} xs={6}>
              <TextField
                select
                label="Empresa"
                value={conexion}
                fullWidth
                size="small"
                onChange={e => { setCnexion(e.target.value) }}
              >
                {
                  empresas.map(emp =>
                    <MenuItem
                      key={emp.conexion}
                      value={emp.conexion}
                    >
                      {emp.nombre}
                    </MenuItem>)
                }
              </TextField>
            </Grid>
          </Grid>
          <Grid item md={4} alignItems={"flex-end"}>
            <Grid item md={3}>
              <LocalizationProvider locale={es} dateAdapter={AdapterDateFns}>
                <MobileDatePicker
                  views={["year"]}
                  value={selectedDate}
                  label="Año"
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} fullWidth size="small" />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Total Clientes" total={dataDash.cantidadClientes} icon={<BookingIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title="Total Documentos (FAC,NVT)" total={dataDash.numeroDocumentos} icon={<DocIllustration />} />
          </Grid>

          <Grid item xs={12} md={4}>
            <BookingWidgetSummary title={`Total Venta Año`} total={dataDash.netoFacturado} icon={<OrderCompleteIllustration />} />
          </Grid>

          <Grid item xs={12} md={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <BookingTotalIncomes total={dataDash.ventasMes} titulo={'Ventas del Mes Actual'} porcentaje={2.5} seriesDir={seriesDir} seriesPos={seriesPos} />
              </Grid>

              <Grid item xs={12} md={6}>
                <BookingTotalIncomes total={dataDash.cobrosDia} titulo={'Cobros del Día'} porcentaje={10} seriesDir={seriesPago} seriesPos={seriesPagop} />
              </Grid>

              <Grid item xs={12} md={12}>
                <BookingCheckInWidgets ventaspos={dataDash.facturadoVentaPos} ventasdirecta={dataDash.facturadoVentaDirecta} />
              </Grid>
            </Grid>
          </Grid>

          {/* <Grid item xs={12} md={4}>
            <BookingRoomAvailable />
          </Grid> */}

          {/* <Grid item xs={12} md={8}>
            <BookingReservationStats />
          </Grid> */}

          {/* <Grid item xs={12} md={4}>
            <BookingCustomerReviews />
          </Grid> */}

          {/* <Grid item xs={12}>
            <BookingNewestBooking />
          </Grid> */}

          <Grid item xs={12}>
            <BookingDetails productos={produc} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
