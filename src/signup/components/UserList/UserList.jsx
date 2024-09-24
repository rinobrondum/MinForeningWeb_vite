import React, {useState, useEffect, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Redirect} from 'react-router-dom'
import {get, omit} from 'lodash'
import {
  getAsArray as getDummies,
  createAll,
  getAllUsersAssigned,
  getAreAllCreated,
  getRequiresParent,
  getRequiredParentCreated,
} from 'signup/dummies'
import {get as getParent} from 'signup/parent'
import {get as getUrlAuth} from 'signup/urlAuth'
import {Card, Text, Box, H1, Button} from 'components'
import User from './User'
import RequiredParent from './RequiredParent'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {getClubData } from 'user/signup/selectors'


const createNameList = (users) =>
  users
    .map(({firstName}) => firstName)
    .reduce(
      (list, name, index, arr) =>
        index === 0
          ? name
          : list + (index === arr.length - 1 ? ` og ${name}` : `, ${name}`),
      ''
    )

const UserList = ({
  users,
  createAll,
  allUsersAssigned,
  areAllCreated,
  parent,
  requiresParent,
  club,
  requiredParentCreated,
  urlAuth: {email, password},
  location: {search, state},


}) => {
  const t = useCustomTranslation()
  const [error, setError] = useState(null)

  const handlSubmit = useCallback(
    (requiredParent) => {

        // console.log('requiresParent', requiresParent)

        createAll({
          email,
          requiredParent: 
          requiresParent ? omit(requiredParent, 'passwordConfirmation') : null,
          RelatedClubId: club.clubId,
        })
    },
    []
  )

  useEffect(() => {
    if (get(state, 'done') && !requiresParent) {
    
      handlSubmit()
    }
  }, [state, handlSubmit, requiresParent])

  return (areAllCreated && !requiresParent) ||
    (areAllCreated && requiresParent && requiredParentCreated) ? (
    <Redirect to={{pathname: '/register/done', search}} />
  ) : (
    <Card secondaryLight width={500} mx="auto"  style={{maxWidth: "100%"}}>
      <H1 textAlign="center">{t('Opret bruger i {{appName}}')}</H1>
      <Box my={3}>
        <Text textAlign="center">
          {parent
            ? `${parent.firstName} ${parent.surname} har samme mail som nedenstående. Hvordan skal de oprettes i {{appName}}?`
            : `${createNameList(users)} er tilknyttet e-mailen`}
        </Text>
        {!parent && (
          <Text textAlign="center">
            <strong>{email}</strong>
          </Text>
        )}
        <Text textAlign="center" mt={3}>{t("Tilkendegiv om følgende brugere er voksen eller barn")}</Text>
      </Box>
      {users.map((user) => (
        <User key={user.userId} {...user} />
      ))}
      {requiresParent ? (
        <>
          <Text textAlign="center" mb={3}>
            {t('Du mangler at oprette en voksen; udfyld formularen nedenfor.')}
          </Text>
          <RequiredParent error={error} club={club} onSubmit={handlSubmit} />
        </>
      ) : (
        <Button
          small
          type='button'
          primary
          mt={3}
          onClick={handlSubmit}
          disabled={!allUsersAssigned}
        >
          {t('Godkend')}!
        </Button>
      )}
    </Card>
  )
}

const enhancer = connect(
  createStructuredSelector({
    users: getDummies,
    club: getClubData,
    urlAuth: getUrlAuth,
    allUsersAssigned: getAllUsersAssigned,
    areAllCreated: getAreAllCreated,
    parent: getParent,
    requiresParent: getRequiresParent,
    requiredParentCreated: getRequiredParentCreated,
  }),
  {createAll: createAll.requested}
)

export default enhancer(UserList)
