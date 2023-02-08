import { useState, useEffect } from 'react';
import { TextField, Grid, Modal, Fade, MenuItem, Button } from '@mui/material';
import Box from '@mui/material/Box';
import { DataGrid, esES } from '@mui/x-data-grid';
import PropTypes from 'prop-types';

const stylemodal = {
  borderRadius: '1rem',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '90%', md: '90%', lg: '45%' },
  height: 'auto',
  bgcolor: 'background.paper',
  boxShadow: 24,
};

ModalGenerico.propTypes = {
  nombre: PropTypes.string.isRequired,
  openModal: PropTypes.bool.isRequired,
  parentCallback: PropTypes.func.isRequired,
};

export default function ModalGenerico(props) {
  const { openModal, toggleShow, rowsData } = props;
  // eslint-disable-next-line react/prop-types
  const nombre = props.busquedaTipo[1].tipo;
  const [rowsFilter, setRowFilter] = useState({});
  const [columns, setColums] = useState([
    {
      field: 'codigo',
      headerName: `${nombre}`,
      width: 150,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'nombre',
      headerName: 'Nombre',
      width: 250,
      headerClassName: 'super-app-theme--header',
    },
    {
      field: 'estado',
      headerName: 'Estado',
      width: 100,
      renderCell: (param) =>
        param.row.estado === 'A' ? (
          <Button variant="containded" style={styleActive}>
            Activo
          </Button>
        ) : (
          <Button variant="containded" style={styleInactive}>
            Inactivo
          </Button>
        ),
    },
    // {
    //   field: 'nombre_categoria',
    //   headerName: 'Categoría',
    //   width: 250,
    //   headerClassName: 'super-app-theme--header',
    // },

  ]);

  const styleActive = {
    color: '#00AB55',
    borderRadius: '1rem',
    border: 'solid 0px #00AB55',
    backgroundColor: '#cbf5d8',
  };
  const styleInactive = {
    color: '#bd2323',
    borderRadius: '1rem',
    border: '0px solid #bd2323',
    backgroundColor: '#e7b9b9',
  };

  const [searchBy, setSearBy] = useState('nombre');
  const [buscar, setBuscar] = useState('');

  const filterTable = (text) => {
    console.log(text);
    const dataOrigin = rowsData;
    const result = dataOrigin.filter((e) => e.nombre.includes(text) || e.codigo.includes(text));
    setRowFilter(result);
  };

  const Buscar = (e) => {
    setBuscar(e.target.value.toUpperCase());
    filterTable(e.target.value.toUpperCase());
  };

  const onTrigger = (event) => {
    props.parentCallback(event);
  };

  useEffect(() => {
    setRowFilter(rowsData);
    setBuscar('');
  }, [rowsData]);

  return (
    <Modal
      open={openModal}
      onClose={toggleShow}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      closeAfterTransition
    >
      <Fade in={openModal}>
        <Box sx={stylemodal}>
          <div style={{ margin: '1rem', fontWeight: 'bold' }}>
            <h2>Selección de {props.nombre} </h2>
          </div>
          <Box ml={2} mr={2}>
            <Grid container spacing={1} alignItems="center">
              {/* <Grid item xl={3} lg={3} md={3} sm={3} xs={12}>
                <TextField select size="small" fullWidth label="Buscar por" variant="outlined" value={searchBy}>
                  {Object.values(props.busquedaTipo).map((val) => (
                    <MenuItem onClick={() => setSearBy(val.tipo)} key={val.tipo} value={val.tipo}>
                      {val.tipo}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid> */}
              <Grid md={5} sm={9} xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  type="text"
                  autoFocus
                  label="Buscar"
                  name="buscar"
                  variant="outlined"
                  onChange={(e) => Buscar(e)}
                  value={buscar}
                />
              </Grid>
            </Grid>
          </Box>
          <Box
            sx={{
              '& .columnclass': {
                // fontSize: '1.1rem',
                width: '100%',
                // fontFamily: 'Franklin Gothic '
              },
              '& .MuiDataGrid-columnHeaders': {
                // backgroundColor: '#EFEFEF',
                borderRadius: '0.5rem',
              },
              '& .super-app-theme--header': {
                // backgroundColor: 'primary.light',
              },
              '& .hot': {
                backgroundColor: '#ff943975',
                color: '#1a3e72',
              },
              '& .cold': {
                backgroundColor: '#b9d5ff91',
                color: '#1a3e72',
              },
            }}
          >
            <div
              style={{
                padding: '1rem',
                height: '55vh',
                width: '100%',
              }}
            >
              <DataGrid
              rowHeight={28}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                density="compact"
                onRowDoubleClick={(e) => onTrigger(e)}
                columns={columns}
                rows={rowsFilter}
                getRowId={(rowsFilter) => rowsFilter.codigo}
              />
            </div>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
}
