function formatDate(date) {
  return date.split('-').reverse().join('/');
}

function formatSelectDate(date) {
  const newDate = date.split('-').map(Number);

  const YEAR = newDate[0];
  const MONTH = newDate[1]-1;
    
  const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const selectDate = `${monthNames[MONTH]}/${YEAR}`;
  
  return selectDate;
}

export { formatDate, formatSelectDate };