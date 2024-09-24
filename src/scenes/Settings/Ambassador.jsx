import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text} from 'components'
import {getCompanyName, getTldEmail} from 'app/selectors'

const Ambassador = ({companyName, email}) => {
  const t = useCustomTranslation()

  return (
    <>
      <Text mb={3}>{t('ambassadorTextOne', {companyName})}</Text>
      <Text>{t('ambassadorTextTwo', {email})}</Text>
    </>
  )
}

const enhancer = connect(
  createStructuredSelector({
    companyName: getCompanyName,
    email: getTldEmail,
  })
)

export default enhancer(Ambassador)
