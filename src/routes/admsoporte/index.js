import { INICIO } from "./inicio";
import { ASIGNACION } from "./asignacion";
import { CONTACTO } from "./contacto";
import { EMPRESA } from "./empresa";
import { INFORME } from "./informe";
import { OPERADOR } from "./operador";
import { REQUERIMIENTO } from "./requerimiento";
import { SOLUCION } from "./solucion";
import { TIPO_REQUERIMIENTO } from "./tiporequerimiento";


export const RUTAS_SISTEMA = [
    ...ASIGNACION,
    ...CONTACTO,
    ...EMPRESA,
    ...INFORME,
    ...INICIO,
    ...OPERADOR,
    // ...REQUERIMIENTO,
    ...SOLUCION,
    ...TIPO_REQUERIMIENTO
] 
