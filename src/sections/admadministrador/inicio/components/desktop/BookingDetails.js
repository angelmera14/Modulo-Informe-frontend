import { useState } from 'react';
import { format } from 'date-fns';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Stack,
  Table,
  Avatar,
  Button,
  Divider,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  IconButton,
  TableHead,
  CardHeader,
  Typography,
  TableContainer,
} from '@mui/material';
// _mock_
import { _bookings } from '../../../../../_mock';
//
import Label from '../../../../../components/Label';
import Iconify from '../../../../../components/Iconify';
import Scrollbar from '../../../../../components/Scrollbar';
import MenuPopover from '../../../../../components/MenuPopover';

// ----------------------------------------------------------------------

export default function BookingDetails( props) {
  const theme = useTheme();

  const { productos } = props;
  const isLight = theme.palette.mode === 'light';

  return (
    <>
      <Card>
        <CardHeader title="Productos más Vendidos del Mes Actual" sx={{ mb: 3 }} />
        <Scrollbar>
          <TableContainer sx={{ minWidth: 720 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ minWidth: 100 }}>Producto</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>Nombre</TableCell>
                  <TableCell sx={{ minWidth: 160 }}>Veces Vendido</TableCell>
                  <TableCell sx={{ minWidth: 120 }}>Cantidad U</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Valor</TableCell>
                  <TableCell sx={{ minWidth: 200 }}>Tipo Venta</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
              {/* 
              cantidad: 36
              item: "02556"
              neto: 0.36
              nombre: "CALCULADORA DS-200ML"
              veces: 4 
              */}
                {productos.map((row) => (
                  <TableRow key={`${row.item}${row.cantidad}`}>
                    <TableCell>
                        <Typography variant="subtitle2">{row.item}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.nombre}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.veces}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.cantidad}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.neto} $</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{row.tipo === 'D' ? 'DIRECTA' : 'POS'}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider />

        {/* <Box sx={{ p: 2, textAlign: 'right' }}>
          <Button size="small" color="inherit" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
            View All
          </Button>
        </Box> */}
      </Card>
    </>
  );
}

// ----------------------------------------------------------------------

function MoreMenuButton() {
  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const ICON = {
    mr: 2,
    width: 20,
    height: 20,
  };

  return (
    <>
      <IconButton size="large" onClick={handleOpen}>
        <Iconify icon={'eva:more-vertical-fill'} width={20} height={20} />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        arrow="right-top"
        sx={{
          mt: -0.5,
          width: 160,
          '& .MuiMenuItem-root': { px: 1, typography: 'body2', borderRadius: 0.75 },
        }}
      >
        <MenuItem>
          <Iconify icon={'eva:download-fill'} sx={{ ...ICON }} />
          Download
        </MenuItem>

        <MenuItem>
          <Iconify icon={'eva:printer-fill'} sx={{ ...ICON }} />
          Print
        </MenuItem>

        <MenuItem>
          <Iconify icon={'eva:share-fill'} sx={{ ...ICON }} />
          Share
        </MenuItem>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem sx={{ color: 'error.main' }}>
          <Iconify icon={'eva:trash-2-outline'} sx={{ ...ICON }} />
          Delete
        </MenuItem>
      </MenuPopover>
    </>
  );
}
