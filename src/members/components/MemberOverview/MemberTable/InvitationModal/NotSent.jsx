import React from 'react'
import {useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {
  Text,
  Tooltip,
  Box,
  Flex,
  Button,
  Switch,
} from 'components'
import {Email} from 'components/icons'
import {Alert} from 'components/icons'
import {getCompanyName} from 'app/selectors'


const NotSent = ({name, send, companyName, dummy}) => {
  const t = useCustomTranslation()
  return (


    <Box p={3}>
         <Flex alignItems="center" justifyContent="space-between" mb={3} mt={2}>
            <Flex alignItems="center">
              <Text secondary mr={2}>
              {dummy
          ? t(
              '{{name}} har status som Rød inaktiv og er dermed ikke inviteret ind i foreningen endnu.' ,
              {name}
            ) 
          : t(
              '{{name}} har status som Orange inaktiv og har dermed fået tilsendt en invitationsmail, men har endnu ikke aktiveret sig via linket i invitationsmailen.',
              {name}
            )}
              </Text>
              <Tooltip  text={
                <>
                  <Text style={{ width:'250px'}} center secondary my={3}>
                    {t(
                      'Når invitationsmailen er afsendt og medlem er tilføjet en eller flere grupper, så får {{name}} automatisk information om aktiviteter, beskeder fra foreningen og kontingentopkrævning via mails.',
                      {name},
                      'Udsendelsen af mails fortsætter, indtil bruger aktiverer sig via link i invitationsmail, hvormed information udsendes via appen.'
                    )}
                  </Text>
                  <Text center secondary my={3}>
                    {t(
                      'Udsendelsen af mails fortsætter, indtil bruger aktiverer sig via link i invitationsmail, hvormed information udsendes via appen.'
                    )}
                  </Text>
                  <Text center secondary>
                    {t('usersDisappear')}
                  </Text>
                </>
              }>
                {({show, hide}) => (
                  <Alert
                    onMouseEnter={show}
                    onMouseLeave={hide}
                    fill="secondary"
                    size={16}
                  />
                )}
              </Tooltip>
            </Flex>
          </Flex>
         
      <Flex justifyContent="center" my={3}>
        <Button purple onClick={send}>
          <Flex alignItems="center">
            <Box mr={2}>
              <Email size={20} fill="white" />
            </Box>
            {t('Send invitationsmail til {{name}}', {name})}
          </Flex>
        </Button>
      </Flex>

    </Box>
  )
}

const enhancer = connect(
  createStructuredSelector({companyName: getCompanyName})
)

export default enhancer(NotSent)
