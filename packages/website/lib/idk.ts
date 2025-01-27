export const joinWithAnd = (arr: string[]) => {
	if (arr.length === 0) return '';
	if (arr.length === 1) return String(arr[0]);

	const allButLast = arr.slice(0, -1);
	const last = arr[arr.length - 1];

	return allButLast.join(', ') + ' & ' + last;
};

export const formatDateWithTimezone = (date: Date) => {
	const options = {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		timeZoneName: 'short'
	};

	return date.toLocaleString('en-US', options);
};