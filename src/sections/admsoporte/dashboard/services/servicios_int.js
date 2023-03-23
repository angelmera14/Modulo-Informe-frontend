import axiosSoftGreen from '../../../../utils/admsoporte/axiosSoftGreen';

export const listar = () => axiosSoftGreen.get('/obtenerdatosinicio').then((res) => res.data);
