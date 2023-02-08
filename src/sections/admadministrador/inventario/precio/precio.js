import { memo, useState, useEffect } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    TextField,
    Button,
    Grid,
    Fade,
    IconButton,
    Typography,
    InputAdornment,
    MenuItem,
    Tooltip,
    Chip
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { DataGrid, esES } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
// import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import AddCardRoundedIcon from '@mui/icons-material/AddCardRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { PATH_DASHBOARD, PATH_OPSISTEMA, PATH_AUTH, PATH_PAGE } from "../../../../routes/paths";
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';
import CajaGenerica from '../../../../components/cajagenerica';
import CircularProgreso from '../../../../components/Cargando';
import Page from '../../../../components/Page';
import { URLAPIGENERAL } from "../../../../config";
import { estilosacordeon, estilosdatagrid, estilosdetabla } from '../../../../utils/csssistema/estilos'
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';
import { columns } from './componentes/columnas';

const tipobusqueda = [
    {
        codigo: 'ITEM',
        label: 'Item'
    },
    {
        codigo: 'GRUPO',
        label: 'Grupo'
    },
    {
        codigo: 'ITEMPROV',
        label: 'Item Proveedor'
    }
]
const tipoincremento = [
    {
        codigo: 'costo',
        label: 'Costo'
    },
    {
        codigo: 'precio',
        label: 'Precio'
    }
]
const tipoprecio = [
    {
        codigo: 'precio1',
        label: 'Precio 1'
    },
    {
        codigo: 'precio2',
        label: 'Precio 2'
    },
    {
        codigo: 'precio3',
        label: 'Precio 3'
    },
    {
        codigo: 'precio4',
        label: 'Precio 4'
    },
    {
        codigo: 'precio5',
        label: 'Precio 5'
    },

]



