import React, {useState, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Helmet} from 'react-helmet'
import {Redirect} from 'react-router-dom'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Page, Card, H2, Image, Link, Box, Flex} from 'components'
import {Back} from 'components/icons'
import CreateUserForm from './CreateUserForm'
import getLogo from 'jsonFetches/getLogo'
import {register} from 'user/actions'
import {getTldLocale, getCompanyName} from 'app/selectors'
import {getAuthenticated} from 'authentication'

const CreateUser = ({register, authenticated, locale, companyName, whiteLabelData}) => {
  const [done, setDone] = useState(false)

  const handleSubmit = useCallback(
    (values, {setErrors}) => {
      new Promise((resolve, reject) => register({values, resolve, reject}))
        .then(() => setDone(true))
        .catch((error) => setErrors({email: error}))
    },
    [register]
  )

  const t = useCustomTranslation()

  return done || authenticated ? (
    <Redirect to={{pathname: '/login', state: {userCreated: true}}} />
  ) : (
    <Page justifyContent="center" flex="1">
      <Helmet>
        <title>{t('Opret bruger | {{companyName}}', {companyName})}</title>
      </Helmet>

      <Box>
        {
          whiteLabelData.logos && 
            <Image
              src={getLogo(locale, whiteLabelData, 'dark')}
              width={300}
              mx="auto"
              mb={4}
              display="block"
            />
        }
      </Box>

      <Box my={3} width={450} mx="auto">
        <Link fontWeight={400} secondary to="/">
          <Flex alignItems="center">
            <Box mr={2}>
              <Back fill="secondary" size={12} />
            </Box>
            {t('Tilbage')}
          </Flex>
        </Link>
      </Box>

      <Card secondaryLight width={450} p={3} mx="auto">
        <Box mb={3}>
          <H2 strong secondary bold textAlign="center">
            {t(
              'Inden du kan oprette din forening, skal du først oprette dig som bruger i {{companyName}}',
              {companyName}
            )}
          </H2>
        </Box>

        <Box width={300} mx="auto">
          <CreateUserForm onSubmit={handleSubmit} />
        </Box>
      </Card>
    </Page>
  )
}

const enhancer = connect(
  createStructuredSelector({
    authenticated: getAuthenticated,
    locale: getTldLocale,
    companyName: getCompanyName,
  }),
  {register: register.requested}
)

export default enhancer(CreateUser)
