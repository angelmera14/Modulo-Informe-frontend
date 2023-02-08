export const noEsVacio = (formulario, propiedades = []) => {
    try {
      let valido = false;
      if (propiedades.length > 0) {
        propiedades.forEach((prop) => {
          // eslint-disable-next-line no-prototype-builtins
          if (formulario.hasOwnProperty(prop)) {
            delete formulario[prop];
          }
        });
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const clave in formulario) {
        // eslint-disable-next-line no-prototype-builtins
        if (formulario.hasOwnProperty(clave)) {
          const valor = String(formulario[clave]).trimEnd().trimStart();
          valido = valor !== "";
          if (!valor) {
            break;
          }
        }
      }
      return valido;
    } catch {
      return false;
    }
  };