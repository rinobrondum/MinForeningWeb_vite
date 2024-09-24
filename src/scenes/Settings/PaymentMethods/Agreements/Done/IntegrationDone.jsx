import React from 'react'
import { useTranslation } from 'react-i18next'
import { H1, Box, Text } from 'components'

const IntegrationDone = () => {
    const [t] = useTranslation()

  return (
    <>
      <H1>{t("Mobilepay Integration")}</H1>

      <Box mb={3} mt={2}>
        <Text>
            {t(`MinForening er hermed i MobilePay blevet godkendt som tredjepartsintegration. For opsætning af MobilePay Integration i MinForening bedes I indbetale 750 kr. til MinForening. Når beløbet på 750 er modtaget, modtager I i løbet af 2-5 dage en mail fra MinForening med besked om, at jeres integration med MobilePay i MinForening er blevet sat op og dermed klar til brug.`)}
        </Text>
      </Box>

    </>
  )
}

export default IntegrationDone