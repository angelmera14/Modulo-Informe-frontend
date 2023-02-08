import * as React from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { TextField, Button, Card, Grid, InputAdornment, IconButton, Fade, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import SearchRounded from '@mui/icons-material/SearchRounded';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { PATH_OPSISTEMA, PATH_AUTH, PATH_PAGE } from '../../../../routes/paths';
import { noEsVacio } from './components/funciones';
import Page from '../../../../components/Page';
import { CORS, URLAPIGENERAL, URLAPILOCAL } from "../../../../config";
import CajaGenerica from './components/cajagenerica';
import { MenuMantenimiento } from './components/opciones';




function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tabpanel-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    document.body.style.overflowX = "hidden";

    const navegacion = useNavigate();

    const location = useLocation();

    const { token } = JSON.parse(window.localStorage.getItem("usuario"));

    const { id } = location.state;


    const [error, setError] = React.useState(false);

    const { enqueueSnackbar } = useSnackbar();
    // MENSAJE GENERICO
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
    const messajeTool = (variant, msg) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    };

    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = (index) => {
        setValue(index);
    };

    const [nFormulario, setNFormulario] = React.useState({
        bien: "",
        cantidadxcaja: "",
        categoria: "",
        codbarra: "",
        codprov: "",
        codship: "",
        combo: "",
        costou: 0,
        cuentaventa: "",
        descripcion: "",
        dispoven: "",
        estado: "",
        factor: 1,
        familia: "",
        grupo: "",
        item: "",
        iva: "",
        linea: "",
        marca: "",
        nombre: "",
        nombrecorto: "",
        numcotizacion: 0,
        observa: "",
        peso: 0,
        pespecial: "",
        pordessugerido: 0,
        poruti: 0,
        porutiventa: 0,
        precio1: 0,
        precio2: 0,
        precio3: 0,
        precio4: 0,
        precio5: 0,
        presenta: "",
        proveedor: "",
        pserie: "",
        ptransporte: "",
        pvp: 0,
        regalo: "",
        solopos: "",
        stockma: 0,
        stockmay: 0,
        stockmi: 0,
        subcategoria: "",
        tipoproducto: "",
        volumen: 0,
        nomcategoria: "",
        nomfamilia: "",
        nomlinea: "",
        nommarca: "",
        nompresenta: "",
        nomproveedor: "",
    })

    // checks
    const [dispovenv, setDispovenv] = React.useState(true)
    const handleSetdispoven = e => {
        setDispovenv(e.target.checked)
    }
    const [ivav, setIvav] = React.useState(true)
    const handleSetiva = e => {
        setIvav(e.target.checked)
    }
    const [combov, setCombov] = React.useState(false)
    const handleSetcombo = e => {
        setCombov(e.target.checked)
    }
    const [regalov, setRegalov] = React.useState(false)
    const handleSetregalo = e => {
        setRegalov(e.target.checked)
    }
    const [pespecialv, setPespecialv] = React.useState(false)
    const handleSetpespecial = e => {
        setPespecialv(e.target.checked)
    }
    const [soloposv, setSoloposv] = React.useState(false)
    const handleSetsolopos = e => {
        setSoloposv(e.target.checked)
    }
    const [pseriev, setPseriev] = React.useState(false)
    const handleSetpeserie = e => {
        setPseriev(e.target.checked)
    }
    const [ptransportev, setPtransportev] = React.useState(false)
    const handleSetptransporte = e => {
        setPtransportev(e.target.checked)
    }


    React.useEffect(() => {
        async function obteneritem() {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            try {
                const { data } = await axios(`${URLAPIGENERAL}/productos/buscar?item=${id}`, config);
                
                if (data.length === 0) {
                    mensajeSistema("El producto no se pudo cargar","error")
                    return
                }
                
                setNFormulario(
                    {
                        bien: data[0].bien,
                        cantidadxcaja: data[0].cantidadxcaja,
                        categoria: data[0].nomcategoria === null ? '' : data[0].categoria,
                        codbarra: data[0].codbarra,
                        codprov: data[0].codprov,
                        codship: data[0].codship,
                        combo: data[0].combo === "S",
                        costou: data[0].costou,
                        cuentaventa: data[0].cuentaventa,
                        descripcion: data[0].descripcion,
                        dispoven: data[0].dispoven === "S",
                        estado: data[0].estado,
                        factor: data[0].factor,
                        familia: data[0].nomfamilia === null ? '': data[0].familia,
                        grupo: data[0].grupo,
                        item: data[0].item.trim(),
                        iva: data[0].iva === "S",
                        linea: data[0].nomlinea === null? '': data[0].linea,
                        marca: data[0].nommarca === null? '': data[0].marca,
                        nombre: data[0].nombre,
                        nombrecorto: data[0].nombrecorto,
                        numcotizacion: data[0].numcotizacion,
                        observa: data[0].observa,
                        peso: data[0].peso,
                        pespecial: data[0].pespecial === "S",
                        pordessugerido: data[0].pordessugerido,
                        poruti: data[0].poruti,
                        porutiventa: data[0].porutiventa,
                        precio1: data[0].precio1,
                        precio2: data[0].precio2,
                        precio3: data[0].precio3,
                        precio4: data[0].precio4,
                        precio5: data[0].precio5,
                        presenta: data[0].presenta,
                        proveedor: data[0].proveedor,
                        pserie: data[0].pserie === "S",
                        ptransporte: data[0].ptransporte === "S",
                        pvp: data[0].pvp,
                        regalo: data[0].regalo === "S",
                        solopos: data[0].solopos === "S",
                        stockma: data[0].stockma,
                        stockmay: data[0].stockmay,
                        stockmi: data[0].stockmi,
                        subcategoria: data[0].subcategoria,
                        tipoproducto: data[0].tipoproducto,
                        volumen: data[0].volumen,
                        nomcategoria: data[0].nomcategoria,
                        nomfamilia: data[0].nomfamilia,
                        nomlinea: data[0].nomlinea,
                        nommarca: data[0].nommarca,
                        nompresenta: data[0].nompresenta,
                        nomproveedor: data[0].nomproveedor,
                    }
                );
                setDispovenv(data[0].dispoven === 'S')
                setIvav(data[0].iva === 'S')
                setCombov(data[0].combo === 'S');
                setRegalov(data[0].regalo === 'S');
                setPespecialv(data[0].pespecial === 'S');
                setSoloposv(data[0].solopos === 'S');
                setPseriev(data[0].pserie === 'S');
                setPtransportev(data[0].ptransporte === 'S');
                setCopycb(data[0].codbarra)

            } catch(error) {
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                }
            }
        }
        obteneritem();
    }, []);


    const formvacio = {
        nombre: nFormulario.nombre,
        estado: nFormulario.estado,
        codcategoria: nFormulario.categoria,
        codfamilia: nFormulario.familia,
        // codlinea: nFormulario.linea,
        codmarca: nFormulario.marca,
        codprese: nFormulario.presenta,
        codprov: nFormulario.proveedor
    }

    const limpiarCampos = () => {
        setNFormulario({
            bien: "",
            cantidadxcaja: "",
            categoria: "",
            codbarra: "",
            codprov: "",
            codship: "",
            combo: "",
            costou: 0,
            cuentaventa: "",
            descripcion: "",
            dispoven: "",
            estado: "A",
            factor: 1,
            familia: "",
            grupo: "",
            item: "",
            iva: "",
            linea: "",
            marca: "",
            nombre: "",
            nombrecorto: "",
            numcotizacion: 0,
            observa: "",
            peso: 0,
            pespecial: "",
            pordessugerido: 0,
            poruti: 0,
            porutiventa: 0,
            precio1: 0,
            precio2: 0,
            precio3: 0,
            precio4: 0,
            precio5: 0,
            presenta: "",
            proveedor: "",
            pserie: "",
            ptransporte: "",
            pvp: 0,
            regalo: "",
            solopos: "",
            stockma: 0,
            stockmay: 0,
            stockmi: 0,
            subcategoria: "",
            tipoproducto: "",
            volumen: 0,

            nomcategoria: "",
            nomfamilia: "",
            nomlinea: "",
            nommarca: "",
            nompresenta: "",
            nomproveedor: "",
        })
        setDispovenv(true);
        setIvav(true);
        setCombov(false);
        setRegalov(false);
        setPespecialv(false);
        setSoloposv(false);
        setPseriev(false);
        setPtransportev(false);
    };

    // copia para validar el codigo de barras
    const [copycb, setCopycb] = React.useState("");

    
    const Grabar = async () => {
        try {
            const noesvacio = noEsVacio(formvacio);
            // console.log('v', noesvacio)
            const form = {
                item: id,
                codbarra: nFormulario.codbarra === '' ? '  ' : nFormulario.codbarra,
                nombre: nFormulario.nombre,
                nombrecorto: '  ',
                estado: nFormulario.estado,
                categoria: nFormulario.categoria,
                familia: nFormulario.familia,
                linea: nFormulario.linea,
                marca: nFormulario.marca,
                presenta: nFormulario.presenta,
                proveedor: nFormulario.proveedor,
                factor: parseFloat(nFormulario.factor),
                peso: parseFloat(nFormulario.peso),
                volumen: parseFloat(nFormulario.volumen),
                dispoven: dispovenv === true ? 'S' : 'N',
                iva: ivav === true ? 'S' : 'N',
                combo: combov === true ? 'S' : 'N',
                regalo: regalov === true ? 'S' : 'N',
                pespecial: pespecialv === true ? 'S' : 'N',
                solopos: soloposv === true ? 'S' : 'N',
                pserie: pseriev === true ? 'S' : 'N',
                ptransporte: ptransportev === true ? 'S' : 'N',
                observa: nFormulario.observa === '' ? '  ' : nFormulario.observa,
                pordessugerido: parseFloat(nFormulario.pordessugerido),
                codprov: nFormulario.codprov === '' ? '  ' : nFormulario.codprov,
                porutiventa: parseFloat(nFormulario.porutiventa),
                stockmi: parseFloat(nFormulario.stockmi),
                stockma: parseFloat(nFormulario.stockma),
                stockmay: parseFloat(nFormulario.stockmay),
                pvp: parseFloat(nFormulario.pvp),
                poruti: parseFloat(nFormulario.poruti),
                bien: "B",
                grupo: " ",
                cuentaventa: ' ',
                numcotizacion: 0,
                tipoproducto: ' ',
                cantidadxcaja: 0,
                codship: ' ',
                descripcion: ' ',
                subcategoria: ' '
            }

            if (!noesvacio) {
                messajeTool('error', 'Complete los campos requeridos');
                setError(true);
                console.log(form, 'to send')
                return false;
            }

            if (existe === 1) {
                if (form.codbarra === copycb) {
                    const config = {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }
                    const { data } = await axios.put(`${URLAPIGENERAL}/productos/editar`, form, config, CORS)
                    if (data === 200) {
                        mensajeSistema('Registros guardados correctamente', 'success');
                        navegacion(`/sistema/inventario/productos`);
                        return;
                    }
                }
                messajeTool('error', 'El codigo de barras ingresado ya existe');
            } else {
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
                const { data } = await axios.put(`${URLAPIGENERAL}/productos/editar`, form, config, CORS)
                if (data === 200) {
                    mensajeSistema('Registros guardados correctamente', 'success');
                    navegacion(`/sistema/inventario/productos`)
                    
                }
            }

        }
        catch (error) {
            mensajeSistema('Error al guardar el registro', 'error');
            if (error.response.status === 401) {
                navegacion(`${PATH_AUTH.login}`);
                mensajeSistema("Su inicio de sesion expiro", "error");
            }
            if (error.response.status === 500) {
                navegacion(`${PATH_PAGE.page500}`);
            }
        }
    };

    const Volver = () => {
        navegacion(`/sistema/inventario/productos`)
    }

    const [existe, setExiste] = React.useState(0)


    React.useEffect(() => {
        async function comprobarcodbarra() {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            try {
                const { data } = await axios(`${URLAPIGENERAL}/codbarra/obtener?codbarra=${nFormulario.codbarra}`, config)
                console.log(data);
                setExiste(data[0].existe_Codbarra);
                
            } catch (error) {
                console.log(error);
                if (error.response.status === 401) {
                    mensajeSistema("Error en la base de datos", "error");
                    navegacion(`${PATH_AUTH.login}`);
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                }
            }
        };
        comprobarcodbarra();

    }, [nFormulario.codbarra])


    return (
        <Page title='Nuevos Productos'>
            <MenuMantenimiento
                nuevo={() => limpiarCampos()}
                grabar={() => Grabar()}
                volver={() => Volver()}
                nomostrarimprimir
            />
            <Fade
                in
                style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
                    <h1>Editar Productos</h1>
                </Box>
            </Fade>
            <Fade
                in
                style={{ transformOrigin: '0 0 0' }}
                timeout={1000}
            >
                <Card sx={{ ml: 3, mr: 3, p: 1, mt: 1 }}>
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs
                                value={value}
                                onChange={handleChange}
                                variant="fullWidth"
                                aria-label="full width tabs example"
                            >
                                <Tab label="Datos Basicos" {...a11yProps(0)} />
                                <Tab label="Datos Complementarios" {...a11yProps(1)} />

                            </Tabs>
                        </Box>
                        <SwipeableViews
                            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                            index={value}
                            onChangeIndex={handleChangeIndex}
                        >
                            <TabPanel value={value} index={0}>
                                <Grid container spacing={1}>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <TextField
                                            label='Codigo'
                                            fullWidth
                                            size="small"
                                            variant='outlined'
                                            value={id}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <TextField
                                            label='Codigo de Barra'
                                            fullWidth
                                            size="small"
                                            variant='outlined'
                                            value={nFormulario.codbarra}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    codbarra: e.target.value
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={5} sm={6} xs={12}>
                                        <TextField
                                            label='Nombre'
                                            error={error}
                                            fullWidth
                                            size="small"
                                            variant='outlined'
                                            value={nFormulario.nombre}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    nombre: e.target.value
                                                });
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <TextField
                                            select
                                            label='Estado'
                                            error={error}
                                            fullWidth
                                            size="small"
                                            value={nFormulario.estado}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    estado: e.target.value
                                                })
                                            }}
                                        >
                                            <MenuItem value='A'>Activo</MenuItem>
                                            <MenuItem value='I'>Inactivo</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            nombremodal='Categoria'
                                            url={`${URLAPIGENERAL}/categorias/listar`}
                                            disparador={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    categoria: e.codigo,
                                                    nomcategoria: e.nombre,
                                                    // estadocat: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: nFormulario.categoria, nombre: nFormulario.nomcategoria }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            nombremodal='Familia'
                                            url={`${URLAPIGENERAL}/familia/filtrar/Categoria?categoria=${nFormulario.categoria}`}
                                            disparador={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    familia: e.codigo,
                                                    nomfamilia: e.nombre,
                                                    // estadofami: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: nFormulario.familia, nombre: nFormulario.nomfamilia }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            nombremodal='Linea'
                                            url={`${URLAPIGENERAL}/linea/filtrarfamilia?familia=${nFormulario.familia}`}
                                            disparador={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    linea: e.codigo,
                                                    nomlinea: e.nombre,
                                                })
                                            }}
                                            estadoinicial={{ codigo: nFormulario.linea, nombre: nFormulario.nomlinea }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            nombremodal='Marca'
                                            url={`${URLAPIGENERAL}/marcas/listar`}
                                            disparador={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    marca: e.codigo,
                                                    nommarca: e.nombre,
                                                    // estadomarc: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: nFormulario.marca, nombre: nFormulario.nommarca }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            nombremodal='Presentacion'
                                            url={`${URLAPIGENERAL}/presentaciones/listar`}
                                            disparador={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    presenta: e.codigo,
                                                    nompresenta: e.nombre,
                                                    // estadoprese: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: nFormulario.presenta, nombre: nFormulario.nompresenta }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            nombremodal='Proveedor'
                                            url={`${URLAPIGENERAL}/proveedores/listar`}
                                            disparador={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    proveedor: e.codigo,
                                                    nomproveedor: e.nombre,
                                                    // estadoprove: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: nFormulario.proveedor, nombre: nFormulario.nomproveedor }}
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel value={value} index={1}>
                                <Grid container spacing={1}>
                                    <Grid item md={6} sm={12}>
                                        <Grid container spacing={1}>
                                            <Grid item md={12} sm={12} xs={12}>
                                                <TextField
                                                    label='Factor por Caja'
                                                    // error={error}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type='number'
                                                    value={nFormulario.factor}
                                                    onChange={(e) => {
                                                        setNFormulario({
                                                            ...nFormulario,
                                                            factor: e.target.value
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={12} sm={12} xs={12}>
                                                <TextField
                                                    label='Peso (gms)'
                                                    // error={error}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type='number'
                                                    value={nFormulario.peso}
                                                    onChange={(e) => {
                                                        setNFormulario({
                                                            ...nFormulario,
                                                            peso: e.target.value
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item md={12} sm={12} xs={12}>
                                                <TextField
                                                    label='Volumen (cm3)'
                                                    // error={error}
                                                    variant="outlined"
                                                    fullWidth
                                                    size="small"
                                                    type='number'
                                                    value={nFormulario.volumen}
                                                    onChange={(e) => {
                                                        setNFormulario({
                                                            ...nFormulario,
                                                            volumen: e.target.value
                                                        })
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid item md={6}>
                                        <Grid container >
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={dispovenv}
                                                        onChange={handleSetdispoven}
                                                    />}
                                                    label='Disponible para la venta'
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={ivav}
                                                        onChange={handleSetiva}
                                                    />}
                                                    label='Graba IVA'
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={combov}
                                                        onChange={handleSetcombo}
                                                    />}
                                                    label='Item - Combo'
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={regalov}
                                                        onChange={handleSetregalo}
                                                    />}
                                                    label='Item - Regalo'
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={pespecialv}
                                                        onChange={handleSetpespecial}
                                                    />}
                                                    label='Producto Especial'
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={soloposv}
                                                        onChange={handleSetsolopos}
                                                    />}
                                                    label='Solo para POS'
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={pseriev}
                                                        onChange={handleSetpeserie}
                                                    />}
                                                    label='Producto con Serie'
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={ptransportev}
                                                        onChange={handleSetptransporte}
                                                    />}
                                                    label='Producto transporte'
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid container spacing={1} mt={1}>
                                    <Grid item md={6} sm={6} xs={12}>
                                        <TextField
                                            label='Observacion'
                                            // error={error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            value={nFormulario.observa}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    observa: e.target.value
                                                })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <TextField
                                            label='% desc sug adicional'
                                            // error={error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            type='number'
                                            value={nFormulario.pordessugerido}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    pordessugerido: e.target.value
                                                })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <TextField
                                            label='Cod Proveedor'
                                            // error={error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            value={nFormulario.codprov}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    codprov: e.target.value
                                                })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <TextField
                                            label='% util venta'
                                            // error={error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            type='number'
                                            value={nFormulario.porutiventa}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    porutiventa: e.target.value
                                                })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <TextField
                                            label='Stock minimo'
                                            // error={error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            type='number'
                                            value={nFormulario.stockmi}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    stockmi: e.target.value
                                                })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <TextField
                                            label='Stock maximo'
                                            // error={error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            type='number'
                                            value={nFormulario.stockma}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    stockma: e.target.value
                                                })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <TextField
                                            label='Stock mayorista'
                                            // error={error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            type='number'
                                            value={nFormulario.stockmay}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    stockmay: e.target.value
                                                })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <TextField
                                            label='PVP'
                                            // error={error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            type='number'
                                            value={nFormulario.pvp}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    pvp: e.target.value
                                                })
                                            }}
                                        />
                                    </Grid>
                                    <Grid item md={2} sm={6} xs={12}>
                                        <TextField
                                            label='% utilidad minimo'
                                            // error={error}
                                            variant="outlined"
                                            fullWidth
                                            size="small"
                                            type='number'
                                            value={nFormulario.poruti}
                                            onChange={(e) => {
                                                setNFormulario({
                                                    ...nFormulario,
                                                    poruti: e.target.value
                                                })
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </TabPanel>
                        </SwipeableViews>
                    </Box>
                </Card>
            </Fade>
        </Page>

    );
}
