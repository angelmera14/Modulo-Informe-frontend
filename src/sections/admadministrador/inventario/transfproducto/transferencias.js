import * as React from 'react';


import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


import Accordion from '@mui/material/Accordion';

import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormTransferencia from './components/FormTransferencia';
import DataResults from './components/DataResults';
import { TransferenciasProvider } from './context/TransferenciasContex';
import { ModalProvider } from './context/ModalContex';
import MenuButtons from './components/MenuButtons';

export default function TransferenciaBod() {

    const unTrue = true;
    return (
        <>
            {/* Provider Transferencia */}
            <TransferenciasProvider>
                <ModalProvider>
                <div
                    style={{
                        marginLeft: '0rem',
                        marginRight: '0rem',
                        marginBottom: '1rem',
                        paddingTop: '0rem',
                    }}
                >
                    <Box sx={{ ml: 1, mr: 1, pt: 1, pl: 1 }}  >
                        <MenuButtons/>          
                        <Accordion expanded={unTrue}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>Busqueda</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <FormTransferencia />
                            </AccordionDetails>
                        </Accordion>
                        <Accordion expanded={unTrue}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>Transferencias a Ejecutar</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <DataResults />
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </div>
                </ModalProvider>
            </TransferenciasProvider>
        </>
    );
}
