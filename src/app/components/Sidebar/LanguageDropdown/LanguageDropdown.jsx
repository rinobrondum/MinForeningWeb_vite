import React, {useState, useCallback} from 'react'
import styled from 'styled-components'
import useCustomTranslation from 'lib/customT'
import {useTranslation} from 'react-i18next'
import TransWrapper from 'lib/transWrapper'
import {Text, Box, Flex, Button, Dropdown} from 'components'
import {Down} from 'components/icons'

const Item = styled(Box).attrs({
  p: 2,
})`
  width: ${({theme}) => theme.sidebarWidth};
  transition: background 0.125s ease;
  background-color: ${({active}) => (active ? '#e7e7e7' : 'white')};
`
const StyledDropdown = styled(Dropdown)`
  width: ${(props) => props.theme.sidebarWidth};
`

const languages = ['da', 'en', 'de']

const LanguageDropdown = () => {
  const [t, i18n] = useTranslation()
  const t2 = useCustomTranslation()
  const languageFromLocalStorage = localStorage.getItem('i18nextLng')
  const [currentLanguage, setCurrentLanguage] = useState(
    languageFromLocalStorage || i18n.language
  )
  const chooseLanguage = useCallback(
    (lng) => {
      i18n.changeLanguage(lng)
      return setCurrentLanguage(lng)
    },
    [i18n, setCurrentLanguage]
  )
  const renderLanguages = (item, hide) => {
    const language = t2(`languageName${item.toUpperCase()}`)

    return (
      <Item
        p={2}
        onClick={() => {
          chooseLanguage(item)
          hide()
        }}
        active={currentLanguage === item}
      >
        <Text secondary small>
          {language}
        </Text>
      </Item>
    )
  }
  const renderDropDownBtn = (toggle) => (
    <Button small onClick={toggle} truncate block>
      <Flex alignItems="center" justifyContent="space-between">
        <Box>{t2(`languageName${currentLanguage.toUpperCase()}`)}</Box>{' '}
        <Box width="20%">
          <Down fill="white" size={16} />
        </Box>
      </Flex>
    </Button>
  )

  return (
    <StyledDropdown
      title={t2('Sprog')}
      mt={2}
      items={languages}
      renderItem={renderLanguages}
      renderButton={renderDropDownBtn}
      hideDivider
    />
  )
}

export default LanguageDropdown
