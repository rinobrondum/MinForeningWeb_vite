import React from 'react'
import {withTheme} from 'styled-components'
import IconBase from './IconBase'

const Invite = ({theme, ...rest}) => (
  <IconBase viewBox="0 0 48.31 34.63" {...rest}>
    <g transform="translate(-87 -89.965)">
      <g className="st0">
        <path
          className="st1"
          d="M104.72,102.58h-7.33v7.33h-3.06v-7.33H87v-3.06h7.33v-7.35h3.06v7.35h7.33V102.58z"
        />
      </g>
      <g transform="translate(159.7 145.92)">
        <circle className="st1" cx="-39.53" cy="-45.64" r="10.32" />
        <path
          className="st1"
          d="m-39.53-33.72c-6.11 0.03-11.8 3.14-15.13 8.26 0 0 2.75 4.13 15.37 4.13 12.15 0 14.91-4.13 14.91-4.13-3.35-5.12-9.04-8.22-15.15-8.26z"
        />
      </g>
    </g>
  </IconBase>
)

export default withTheme(Invite)
