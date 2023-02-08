import { useSnackbar } from 'notistack';


export default function useMensaje() {
    const { enqueueSnackbar } = useSnackbar();
    /** 
        * Mensaje del sistema
        * @param {{ texto: string, variant: string }}
    */
    const mensajeSistema = (texto = '', variante = '') => {
        enqueueSnackbar(texto.trim().length !== 0 ? texto : 'Hecho!', {
            variant: variante.trim().length !== 0 ? variante : 'success',
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            },
        });
    }
    return {
        mensajeSistema
    }
}


