import React, {useCallback, useState} from 'react'
import {connect} from 'react-redux'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text, Flex, Button, Box, H1, DialogueModal} from 'components'
import {createOnlimeAccount} from 'clubs/actions'
import { getEmail } from 'user'
import {useToggle} from 'lib/hooks'
import {createStructuredSelector} from 'reselect'

const Onlime = ({createOnlimeAccount, email}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isOnlimeSuccess, setIsOnlimeSuccess] = useState(false)
  const [dialogModalVisible, showDialogModal, hideDialogModal] = useToggle()
  const handleClick = useCallback(() => {
    setIsLoading(true)

    new Promise((resolve, reject) => {
      setIsOnlimeSuccess(false)
      createOnlimeAccount({resolve, reject})
      showDialogModal(true)
    }).then((response) => {
      if (response.status != null && response.status == false) {
        showDialogModal(false)
      } else {
        setIsOnlimeSuccess(true)
        showDialogModal(true)
      }

      setIsLoading(false)
    })
  }, [createOnlimeAccount, setIsLoading])

  const handleClickReadMore = useCallback(() => {
    setIsLoading(true)

    new Promise((resolve, reject) => {
      window.open('https://onlime.dk/kundecenter/om-onlime/')
    }).then(() => {
      setIsLoading(false)
    })
  }, [setIsLoading])

  const t = useCustomTranslation()

  return (
    <>
      <H1>{t('onlimeTitle')}</H1>
      <Text my={3}>
        <TransWrapper key="onlimeIntro">
          Sammen med Onlime.dk giver vi din forening{' '}
          <strong>5 GB plads i skyen gratis</strong>.
        </TransWrapper>
      </Text>
      <Text>{t('onlimeDescription')}</Text>
      <ul>
        {[1, 2, 3, 4, 5].map((id) => (
          <li key={id}>
            <Text>{t(`onlimePoint${id}`)}</Text>
          </li>
        ))}
      </ul>
      <Text>{t('onlimeEpilogue')}</Text>
      <Flex mt={3}>
        <Button small primary mr={3} onClick={handleClick}>
          {t('onlimeActivateButton')}
        </Button>
        <Button small secondary onClick={handleClickReadMore}>
          {t('Læs mere')}
        </Button>
      </Flex>
      {dialogModalVisible && (
        <DialogueModal hide={hideDialogModal} title={t('onlimeTitle')}>
          {isOnlimeSuccess ? (
            <Box mb={3}>
                {
                  t('onlimeSuccess',
                  {
                    email: email
                  })
                }
            </Box>
          ) : (
            <Box mb={3}>
            {
              t('onlimeFail',
              {
                email: email
              })
            }
            </Box>
          )}
        </DialogueModal>
      )}   
    </>
  )
}

const enhancer = connect(createStructuredSelector({
  email: getEmail
}), {
  createOnlimeAccount: createOnlimeAccount.requested,
})

export default enhancer(Onlime)
