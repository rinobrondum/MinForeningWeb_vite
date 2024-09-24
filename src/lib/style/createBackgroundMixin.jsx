import { css } from 'styled-components'

const createBackgroundMixin = color => css`
  background: ${color};
`

export default createBackgroundMixin
