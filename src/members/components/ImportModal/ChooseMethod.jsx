import React from 'react'
import styled from 'styled-components'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Button, Box, Flex, Link} from 'components'
import winKas from 'images/integrations-winkas.png'
import conventus from 'images/integrations-conventus.png'
import steps from './steps'
import countryCodes from 'lib/countryCodes'
import { module_member_import_conventus, module_member_import_winkas, module_integrations } from 'globalModuleNames'
import { useFeature } from '@growthbook/growthbook-react'

const Container = styled(Box)`
  height: 114px;
  border-radius: 5px;
  background-image: url(${(props) => props.image});
  background-position: center center;
  background-size: cover;
`

const ChooseMethod = ({setStep, countryCode}) => {
  const t = useCustomTranslation()

  const methods = [
    {
      title: t('Importer medlemmer'),
      step: steps.CSV,
      color: 'purple',
    },
  ]
  
  if (useFeature(module_integrations).on && (countryCode === countryCodes.da || countryCode === countryCodes.da_DK)) {
    methods.splice(0, 0, {
      title: t('Importer medlemmer, roller og grupper'),
      step: steps.CONVENTUS,
      color: 'primary',
    })
  }

  return (
    <Box>
      {methods.map(({title, step, color}, index) => (
        <Button
          key={step}
          block
          small
          onClick={() => setStep(step)}
          mb={index === methods.length - 1 ? 0 : 3}
          {...{[color]: true}}
        >
          {title}
        </Button>
      ))}
      <Flex mt={3}>
        {useFeature(module_member_import_winkas).on && (countryCode === countryCodes.da || countryCode === countryCodes.da_DK) && (
          <Box mr={3} flex="1">
            <Link to="/settings/integrations/winkas">
              <Container image={winKas} />
            </Link>
          </Box>
        )}
        {useFeature(module_member_import_conventus).on && (countryCode === countryCodes.da || countryCode === countryCodes.da_DK) && (
          <Box flex="1">
            <Link to="/settings/integrations/conventus">
              <Container image={conventus} />
            </Link>
          </Box>
        )}
      </Flex>
    </Box>
  )
}

export default ChooseMethod
