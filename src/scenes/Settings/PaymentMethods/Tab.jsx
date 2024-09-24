import React from 'react'
import styled, {css} from 'styled-components'
import {Flex, Link, Box} from 'components'
import useCustomTranslation from 'lib/customT'

const Container = styled(Box)`
  border: 1px solid ${(props) => props.theme.colors.secondary};
  border-radius: 5px;
  background: ${(props) => props.theme.colors.white};
  position: relative;
  margin: 0 0 10px 0;
  display:block;
  text-align: center;

  ${(props) =>
    props.active &&
    css`
      background: ${(props) => props.theme.colors.secondaryLight};
    `}
`

const Tab = ({name, active, path, icon: Icon}) => {
  const t = useCustomTranslation()

  // FALAL TEMP Fix
  if (name == "mobilepaysubscription")
  {
    name = t('MobilePay Subscription (1% i transaktionsgebyr, dog mindst 1 kr.)')
  }

  if (name == "mobilepay") {
    name = t('MobilePay Payments (1% i transaktionsgebyr)')
  }

  return (
    <Container active={active}>
      <Link style={ { fontWeight: 'bold' } } color={active ? 'primary' : 'secondary'} to={path}>
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
}

export default Tab
