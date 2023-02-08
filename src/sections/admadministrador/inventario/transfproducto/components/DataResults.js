import React, { useContext } from 'react';
import {
    Box
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid, esES } from '@mui/x-data-grid';
import { TranferenciasContext } from '../context/TransferenciasContex';

export default function DataResults() {

    const [value] = useContext(TranferenciasContext);
    const { rowsInfor, setRowsInfor } = value;

    const columnsInfor = [
        
        {field: 'codigo',headerName: 'Codigo',  width: 150,headerClassName: 'super-app-theme--header' },
        {field: 'nombre',headerName: 'Nombre',  width: 150,headerClassName: 'super-app-theme--header' },
        {field: 'cantidad',headerName: 'Cantidad',  width: 150,headerClassName: 'super-app-theme--header' },
        {field: 'origen',headerName: 'Origen',  width: 150,headerClassName: 'super-app-theme--header' },
        {field: 'destino',headerName: 'Destino',  width: 150,headerClassName: 'super-app-theme--header' },
        {
			field: 'eliminar',
			headerName: 'Eliminar',
			width: 100,
			editable: false,
			renderCell: () => <DeleteIcon />,
			headerClassName: 'boldHeader'
		}
    ];

    const handleOnCellClick = u => {
		if (u.field === 'eliminar') {
			const itemFiltrado = rowsInfor.filter(item => item.id !== u.id);
			setRowsInfor(itemFiltrado);
			if (itemFiltrado.length === 0) {
				// setBtnProcesar(true);
				// setDisableOrigen(false);
			}
		}
	};
    
    return (
        <Box
            style={{
                padding: '0.5rem',
                height: '40vh',
                width: '100%',
            }}
        >
            <DataGrid
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                density="compact"
                getRowId={rows => rows.key}
                onCellClick={handleOnCellClick}
                columns={columnsInfor}
                rows={rowsInfor}
            />
        </Box>
    )
}