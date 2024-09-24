import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {LinkButton, Text, Box, Flex} from 'components'
import {Invite, Add, Help, Integrations, Settings, Webinar, Gdpr, Timeline, Bug, Payment, Email} from 'components/icons'
import {getIsGroupLeader} from 'user'
import {getActive} from 'clubs'
import countryCodes from 'lib/countryCodes'
import { useFeature } from "@growthbook/growthbook-react";
import { module_bug_report, module_development_timeline, module_webinar } from 'globalModuleNames';


const Shortcuts = ({isGroupLeader, club, ...props}) => {
  const t = useCustomTranslation()
  return (
    <>
      <Box {...props}>
            <Box mb={2}>
              <Text secondary bold>
                {t('Genveje')}
              </Text>
            </Box>
            <Flex flexWrap="wrap">
                <LinkButton
                  bold
                  success
                  to={{pathname: '/activities', state: {create: true}}}
                  mr={2}
                  mb={2}
                >
                  <Flex alignItems="center">
                    <Box mr={2}>
                      <Add fill="white" size={20} />
                    </Box>
                    {t('Opret aktivitet')}
                  </Flex>
                </LinkButton>
              <LinkButton
                bold
                primary
                to={{
                  pathname: '/messages',
                  state: {showMessages: true},
                }}
                mr={2}
                mb={2}
              >
                <Flex alignItems="center">
                  <Box mr={2}>
                    <Email fill="white" size={20} />
                  </Box>
                  {t('Opret besked')}
                </Flex>
              </LinkButton>
              <LinkButton
                bold
                purple
                to={{
                  pathname: '/payments/overview',
                  state: {showPayment: true},
                }}
                mr={2}
                mb={2}
              >
                <Flex alignItems="center">
                  <Box mr={2}>
                    <Payment fill="white" size={16} />
                  </Box>
                  {t('Opret betaling')}
                </Flex>
              </LinkButton>
              <LinkButton
                bold
                danger
                to={{
                  pathname: '/payments/subscriptions',
                  state: {showSubscription: true},
                }}
                mr={2}
                mb={2}
              >
                <Flex alignItems="center">
                  <Box mr={2}>
                    <Payment fill="white" size={16} />
                  </Box>
                  {t('Opret abonnement')}
                </Flex>
              </LinkButton>
              <LinkButton
                bold
                warning
                to={{
                  pathname: '/members',
                  state: {showMember: true},
                }}
                mr={2}
                mb={2}
              >
                <Flex alignItems="center">
                  <Box mr={2}>
                    <Invite fill="white" size={16} />
                  </Box>
                  {t('Opret medlem')}
                </Flex>
              </LinkButton>
              
              
            </Flex>
      </Box>
      <Box {...props}>
        <Box mb={2}>
              <Text secondary bold>
                {t('Hjælp til selvhjælp')}
              </Text>
        </Box>
              <Flex flexWrap="wrap">
                {
                  useFeature(module_webinar).on &&
                  <LinkButton
                    bold
                    success
                    external
                    target="_blank"
                    to="https://tidycal.com/webinarer"
                    mr={2}
                    mb={2}
                  >
                    <Flex alignItems="center">
                      <Box mr={2}>
                        <Webinar fill="white" size={16} />
                      </Box>
                      {t('Webinarer')}
                    </Flex>
                  </LinkButton>
                }
                <LinkButton
                  bold
                  primary
                  external
                  target="_blank"
                  to="https://minforening.dk/support/"
                  mr={2}
                  mb={2}
                >
                  <Flex alignItems="center">
                    <Box mr={2}>
                      <Help fill="white" size={16} />
                    </Box>
                    {t('FAQs og videoer')}
                  </Flex>
                </LinkButton>

                <LinkButton
                  external
                  bold
                  purple
                  to="https://minforening.dk/implementering/"
                  target="_blank"
                  mr={2}
                  mb={2}
                >
                  <Flex alignItems="center">
                    <Box mr={2}>
                      <Settings fill="white" size={16} />
                    </Box>
                    {t('Implementering')}
                  </Flex>
                </LinkButton>

                {
                  useFeature(module_development_timeline).on &&
                  <LinkButton
                    bold
                    danger
                    external
                    target="_blank"
                    to="https://minforening.dk/udviklingstidslinje/"
                    mr={2}
                    mb={2}
                  >
                    <Flex alignItems="center">
                      <Box mr={2}>
                        <Timeline fill="white" size={16} />
                      </Box>
                      {t('Udviklingstidslinje')}
                    </Flex>
                  </LinkButton>
                }

                {
                useFeature(module_bug_report).on &&
                  <LinkButton
                    bold
                    warning
                    external
                    target="_blank"
                    to=""
                    mr={2}
                    mb={2}
                  >
                    <Flex alignItems="center">
                      <Box mr={2}>
                        <Bug fill="white" size={16} />
                      </Box>
                      {t('Fejlrapportering')}
                    </Flex>
                  </LinkButton>
              }
              </Flex>
            </Box>
    </>
  )
}
const enhancer = connect(
  createStructuredSelector({isGroupLeader: getIsGroupLeader, club: getActive})
)

export default enhancer(Shortcuts)
