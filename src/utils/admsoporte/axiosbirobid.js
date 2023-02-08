import axios from 'axios';

// const { token } = JSON.parse(window.localStorage.getItem('session'));
const axiosBirobid = axios.create({
    // headers: {
    //     Authorization: `Bearer ${token}`,
    // }
})

axiosBirobid.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
)

export default axiosBirobid;