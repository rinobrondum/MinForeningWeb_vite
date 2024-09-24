export default function price(amount, {prefix} = {prefix: 'kr.'}) {
  return `${parseFloat(amount, 10)
    .toFixed(2)
    .toString()
    .replace('.', ',')} ${prefix.trim()}`
}
