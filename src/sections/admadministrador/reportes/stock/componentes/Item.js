import * as React from 'react';
import { Box, CircularProgress, Modal, Grid, Button, Fade, TextField, InputAdornment } from '@mui/material';
import axios from 'axios';
import SearchRounded from '@mui/icons-material/SearchRounded';

function ModalItem() {
  const [openmodal, setopenmodal] = React.useState(false);
  const [openmodald, setopenmodald] = React.useState(false);
  const [colummas, setcolumnas] = React.useState([
    { field: 'item', headerName: 'Item', width: 150, headerClassName: 'super-app-theme--header' },
    { field: 'nombre', headerName: 'Nombre', width: 250, headerClassName: 'super-app-theme--header' },
  ]);

  return <></>;
}

export default React.memo(ModalItem);
