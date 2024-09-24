import React from 'react'
import styled, {css} from 'styled-components'
import {Flex, Link, Box} from 'components'

const Container = styled(Box)`
  border: 1px solid ${(props) => props.theme.colors.secondary};
  border-radius: 5px 5px 0 0;
  border-left: 0;
  background: ${(props) => props.theme.colors.white};
  position: relative;
  top: 1px;
  text-align: center;

  ${(props) =>
    props.active &&
    css`
      border-bottom: 1px solid ${(props) => props.theme.colors.secondaryLight};
      background: ${(props) => props.theme.colors.secondaryLight};
    `}
`

const Tab = ({name, active, path, icon: Icon}) => (
  <Container active={active}>
    <Link bold color={active ? 'primary' : 'secondary'} to={path}>
      <Flex alignItems="center" py={3} px={4}>
        {Icon && (
          <Box mr={2}>
            <Icon fill={active ? 'primary' : 'secondary'} size={16} />
          </Box>
        )}
        {name}
      </Flex>
    </Link>
  </Container>
)

export default Tab
