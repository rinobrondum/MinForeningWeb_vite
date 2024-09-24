import React from 'react'
import styled from 'styled-components'
import {Flex, Box, Text} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Image = styled.div`
  height: 30px;
  width: 30px;
  margin-right: 10px;
  background-color: ${(props) => props.theme.colors[props.color]};
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  border-radius: 50%;
`

const CoHosts = ({coHosts, color}) => {
  const t = useCustomTranslation()

  return coHosts.length > 0 ? (
    <Flex flexDirection="column" mt={3}>
      <Box mb={1}>
        <Text>
          <small>{t('Medarrangører')}</small>
        </Text>
      </Box>

      {coHosts.filter(h => h != null && h.firstName != null).map(({firstName, surname, headerImage}) => (
        <Flex alignItems="center" mr={2}>
          <Image
            color={color}
            style={{backgroundImage: `url('${headerImage}')`}}
          />
          <Text>
            <small>
              {firstName} {surname}
            </small>
          </Text>
        </Flex>
      ))}
    </Flex>
  ) : null
}

CoHosts.defaultProps = {
  coHosts: [],
}

export default CoHosts
