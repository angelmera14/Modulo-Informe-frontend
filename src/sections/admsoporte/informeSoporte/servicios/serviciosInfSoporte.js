import axiosSoftGreen from '../../../../utils/admsoporte/axiosSoftGreen';

export const listarEmpresa = () => axiosSoftGreen.get('/listarempresa').then((res) => res.data);
export const listarOperador = () => axiosSoftGreen.get('/listaroperador').then((res) => res.data);
export const listarInforme = (datos) => axiosSoftGreen.post('/listartiporequerimientos', datos).then((res) => res.data);
export const enviarCorreo = () => axiosSoftGreen.post('').then((res) => res.data);
