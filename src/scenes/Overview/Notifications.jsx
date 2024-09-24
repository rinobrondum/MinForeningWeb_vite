import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import styled from 'styled-components'
import {darken} from 'polished'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Box, Text, Link, Flex} from 'components'
import {getInactiveMembersArray} from 'members/selectors'
import {
  getNumberOfOutstanding,
  getNumberOfActionsRequired,
} from 'payments/selectors'
import {
  getPendingMembersArray,
  getNumberOfMembersNotInGroups,
} from 'members/selectors'
import {Alert} from 'components/icons'

const NotificationContainer = styled(Flex).attrs({
  flex: '1',
  px: 2,
  alignItems: 'center',
})`
  background: ${(props) => props.theme.colors.secondaryLight};

  will-change: background;
  transition: 0.125s ease background;

  &:hover {
    background: ${(props) => darken(0.05, props.theme.colors.secondaryLight)};
  }
`

const Notifications = ({
  payments,
  outstandingPayments,
  requests,
  inactive,
  membersNotInGroups,
  ...props
}) => {
  const t = useCustomTranslation()

  return outstandingPayments + requests + inactive + membersNotInGroups > 0 ? (
    <Box {...props}>
      <Box mb={2}>
        <Text secondary bold>
          {t('Vær opmærksom på')}
        </Text>
      </Box>

      {membersNotInGroups > 0 && (
        <Link to="/members?group=notInGroups">
          <Flex my={1} width={1}>
            <Box bg="purple" p={2}>
              <Alert fill="white" size={14} />
            </Box>
            <NotificationContainer>
              <Box mr={1}>
                <Text purple bold>
                  {membersNotInGroups}
                </Text>
              </Box>
              <Text secondary>
                {t('membersNotInGroup', {count: membersNotInGroups})}
              </Text>
            </NotificationContainer>
          </Flex>
        </Link>
      )}

      {outstandingPayments > 0 && (
        <Link to="/payments">
          <Flex my={1} width={1}>
            <Box bg="danger" p={2}>
              <Alert fill="white" size={14} />
            </Box>
            <NotificationContainer>
              <Box mr={1}>
                <Text danger bold>
                  {outstandingPayments}
                </Text>
              </Box>
              <Text secondary>
                {t('outstandingPayments', {count: outstandingPayments})}
              </Text>
            </NotificationContainer>
          </Flex>
        </Link>
      )}

      {payments > 0 && (
        <Link to="/payments">
          <Flex my={1} width={1}>
            <Box bg="danger" p={2}>
              <Alert fill="white" size={14} />
            </Box>
            <NotificationContainer>
              <Box mr={1}>
                <Text danger bold>
                  {payments}
                </Text>
              </Box>
              <Text secondary>{t('paymentNeedAction', {count: payments})}</Text>
            </NotificationContainer>
          </Flex>
        </Link>
      )}

      {requests > 0 && (
        <Link to="/members">
          <Flex my={1} width={1}>
            <Box bg="primary" p={2}>
              <Alert fill="white" size={14} />
            </Box>
            <NotificationContainer>
              <Box mr={1}>
                <Text primary bold>
                  {requests}
                </Text>
              </Box>
              <Text secondary>{t('requests', {count: requests})}</Text>
            </NotificationContainer>
          </Flex>
        </Link>
      )}

      {inactive > 0 && (
        <Link to="/members?group=inactive">
          <Flex my={1} width={1}>
            <Box bg="warning" p={2}>
              <Alert fill="white" size={14} />
            </Box>
            <NotificationContainer>
              <Box mr={1}>
                <Text warning bold>
                  {inactive}
                </Text>
              </Box>
              <Text secondary>{t('Inaktiv bruger', {count: inactive})}</Text>
            </NotificationContainer>
          </Flex>
        </Link>
      )}
    </Box>
  ) : null
}

const enhancer = connect(
  createStructuredSelector({
    requests: getPendingMembersArray,
    inactive: getInactiveMembersArray,
    outstandingPayments: getNumberOfOutstanding,
    membersNotInGroups: getNumberOfMembersNotInGroups,
    payments: getNumberOfActionsRequired,
  }),
  null,
  ({requests, inactive, ...mappedProps}, _, ownProps) => ({
    ...ownProps,
    ...mappedProps,
    requests: requests.length || 0,
    inactive: inactive.length || 0,
  })
)

export default enhancer(Notifications)
