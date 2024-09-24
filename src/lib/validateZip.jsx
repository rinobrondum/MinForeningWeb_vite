function validateZip(value, locale = 'da') {
  switch (locale) {
    case 'da':
      return /^\d{4}$/.test(value)
    case 'de':
      return /^\d{5}$/.test(value)
    case 'en':
      return /^[A-Z]{1,2}[0-9R][0-9A-Z]? [0-9][ABD-HJLNP-UW-Z]{2}$/.test(value)
    case 'es':
      return /^\d{5}$/.test(value)
    case 'pl':
      return /^\d{2}-\d{3}$/.test(value)
    case 'cz':
        return /^\d{3}[ ]?\d{2}$/.test(value)
    case 'no':
      return /^\d{4}$/.test(value)
    case 'sk':
      return /^\d{3}[ ]?\d{2}$/.test(value)
    default:
      return false
  }
}

export default validateZip
