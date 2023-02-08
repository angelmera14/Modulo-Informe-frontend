import React, { useState } from 'react';

const Context = React.createContext({});

// eslint-disable-next-line react/prop-types
export function UsuarioContextProvider({ children }) {
    const [usuario, setUsuario] = useState(null);
    return (
        <Context.Provider value={{ usuario, setUsuario }}>
            {children}
        </Context.Provider>
    )
}

export default Context;