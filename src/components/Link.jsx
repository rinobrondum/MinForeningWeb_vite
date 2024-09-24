import React from 'react'
import styled from 'styled-components'
import {branch, renderComponent, compose} from 'recompose'
import {Link as RouterLink} from 'react-router-dom'
import typography from 'lib/style/typography'
import {Text} from 'components'

const Link = styled.a`
  ${typography};
  text-decoration: none;
  ${(props) => props.block && 'display: block'};
`

const StyledRouterLink = Link.withComponent(RouterLink)

const ExternalLink = ({to, children, ...rest}) => (
  <Link {...rest} href={to}>
    {children}
  </Link>
)

const DisabledLink = ({children, ...props}) => (
  <Text {...props}>{children}</Text>
)

// Render react-router-dom Link components
// if the page linked to is local (not external)
const enhancer = compose(
  branch(({disabled}) => disabled, renderComponent(DisabledLink)),
  branch(({external}) => !external, renderComponent(StyledRouterLink))
)

export default enhancer(ExternalLink)