function AjustePrecio() {
    // eslint-disable-next-line camelcase
    const { token, codigo_Usuario } = JSON.parse(window.localStorage.getItem('usuario'));
    const [rows, setRows] = useState([]);
    const [imprimir, setImprimir] = useState(true);
    const [empresa, setEmpresa] = useState([]);
    const [progreso, setProgreso] = useState(false);
    const [iva, setIva] = useState(12);
    const [formulario, setFormulario] = useState({
        opcion: 'ITEM',
        incremento: 'costo',
        porcentaje: 0,
        precio: [],
        empresa: [],
        categoria: '',
        nombrecategoria: '',
        familia: '',
        nombrefamilia: '',
        linea: '',
        nombrelinea: '',
        item: '',
        nombreitem: '',
        proveedor: '',
        nombreproveedor: '',
        tipocosto: ''

    })
    const navegacion = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    const mensajeSistema = (mensaje, variante) => {
        enqueueSnackbar(mensaje,
            {
                variant: variante,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
            }
        )
    }

    const buscarProducto = async () => {
        try {

            const tipocosto = empresa[0].tipoCosto;
            if (formulario.opcion === 'ITEM') {
                const { data } = await axios(`${URLAPIGENERAL}/productos/obtener?item=${formulario.item.trim()}&tipocosto=${tipocosto}`, config, setProgreso(true));
                if (data.length === 0) {
                    mensajeSistema('No se encontro informacion con estas caracteristicas', 'error');
                }
                setRows(data)
            }
            if (formulario.opcion === 'ITEMPROV') {
                const { data } = await axios(`${URLAPIGENERAL}/productos/obtenerxproveedor?proveedor=${formulario.proveedor}&tipocosto=${tipocosto}`, config, setProgreso(true));
                if (data.length === 0) {
                    mensajeSistema('No se encontro informacion con estas caracteristicas', 'error');
                }
                setRows(data)
            }
            if (formulario.opcion === 'GRUPO') {
                const { data } = await axios(`${URLAPIGENERAL}/productos/obtenerxcatfamlin?categoira=${formulario.categoria}&familia=${formulario.familia}&linea=${formulario.linea}&tipocosto=P`, config, setProgreso(true));
                if (data.length === 0) {
                    mensajeSistema('No se encontro informacion con estas caracteristicas', 'error');
                }
                setRows(data)
            }

        } catch (error) {
            mensajeSistema("Error al buscar informacion", "error");
            if (error.response.status === 401) {
                navegacion(`${PATH_AUTH.login}`);
                mensajeSistema("Su inicio de sesion expiro", "error");
            }
            if (error.response.status === 500) {
                navegacion(`${PATH_PAGE.page500}`);
            }
        } finally {
            setProgreso(false);
        }
    }
    const calcular = () => {
        try {

            if (formulario.precio.length === 0) {
                mensajeSistema("Elija un precio", 'error')
                return
            }
            const item = rows.map(d => (
                {
                    item: d.item,
                    nombre: d.nombre,
                    iva: d.iva,
                    costo: d.costo,
                    precio1: d.precio1,
                    precio2: d.precio2,
                    precio3: d.precio3,
                    precio4: d.precio4,
                    precio5: d.precio5,
                    inc1: d.inc1 ? d.inc1 : null,
                    inc2: d.inc2 ? d.inc2 : null,
                    inc3: d.inc3 ? d.inc3 : null,
                    inc4: d.inc4 ? d.inc4 : null,
                    inc5: d.inc5 ? d.inc5 : null,
                    nuevoprecio1: d.nuevoprecio1 ? d.nuevoprecio1 : 0,
                    nuevoprecio2: d.nuevoprecio2 ? d.nuevoprecio2 : 0,
                    nuevoprecio3: d.nuevoprecio3 ? d.nuevoprecio3 : 0,
                    nuevoprecio4: d.nuevoprecio4 ? d.nuevoprecio4 : 0,
                    nuevoprecio5: d.nuevoprecio5 ? d.nuevoprecio5 : 0,
                }
            ))

            formulario.precio.forEach(p => {
                item.forEach(i => {
                    if (p === 'precio1') {
                        i.inc1 = formulario.porcentaje
                        if (formulario.incremento === 'costo') {
                            const costo = parseFloat(i.costo) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.costo);
                            i.nuevoprecio1 = p.iva === 'S' ? (costo * iva) + costo : costo;
                        }
                        if (formulario.incremento === 'precio') {
                            const precio = parseFloat(i.precio1) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.precio1);
                            i.nuevoprecio1 = p.iva === 'S' ? (precio * 0.12) + precio : precio;
                        }
                    }
                    if (p === 'precio2') {
                        i.inc2 = formulario.porcentaje
                        if (formulario.incremento === 'costo') {
                            const costo = parseFloat(i.costo) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.costo)
                            i.nuevoprecio2 = p.iva === 'S' ? (costo * iva) + costo : costo;
                        }
                        if (formulario.incremento === 'precio') {
                            const precio = parseFloat(i.precio2) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.precio2)
                            i.nuevoprecio2 = p.iva === 'S' ? (precio * iva) + precio : precio;
                        }
                    }
                    if (p === 'precio3') {
                        i.inc3 = formulario.porcentaje
                        if (formulario.incremento === 'costo') {
                            const costo = parseFloat(i.costo) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.costo)
                            i.nuevoprecio3 = p.iva === 'S' ? (costo * iva) + costo : costo;
                        }
                        if (formulario.incremento === 'precio') {
                            const precio = parseFloat(i.precio3) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.precio3)
                            i.nuevoprecio3 = p.iva === 'S' ? (precio * iva) + precio : precio;
                        }
                    }
                    if (p === 'precio4') {
                        i.inc4 = formulario.porcentaje
                        if (formulario.incremento === 'costo') {
                            const costo = parseFloat(i.costo) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.costo)
                            i.nuevoprecio4 = p.iva === 'S' ? (costo * iva) + costo : costo;
                        }
                        if (formulario.incremento === 'precio') {
                            const precio = parseFloat(i.precio4) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.precio4)
                            i.nuevoprecio4 = p.iva === 'S' ? (precio * iva) + precio : precio;
                        }
                    }
                    if (p === 'precio5') {
                        i.inc5 = formulario.porcentaje
                        if (formulario.incremento === 'costo') {
                            const costo = parseFloat(i.costo) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.costo)
                            i.nuevoprecio5 = p.iva === 'S' ? (costo * iva) + costo : costo;
                        }
                        if (formulario.incremento === 'precio') {
                            const precio = parseFloat(i.precio5) * (parseFloat(formulario.porcentaje) / 100) + parseFloat(i.precio5)
                            i.nuevoprecio5 = p.iva === 'S' ? (precio * iva) + precio : precio;
                        }
                    }

                })
            })

            // console.log()("mira nuevo precio", item)
            setRows(item);
        } catch (error) {
            // console.log()(error);
        }
    }

    const editarPreciosTabla = (e) => {
        const valor = e.value ? e.value : 0;
        if (formulario.incremento === 'costo') {

            // calcular el incremento
            if (e.field === 'inc1') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {

                        const costo = parseFloat(n.costo) * (parseFloat(valor) / 100) + parseFloat(n.costo);

                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: condicion ? e.value : n.inc1,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: condicion ? costot : n.nuevoprecio1,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,

                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'inc2') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        const costo = parseFloat(n.costo) * (parseFloat(valor) / 100) + parseFloat(n.costo);

                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;

                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: condicion ? e.value : n.inc2,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: condicion ? costot : n.nuevoprecio2,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'inc3') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        const costo = parseFloat(n.costo) * (parseFloat(valor) / 100) + parseFloat(n.costo);
                        // console.log()("mira aca estoy", costo)
                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;
                        // console.log()("mira aca estoy", costot)
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: condicion ? e.value : n.inc3,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: condicion ? costot : n.nuevoprecio3,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'inc4') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        const costo = parseFloat(n.costo) * (parseFloat(valor) / 100) + parseFloat(n.costo);
                        // console.log()("mira aca estoy", costo)
                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;
                        // console.log()("mira aca estoy", costot)
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: condicion ? e.value : n.inc4,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: condicion ? costot : n.nuevoprecio4,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'inc5') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        const costo = parseFloat(n.costo) * (parseFloat(valor) / 100) + parseFloat(n.costo);
                        // console.log()("mira aca estoy", costo)
                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;
                        // console.log()("mira aca estoy", costot)
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: condicion ? e.value : n.inc5,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: condicion ? costot : n.nuevoprecio5,
                    }
                })
                setRows(nuevalista);
            }
            // si inserta el nuevo precio directo
            if (e.field === 'nuevoprecio1') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.costo));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: condicion ? costot : n.inc1,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: condicion ? e.value : n.nuevoprecio1,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,

                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'nuevoprecio2') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.costo));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: condicion ? costot : n.inc2,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: condicion ? e.value : n.nuevoprecio2,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'nuevoprecio3') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.costo));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: condicion ? costot : n.inc3,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: condicion ? e.value : n.nuevoprecio3,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'nuevoprecio4') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.costo));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: condicion ? costot : n.inc4,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: condicion ? e.value : n.nuevoprecio4,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'nuevoprecio5') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.costo));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: condicion ? costot : n.inc5,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: condicion ? e.value : n.nuevoprecio5,
                    }
                })
                setRows(nuevalista);
            }


        }

        if (formulario.incremento === 'precio') {
            if (e.field === 'inc1') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.precio1)
                        const costo = parseFloat(n.precio1) * (parseFloat(valor) / 100) + parseFloat(n.precio1);
                        // console.log()("mira aca estoy", costo)
                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: condicion ? e.value : n.inc1,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: condicion ? costot : n.nuevoprecio1,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,

                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'inc2') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        const costo = parseFloat(n.precio2) * (parseFloat(valor) / 100) + parseFloat(n.precio2);
                        // console.log()("mira aca estoy", costo)
                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;
                        // console.log()("mira aca estoy", costot)
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: condicion ? e.value : n.inc2,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: condicion ? costot : n.nuevoprecio2,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'inc3') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        const costo = parseFloat(n.precio3) * (parseFloat(valor) / 100) + parseFloat(n.precio3);
                        // console.log()("mira aca estoy", costo)
                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;
                        // console.log()("mira aca estoy", costot)
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: condicion ? e.value : n.inc3,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: condicion ? costot : n.nuevoprecio3,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'inc4') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        const costo = parseFloat(n.precio4) * (parseFloat(valor) / 100) + parseFloat(n.precio4);
                        // console.log()("mira aca estoy", costo)
                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;
                        // console.log()("mira aca estoy", costot)
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: condicion ? e.value : n.inc4,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: condicion ? costot : n.nuevoprecio4,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'inc5') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        const costo = parseFloat(n.precio5) * (parseFloat(valor) / 100) + parseFloat(n.precio5);
                        // console.log()("mira aca estoy", costo)
                        costot = n.iva === 'S' ? (costo * iva) + costo : costo;
                        // console.log()("mira aca estoy", costot)
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: condicion ? e.value : n.inc5,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: condicion ? costot : n.nuevoprecio5,
                    }
                })
                setRows(nuevalista);
            }
            // si inserta el nuevo precio directo
            if (e.field === 'nuevoprecio1') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.precio1));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: condicion ? costot : n.inc1,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: condicion ? e.value : n.nuevoprecio1,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,

                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'nuevoprecio2') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.precio2));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: condicion ? costot : n.inc2,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: condicion ? e.value : n.nuevoprecio2,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'nuevoprecio3') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.precio3));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: condicion ? costot : n.inc3,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: condicion ? e.value : n.nuevoprecio3,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'nuevoprecio4') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.precio4));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: condicion ? costot : n.inc4,
                        inc5: n.inc5 ? n.inc5 : null,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: condicion ? e.value : n.nuevoprecio4,
                        nuevoprecio5: n.nuevoprecio5 ? n.nuevoprecio5 : null,
                    }
                })
                setRows(nuevalista);
            }
            if (e.field === 'nuevoprecio5') {
                const nuevalista = rows.map(n => {
                    let costot = 0;
                    const condicion = `${n.item}`.trim() === `${e.id}`.trim();
                    if (condicion) {
                        // console.log()("costo", n.costo)
                        const costo = (parseFloat(e.value) / parseFloat(n.precio5));
                        // console.log()("mira aca estoy", costo)
                        costot = (costo - 1) * 100;
                    }
                    return {
                        item: n.item,
                        nombre: n.nombre,
                        iva: n.iva,
                        costo: n.costo,
                        precio1: n.precio1,
                        precio2: n.precio2,
                        precio3: n.precio3,
                        precio4: n.precio4,
                        precio5: n.precio5,
                        inc1: n.inc1 ? n.inc1 : null,
                        inc2: n.inc2 ? n.inc2 : null,
                        inc3: n.inc3 ? n.inc3 : null,
                        inc4: n.inc4 ? n.inc4 : null,
                        inc5: condicion ? costot : n.inc5,
                        nuevoprecio1: n.nuevoprecio1 ? n.nuevoprecio1 : null,
                        nuevoprecio2: n.nuevoprecio2 ? n.nuevoprecio2 : null,
                        nuevoprecio3: n.nuevoprecio3 ? n.nuevoprecio3 : null,
                        nuevoprecio4: n.nuevoprecio4 ? n.nuevoprecio4 : null,
                        nuevoprecio5: condicion ? e.value : n.nuevoprecio5,
                    }
                })
                setRows(nuevalista);
            }
        }
    }

    const grabarPrecios = async () => {
        try {
            if (formulario.empresa.length === 0) {
                mensajeSistema("Seleccion una empresa primero", "error");
                return
            }
            if (rows.length === 0) {
                mensajeSistema("Primero inserte datos en la tabla antes de enviar", "error");
                return
            }
            const listarproductos = [];
            const listaprecios = rows.map(p => (
                {
                    item: `${p.item}`.trim(),
                    precio1: p.nuevoprecio1 !== null ? p.nuevoprecio1 : 0,
                    precio2: p.nuevoprecio2 !== null ? p.nuevoprecio2 : 0,
                    precio3: p.nuevoprecio3 !== null ? p.nuevoprecio3 : 0,
                    precio4: p.nuevoprecio4 !== null ? p.nuevoprecio4 : 0,
                    precio5: p.nuevoprecio5 !== null ? p.nuevoprecio5 : 0
                }
            ))
            formulario.empresa.forEach(e => {
                listarproductos.push({
                    conexion: e,
                    items: listaprecios
                })
            })
            // console.log()(listarproductos);
            const { data } = await axios.post(`${URLAPIGENERAL}/ajusteprecio`, listarproductos, config, setProgreso(true));
            if (data === 200) {
                const ajustepdf = rows.map(p => {
                    const nuevoprecio = (p.precio1 * (p.inc1 / 100)) + p.precio1;
                    const precioiva = (nuevoprecio * iva) + nuevoprecio;
                    const preciof = precioiva !== 0 ? precioiva : p.nuevoprecio1
                    return {
                        item: `${p.item}`.trim(),
                        nombre: p.nombre,
                        costo: p.costo,
                        precio_Anterior: p.precio1,
                        porcentaje_Incremento: p.inc1 ? p.inc1 : 0,
                        precio_Nuevo: nuevoprecio || 0,
                        precio_Iva: preciof || 0,
                        grava_Iva: p.iva,
                        operador: "ADM"
                    }
                })
                // // console.log()(ajustepdf);
                const respuesta = await axios.post(`${URLAPIGENERAL}/ajusteprecio/grabarajustepdf`, ajustepdf, config, setProgreso(true));
                if (respuesta.data === 200) {
                    setImprimir(false);
                }
                // // console.log()(respuesta.data);
                mensajeSistema("Los precios se actulizaron correctamente", 'success');
                setRows([]);
            }

        } catch (error) {
            mensajeSistema("Error al grabar los precios", "error");
            if (error.response.status === 401) {
                navegacion(`${PATH_AUTH.login}`);
                mensajeSistema("Su inicio de sesion expiro", "error");
            }
            if (error.response.status === 500) {
                navegacion(`${PATH_PAGE.page500}`);
            }
        } finally {
            setProgreso(false);
        }
    }

    useEffect(() => {
        async function obtenerEmpresas() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/conexiones/listar`, config, setProgreso(true));
                setEmpresa(data);
                // console.log()(data)
                setIva(parseFloat(data[0].porIva) / 100);
            } catch (error) {
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                }
            } finally {
                setProgreso(false);
            }
        }
        obtenerEmpresas();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <CircularProgreso open={progreso} handleClose1={() => { setProgreso(false) }} />
            <Page title="Precios">
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                        <HeaderBreadcrumbs
                            heading=" Precios"
                            links={[
                                { name: 'Inicio', href: PATH_DASHBOARD.root },
                                { name: 'Precios', href: PATH_OPSISTEMA.invetario.ajusteprecio },
                                { name: 'Menu' },
                            ]}
                            action={
                                <Button
                                    fullWidth
                                    variant="text"
                                    onClick={() => { buscarProducto() }}
                                    startIcon={<SearchRoundedIcon />}
                                >
                                    Buscar
                                </Button>
                            }

                        />
                    </Box>
                </Fade>
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}  >
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                sx={estilosacordeon}
                            >
                                <Typography sx={{ fontWeight: 'bold' }}>Busqueda</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container spacing={1}>
                                    <Grid item container md={6} xs={12} spacing={1}>
                                        <Grid item md={4.5} sm={4.5} xs={6}>
                                            <TextField
                                                select
                                                label="Opciones"
                                                fullWidth
                                                size="small"
                                                value={formulario.opcion}
                                                onChange={(e) => {
                                                    setFormulario({
                                                        ...formulario,
                                                        opcion: e.target.value
                                                    })
                                                }}
                                            >
                                                {
                                                    tipobusqueda.map((m) =>
                                                        <MenuItem key={m.codigo} value={m.codigo}>{m.label}</MenuItem>
                                                    )
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item md={3} sm={3} xs={6}>
                                            <TextField
                                                select
                                                label="Incrementar"
                                                fullWidth
                                                size="small"
                                                value={formulario.incremento}
                                                onChange={(e) => {
                                                    setFormulario({
                                                        ...formulario,
                                                        incremento: e.target.value
                                                    })
                                                }}
                                            >
                                                {
                                                    tipoincremento.map((m) =>
                                                        <MenuItem key={m.codigo} value={m.codigo}>{m.label}</MenuItem>
                                                    )
                                                }
                                            </TextField>
                                        </Grid>
                                        <Grid item md={3} sm={3} xs={6}>
                                            <TextField
                                                type="number"
                                                label="Porcentaje"
                                                fullWidth
                                                size="small"
                                                value={formulario.porcentaje}
                                                onChange={(e) => {
                                                    setFormulario({
                                                        ...formulario,
                                                        porcentaje: e.target.value
                                                    })
                                                }}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="start">
                                                            <PercentRoundedIcon />
                                                        </InputAdornment>
                                                    ),
                                                    inputProps: { min: 0 }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item md={1.5} sm={1.5} xs={6}>
                                            <Tooltip title="Calcular">
                                                <IconButton sx={{ color: 'primary.main' }} onClick={() => { calcular() }} >
                                                    <AutorenewRoundedIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                        <CajaGenerica
                                            desactivar={formulario.opcion !== 'ITEM'}
                                            descativarbusqueda={formulario.opcion !== 'ITEM'}
                                            nombremodal="Item"
                                            url={`${URLAPIGENERAL}/productos/listar`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    item: e.codigo,
                                                    nombreitem: e.nombre
                                                })
                                            }}
                                            tipobusqueda="item"
                                            estadoinicial={{ codigo: formulario.item, nombre: formulario.nombreitem }}
                                        />
                                        <CajaGenerica
                                            desactivar={formulario.opcion !== 'ITEMPROV'}
                                            descativarbusqueda={formulario.opcion !== 'ITEMPROV'}
                                            nombremodal="Proveedor"
                                            url={`${URLAPIGENERAL}/proveedores/listar`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    proveedor: e.codigo,
                                                    nombreproveedor: e.nombre
                                                })
                                            }}
                                            estadoinicial={{ codigo: formulario.proveedor, nombre: formulario.nombreproveedor }}
                                        />
                                        <Grid item md={8.5} sm={8.5} xs={12}>
                                            <TextField
                                                fullWidth
                                                select
                                                size="small"
                                                variant="outlined"
                                                label="Precios"
                                                SelectProps={{
                                                    multiple: true,
                                                    value: formulario.precio,
                                                    onChange: e => {
                                                        const {
                                                            target: { value }
                                                        } = e;
                                                        setFormulario({
                                                            ...formulario,
                                                            precio:
                                                                typeof value === 'string' ? value.split(',') : value
                                                        });
                                                    }
                                                }}
                                            >
                                                {
                                                    tipoprecio.map((m) =>
                                                        <MenuItem key={m.codigo} value={m.codigo}>{m.label}</MenuItem>
                                                    )
                                                }
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Grid item container md={6} xs={12} spacing={1}>
                                        <CajaGenerica
                                            desactivar={formulario.opcion !== 'GRUPO'}
                                            descativarbusqueda={formulario.opcion !== 'GRUPO'}
                                            nombremodal="Categoria"
                                            url={`${URLAPIGENERAL}/categorias/listar`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    categoria: e.codigo,
                                                    nombrecategoria: e.nombre
                                                })
                                            }}
                                            // descativarbusqueda={tipo === 'editar'}
                                            estadoinicial={{ codigo: formulario.categoria, nombre: formulario.nombrecategoria }}
                                        />
                                        <CajaGenerica
                                            desactivar={formulario.opcion !== 'GRUPO'}
                                            descativarbusqueda={formulario.opcion !== 'GRUPO'}
                                            nombremodal="Familia"
                                            // descativarbusqueda={tipo === 'editar' || formulario.opcion !== 'producto'}
                                            url={`${URLAPIGENERAL}/familia/filtrar/Categoria?categoria=${formulario.categoria}`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    familia: e.codigo,
                                                    nombrefamilia: e.nombre
                                                })
                                            }}
                                            // descativarbusqueda={tipo === 'editar'}
                                            estadoinicial={{ codigo: formulario.familia, nombre: formulario.nombrefamilia }}
                                        />
                                        <CajaGenerica
                                            desactivar={formulario.opcion !== 'GRUPO'}
                                            descativarbusqueda={formulario.opcion !== 'GRUPO'}
                                            nombremodal="Linea"
                                            // descativarbusqueda={tipo === 'editar' || formulario.opcion !== 'producto'}
                                            url={`${URLAPIGENERAL}/linea/filtrarfamilia?familia=${formulario.familia}`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    linea: e.codigo,
                                                    nombrelinea: e.nombre
                                                })
                                            }}
                                            // descativarbusqueda={tipo === 'editar'}
                                            estadoinicial={{ codigo: formulario.linea, nombre: formulario.nombrelinea }}
                                        />
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                select
                                                size="small"
                                                variant="outlined"
                                                label="Empresas"
                                                SelectProps={{
                                                    multiple: true,
                                                    value: formulario.empresa,
                                                    onChange: e => {
                                                        const {
                                                            target: { value }
                                                        } = e;
                                                        setFormulario({
                                                            ...formulario,
                                                            empresa:
                                                                typeof value === 'string' ? value.split(',') : value
                                                        });
                                                    }
                                                }}
                                            >
                                                {
                                                    empresa.map((m) =>
                                                        <MenuItem key={m.conexion} value={m.conexion}>{m.nombre}</MenuItem>
                                                    )
                                                }
                                            </TextField>
                                        </Grid>

                                    </Grid>
                                </Grid>
                                <Box mt={1}>
                                    <Chip
                                        icon={<AddCardRoundedIcon style={{ color: 'white' }} />}
                                        sx={{ bgcolor: 'primary.main', color: 'white', fontWeight: 'bold' }}
                                        label="La opcion incluye iva"
                                        size="small"
                                    />
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Fade>
                <Fade
                    in
                    style={{ transformOrigin: '0 0 0' }}
                    timeout={1000}
                >
                    <Box sx={{ ml: 3, mr: 3, p: 1 }}  >
                        <Accordion defaultExpanded>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                sx={estilosacordeon}
                            >
                                <Typography sx={{ fontWeight: 'bold' }}>Informe</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box mb={1}>
                                    <Grid container spacing={1} justifyContent="flex-end" >
                                        <Grid item md={1.2} sm={2} xs={4} >
                                            <Button
                                                disabled={imprimir}
                                                fullWidth
                                                variant="text"
                                                // eslint-disable-next-line camelcase
                                                href={`${URLAPIGENERAL}/ajusteprecio/generarpdf?operador=${codigo_Usuario || 'ADM'}`}
                                                target="_blank"
                                                onClick={() => {
                                                    setImprimir(true);
                                                }}
                                                startIcon={<PictureAsPdfRoundedIcon />}
                                            >
                                                PDF
                                            </Button>
                                        </Grid>
                                        <Grid item md={1.2} sm={2} xs={4} >
                                            <Button
                                                disabled={imprimir}
                                                fullWidth
                                                variant="text"
                                                // eslint-disable-next-line camelcase
                                                href={`${URLAPIGENERAL}/ajusteprecio/generarexcel`}
                                                target="_blank"
                                                onClick={() => {
                                                    setImprimir(true);
                                                }}
                                                startIcon={<ViewComfyRoundedIcon />}
                                            >
                                                Excel
                                            </Button>
                                        </Grid>
                                        <Grid item md={1.2} sm={2} xs={4} >
                                            <Button
                                                fullWidth
                                                variant="text"
                                                startIcon={<SaveRoundedIcon />}
                                                onClick={() => { grabarPrecios() }}
                                            >
                                                Grabar
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box sx={estilosdetabla}>
                                    <div
                                        style={{
                                            // padding: '1rem',
                                            height: '45vh',
                                            width: '100%'
                                        }}
                                    >
                                        <DataGrid
                                            rowHeight={30}
                                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                            components={{
                                                NoRowsOverlay: CustomNoRowsOverlay,
                                            }}
                                            onCellEditCommit={e => {
                                                editarPreciosTabla(e)
                                            }}

                                            rows={rows}
                                            columns={columns}
                                            density="compact"
                                            getRowId={rows => rows.item}
                                            sx={estilosdatagrid}
                                        />
                                    </div>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    </Box>
                </Fade>
            </Page>

        </>
    )
}

export default memo(AjustePrecio);