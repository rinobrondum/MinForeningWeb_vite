import preset from '@rebass/preset'
import parentTheme from 'lib/style/theme'

const theme = {
  ...preset,
  ...parentTheme,
  breakpoints: ['1500px'],
  colors: {
    ...preset.colors,
    ...parentTheme.colors,
  },
  shadows: {
    ...preset.shadows,
    card: '-1px 1px 3px 0 rgba(0, 0, 0, .25)',
  },
  active: false,
}

export default theme
