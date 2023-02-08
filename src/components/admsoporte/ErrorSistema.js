import { Navigate} from "react-router";
import useMensaje from "../../hooks/admsoporte/useMensaje";

/** 
* Error del sistema
* @param {{ error: number }} Props
*/
// eslint-disable-next-line react/prop-types
export default function ErrorHttpSistema({ error }) {
    const { mensajeSistema } = useMensaje();
    console.log("mirAA", error)
    if (error === 404) return <Navigate to='/404' replace />
    if (error === 500) return <Navigate to='/500' replace />
    if (error === 400) {
        mensajeSistema('Error 400 el servidor no puede realizar la peticion', 'error');
        return <Navigate to='/' replace />
    }
    if (error === 401) {
        mensajeSistema('Su sesion expiro', 'error');
        return <Navigate to='/' replace  />
    }
    return (
        <Navigate to='/' replace  />
    )
}