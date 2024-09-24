import React from 'react'
import qs from 'qs'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import {omit} from 'lodash'
import {createStructuredSelector} from 'reselect'
import {withRouterParams} from 'lib/hoc'
import {getCurrent} from 'signup/dummies'
import {Flex, LinkButton, Link, Box, H1} from 'components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Choose = ({user: {firstName}, match: {url}, params}) => {
  const t = useCustomTranslation()

  return (
    <>
      <Link
        to={{
          search: qs.stringify(omit(params, 'type')),
          pathname: '/register',
        }}
      >
        Tilbage
      </Link>
      <Box mb={3}>
        <H1 textAlign="center">{t('createUser', {name: firstName})}</H1>
      </Box>
      <Flex>
        <LinkButton
          small
          block
          mr={3}
          to={{pathname: `${url}/new`, search: qs.stringify(params)}}
        >
          {t('Opret bruger i {{appName}}')}
        </LinkButton>
        {}
      </Flex>
    </>
  )
}
const enhancer = compose(
  withRouterParams,
  connect(
    createStructuredSelector({
      user: getCurrent,
    })
  )
)

export default enhancer(Choose)
