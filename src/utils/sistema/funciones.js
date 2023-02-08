import axios from "axios";

export const obtenerMaquina = async () => {
    const { data } = await axios('https://api.ipify.org/?format=json');
    return data.ip
}

export function ordenarListaJson(data, key, orden) {
	try {
		// eslint-disable-next-line array-callback-return
		return data.sort((a, b) => {
			const x = a[key];
			const y = b[key];
	
			if (orden === 'asc') {
				// eslint-disable-next-line no-nested-ternary
				return x < y ? -1 : x > y ? 1 : 0;
			}
	
			if (orden === 'desc') {
				// eslint-disable-next-line no-nested-ternary
				return x > y ? -1 : x < y ? 1 : 0;
			}
		});
	} catch (error) {
		return []
	}
	// eslint-disable-next-line array-callback-return
	
}