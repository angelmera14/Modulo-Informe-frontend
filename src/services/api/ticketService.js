import axiosBirobid from "../../utils/admsoporte/axiosbirobid";
import { URLAPIGENERAL } from "../../config";

export const obtenerTicketsPendientes = () => {
    const apiUrl = `${URLAPIGENERAL}/listarticketpendientes`;
    return axiosBirobid.get(apiUrl).then(res => res.data);
}