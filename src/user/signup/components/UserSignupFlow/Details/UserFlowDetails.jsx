import React from 'react'
import {compose} from 'recompose'
import qs from 'qs'
import {withTranslation} from 'react-i18next'
import {Box, Flex, H2, Text, Link, Hr} from 'components'
import {LogoWithTagline, Person} from 'components/icons'
import {withRouterParams} from 'lib/hoc'
import ClubInformation from './ClubInformation'
import Context from '../Context'
import LoginForm from './LoginForm'
import UserRegistrationForm from './UserRegistrationForm'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getAppName } from 'app/selectors';

const methods = {
  NEW_USER: '0',
  EXISTING_USER: '1',
}


const UserFlowDetails = ({
  params: {method = methods.NEW_USER},
      location: {pathname},
      club,
      clubToken,
      setStep,
      t,
      whiteLabelData
}) => {
  const isCreatingNewUser = method === methods.NEW_USER

  const storeClubToken = () => {
    localStorage.setItem('SIGNUP_CLUB_TOKEN', params.clubToken)
  }

  return (
    <>
        <Box mt={3}>
          <LogoWithTagline width="auto" height="50" whiteLabelData={whiteLabelData}/>
        </Box>

        <Box mx="auto">
          <ClubInformation {...club} />


          {clubToken && (
            <Flex mt={2} flexDirection="column">
              <Text center>
                {isCreatingNewUser
                  ? t('Allerede bruger i {{appName}}?', { appName: getAppName() })
                  : t('Har du ikke en bruger?')}{' '}
                <Link
                  primary
                  to={{
                    pathname,
                    search: qs.stringify({
                      clubToken,
                      method: isCreatingNewUser
                        ? methods.EXISTING_USER
                        : methods.NEW_USER,
                    }),
                  }}
                >
                  {isCreatingNewUser ? t('Log ind her') : t('Opret en her')}
                </Link>
              </Text>
            </Flex>
          )}

          <Box my={3}>
            <Hr />
          </Box>
        </Box>

        <Flex mb={4} alignItems="center" mx="auto">
          <Box mr={2}>
            <Person fill="secondary" size={24} />
          </Box>
          <H2>
            {isCreatingNewUser ? t('Opret bruger på') : t('Log ind på')}{' '}
            <strong>{getAppName()}</strong>
          </H2>
        </Flex>

        <Box width={1}>
          {isCreatingNewUser ? (
            <UserRegistrationForm setStep={setStep} initialValues={{clubToken}} club={club}/>
          ) : (
            <LoginForm setStep={setStep} initialValues={{clubToken}} />
          )}
        </Box>
      </>
  )
}


const enhancer = compose(
  connect(createStructuredSelector({}),
  {
    
  }
  ),
  withRouterParams, 
  withTranslation(), 
)

export default enhancer((props) => (
  <Context.Consumer>
    {(value) => <UserFlowDetails {...props} {...value} />}
  </Context.Consumer>
))
