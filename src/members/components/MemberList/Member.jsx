import React from 'react'
import styled from 'styled-components'
import {Flex, Box, Text, Checkbox, Image} from 'components'
import memberDefault from 'images/member-default.png'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Container = styled(Flex).attrs({
  p: 2,
  alignItems: 'center',
})`
  background: ${(props) => props.theme.colors.secondaryLight};
  opacity: ${(props) => (props.fade ? 0.66 : 1)};
`

const Member = ({
  id,
  firstName,
  surname,
  fade,
  toggleMember,
  checked,
  headerImage,
  isInactiveUser,
}) => {
  const t = useCustomTranslation()
  
  return (
    <Container fade={fade}>
      <Box mr={3}>
        <Checkbox
          checked={checked}
          name={id}
          value={id}
          onChange={toggleMember}
        />
      </Box>
      <Box mr={3}>
        <Image
          round
          src={headerImage || memberDefault}
          height="25"
          width="25"
        />
      </Box>
      <Box>
        <Text>
          {firstName} {surname} {isInactiveUser && t('(Får mails)')} 
        </Text>
      </Box>
    </Container>
  )
}
export default Member
