import React from 'react'
import {Box, Flex} from '@rebass/grid'
import {Page, H1, Text, Image, Link, Button} from 'components'
import conventus1 from 'images/conventus-1.png'
import conventus2 from 'images/conventus-2.png'
import conventus3 from 'images/conventus-3.png'
import conventus4 from 'images/conventus-4.png'
import conventus5 from 'images/conventus-5.png'
import conventus6 from 'images/conventus-6.png'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import { getAppName } from 'app/selectors';
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'

const Conventus = ({history: {goBack}, appName}) => {
  const t = useCustomTranslation(['common', 'translation'])
  return (
    <Page>
      <Flex>
        <Box mr={3}>
          <Button primary block onClick={goBack}>
            {t('common:Tilbage')}
          </Button>
        </Box>
        <Box flex="1">
          <Box mb={3}>
            <H1>{t('Guide til Conventus-import')}</H1>
          </Box>

          <Box mb={3}>
            <Text secondary>{t('translation:toImportYouMustExportInCSV')}</Text>
          </Box>

          <Box mb={5}>
            <Text secondary>
              <TransWrapper i18nKey="translation:conventusStepOne">
                1. Log ind på Conventus og tryk på <strong>Adressebog</strong>.
              </TransWrapper>
            </Text>

            <Box mt={3}>
              <Image src={conventus1} width="500" />
            </Box>
          </Box>

          <Box mb={5}>
            <Text secondary>
              <TransWrapper i18nKey="translation:conventusStepTwo">
                2. Tryk på <strong>Rapport</strong>.
              </TransWrapper>
            </Text>

            <Box mt={3}>
              <Image src={conventus2} width="500" />
            </Box>
          </Box>

          <Box mb={5}>
            <Text secondary>
              <TransWrapper i18nKey="conventusStepThree">
                3. Hvis du vil eksportere <strong>alle</strong> foreningens
                medlemmer, skal du blot fortsætte til næste trin. Hvis du vil
                eksportere enkelte <strong>Afdelinger</strong> og/eller{' '}
                <strong>Hold</strong>, kan du vælge disse i de to
                dropdown-menuen.
              </TransWrapper>
            </Text>

            <Box mt={3}>
              <Image src={conventus3} width="500" />
            </Box>
          </Box>

          <Box mb={5}>
            <Text secondary>
              <TransWrapper i18nKey="conventusStepFour">
                4. Tryk på <strong>Vælg</strong> ud for "Felter".
              </TransWrapper>
            </Text>

            <Box mt={3}>
              <Image src={conventus4} width="500" />
            </Box>
          </Box>

          <Box mb={5}>
            <Text secondary>
              <TransWrapper i18nKey="conventusStepFive">
                5. <strong>VIGTIGT!</strong> Afkryds <strong>Titel</strong>-,{' '}
                <strong>Fødselsdag</strong>- og <strong>Id-</strong>feltet. Du
                kan se på nedstående billede, hvilke felter, der skal være
                afkrydset.
              </TransWrapper>
            </Text>

            <Box mt={3}>
              <Image src={conventus5} width="500" />
            </Box>
          </Box>

          <Box mb={5}>
            <Text secondary>
              <TransWrapper i18nKey="conventusStepSix">
                6. Tryk <strong>Eksport</strong>. Du modtager nu din .CSV-fil
                ved navn <strong>adressebog.csv</strong>, som du kan bruge i{' '}
                <strong>{{appName}}</strong>.
              </TransWrapper>
            </Text>

            <Box mt={3}>
              <Image src={conventus6} width="500" />
            </Box>
          </Box>

          <Box mb={3}>
            <Text>
              <strong>{t('Har du brug for mere hjælp')}?</strong>
            </Text>
          </Box>
          <Text>{t('Vi sidder altid klar til at svare på spørgsmål')}</Text>
          <Text>
            <TransWrapper i18nKey="youCanCallSendEmail">
              Du kan ringe til os på <strong>28 76 00 99</strong> eller{' '}
              <Link external to="http://minforening.dk/kontakt/" primary>
                <strong>sende os en mail</strong>
              </Link>
            </TransWrapper>
          </Text>
        </Box>
      </Flex>
    </Page>
  )
}

const enhancer = connect(createStructuredSelector({appName: getAppName}))

export default enhancer(Conventus)
