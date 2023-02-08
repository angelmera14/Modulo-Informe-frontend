import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { TextField, Card, Grid, Fade, MenuItem, FormControlLabel, Checkbox } from "@mui/material";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@mui/material/styles';
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

    const { token } = JSON.parse(window.localStorage.getItem("usuario"));

    const [error, setError] = React.useState(false);

    const [errorb, setErrorb] = React.useState(false);

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

    const [ultimoItem, setUltimoItem] = React.useState({
        codigo: '',
    });
    const [iniciales, setIniciales] = React.useState({
        longitud: '',
    })

    const generarCodigo = (numero, cantceros) => {
        let ceros = Array.from({ length: cantceros }, () => 0);
        ceros = ceros.join('');
        const nums = numero.toString();
        const cero1 = ceros.split('');
        // eslint-disable-next-line no-plusplus
        for (let step = 0; step < nums.length; step++) {
            cero1.pop();
        }
        const cero2 = cero1.join('');
        return `${cero2}${numero + 1}`;
    };

    const codigoitem = generarCodigo(ultimoItem.codigo, iniciales.longitud)

    const [formulario, setFormulario] = React.useState({
        codcategoria: '',
        categoria: '',
        estadocat: '',
        codfamilia: '',
        familia: '',
        estadofami: '',
        codlinea: '',
        linea: '',
        estadolin: '',
        codmarca: '',
        marca: '',
        estadomarc: '',
        codprese: '',
        presentacion: '',
        estadoprese: '',
        codprove: '',
        proveedor: '',
        estadoprove: '',

        codbarra: '',
        nombre: '',
        estado: '',
        factorporcaja: 1,
        peso: 0,
        volumen: 0,
        disponiblevta: true,
        grabaIVA: true,
        itemcombo: false,
        itemregalo: false,
        prodespecial: false,
        soloparaPOS: false,
        prodconserie: false,
        prodtransporte: false,
        observacion: '',
        descsugadicional: 0,
        codigoprovee: '',
        utilventa: 0,
        stockmin: 0,
        stockmax: 0,
        stockmay: 0,
        pvp: 0,
        utilmin: 0
    })

    const formvacio = {
        nombre: formulario.nombre,
        estado: formulario.estado,
        codcategoria: formulario.codcategoria,
        codfamilia: formulario.codfamilia,
        // codlinea: formulario.codlinea,
        codmarca: formulario.codmarca,
        codprese: formulario.codprese,
        codprov: formulario.codprove
    }

    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }
    // .log('formulario ojo', formulario)


    const limpiarCampos = () => {
        setFormulario({
            codcategoria: '',
            categoria: '',
            estadocat: '',
            codfamilia: '',
            familia: '',
            estadofami: '',
            codlinea: '',
            linea: '',
            estadolin: '',
            codmarca: '',
            marca: '',
            estadomarc: '',
            codprese: '',
            presentacion: '',
            estadoprese: '',
            codprove: '',
            proveedor: '',
            estadoprove: '',

            codbarra: '',
            nombre: '',
            estado: '',
            factorporcaja: 1,
            peso: 0,
            volumen: 0,
            disponiblevta: true,
            grabaIVA: true,
            itemcombo: false,
            itemregalo: false,
            prodespecial: false,
            soloparaPOS: false,
            prodconserie: false,
            prodtransporte: false,
            observacion: '',
            descsugadicional: 0,
            codigoprovee: '',
            utilventa: 0,
            stockmin: 0,
            stockmax: 0,
            stockmay: 0,
            pvp: 0,
            utilmin: 0
        })
    };

    const Grabar = async () => {
        try {
            const noesvacio = noEsVacio(formvacio);
            // .log('v', noesvacio)
            const form = {
                item: codigoitem,
                codbarra: formulario.codbarra === '' ? '' : formulario.codbarra,
                nombre: formulario.nombre,
                nombrecorto: '  ',
                estado: formulario.estado,
                categoria: formulario.codcategoria,
                familia: formulario.codfamilia,
                linea: formulario.codlinea,
                marca: formulario.codmarca,
                presenta: formulario.codprese,
                proveedor: formulario.codprove,
                factor: parseFloat(formulario.factorporcaja),
                peso: parseFloat(formulario.peso),
                volumen: parseFloat(formulario.volumen),
                dispoven: formulario.disponiblevta === true ? 'S' : 'N',
                iva: formulario.grabaIVA === true ? 'S' : 'N',
                combo: formulario.itemcombo === true ? 'S' : 'N',
                regalo: formulario.itemregalo === true ? 'S' : 'N',
                pespecial: formulario.prodespecial === true ? 'S' : 'N',
                solopos: formulario.soloparaPOS === true ? 'S' : 'N',
                pserie: formulario.prodconserie === true ? 'S' : 'N',
                ptransporte: formulario.prodtransporte === true ? 'S' : 'N',
                observa: formulario.observacion === '' ? '   ' : formulario.observacion,
                pordessugerido: parseFloat(formulario.descsugadicional),
                codprov: formulario.codigoprovee === '' ? '   ' : formulario.codigoprovee,
                porutiventa: parseFloat(formulario.utilventa),
                stockmi: parseFloat(formulario.stockmin),
                stockma: parseFloat(formulario.stockmax),
                stockmay: parseFloat(formulario.stockmay),
                pvp: parseFloat(formulario.pvp),
                poruti: parseFloat(formulario.utilmin),
                bien: "B",
                grupo: "  ",
                cuentaventa: '  ',
                numcotizacion: 0,
                tipoproducto: '  ',
                cantidadxcaja: 0,
                codship: '  ',
                descripcion: '  ',
                subcategoria: '  '
            }
            const esbarra = await axios(`${URLAPIGENERAL}/codbarra/obtener?codbarra=${formulario.codbarra}`, config)
            console.log(esbarra.data);
            if (!noesvacio) {
                messajeTool('error', 'Complete los campos requeridos');
                setError(true);
            
                return false;
            }
            if (existe === 1) {
                messajeTool('error', 'El codigo de barras ingresado ya existe');
                setErrorb(true);
                
                return false;
            }

            
            const { data } = await axios.post(`${URLAPIGENERAL}/productos`, form, config)
            if (data === 200) {
                mensajeSistema('Registros guardados correctamente', 'success');
                navegacion(`/sistema/inventario/productos`)
            }
        }
        catch (error) {
            // console.log("miraaa este error",error);
            // .log('fn')
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

    React.useEffect(() => {
        async function obtenercoditem() {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            try {
                const { data } = await axios(`${URLAPIGENERAL}/productos/listar`, config);
                const { [Object.keys(data).pop()]: lastItem } = data;
                // .log('ultimo item', lastItem.item);
                setUltimoItem({
                    ...ultimoItem,
                    codigo: Number(lastItem.item)
                })
            } catch (error) {
                // .log(error)
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                }
            }
        };
        obtenercoditem();
    }, [])

    React.useEffect(() => {
        async function obteneriniciales() {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            try {
                const { data } = await axios(`${URLAPIGENERAL}/inicales/listar?opcion=ADMITEM`, config);
                // .log('iniciales', data);
                setIniciales({
                    ...iniciales,
                    longitud: data[0].longitud
                })
            } catch (error) {
                // .log(error);
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                }
            }
        };
        obteneriniciales();
    }, [])

    const [existe, setExiste] = React.useState(0)

    React.useEffect(() => {
        async function comprobarcodbarra() {
            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
            try {
                const { data } = await axios(`${URLAPIGENERAL}/codbarra/obtener?codbarra=${formulario.codbarra}`, config)
                setExiste(data[0].existe_Codbarra)
                console.log("miraa",data[0].existe_Codbarra);

            } catch (error) {
                // .log(error);
                if (error.response.status === 401) {
                    navegacion(`${PATH_AUTH.login}`);
                    mensajeSistema("Su inicio de sesion expiro", "error");
                }
                if (error.response.status === 500) {
                    navegacion(`${PATH_PAGE.page500}`);
                }
            }
        };
        comprobarcodbarra();
    }, [formulario.codbarra])

    // .log('1 = existe | 0 = no existe....', existe)
    if (existe === 1) {
        messajeTool('error', 'El codigo de barras ingresado ya existe');
    }


    return (
        <Page title='Nuevos Productos'>
            <MenuMantenimiento
                modo
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
                    <h1>Ingreso de Productos</h1>
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
                                            value={codigoitem}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item md={3} sm={6} xs={12}>
                                        <TextField
                                            error={errorb}
                                            label='Codigo de Barra'
                                            fullWidth
                                            size="small"
                                            variant='outlined'
                                            value={formulario.codbarra}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
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
                                            value={formulario.nombre}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
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
                                            value={formulario.estado}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
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
                                                setFormulario({
                                                    ...formulario,
                                                    codcategoria: e.codigo,
                                                    categoria: e.nombre,
                                                    estadocat: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: formulario.codcategoria, nombre: formulario.categoria, estado: formulario.estadocat }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            desactivar={formulario.codcategoria === ''}
                                            descativarbusqueda={formulario.codcategoria === ''}
                                            nombremodal='Familia'
                                            url={`${URLAPIGENERAL}/familia/filtrar/Categoria?categoria=${formulario.codcategoria}`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    codfamilia: e.codigo,
                                                    familia: e.nombre,
                                                    estadofami: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: formulario.codfamilia, nombre: formulario.familia, estado: formulario.estadofami }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            desactivar={formulario.codfamilia === ''}
                                            descativarbusqueda={formulario.codfamilia === ''}
                                            nombremodal='Linea'
                                            url={`${URLAPIGENERAL}/linea/filtrarfamilia?familia=${formulario.codfamilia}`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    codlinea: e.codigo,
                                                    linea: e.nombre,
                                                    estadolin: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: formulario.codlinea, nombre: formulario.linea, estado: formulario.estadolinea }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            nombremodal='Marca'
                                            url={`${URLAPIGENERAL}/marcas/listar`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    codmarca: e.codigo,
                                                    marca: e.nombre,
                                                    estadomarc: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: formulario.codmarca, nombre: formulario.marca, estado: formulario.estadomarc }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            nombremodal='Presentacion'
                                            url={`${URLAPIGENERAL}/presentaciones/listar`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    codprese: e.codigo,
                                                    presentacion: e.nombre,
                                                    estadoprese: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: formulario.codprese, nombre: formulario.presentacion, estado: formulario.estadoprese }}
                                        />
                                    </Grid>
                                    <Grid item md={6} sm={12} xs={12}>
                                        <CajaGenerica
                                            error={error}
                                            nombremodal='Proveedor'
                                            url={`${URLAPIGENERAL}/proveedores/listar`}
                                            disparador={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    codprove: e.codigo,
                                                    proveedor: e.nombre,
                                                    estadoprove: e.estado
                                                })
                                            }}
                                            estadoinicial={{ codigo: formulario.codprove, nombre: formulario.proveedor, estado: formulario.estadoprove }}
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
                                                    value={formulario.factorporcaja}
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
                                                            factorporcaja: e.target.value
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
                                                    value={formulario.peso}
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
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
                                                    value={formulario.volumen}
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
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
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
                                                            disponiblevta: e.target.checked
                                                        })
                                                    }}
                                                    value={formulario.disponiblevta}
                                                    control={<Checkbox />}
                                                    label='Disponible para la venta'
                                                    checked={formulario.disponiblevta}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
                                                            grabaIVA: e.target.checked
                                                        })
                                                    }}
                                                    value={formulario.grabaIVA}
                                                    control={<Checkbox />}
                                                    label='Graba IVA'
                                                    checked={formulario.grabaIVA}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
                                                            itemcombo: e.target.checked
                                                        })
                                                    }}
                                                    value={formulario.itemcombo}
                                                    control={<Checkbox />}
                                                    label='Item - Combo'
                                                    checked={formulario.itemcombo}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
                                                            itemregalo: e.target.checked
                                                        })
                                                    }}
                                                    value={formulario.itemregalo}
                                                    control={<Checkbox />}
                                                    label='Item - Regalo'
                                                    checked={formulario.itemregalo}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
                                                            prodespecial: e.target.checked
                                                        })
                                                    }}
                                                    value={formulario.prodespecial}
                                                    control={<Checkbox />}
                                                    label='Producto Especial'
                                                    checked={formulario.prodespecial}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
                                                            soloparaPOS: e.target.checked
                                                        })
                                                    }}
                                                    value={formulario.soloparaPOS}
                                                    control={<Checkbox />}
                                                    label='Solo para POS'
                                                    checked={formulario.soloparaPOS}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
                                                            prodconserie: e.target.checked
                                                        })
                                                    }}
                                                    value={formulario.prodconserie}
                                                    control={<Checkbox />}
                                                    label='Producto con Serie'
                                                    checked={formulario.prodconserie}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={6}>
                                                <FormControlLabel
                                                    onChange={(e) => {
                                                        setFormulario({
                                                            ...formulario,
                                                            prodtransporte: e.target.checked
                                                        })
                                                    }}
                                                    value={formulario.prodtransporte}
                                                    control={<Checkbox />}
                                                    label='Producto transporte'
                                                    checked={formulario.prodtransporte}
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
                                            value={formulario.observacion}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    observacion: e.target.value
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
                                            value={formulario.descsugadicional}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    descsugadicional: e.target.value
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
                                            value={formulario.codigoprovee}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    codigoprovee: e.target.value
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
                                            value={formulario.utilventa}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    utilventa: e.target.value
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
                                            value={formulario.stockmin}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    stockmin: e.target.value
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
                                            value={formulario.stockmax}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    stockmax: e.target.value
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
                                            value={formulario.stockmay}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
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
                                            value={formulario.pvp}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
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
                                            value={formulario.utilmin}
                                            onChange={(e) => {
                                                setFormulario({
                                                    ...formulario,
                                                    utilmin: e.target.value
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
