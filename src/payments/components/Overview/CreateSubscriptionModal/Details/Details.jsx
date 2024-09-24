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
  isBefore,
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
  TextArea,
  StyledCheckbox,
  Switch,
  Dropdown,
  Select,
} from 'components'
import {Alert, Pin} from 'components/icons'
import Warning from 'components/icons/Warning'
import {getPaymentMobilePaySubscriptionAgreementAccepted, getActiveCurrency, getEconomicMastercardPaymentServiceIsReady} from 'clubs/selectors'
import countryCodes from 'lib/countryCodes'
import {getCompanyName} from 'app/selectors'
import {getClubPaymentMethods} from 'paymentMethods/actions'
import {useToggle} from 'lib/hooks'
import { useFeature } from "@growthbook/growthbook-react";
import { module_subscription_end_date_field, module_mastercard_payment } from 'globalModuleNames';


const Details = ({
  paymentAgreementAccepted,
  economicMastercardPaymentServiceIsReady,
  countryCode,
  paymentInterval,
  exemptAdminPayment,
  exemptGroupLeadersPayment,
  currency,
  companyName,
  getClubPaymentMethods,
  mobilePaySubscription,
  values,
  isValid
}) => {
  const t = useCustomTranslation()
  const [isOpen, , hide, toggle] = useToggle()
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
      <Text secondary>{t('Titel')} *</Text>
      <Field name="title">
        {({field, form}) => (
          <Box mb={2}>
            <Input
              {...field}
              small
              last
              maxLength="29"
              error={form.touched[field.name] && form.errors[field.name]}
            />
            {form.touched[field.name] && form.errors[field.name] && (
              <Box mt={2}>
                <Text small danger>
                  {form.errors[field.name]}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Field>

      <Text secondary>{t('Price')} (DKK) *</Text>
      <Field name="price">
        {({field, form}) => (
          <Box mb={2}>
            <Input
              {...field}
              small
              last
              error={form.touched[field.name] && form.errors[field.name]}
            />
            {form.touched[field.name] && form.errors[field.name] && (
              <Box mt={2}>
                <Text small danger>
                  {form.errors[field.name]}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Field>

      <Flex justifyContent="space-between" mb={2}>
        <Box mr={useFeature(module_subscription_end_date_field).on ? 3 : 0} flex="1">
          <Flex>
            <Text secondary mr={2}>
              {t('Start dato')} *
            </Text>
            <Tooltip text={t('subscriptionDateExplanation')} width="200px">
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
        {useFeature(module_subscription_end_date_field).on && 
        
        <Box flex="1">
          <Text secondary>{t('Slut dato')}</Text>
          <Field name="paymentEndDate">
            {({ field,
                form: {
                  values: {paymentEndDate},
                  ...form
                },
            }) => (
              <>
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
              
              </>
            )}
          </Field>
          
        </Box>
        
        }
      </Flex>


      <Flex >      
        <Box flex="1" mb={2}>
          <Text secondary>{t('Betalings interval')} *</Text>
          <Field name="paymentInterval">
          {({ field,
                form: {
                  values: {paymentInterval},
                  ...form
                },
            }) => (
              <>
                <Select
                {...field}
                last
                  >
                  <option value="">
                    {t('Vælg interval')}
                  </option>
                  <option value={1}>{t('Månedlig')}</option>
                  <option value={3}>{t('Kvartal')}</option>
                  <option value={6}>{t('Halvårlig')}</option>
                  <option value={12}>{t('Årlig')}</option>
                </Select>

                {form.touched[field.name] && form.errors[field.name] && (
                  <Box mt={2} >
                    <Text small danger>
                      {t(`${form.errors[field.name]}`)}
                    </Text>
                  </Box>
                )}
              </>
              )}
            </Field>
        </Box>
      </Flex>
      <Flex>
        <Box mr={2}>
          <Text secondary>{t('Link til betalingsvilkår *  ')} </Text>
        </Box>
        <Tooltip text={t('Der skal linkes til betalingsvilkår, så medlem kan se gældende betingelser for indgåelse af betalingsaftale.')} width="200px">
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
      <Field name="agreementUrl">
        {({field, form}) => (
          <Box mb={2}>
            <Input
              {...field}
              small
              last
              error={form.touched[field.name] && form.errors[field.name]}
            />
            {form.touched[field.name] && form.errors[field.name] && (
              <Box mt={2}>
                <Text small danger>
                  {form.errors[field.name]}
                </Text>
              </Box>
            )}
          </Box>
        )}
      </Field>
      
      <Box my={3}>
      
        {(countryCode === countryCodes.da || countryCode === countryCodes.da_DK) && (
          <>

            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Flex alignItems="center">
                <Field name="mobilePaySubscription">
                  {({
                    field: {value, name},
                    form: {setFieldValue, setFieldTouched},
                  }) => (
                    <StyledCheckbox
                      checked={value}
                      disabled={!paymentAgreementAccepted}
                      onChange={({target: {checked}}) => {
                        setFieldTouched('methods')
                        setFieldValue(name, checked)
                      }}
                    />
                  )}
                </Field>
                <Box mx={2}>
                  <Text color={paymentAgreementAccepted ? 'black' : 'secondary'}>
                  {t('MobilePay Subscription')} ({t('Kræver MobilePay Subscription - Tilslutningsaftale')})
                  </Text>
                </Box>
                <Tooltip text={t('mobilePayExplanation')}>
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
            
            {useFeature(module_mastercard_payment).on && 
              <Flex justifyContent="space-between" alignItems="center" mb={3}>
                <Flex alignItems="center">
                  <Field name="economicMastercardPaymentService">
                    {({
                      field: {value, name},
                      form: {setFieldValue, setFieldTouched},
                    }) => (
                      <StyledCheckbox
                        checked={value}
                        disabled={!economicMastercardPaymentServiceIsReady}
                        onChange={({target: {checked}}) => {
                          setFieldTouched('methods')
                          setFieldValue(name, checked)
                        }}
                      />
                    )}
                  </Field>
                  <Box mx={2}>
                    <Text color={economicMastercardPaymentServiceIsReady ? 'black' : 'secondary'}>
                      {t('E-conomic Mastercard Betalingsservice')} ({t('Kræver Mastercard Betalingsservice opsætning')})
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            }
          </>
        )}

        <Flex mb={2} justifyContent="space-between" alignItems="center">
                  <Flex alignItems="center">

                    <Field name="exemptAdminPayment">
                      {({
                        field: {value, name},
                        form: {setFieldValue, setFieldTouched},
                      }) => (
                        <StyledCheckbox
                          checked={value}
                          onChange={({target: {checked}}) => {
                          setFieldTouched('methods')
                          setFieldValue(name, checked)
                          }}
                        />
                      )}
                    </Field>

                    <Box mx={2}>
                      <Text>{t('Administratorer fritages for opkrævning')}</Text>
                    </Box>
                  </Flex>
        </Flex>

        <Flex mb={2} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">

            <Field name="exemptGroupLeadersPayment">
              {({
                field: {value, name},
                form: {setFieldValue, setFieldTouched},
              }) => (
                <StyledCheckbox
                  checked={value}
                  onChange={({target: {checked}}) => {
                    setFieldTouched('methods')
                    setFieldValue(name, checked)
                  }}
                />
              )}
            </Field>

            <Box mx={2}>
              <Text>{t('Gruppeledere fritages for opkrævning')}</Text>
            </Box>
          </Flex>
        </Flex>	
        
        <Flex mb={2} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">

            <Field name="exemptRelations">
              {({
                field: {value, name},
                form: {setFieldValue, setFieldTouched},
              }) => (
                <StyledCheckbox
                  checked={value}
                  onChange={({target: {checked}}) => {
                    setFieldTouched('methods')
                    setFieldValue("householdPayment", false)
                    setFieldValue(name, checked)
                  }}
                />
              )}
            </Field>

            <Box mx={2}>
              <Text>{t('Relationer fritages for opkrævning')}</Text>
            </Box>
          </Flex>
        </Flex>	
        
        <Flex mb={2} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">

            <Field name="householdPayment">
              {({
                field: {value, name},
                form: {setFieldValue, setFieldTouched},
              }) => (
                <StyledCheckbox
                  checked={value}
                  onChange={({target: {checked}}) => {
                    setFieldTouched('methods')
                    setFieldValue(name, checked)
                    setFieldValue("exemptRelations", false)
                  }}
                />
              )}
            </Field>

            <Box mx={2}>
              <Text>{t('Opkræv husstand')}</Text>
            </Box>
          </Flex>
        </Flex>	

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
