export const getValue = (property, data) => {
	const properties = property.split(".");
	let valueParam = false;
	properties.forEach((param) => {
		if (valueParam) {
			valueParam = valueParam[param];
		} else {
			valueParam = data[param];
		}
	});
	return valueParam;
};