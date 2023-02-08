import * as React from 'react';
import {
    Modal,
    // Fade,
    Box, CircularProgress
} from '@mui/material';
import PropTypes from 'prop-types';

CircularProgreso.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose1: PropTypes.func.isRequired,

}

export default function CircularProgreso(props) {
    const { open, handleClose1 } = props;
    return (
        <Modal
            open={open}
            onClose={handleClose1}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                mx="auto"
                style={{
                    display: 'flex',
                    position: 'absolute',
                    margin: 'auto',
                    backgroundColor: 'black',
                    opacity: '50%',
                    width: '100vw',
                    height: '100vh',
                    zIndex: 'auto',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                <Box mx="auto">
                    <CircularProgress style={{ color: '#2196F3' }} />
                </Box>
            </Box>
        </Modal>
    );
}
