import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

CuentaGuardada.propTypes = {
    children: PropTypes.node,
};

export default function CuentaGuardada({ children }) {
    // verficiar token
    const { enqueueSnackbar } = useSnackbar();
    const usuario = JSON.parse(window.localStorage.getItem('usuario'))
    const mensajeSistema = (mensaje, variante) => {
        enqueueSnackbar(mensaje,
            {
                variant: variante,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
            }
        )
    }

    if (!usuario) {
        mensajeSistema('Debe iniciar sesion para acceder a los recursos del sistema', 'error');
        return <Navigate to='/auth/login' replace />;
    }
    
    
    

    return <>{children}</>;
}