export const formaterarFecha = (fecha, separador, union) => {
    try {
        let f = String(fecha).substring(0, 10)
        f = f.split(separador)
        f = f.reverse()
        f = f.join(union)
        return f
    } catch {
        return "--/--/----"
    }
}