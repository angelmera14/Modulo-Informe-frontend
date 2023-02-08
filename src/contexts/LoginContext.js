import { createContext } from "react";

const LoginContext = createContext({
    usuario: "--",
    nombreusuario: "----"
});

export default LoginContext