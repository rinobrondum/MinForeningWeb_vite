import React from 'react'
import {withTheme} from 'styled-components'
import ReactIconBase from 'react-icon-base'

const IconBase = ({theme, fill, children, innerRef, ...rest}) => (
  <ReactIconBase fill={theme.colors[fill] || fill} {...rest}>
    {children}
  </ReactIconBase>
)

export default withTheme(IconBase)
