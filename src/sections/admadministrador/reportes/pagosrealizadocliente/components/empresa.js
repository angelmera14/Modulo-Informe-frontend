import * as React from 'react';
import PropTypes from "prop-types";
import axios from 'axios';
import { TextField, MenuItem } from '@mui/material';
import { URLAPIGENERAL, URLAPILOCAL } from "../../../../../config";

Empresa.prototype = {
  estadoinicial: PropTypes.number.isRequired,
  disparador: PropTypes.func.isRequired
};


export default function Empresa(props) {

    const { token } = JSON.parse(window.localStorage.getItem("usuario"));

    const { estadoinicial, disparador } = props;
    const [empresa, setEmpresa] = React.useState('');
    const [listarempresa, setListarEmpresa] = React.useState([]);
    const obtenerEmpresa = async () => {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }
      try {
        const { data } = await axios(`${URLAPIGENERAL}/empresa/listar`);
        setListarEmpresa(data);
        setEmpresa(data[0].nombre);
      } catch {
        setListarEmpresa([{ codigo: '--', nombre: '----' }]);
      }
    };
    // CAMBIAR VALOR
    // eslint-disable-next-line react/prop-types
    // props.data.sucursal = sucursal;
    // console.log("mira",props);
    React.useEffect(() => {
        obtenerEmpresa();
    }, []);
    return (
      <TextField
        select
        label="Empresa"
        value={empresa}
        onChange={(e) => {
            setEmpresa(e.target.value);
            disparador(e.target.value);
        }}
        fullWidth
        size="small"
      >
        {listarempresa.map((t) => (
          <MenuItem key={t.codigo} value={t.codigo}>
            {' '}
            {t.nombre}
          </MenuItem>
        ))}
      </TextField>
    );
  }
