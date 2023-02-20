((global) => {
	const toDate = (date = new Date()) => {
		return {
			date: date.getDate(),
			month: date.getMonth(),
			year: date.getFullYear(),
		};
	};

	const dateGreaterEqual = (a, b) => {
		a = toDate(a instanceof Date ? a : Date.parse(a));
		b = toDate(b instanceof Date ? b : Date.parse(b));

		return a.date >= b.date && a.month >= b.month && a.year >= b.year;
	};

	const dateGreater = (a, b) => {
		a = toDate(a instanceof Date ? a : Date.parse(a));
		b = toDate(b instanceof Date ? b : Date.parse(b));

		return a.date > b.date || a.month > b.month || a.year > b.year;
	};

	global.formUtils = global.formUtils || {
		date: {
			greaterEqual: dateGreaterEqual,
			greaterEqualNow: (date) => dateGreaterEqual(date, new Date()),
            greater: dateGreater
		},
	};
})(window);
