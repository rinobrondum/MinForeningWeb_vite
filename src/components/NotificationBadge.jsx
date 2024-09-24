import React from 'react'
import styled from 'styled-components'
import {pure} from 'recompose'
import createBackgroundMixin from 'lib/style/createBackgroundMixin'

const Container = styled.div`
  padding: 1px 3px;
  ${(props) =>
    props.warning && createBackgroundMixin(props.theme.colors.warning)};
  ${(props) =>
    props.danger && createBackgroundMixin(props.theme.colors.danger)};
  ${(props) =>
    props.purple && createBackgroundMixin(props.theme.colors.purple)};
  ${(props) =>
    props.primary && createBackgroundMixin(props.theme.colors.primary)};
  color: white;
  display: inline-block;
  justify-content: center;
  align-items: center;
  text-align: center;
  border-radius: 3px;
`

const NotificationBadge = pure(({value, ...props}) => (
  <Container {...props}>{value}</Container>
))

export default NotificationBadge
