((global) => {
	const toDate = (date = new Date()) => {		
		const year = date.getFullYear();		
		const month = date.getMonth();
		date = date.getDate();
		return {
			date, month, year,
			test: year * 10000 + month * 100 + date
		};
	};

	const dateGreaterEqual = (a, b) => {
		a = toDate(a instanceof Date ? a : Date.parse(a));
		b = toDate(b instanceof Date ? b : Date.parse(b));

		return a.test >= b.test;
	};

	const dateGreater = (a, b) => {
		a = toDate(a instanceof Date ? a : Date.parse(a));
		b = toDate(b instanceof Date ? b : Date.parse(b));

		return a.test > b.test;
	};

	global.formUtils = global.formUtils || {
		date: {
			greaterEqual: dateGreaterEqual,
			greaterEqualNow: (date) => dateGreaterEqual(date, new Date()),
            greater: dateGreater
		},
	};
})(window);
