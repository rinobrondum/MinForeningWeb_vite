import React from 'react'
import { H1, Box , Text, Button} from 'components'
import { useTranslation } from 'react-i18next'
const Integration = () => {
    const [t] = useTranslation()


  return (
    <>
      <H1>{t("Mobilepay Integration")}</H1>

      <Box mb={3} mt={2}>
        <Text>{`
            ${t(`Ønsker I at sætte jeres egen MobilePay-konto op til MobilePay Payments og MobilePay Subscriptions i MinForening, så skal I godkende MinForening som 3. parts integration med MobilePay. 

            Med MobilePay integration bliver jeres medlemmers transaktioner automatisk overført fra MobilePay til jeres foreningskonto. 

            Derudover giver MobilePay Portalen jer nem adgang til at eksportere rapporter med oversigt over MobilePay indbetalinger fra jeres medlemmer. 

            Tryk`)} ${<a href="https://minforening.dk/support-2/?Display_FAQ=61177" target='_blank'>Her</a> } for guide og pris for opsætning af MobilePay integration med MinForening.
        
        `}
        </Text>
        <Button mt={3} onClick={()=>{window.location.href='https://portal.mobilepay.dk/auth/login?encodedQueryString=P1JldHVyblVybD0lMkZhY2NvdW50JTJGY29ubmVjdCUyRmF1dGhvcml6ZSUyRmNhbGxiYWNrJTNGcmVzcG9uc2VfdHlwZSUzRGNvZGUlMjUyMGlkX3Rva2VuJTI2bm9uY2UlM0RoVkp1ajRwd2xOWEgxazZMdDBneDJnJTI2c3RhdGUlM0RxUHJDY2N5TmZXYzlKWmx2anVIT1RRJTI2Y29kZV9jaGFsbGVuZ2UlM0RYdnpXeUNSVFB1NzZxQXl1VksyZVpnSWg3YkZsdjU4TEpUVEs0MWFOaHhRJTI2Y29kZV9jaGFsbGVuZ2VfbWV0aG9kJTNEUzI1NiUyNmNsaWVudF9pZCUzRG1pbmZvcmVuaW5nJTI2c2NvcGUlM0RvcGVuaWQlMjUyMHN1YnNjcmlwdGlvbnMlMjUyMHRyYW5zYWN0aW9ucmVwb3J0aW5nJTI1MjBvZmZsaW5lX2FjY2VzcyUyNnJlZGlyZWN0X3VyaSUzRGh0dHBzJTI1M0ElMjUyRiUyNTJGYXBpLm1pbmZvcmVuaW5nLmRrJTI1MkZhcGklMjUyRnY0JTI1MkZwYXltZW50cyUyNTJGbW9iaWxlcGF5c3Vic2NyaXB0aW9uJTI1MkZjYWxsYmFjayUyNnJlc3BvbnNlX21vZGUlM0Rmb3JtX3Bvc3Q~EOF';}}>Indsend</Button>
      </Box>

    </>
  )
}


export default Integration