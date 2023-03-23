import { useEffect, useState } from 'react';
import * as servicio from '../services/servicios_int';

const useDashboard = () => {
  const [datos, setDatos] = useState({
    total_empresa: 0,
    total_contaco: 0,
    total_soporte_anio: 0,
    total_soporte_hoy: 0,
    total_soporte_mes: 0,
    soporte_operador: [],
    soporte_tipo_soporte: [],
  });

  const cargarDatos = () => {
    servicio
      .listar()
      .then((res) => {
        setDatos(res.data);
      })
      .catch()
      .finally();
  };
  useEffect(() => cargarDatos(), []);
  return {
    datos,
  };
};
export default useDashboard;
