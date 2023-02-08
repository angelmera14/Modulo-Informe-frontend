import { useState } from 'react';
import { Box, TextField, Grid, Fade } from '@mui/material';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Page from '../../../components/Page';
import { estilobox } from '../../../utils/csssistema/estilos';
// import { PATH_DASHBOARD } from '../../../../.routes/paths'


// const usoCampo = ({ type }) => {
//     const [valor, setValor] = useState('');
//     const modificarValor = (evento) => {
//         setValor(evento.target.value);
//     }
//     return {
//         type,
//         valor,
//         modificarValor
//     }
// }

function Requerimiento() {
    return (
        <>
            <Page title="Requerimiento">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={estilobox}  >
                        <HeaderBreadcrumbs
                            heading="Requerimiento"
                            links={[
                                { name: 'Inicio' },
                                { name: 'Requerimiento' },
                                { name: 'Ingeso' },
                            ]}
                        />
                    </Box>
                    <Box sx={estilobox}  >
                        <HeaderBreadcrumbs
                            heading="Requerimiento"
                            links={[
                                { name: 'Inicio' },
                                { name: 'Requerimiento' },
                                { name: 'Ingeso' },
                            ]}
                        />
                    </Box>
                    <Box sx={estilobox}  >
                        <HeaderBreadcrumbs
                            heading="Requerimiento"
                            links={[
                                { name: 'Inicio' },
                                { name: 'Requerimiento' },
                                { name: 'Ingeso' },
                            ]}
                        />
                    </Box>
                </Fade>

            </Page>
        </>
    )
}

export default Requerimiento;