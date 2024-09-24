import { css } from 'styled-components'

const createColorMixin = color => css`
  color: ${color};
`

export default createColorMixin
