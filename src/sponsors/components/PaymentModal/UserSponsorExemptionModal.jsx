import React, {useEffect, useState, useCallback} from 'react'
import {Helmet} from 'react-helmet'
import {Box, Text} from 'rebass/styled-components'
import {connect} from 'react-redux'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {createStructuredSelector} from 'reselect'
import {Modal, Button} from 'components'
import {getActive} from 'clubs'
import countryCodes from 'lib/countryCodes'
import styled, { css } from 'styled-components'


const UserSponsorExemptionModal = ({hide, club}) => {
  const t = useCustomTranslation()
 
  const onEmojiClick = (e, emojiObject) => {
    
  };

  useEffect(() => {
    
  })

  return (
    <>
      <Modal width={600} hide={hide} title={'Køb sponsor undtagelser'}>
        <Box p={3}>
          <Text mb={4}>
            <strong>Undtagelser tilbage:</strong> <span>0</span>
          </Text>


          <Button primary block success small mt={3} onClick={hide}>
            {t('Godkendt')}
          </Button>
          <Button primary block small mt={3} onClick={hide}>
            {t('Fortryd')}
          </Button>
        </Box>
      </Modal>
    </>
  )
}

const enhancer = connect(
  createStructuredSelector({
    club: getActive
  }),
  {
      
  }
)

export default enhancer(UserSponsorExemptionModal)
