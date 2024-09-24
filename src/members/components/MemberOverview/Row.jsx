import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import styled from 'styled-components'
import {withStateHandlers, compose, withHandlers} from 'recompose'
import {Flex, Box} from '@rebass/grid'
import format from 'date-fns/format'
import distanceInWordsToNow from 'date-fns/distance_in_words_to_now'
import {bulk} from 'members'
import {typeIds} from 'members/constants'
import {Row, Cell} from 'components/Table'
import {Image, Text} from 'components'
import {Email, Phone, Clock} from 'components/icons'
import TypeDropdown from './TypeDropdown'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Container = styled(Flex).attrs({
  flexDirection: 'column',
})`
  cursor: pointer;
  border-bottom: 2px solid ${(props) => props.theme.colors.white};
`

const MemberTableRow = ({
  id,
  firstName,
  checked,
  handleCheck,
  surname: lastName,
  email,
  phone,
  birthdate,
  zip,
  memberSince,
  contingent,
  type,
  toggleDetailsVisible,
  detailsVisible,
  headerImage,
  memberId,
}) => {
  const t = useCustomTranslation()

  return (
    <Container onClick={toggleDetailsVisible}>
      <Row>
        <Cell width={1 / 18}>
          <input
            type="checkbox"
            name="memberSelect"
            checked={checked}
            onChange={handleCheck}
            value={id}
            onClick={(e) => e.stopPropagation()}
          />
        </Cell>
        <Cell width={1 / 4}>{firstName}</Cell>
        <Cell width={1 / 4}>{lastName}</Cell>
        <Cell secondary width={1 / 4}>
          {birthdate && format(birthdate, 'DD-MM-YYYY')}
        </Cell>
        <Cell secondary width={1 / 4}>
          <TypeDropdown userId={id} type={typeIds[type]} />
        </Cell>
      </Row>

      {detailsVisible && (
        <Row>
          <Flex
            flex="1"
            p={3}
            alignItems="center"
            justifyContent="space-between"
          >
            <Box mr={4}>
              <Image round src={headerImage} height="75" />
            </Box>

            <Flex flex="1">
              <Flex flexDirection="column" mr={4}>
                <Flex alignItems="center" mb={3}>
                  <Clock size={20} fill="secondary" />
                  <Box ml={2}>
                    <Text secondary>
                      <small>
                        {memberSince
                          ? distanceInWordsToNow(memberSince)
                          : t('Medlem siden')}
                      </small>
                    </Text>
                  </Box>
                </Flex>

                <Flex alignItems="center">
                  <Clock size={20} fill="secondary" />
                  <Box ml={2}>
                    <Text secondary>
                      <small>{zip ? zip : t('postCode')}</small>
                    </Text>
                  </Box>
                </Flex>
              </Flex>

              <Flex flexDirection="column">
                <Flex alignItems="center" mb={3}>
                  <Email size={20} fill="secondary" />
                  <Box ml={2}>
                    <Text secondary>
                      <small>{email}</small>
                    </Text>
                  </Box>
                </Flex>
                <Flex alignItems="center">
                  <Phone size={20} fill="secondary" />
                  <Box ml={2}>
                    <Text secondary>
                      <small>{phone ? phone : t('phoneNumber')}</small>
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Row>
      )}
    </Container>
  )
}
const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      addToBulk: bulk.add,
      removeFromBulk: bulk.remove,
    },
    dispatch
  )

const enhancer = compose(
  connect(null, mapDispatchToProps),
  withStateHandlers(
    {
      detailsVisible: false,
    },
    {
      toggleDetailsVisible: ({detailsVisible}) => () => ({
        detailsVisible: !detailsVisible,
      }),
    }
  ),
  withHandlers({
    handleCheck: ({id, addToBulk, removeFromBulk}) => (event) => {
      const isChecked = event.target.checked

      if (isChecked) {
        addToBulk(id)
      } else {
        removeFromBulk(id)
      }
    },
  })
)

export default enhancer(MemberTableRow)
