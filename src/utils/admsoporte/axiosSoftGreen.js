import axios from 'axios';
import { URLAPIGENERAL } from '../../config';
// const { token } = JSON.parse(window.localStorage.getItem('session'));
const axiosSoftGreen = axios.create({
  baseURL: URLAPIGENERAL,
});

axiosSoftGreen.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default axiosSoftGreen;

