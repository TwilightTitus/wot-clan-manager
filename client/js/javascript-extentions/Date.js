window.Date.prototype.addDays = function (days) {
    const date = new Date(this);
    date.setDate(date.getDate() + days);
    return date;
};