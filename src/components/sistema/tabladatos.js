import { memo } from "react";
import PropTypes from 'prop-types';
import { DataGrid, esES } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { CustomNoRowsOverlay } from "../../utils/csssistema/iconsdatagrid";
import { estilosdetabla, estilosdatagrid } from "../../utils/csssistema/estilos";

// TablaDatos.propTypes = {
//     sx: PropTypes.object
// }

const TablaDatos = (props) => {
    // eslint-disable-next-line react/prop-types
    const { sx, style } = props;
    return (
        <Box sx={estilosdetabla}>
            <div style={style}>
                <DataGrid
                    {...sx}
                    density="compact"
                    rowHeight={28}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                    sx={estilosdatagrid}
                    components={{
                        NoRowsOverlay: CustomNoRowsOverlay,
                    }}
                />
            </div>
        </Box>

    )
}
export default memo(TablaDatos);