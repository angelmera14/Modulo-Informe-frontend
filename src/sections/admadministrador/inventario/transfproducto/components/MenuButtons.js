import { useState, useContext, useRef } from 'react';
import {
	Grid,
	Box,
	Button
} from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import InsertDriveFileRoundedIcon from '@mui/icons-material/InsertDriveFileRounded';
import FilePresentRoundedIcon from '@mui/icons-material/FilePresentRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import LocalPrintshopRoundedIcon from '@mui/icons-material/LocalPrintshopRounded';
import { URLAPILOCAL, URLAPIGENERAL } from '../../../../../config'
import { PATH_DASHBOARD, PATH_OPSISTEMA } from "../../../../../routes/paths";
import { TranferenciasContext } from '../context/TransferenciasContex';
import HeaderBreadcrumbs from '../../../../../components/cabecerainforme';


export default function MenuButtons(props) {

	const usuario = JSON.parse(window.localStorage.getItem('usuario'));
	const axiosInst = axios.create({
		headers: {
			Authorization: `Bearer ${usuario.token}`,
		}
	});
	const { enqueueSnackbar } = useSnackbar();
	const messajeTool = (variant, msg) => {
		enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
	};
	const [value] = useContext(TranferenciasContext);
	const {
		postData,
		setPostData,
		setBtnProcesar,
		rowsInfor,
		setRowsInfor,
		motivoSelected,
		setMotivoSelected,
		EmpresaOrigen,
		setEmpresaOrigen,
		EmpresaDestino,
		setEmpresaDestino
	} = value;

	const HandleTransferencia = () => {
		// setLoading(true);
		setBtnProcesar(true);
		console.log(rowsInfor);
		const itemsPost = rowsInfor.map(obj2 => {
			return {
				key: obj2.codigo,
				item: obj2.codigo,
				cantiu: parseFloat(obj2.cantidad),
				costo: parseFloat(obj2.total) / parseFloat(obj2.cantidad),
				precio: obj2.precio,
				subTotal: obj2.total,
				iva: 0,
				neto: obj2.total,
				motivo: motivoSelected.trim(),
				empresaDestino: obj2.destinoe
			};
		});


		if (itemsPost.length === 0) {
			messajeTool('error', 'No hay transferencias por realizar.');
		} else {
			postData.itemsp = itemsPost;
			postData.motivo = motivoSelected.trim();
			postData.secuencial = 0;
			postData.numero = 0;

			// verificar una empresa de Origen.
			if (postData.empreOrigen === '-') {
				postData.empreOrigen = EmpresaOrigen.CONEXION;
			}

			const options = { headers: { 'Access-Control-Allow-Origin': '*' } };
			const urlFinal2 = `${URLAPILOCAL}/transferenciaproducto`;
			axiosInst.post(urlFinal2, postData, options).then(res => {
				console.log(res.data);
				if (res.status === 200) {
					const secc = res.data.secuencial;
					const numeroaje = res.data.numero;
					messajeTool('success', `Transferencias Realizadas con exito. Secuencial Numero AJE:${numeroaje}`);
					setPostData({ ...postData, secuencial: secc, numero: numeroaje });
				} else {
					messajeTool('error', 'Inconvenientes al realizar transacciones');
				}
			});
		}
	};

	const printAJE = () => {
		// transferenciaproducto/generarpdf?secuencial=618&conexion=BDADM1
		const seccAJE = postData.secuencial;
		const empresa = postData.empreOrigen;
		if (seccAJE !== 0 && seccAJE !== '') {
			window.open(`${URLAPILOCAL}/transferenciaproducto/generarpdf?secuencial=${seccAJE}&conexion=${empresa}`);
		} else {
			console.log('secuencial vacio');
		}
	}

	const procesarDoc = () => {
		HandleTransferencia();
	}

	const limpiar = () => {
		setRowsInfor([]);
		setPostData({ ...postData, secuencial: 0, numero: '--' });
	}

	return (
		<>
			<HeaderBreadcrumbs
				heading=" Transferencia de Productos"
				links={[
					{ name: 'Inventario' },
					{ name: 'Transferencia de Productos' },
					{ name: 'Operacion' },
				]}
			/>
			<Grid container spacing={1} justifyContent="flex-end" alignItems="rigth">
				<Grid item md={1} xs={4} sx={{ ml: 1 }}>
					<Button variant="text" onClick={() => limpiar()} startIcon={<InsertDriveFileRoundedIcon />}>
						Nuevo
					</Button>
				</Grid>
				<Grid item md={1} xs={4} sx={{ ml: 1 }}>
					<Button
						// disabled={buttonDisabled}
						variant="text"
						onClick={() => procesarDoc()}
						startIcon={<SaveRoundedIcon />}>
						Procesar
					</Button>
				</Grid>
				<Grid item md={1} xs={4} sx={{ ml: 1 }}>
					<Button
						variant="text"
						startIcon={<LocalPrintshopRoundedIcon />}
						onClick={() => printAJE()}
					>
						Imprimir
					</Button>
				</Grid>
				<Grid item md={1} xs={4} sx={{ ml: 1 }}>
					<Button
						variant="outlined"
						startIcon={<ArticleRoundedIcon />}
					>
						{postData.numero !== 0 ? postData.numero : '--'}
					</Button>
				</Grid>
			</Grid>

		</>
	)
}