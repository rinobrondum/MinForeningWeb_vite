import format from 'date-fns/format'
import daLocale from 'date-fns/locale/da'
import enLocale from 'date-fns/locale/en'

export default (date, formatString) => {
  const languageFromLS = localStorage.getItem('i18nextLng')
  const locale = languageFromLS === 'da' ? daLocale : enLocale
  return format(date, formatString, {locale})
}
