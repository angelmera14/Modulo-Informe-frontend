import { createContext, useEffect, useState } from 'react';
import useMensaje from '../../../../hooks/admsoporte/useMensaje';
import * as servicios from '../servicios/serviciosInfSoporte';

export const InformeSoporteContext = createContext();

// eslint-disable-next-line react/prop-types
export const InformeSoporteProvider = ({ children }) => {
  const { mensajeSistema } = useMensaje();
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
  const [formularioCorreo, setFormularioCorreo] = useState({
    correo: '',
    mensaje: ''
  });
  const [informe, setInforme] = useState([]);
  const [modalEmpresa, setModalEmpresa] = useState(false);
  const [modalOperador, setModalOperador] = useState(false);
  const [modalCorreo, setModalCorreo] = useState(false);
  const [listaEmpresa, setListaEmpresa] = useState([]);
  const [listaOperador, setListaOperador] = useState([]);

  const limpiarTabla = () => setInforme([]);
  // Metodos para abrir y cerrar la busqueda de las empresas y operadores
  const abrirModalEmpresa = () => setModalEmpresa(true);
  const cerrarModalEmpresa = () => setModalEmpresa(false);
  const abrirModalOperador = () => setModalOperador(true);
  const cerrarModalOperador = () => setModalOperador(false);
  // Metodos para cambiar los estados de los componentes
  const cambiarFechaDesde = (e) => setFormulario({ ...formulario, fechaDesde: e });
  const cambiarFechaHasta = (e) => setFormulario({ ...formulario, fechaHasta: e });
  const cambiarEmpresa = (e) => {
    setFormulario({ ...formulario, codigoEmpresa: e.codigo, nombreEmpresa: e.nombre });
    cerrarModalEmpresa();
  };
  const cambiarOperador = (e) => {
    setFormulario({ ...formulario, codigoOperador: e.codigo, nombreOperador: e.nombre });
    cerrarModalOperador();
  };
  const cambiarSolucion = (e) => setFormulario({ ...formulario, esSolucion: e.target.checked });
  const cambiarFiltroOperador = (e) => setFormulario({ ...formulario, filtraOperador: e.target.checked });
  const cambiarEnviadoCorreo = (e) => setFormulario({ ...formulario, enviadoCorreo: e.target.checked });
  // Para los correos
  const cambiarCorreo = (e) => setFormularioCorreo({...formularioCorreo, correo: e.target.value})
  const cambiarMensaje = (e) => setFormularioCorreo({...formularioCorreo, mensaje: e.target.value})
  const abrirModalCorreo = () => setModalCorreo(true);
  const cerrarModalCorreo = () => setModalCorreo(false);
  // cargar las lista de las empresa y operadores
  const cargarDatos = () => {
    Promise.all([servicios.listarEmpresa(), servicios.listarOperador()])
      .then((res) => {
        const listaEmpresaApi = res.at(0).data.map((m) => ({ ...m, codigo: m.idempresa, nombre: m.nombre_empresa }));
        const listaOperadorApi = res.at(1).data.map((m) => ({ ...m, codigo: m.idoperador }));
        setListaEmpresa(listaEmpresaApi);
        setListaOperador(listaOperadorApi);
        // console.log(listaEmpresaApi, listaOperadorApi);
      })
      .catch(() => mensajeSistema('Problemas con la aplicacion o conexion a la base de datos', 'error'));
  };

  const nuevo = () => {
    setFormulario({
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
    limpiarTabla();
    cargarDatos();
  };

  const buscar = () => {
    if (String(formulario.codigoEmpresa).trim().length === 0) {
      limpiarTabla();
      mensajeSistema('La empresa es requerida', 'warning');
      return;
    }
    const datos = {
      filtros: {
        fechadesde: formulario.fechaDesde,
        fechahasta: formulario.fechaHasta,
        estado: formulario.esSolucion,
        operador: formulario.codigoOperador,
        idempresa: formulario.codigoEmpresa,
        escorreo: formulario.enviadoCorreo,
      },
    };
    // console.log(datos);
    servicios
      .listarInforme(datos)
      .then((res) => {
        if (res.data.length === 0) {
          mensajeSistema('No se encontraron registros con las caracteristicas proporcionadas', 'error');
          return;
        }
        setInforme(res.data);
      })
      .catch(() => {
        mensajeSistema('Problemas con la aplicacion o de conexion a la base de datos', 'error');
      });
  };
  const enviarCorreo = () => {
    const datos = {
      daTicket: {
        data: {
          nombre: formularioCorreo.nombre,
          email: formularioCorreo.email,
          mensaje: formularioCorreo.mensaje,
        },
        list: informe,
        fi: formulario.fechaDesde,
        ff: formulario.fechaHasta,
      },
    };
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => cargarDatos(), []);

  return (
    <InformeSoporteContext.Provider
      value={{
        formulario,
        formularioCorreo,
        informe,
        modalEmpresa,
        modalOperador,
        modalCorreo,
        listaEmpresa,
        listaOperador,
        cambiarFechaDesde,
        cambiarFechaHasta,
        cambiarEmpresa,
        cambiarOperador,
        cambiarSolucion,
        cambiarFiltroOperador,
        cambiarEnviadoCorreo,
        cambiarCorreo,
        cambiarMensaje,
        abrirModalCorreo,
        cerrarModalCorreo,
        nuevo,
        buscar,
        enviarCorreo,
        abrirModalEmpresa,
        cerrarModalEmpresa,
        abrirModalOperador,
        cerrarModalOperador,
      }}
    >
      {children}
    </InformeSoporteContext.Provider>
  );
};
