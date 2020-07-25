const CURRENT_YEAR = new Date().getFullYear();
const CURRENT_MONTH = new Date().getMonth()+1;
const YEARS = [CURRENT_YEAR - 1, CURRENT_YEAR, CURRENT_YEAR + 1];
const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const PERIODS = [];

let startSelectedPeriod = null;

YEARS.forEach(year => {
  MONTHS.forEach(month => {
    const currentPeriod = `${year}-${month.toString().padStart(2,'0')}`;
    if (year === CURRENT_YEAR && month === CURRENT_MONTH) {
      startSelectedPeriod = currentPeriod;
    }
    PERIODS.push(currentPeriod);
  })
})



export {PERIODS, startSelectedPeriod};