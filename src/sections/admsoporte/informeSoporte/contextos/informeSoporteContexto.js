import { createContext, useState } from 'react';

export const InformeSoporteContext = createContext();

// eslint-disable-next-line react/prop-types
export const InformeSoporteProvider = ({ children }) => {
  const [formulario, setFormulario] = useState({
    fechaDesde: new Date(),
    fechaHasta: new Date(),
    codigoEmpresa: '',
    nombreEmpresa: '',
    codigoOperador: '',
    nombreOperador: '',
    esSolucion: true,
    filtraOperador: true,
    enviadoCorreo: true,
  });
  const [informe, setInforme] = useState([]);

  const listarInforme = () => {
    setInforme([]);
  };

  // Metodos para cambiar los estados de los componentes
  const cambiarFechaDesde = (e) => setFormulario({ ...formulario, fechaDesde: e });
  const cambiarFechaHasta = (e) => setFormulario({ ...formulario, fechaHasta: e });
  const cambiarEmpresa = (e) => setFormulario({ ...formulario, codigoEmpresa: e, nombreEmpresa: e });
  const cambiarOperador = (e) => setFormulario({ ...formulario, codigoOperador: e, nombreOperador: e });
  const cambiarSolucion = (e) => setFormulario({ ...formulario, esSolucion: e });
  const cambiarFiltroOperador = (e) => setFormulario({ ...formulario, filtraOperador: e });
  const cambiarEnviadoCorreo = (e) => setFormulario({ ...formulario, enviadoCorreo: e });

  return (
    <InformeSoporteContext.Provider
      value={{
        formulario,
        informe,
        listarInforme,
        cambiarFechaDesde,
        cambiarFechaHasta,
        cambiarEmpresa,
        cambiarOperador,
        cambiarSolucion,
        cambiarFiltroOperador,
        cambiarEnviadoCorreo,
      }}
    >
      {children}
    </InformeSoporteContext.Provider>
  );
};
