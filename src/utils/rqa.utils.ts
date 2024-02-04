export const validateObject = (obj: any) => {
	if (obj === undefined || obj === null) {
		return false;
	}

	if (Array.isArray(obj) && obj.length === 0) {
		return false;
	}

	if (typeof obj === 'object') {
		for (const key in obj) {
			if (validateObject(obj[key]) === false) {
				return false;
			}
		}
	}

	return true;
}