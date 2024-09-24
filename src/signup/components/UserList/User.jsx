import React from 'react'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {createStructuredSelector} from 'reselect'
import qs from 'qs'
import {withRouterParams} from 'lib/hoc'
import {LinkButton, Button, Flex, Box, Text} from 'components'
import {Checkmark} from 'components/icons'
import {remove, getNumberOfUsers} from 'signup/dummies'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const User = ({
  userId,
  firstName,
  surname,
  params,
  error,
  type,
  remove,
  canCreateChildren,
  numberOfMembers,
  match: {path, url},
}) => {
  const t = useCustomTranslation()

  return (
    <Box p={3} mb={3} bg="white">
      <Text textAlign="center" mb={3}>
        <strong>
          {firstName} {surname}
        </strong>
      </Text>
      <Flex>
        {['adult', 'child'].map((id) => (
          <Box key={id} flex="1" mr={id === 'adult' ? 3 : 0}>
            <LinkButton
              small
              bg={type ? (type === id ? 'primary' : 'secondary') : 'primary'}
              display="block"
              to={{
                search: qs.stringify({...params, type: id}),
                pathname: `${path}/${userId}/new`,
              }}
            >
              <Flex justifyContent="center" alignItems="center">
                {type === id && (
                  <Box mr={2}>
                    <Checkmark fill="white" />
                  </Box>
                )}
                {id === 'child' ? t('Barn') : t('Voksen')}
              </Flex>
            </LinkButton>
          </Box>
        ))}
        {numberOfMembers > 1 && (
          <Button danger small ml={3} onClick={() => remove(userId)}>
            {t('Fjern')}
          </Button>
        )}
      </Flex>
      {error && (
        <Text danger center mt={3}>
          {t('Emailen er allerede i brug')}
        </Text>
      )}
    </Box>
  )
}
const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      numberOfMembers: getNumberOfUsers,
    }),
    {remove}
  )
)

export default enhancer(User)
