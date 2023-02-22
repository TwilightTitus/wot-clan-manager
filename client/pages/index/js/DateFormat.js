((global) => {
    const DATEFORMAT = new Intl.DateTimeFormat('default', {weekday: 'long',month: 'long', day:'numeric'});
	const toDate = (date = new Date()) => {
		return DATEFORMAT.format(date)
	};

    global.DateFormats = global.DateFormats || {
		toDate
	};
})(window);