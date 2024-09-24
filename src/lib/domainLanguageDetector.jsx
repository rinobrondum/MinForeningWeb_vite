export default {
  name: 'domainLanguageDetector',

  lookup() {
    switch (window.location.hostname) {
      case 'web.minforening.dk':
        return 'da'
      case 'web.mehrverein.de':
        return 'de'
      case 'web.wiandi.co.uk':
        return 'en'
      case 'web.wiandi.es':
        return 'es'
      case 'web.wiandi.pl':
        return 'pl'
      case 'web.wiandi.cz':
        return 'cz'
      case 'web.min-forening.no':
        return 'no'
      case 'web.wiandi.cz':
        return 'cz'
      default:
        return null
    }
  },
}
