import React, { useState, createContext,useMemo  } from 'react';

export const ModalContext = createContext();

export const ModalProvider = props => {
    const [rowsModal,setRowsModal] = useState([]);
    const [nombreModal, setNombreModal] = useState('');
    const [openModalContex, setOpenModalContex] = useState(false);

    const [postData, setPostData] = useState({
		motivo: '',
		operador: 'ADM',
		empreOrigen: '',
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
        rowsModal,
        setRowsModal,
        nombreModal,
        setNombreModal,
        openModalContex,
        setOpenModalContex,
        postData, setPostData
    }),[rowsModal, openModalContex]);
    
    return (
        <ModalContext.Provider value={[value]}>
            {props.children}
        </ModalContext.Provider>
    );
}