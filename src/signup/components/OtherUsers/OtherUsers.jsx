import React, {Fragment, useState, useCallback, useEffect} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import {Redirect, withRouter} from 'react-router-dom'
import {Card, Text, Box, Button, Link} from 'components'
import {
  getAllUserExcluded,
  save as saveDummy,
  getAllUsersAssigned,
} from 'signup/dummies'
import {getUrlEmail, getUrlPassword} from 'signup'
import {get as getClub} from 'signup/club'
import {remove, createAll} from 'signup/dummies/actions'
import Dummy from './Dummy'
import Club from 'signup/components/Invitation/Club'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const OtherUsers = ({
  email,
  password,
  createAll,
  dummies,
  saveDummy,
  club,
  remove,
  allAssigned,
  location: {search},
}) => {
  const t = useCustomTranslation()
  const [done, setDone] = useState(false)

  const confirm = useCallback(
    () =>
      new Promise((resolve) => createAll({email, password, resolve})).then(() =>
        setDone(true)
      ),
    [email, password, createAll]
  )

  useEffect(() => {
    if (dummies.length === 0) {
      confirm()
    }
  }, [dummies.length, confirm])

  return done ? (
    <Redirect to={{pathname: '/register/done', search}} />
  ) : (
    <Fragment>
      <Box width={550} mx="auto" mb={3}>
        <Link
          secondary
          to={{
            search,
            pathname: '/register/own-user',
            state: {changeSelf: true},
          }}
        >
          {t('Tilbage')}
        </Link>
      </Box>
      <Card secondaryLight width={550} mx="auto" p={0}>
        <Club name={club.clubName} image={club.imageUrl} />

        <Box p={4}>
          <Card white mb={3}>
            <Text center>
              <small>{t('Der er flere personer tilknyttet din email')}:</small>
            </Text>
            <Text center primary>
              <small>
                <strong>{email}</strong>
              </small>
            </Text>
            <Text center>
              <small>
                {t('Hjælp os med at finde ud af, hvem der er hvem nendenfor.')}
              </small>
            </Text>
          </Card>

          {dummies.map((dummy) => (
            <Dummy
              key={dummy.userId}
              remove={remove}
              save={saveDummy}
              urlEmail={email}
              urlPassword={password}
              {...dummy}
            />
          ))}

          <Button
            block
            primary
            mt={3}
            disabled={!allAssigned}
            onClick={confirm}
          >
            {t('Godkend')}
          </Button>
        </Box>
      </Card>
    </Fragment>
  )
}

const enhancer = compose(
  withRouter,
  connect(
    createStructuredSelector({
      dummies: getAllUserExcluded,
      email: getUrlEmail,
      password: getUrlPassword,
      club: getClub,
      allAssigned: getAllUsersAssigned,
    }),
    {
      saveDummy,
      remove: remove.requested,
      createAll: createAll.requested,
    }
  )
)

export default enhancer(OtherUsers)
