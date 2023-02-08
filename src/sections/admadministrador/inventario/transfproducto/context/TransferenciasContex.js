import React, { useState, createContext, useMemo } from 'react';
import { useLocalStorage } from "../components/useLocalStorage";

export const TranferenciasContext = createContext();

export const TransferenciasProvider = props => {
    
    const [rowsInfor, setRowsInfor] = useState([]);
    const [productos, setProductos] = useState([]);
    const [btnProcesar,setBtnProcesar] =  useState(true);
    const [disableOrigen,setDisableOrigen] =  useState(false);
    const [motivoSelected, setMotivoSelected] = useState('');
    const [EmpresaOrigen, setEmpresaOrigen] = useState({ NOMBRE: 'Cargando', CONEXION: '-', BODFAC: '10' });
    const [EmpresaDestino, setEmpresaDestino] = useState({ NOMBRE: 'Cargando', CONEXION: '-', BODFAC: '10' });

    const [postData, setPostData] = useState({
        secuencial: '',
        numero: '',
		motivo: '',
		operador: 'ADM',
		empreOrigen: EmpresaOrigen.CONEXION,
		cabecera: [
			{
				iva: 0,
				neto: 0,
				observacion: 'realizado en Web'
			}
		],
		itemsp: []
	});

    const value = useMemo(() => ({
        rowsInfor,
        setRowsInfor,
        productos,
        setProductos,
        btnProcesar,
        setBtnProcesar,
        disableOrigen,
        setDisableOrigen,
        motivoSelected,
        setMotivoSelected,
        EmpresaOrigen,
        setEmpresaOrigen,
        EmpresaDestino,
        setEmpresaDestino,
        postData,
        setPostData
    }),[
        rowsInfor,
        EmpresaOrigen,
        EmpresaDestino,
        btnProcesar,
        disableOrigen,
        motivoSelected,
        postData
    ]);
    
    return (
        <TranferenciasContext.Provider value={[value]}>
            {props.children}
        </TranferenciasContext.Provider>
    );
}