import React, { useState, useEffect, useContext } from 'react';
import {
    Grid,
    // Card,
    TextField,
    IconButton,
    InputAdornment,
    // Checkbox,
    // FormControlLabel,
    Button,
    MenuItem,
    // FilledInput
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
// import { es } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSnackbar } from 'notistack';
// import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import ModalGenerico from './ModalGenerico';
import { PATH_AUTH, PATH_PAGE } from '../../../../../routes/paths';
import { URLAPILOCAL, URLAPIGENERAL } from '../../../../../config';
import { TranferenciasContext } from '../context/TransferenciasContex';
import { ModalContext } from '../context/ModalContex';

export default function FormTransferencia(props) {
    // Axios config
    const usuario = JSON.parse(window.localStorage.getItem('usuario'));
    const axiosInst = axios.create({
        headers: {
            Authorization: `Bearer ${usuario.token}`,
        }
    })

    // Context
    const [value] = useContext(TranferenciasContext);
    const [valuesModal] = useContext(ModalContext);
    const { 
        rowsInfor, 
        setRowsInfor,
        postData, 
        setPostData, 
        btnProcesar,
        setBtnProcesar,
        disableOrigen,
        setDisableOrigen,
        motivoSelected,
        setMotivoSelected,
        EmpresaOrigen,
        setEmpresaOrigen,
        EmpresaDestino,
        setEmpresaDestino
     } = value;
    const {
        rowsModal,
        setRowsModal,
        nombreModal,
        setNombreModal,
        openModalContex,
        setOpenModalContex
    } = valuesModal;

    // Local Variables
    const { enqueueSnackbar } = useSnackbar();
    const navegacion = useNavigate();
    const messajeTool = (variant, msg) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    };
    const [cantidad, setCantidad] = useState(0);
    const [productos, setProductos] = useState([]);
    const [ItemSelected, setItemSelected] = useState({ CODIGO: '', NOMBRE: '', STOCK: '', PRECIO1: 0 });
    const [selectBusquedas, setTiposBusqueda] = useState([{ tipo: 'nombre' }, { tipo: 'codigo' }]);
    const [empresas, setEmpresas] = useState([])
    
    const [motivos, setMotivos] = useState([
        { id: 1, codigo: '001', nombre: 'Motivo 1', ruc: '123456789' },
        { id: 2, codigo: '002', nombre: 'Motivo 2', ruc: '223456789' },
        { id: 3, codigo: '003', nombre: 'Motivo 3', ruc: '323456789' }
    ])

    const toggleShow = () => setOpenModalContex(p => !p);

    const modalCallback = (e) => {
        switch (nombreModal) {
            case 'Producto': {
                const pro = e.row;
                setItemSelected({ CODIGO: pro.codigo, NOMBRE: pro.nombre, STOCK: pro.stock, PRECIO1: pro.precio1 });
                toggleShow();
                break;
            }
            case 'Bodega': {
                toggleShow();
                break;
            }
            default:
                break;
        }
    }

    const checkExis = () => {
        const idArmado = `${ItemSelected.CODIGO}${EmpresaDestino.CONEXION}`;
        const contador = rowsInfor.reduce((acc, curVal) => {
            if (curVal.id === idArmado) {
                return acc + 1;
            }
            return acc + 0;
        }, 0);
        if(contador > 0){
            return true;
        }
        return false;
    };

    // eslint-disable-next-line consistent-return
    const handleAddButton = () => {
        // setdialogoOpen(true);
        // eslint-disable-next-line func-names
        // eslint-disable-next-line array-callback-return
        if (parseFloat(cantidad) === 0) {
            messajeTool('error', 'Debe indicar la cantidad a Transferir.');
            return 0;
        }
        const validar =  checkExis();

        if(validar){
            messajeTool('error', 'Ya existe ese Producto en una operación de la misma empresa.');
            return 0;
        }

        const sumatoriaStok = rowsInfor.reduce((acc, curVal) => {
            // console.log('item selected');
            // console.log(ItemSelected);
            if (curVal.codigo.trim() === ItemSelected.CODIGO.trim()) {
                return acc + curVal.cantidad;
            }
            return acc + 0;
        }, 0);

        if (parseFloat(ItemSelected.STOCK) - (parseFloat(sumatoriaStok) + parseFloat(cantidad)) >= 0) {
            setRowsInfor([
                ...rowsInfor,
                {
                    key: `${ItemSelected.CODIGO}${EmpresaDestino.CONEXION}`,
                    id: `${ItemSelected.CODIGO}${EmpresaDestino.CONEXION}`,
                    codigo: ItemSelected.CODIGO,
                    nombre: ItemSelected.NOMBRE,
                    cantidad: parseFloat(cantidad) > 0 ? parseFloat(cantidad) : 1,
                    precio: parseFloat(ItemSelected.PRECIO1).toFixed(2),
                    total: parseFloat(cantidad) * parseFloat(ItemSelected.PRECIO1).toFixed(2),
                    origen: EmpresaOrigen.NOMBRE,
                    destino: EmpresaDestino.NOMBRE,
                    eliminar: 'X',
                    destinoe: EmpresaDestino.CONEXION
                }
            ]);
            // console.log(parseFloat(ItemSelected.PRECIO1).toFixed(2));
            setBtnProcesar(false);
            setDisableOrigen(true);
            // setearItemPost();
            setCantidad(0);
        } else {
            messajeTool('error', 'No hay stock suficiente para las transacciones del producto seleccionado');
        }
    };

    useEffect(() => {
        // Consulta de Productos
        axiosInst.get(`${URLAPIGENERAL}/productos/listar`)
            .then(res => {
                const proLi = res.data.map(el => ({
                    id: el.item.trim(),
                    codigo: el.item.trim(),
                    nombre: el.nombre.trim(),
                    codBarra: el.codbarra.trim(),
                    iva: el.iva,
                    precio1: el.precio1,
                    factor: el.factor,
                    stock: el.stock
                }));

                setProductos(proLi);
                // console.log('se setearon los productos');
            })
            .catch(error => {
                messajeTool('error', error.response.data.message);
                // messajeToo('error','Problemas con la aplicacion', 'error');
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    messajeTool('error', error.response.data.message);
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                    messajeTool('error', error.response.data.message);
                }
            })

        // Consulta de Empresas
        axiosInst.get(`${URLAPILOCAL}/conexiones/listar`)
            .then((res) => {
                if (res.status === 200) {
                    const empresaLs = res.data.map((item) => ({
                        ID: item.conexion,
                        CONEXION: item.conexion,
                        NOMBRE: item.nombre
                    }))
                    setEmpresas(empresaLs);
                    // console.log(empresaLs);
                    setEmpresaOrigen({ ...EmpresaOrigen, CONEXION: empresaLs[0].CONEXION, NOMBRE:empresaLs[0].NOMBRE });
                    setEmpresaDestino({ ...EmpresaDestino, CONEXION: empresaLs[1].CONEXION, NOMBRE:empresaLs[1].NOMBRE });
                }
            }
            ).catch((error) => {
                messajeTool('error', 'Inconvenientes al cosultar Motivos de las Empresas.');
                // messajeToo('error','Problemas con la aplicacion', 'error');
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    messajeTool('error', error.response.data.message);
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                    messajeTool('error', error.response.data.message);
                }
            });

        // Consulta de Motivos
        axiosInst.get(`${URLAPIGENERAL}/motivosegreso/listar`)
            .then((res) => {
                if (res.status === 200) {
                    const motL = res.data.map((item) => ({
                        id: item.codigo,
                        codigo: item.codigo,
                        nombre: item.nombre
                    }))
                    setMotivos(motL);
                    // console.log(`motivo selected ${motL[0].codigo}`)
                    setMotivoSelected(motL[0].codigo);
                }
            }
            ).catch((error) => {
                messajeTool('error', 'Inconvenientes al cosultar Motivos de Transferencia.');
                // messajeToo('error','Problemas con la aplicacion', 'error');
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    messajeTool('error', error.response.data.message);
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                    messajeTool('error', error.response.data.message);
                }
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <ModalGenerico
                nombre={nombreModal}
                openModal={openModalContex}
                busquedaTipo={selectBusquedas}
                toggleShow={toggleShow}
                rowsData={rowsModal || []}
                callbackParent={modalCallback}
                online={false}
                url={''}
                server={''}
            />
            <Grid container spacing={1}>
                <Grid item md={3} sm={6} xs={6}>
                    <TextField
                        select
                        label="Empresa Origen"
                        value={EmpresaOrigen.CONEXION}
                        fullWidth
                        size="small"
                    >
                        {
                            empresas.map(empresa =>
                                <MenuItem
                                    key={empresa.CONEXION}
                                    value={empresa.CONEXION}
                                    onClick={() => {
                                        if (EmpresaDestino.CONEXION === empresa.CONEXION) {
                                            // eslint-disable-next-line no-alert
                                            messajeTool( 'error','Debe seleccionar una empresa diferente al Destino.');
                                        } else {
                                            setEmpresaOrigen({
                                                NOMBRE: empresa.NOMBRE,
                                                CONEXION: empresa.CONEXION,
                                                BODFAC: 10
                                            });
                                        }
                                    }}
                                >
                                    {empresa.NOMBRE}
                                </MenuItem>)
                        }

                    </TextField>
                </Grid>
                <Grid item md={3} sm={6} xs={6}>
                    <TextField
                        select
                        label="Empresa Destino"
                        value={EmpresaDestino.CONEXION}
                        fullWidth
                        size="small"  
                    >
                        {
                            empresas.map(empresa =>
                                <MenuItem
                                    key={empresa.CONEXION}
                                    value={empresa.CONEXION}
                                    onClick={() => {
                                        if (EmpresaOrigen.CONEXION === empresa.CONEXION) {
                                            // eslint-disable-next-line no-alert
                                            messajeTool( 'error','Debe seleccionar una empresa diferente al origen.');
                                        } else {
                                            setEmpresaDestino({
                                                NOMBRE: empresa.NOMBRE,
                                                CONEXION: empresa.CONEXION,
                                                BODFAC: 10
                                            });
                                        }
                                    }}
                                >
                                    {empresa.NOMBRE}
                                </MenuItem>)
                        }
                    </TextField>
                </Grid>
                <Grid item md={3} sm={4} xs={4} >
                    <TextField
                        fullWidth
                        size="small"
                        type="text"
                        label="Producto"
                        value={ItemSelected.CODIGO}
                        name="productcode"
                        variant="outlined"
                        maxleght="30"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <IconButton
                                        aria-label="SearchIcon"
                                        onClick={() => {
                                            setNombreModal('Producto')
                                            setRowsModal(productos);
                                            setOpenModalContex(true);
                                        }}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    // onChange={e => BuscarCaja(e)}
                    // value={buscar}
                    />
                </Grid>
                <Grid item md={3} xs={8} sm={8}>
                    <TextField
                        fullWidth
                        size="small"
                        type="text"
                        label="Nombre Producto"
                        value={ItemSelected.NOMBRE}
                        name="NombrePro"
                        variant="outlined"
                    // onChange={e => BuscarCaja(e)}
                    // value={buscar}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={1} sx={{ pt: 1 }}>
                <Grid item md={3} sm={6} xs={6}>
                    <TextField
                        select
                        label="Motivo"
                        value={motivoSelected}
                        fullWidth
                        size="small"
                        onChange={e => {
                            setMotivoSelected(e.target.value)
                        }}
                    >
                        {
                            motivos.map(motivo =>
                                <MenuItem
                                    key={motivo.codigo}
                                    value={motivo.codigo}
                                >
                                    {motivo.nombre}
                                </MenuItem>)
                        }

                    </TextField>
                </Grid>
                <Grid item md={3} xs={8} sm={8}>
                    <TextField
                        fullWidth
                        size="small"
                        type="text"
                        label="Stock"
                        value={ItemSelected.STOCK}
                        name="stock"
                        variant="outlined"
                    // onChange={e => BuscarCaja(e)}
                    // value={buscar}
                    />
                </Grid>
                <Grid item md={3} xs={8} sm={8}>
                    <TextField
                        fullWidth
                        size="small"
                        type="text"
                        label="Cantidad a Transferir"
                        value={cantidad}
                        name="canti"
                        variant="outlined"
                        onChange={e => setCantidad(e.target.value)}
                    // value={buscar}
                    />
                </Grid>
                <Grid item md={3} xs={8} sm={8}>
                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={() => {
                            handleAddButton();
                        }}
                    >
                        Agregar
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}