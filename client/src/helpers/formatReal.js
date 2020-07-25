const numberFormat = Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function formatReal(numberToBeFormatted) {
  return numberFormat.format(numberToBeFormatted);
}
