import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Field, ErrorMessage} from 'formik'
import {
  addDays,
  setMinutes,
  addHours,
  isAfter,
  startOfYesterday,
} from 'date-fns'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {
  Input,
  DateInput,
  Text,
  Tooltip,
  Box,
  Flex,
  Button,
} from 'components'
import {Alert, Pin} from 'components/icons'
import Warning from 'components/icons/Warning'
import {getPaymentMobilePaySubscriptionAgreementAccepted, getActiveCurrency, getEconomicMastercardPaymentServiceIsReady} from 'clubs/selectors'
import countryCodes from 'lib/countryCodes'
import {getCompanyName} from 'app/selectors'
import {getClubPaymentMethods} from 'paymentMethods/actions'
import {useToggle} from 'lib/hooks'

const Details = ({
  economicMastercardPaymentServiceIsReady,
  getClubPaymentMethods
}) => {
  const t = useCustomTranslation()
  const [mobilepaysubscriptionMethodIsActive, setMobilepaysubscriptionMethodIsActive] = useState(false)

  useEffect(() => {
    new Promise((resolve) => {
      getClubPaymentMethods({resolve})
    }).then(result => {
      if (result != null) {
        let paymentMethods = result.filter(p => p.paymentMethodName.toLowerCase() == "mobilepaysubscription");
        if (paymentMethods.length > 0) {
          setMobilepaysubscriptionMethodIsActive(true);
        }
      }
      
    })
  }, [getClubPaymentMethods]) 

  return (
    <>
      
      
      <Flex justifyContent="space-between" mb={2}>
        <Box mr={3} flex="1">
          <Flex>
            <Text secondary mr={2}>
              {t('Start dato')} *
            </Text>
            <Tooltip text={t('startAndEndExplanation')}>
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

          <Field name="paymentStartDate">
             {({
               field:  { name, value},
               form: { touched, errors, setFieldTouched, setFieldValue}, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
               meta,
             }) => (
               <>
                 <DateInput 
                {...Field}
                last
                small
                viewDate={
                  value || setMinutes(addHours(new Date(), 1), 0)
                }
                isValidDate={(current) =>
                  isAfter(current, startOfYesterday())
                }
                error={touched[name] && errors[name]}
                onChange={(val) => setFieldValue(name, val)}
                onBlur={() => setFieldTouched(name, true)}
                renderAddon={(close) => (
                  <Button small block onClick={close}>
                    {t('Ok')}
                  </Button>
                )} 
                 
                 />
                  {touched[name] && errors[name] && (
                  <Box mt={2}>
                    <Text danger small>
                      {errors[name]}
                    </Text>
                  </Box>
                )}                 
               </>
             )}
           </Field>
        </Box>

        <Box flex="1">
          <Text secondary>{t('Slut dato')}</Text>
          <Field name="paymentEndDate">
            {({ field,
                form: {
                  values: {paymentEndDate},
                  ...form
                },
            }) => (
              <DateInput
                {...field}
                last
                small
                viewDate={
                  field.value ||
                  (paymentEndDate
                    ? addDays(paymentEndDate, 1)
                    : setMinutes(addHours(new Date(), 1), 0))
                }
                isValidDate={(current) =>
                  isAfter(current, paymentEndDate || startOfYesterday())
                }
                error={form.touched[field.name] && form.errors[field.name]}
                onChange={(val) => form.setFieldValue(field.name, val)}
                onBlur={() => form.setFieldTouched(field.name, true)}
                renderAddon={(close) => (
                  <Button small block onClick={close}>
                    {t('Ok')}
                  </Button>
                )}
              />
            )}
          </Field>
        </Box>
      </Flex>
           
      <Box my={3}>
      
       


        <ErrorMessage name="methods">
          {(message) => (
            <Text danger mt={2}>
              {message}
            </Text>
          )}
        </ErrorMessage>

      </Box>
    </>
  )
}

const enhancer = connect(
  createStructuredSelector({
    companyName: getCompanyName,
    currency: getActiveCurrency,
    paymentAgreementAccepted: getPaymentMobilePaySubscriptionAgreementAccepted,
    economicMastercardPaymentServiceIsReady: getEconomicMastercardPaymentServiceIsReady
  }),{
    getClubPaymentMethods: getClubPaymentMethods.requested,
  }
)


export default enhancer(Details)