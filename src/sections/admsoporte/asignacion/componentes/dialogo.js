import { memo, useEffect, useState } from "react";
import axios from "axios";
import {
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Dialog,
    DialogTitle
} from '@mui/material';
import PersonRounded from "@mui/icons-material/PersonRounded";
import { URLAPIGENERAL } from '../../../../config';

function SimpleDialog(props) {
    const [emails, setEmail] = useState([
        { email: 'Cargando..', idOperador: 0, nombre: 'Cargando..', departamento: '...' }
    ]);

    useEffect(() => {
        async function getOperador() {
            const urlFinal = `${URLAPIGENERAL}/listaroperador`;
            axios.get(urlFinal).then(res => {
                const dataC = res.data;
                setEmail(
                    dataC.data.map(({ idoperador, nombre, email, departamento }) => ({
                        idOperador: idoperador,
                        email,
                        nombre,
                        departamento
                    }))
                );
            });
        }
        getOperador();
    }, []);

    // eslint-disable-next-line react/prop-types
    const { onClose, selectedValue, open, ticketusando } = props;

    const handleClose = () => {
        onClose(selectedValue, ticketusando);
    };

    const handleListItemClick = (email, id, ticketusandol) => {
        onClose(email, id, ticketusandol);
    };

    return (
        <Dialog id={ticketusando} onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
            <DialogTitle>Operador para el Ticket {ticketusando}</DialogTitle>
            <List>
                {emails.map(ope => (
                    <ListItem
                        button
                        onClick={() => handleListItemClick(ope.email, ope.idOperador, ticketusando)}
                        key={ope.idOperador}
                        tickettratado={ticketusando}
                    >
                        <ListItemAvatar>
                            <Avatar>
                                <PersonRounded />
                            </Avatar>
                        </ListItemAvatar>

                        <ListItemText primary={`${ope.nombre}`} />

                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

export default memo(SimpleDialog);