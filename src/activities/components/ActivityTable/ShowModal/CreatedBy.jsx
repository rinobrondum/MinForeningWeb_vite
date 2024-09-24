import React from 'react'
import {connect} from 'react-redux'
import styled from 'styled-components'
import {compose} from 'recompose'
import {getMember} from 'members/selectors'
import {Text, Flex, Box} from 'components'
import useCustomTranslation from 'lib/customT'

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

const CreatedBy = ({member, color}) => {
  const t = useCustomTranslation()

  return member ? (
    <Flex flexDirection="column" mt={3}>
      <Box mb={1}>
        <Text>
          <small>{t('Aktivitetsansvarlig')}</small>
        </Text>
      </Box>

      <Flex alignItems="center">
        <Image
          color={color}
          style={{backgroundImage: `url('${member.headerImage}')`}}
        />
        <Text>
          <small>
            {member.firstName} {member.surname}
          </small>
        </Text>
      </Flex>
    </Flex>
  ) : null
}

const enhancer = compose(
  connect((state, {id}) => ({
    member: getMember(state, id),
  }))
)

export default enhancer(CreatedBy)
