import React, {useCallback, useEffect, useState} from 'react'
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
  H1,
} from 'components'
import {Alert} from 'components/icons'
import {getPaymentAgreementAccepted, getActiveCurrency} from 'clubs/selectors'
import {kevinIsActive } from 'paymentMethods/selectors'
import countryCodes from 'lib/countryCodes'
import {getCompanyName} from 'app/selectors'
import {getClubPaymentMethods} from 'paymentMethods/actions'
import { useFeature } from "@growthbook/growthbook-react";
import { module_myassociation_payment } from 'globalModuleNames';

const Details = ({
  paymentAgreementAccepted,
  reducedPayment,
  externalPaymentDisabled,
  countryCode,
  exemptAdminPayment,
  exemptGroupLeadersPayment,
  exemptRelationsPayment, 
  currency,
  companyName,
  kevinIsActive,
  getClubPaymentMethods,
  ReducedPaymentStartDate,
}) => {
  const t = useCustomTranslation()
  const [kevinPaymentMethodIsActive, setKevinPaymentMethodIsActive] = useState(false)

  useEffect(() => {
    new Promise((resolve) => {
      getClubPaymentMethods({resolve})
    }).then(result => {
      if (result != null) {
        let paymentMethods = result.filter(p => p.paymentMethodName.toLowerCase() == "kevin");
        if (paymentMethods.length > 0) {
          setKevinPaymentMethodIsActive(true);
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
        <Box mr={3} flex="1">
          <Flex>
            <Text secondary mr={2}>
              {t('Startdato')}*
            </Text>
            <Tooltip text={t('paymentDateExplanation')} width="200px">
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

          <Field
            name="paymentStartDate"
            validate={(value) => {
              if (isBefore(value, new Date())) {
                return 'Skal være fremadrettet'
              }
            }}
            render={({field, form}) => (
              <>
                <DateInput
                  {...field}
                  last
                  small
                  viewDate={
                    field.value || setMinutes(addHours(new Date(), 1), 0)
                  }
                  isValidDate={(current) =>
                    isAfter(current, startOfYesterday())
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
                {form.touched[field.name] && form.errors[field.name] && (
                  <Box mt={2}>
                    <Text danger small>
                      {form.errors[field.name]}
                    </Text>
                  </Box>
                )}
              </>
            )}
          />
        </Box>

        <Box flex="1">
          <Text secondary>{t('Slutdato')} *</Text>
          <Field name="requestDate">
            {({
              field,
              form: {
                values: {paymentStartDate},
                ...form
              },
            }) => (
              <DateInput
                {...field}
                last
                small
                viewDate={
                  field.value ||
                  (paymentStartDate
                    ? addDays(paymentStartDate, 1)
                    : setMinutes(addHours(new Date(), 1), 0))
                }
                isValidDate={(current) =>
                  isAfter(current, paymentStartDate || startOfYesterday())
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
      
      <Flex>
        <Text secondary mr={2}>
          {t('Betalingsfrist (antal dage)')} *
        </Text>

        <Tooltip text={t('deadlineExplanation')}>
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

      <Field
        name="daysTillDeadline"
        render={({field, form}) => (
          <Box mb={2}>
            <Input
              {...field}
              small
              last
              type="number"
              error={form.touched[field.name] && form.errors[field.name]}
            />

            {form.touched[field.name] && form.errors[field.name] && (
              <Box mt={2}>
                <Text danger small>
                  {form.errors[field.name]}
                </Text>
              </Box>
            )}
          </Box>
        )}
      />
      <Flex>
        <Box flex="1" mr={reducedPayment && 3}>
          <Text secondary>
            {reducedPayment
              ? t('Fuld Pris')
              : `${t('Pris')}`}
            *
          </Text>

          <Field
            name="individualAmount"
            render={({field, form}) => (
              <Box mb={2}>
                <Input
                  {...field}
                  small
                  last
                  error={form.touched[field.name] && form.errors[field.name]}
                />
                {form.touched[field.name] && form.errors[field.name] && (
                  <Box mt={2}>
                    <Text danger small>
                      {form.errors[field.name]}
                    </Text>
                  </Box>
                )}
              </Box>
            )}
          />
        </Box>
        
        {reducedPayment && (
          <Box flex="1">
            <Text secondary>
              {t('Mindste Pris', {currency})} *
            </Text>
            <Field
              name="minimumAmount"
              render={({field, form}) => (
                <Box mb={2}>
                  <Input
                    {...field}
                    small
                    last
                    error={form.touched[field.name] && form.errors[field.name]}
                  />

                  {form.touched[field.name] && form.errors[field.name] && (
                    <Box mt={2}>
                      <Text danger small>
                        {form.errors[field.name]}
                      </Text>
                    </Box>
                  )}
                </Box>
              )}
            />
          
          </Box>
        )}
      </Flex>
      {/* Her har jeg indpakket de relevante felter i en betinget rendering. Når reducedPayment er true, vises Start dato for reduceret betaling først, efterfulgt af Reduceret betaling-sektionen. Når reducedPayment er false, vises kun Reduceret betaling-sektionen. */}
      { reducedPayment ? (
  <>
    <Flex>
      <Text secondary mr={2}>
        {t('Aktiveringsdato for reduceret betaling')} *
      </Text>
      <Tooltip text={t('Vælg den ønskede dato for aktivering af den reducerede betaling. Bemærk, at denne aktiveringsdato skal falde inden for betalingsperioden (Startdato og Slutdato)')}>
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

    <Field name='ReducedPaymentStartDate'>
      {({field: {name}, form: {setFieldValue, setFieldTouched, values:{paymentStartDate}}})=>(
        <DateInput 
        small 
        onBlur={() => setFieldTouched(name, true)} 
        isValidDate={(current) => isAfter(current, paymentStartDate || startOfYesterday())}
        onChange={(val) => setFieldValue(name, val)}
        />
      )}
    </Field>

    <Flex alignItems="center" justifyContent="space-between" mb={3} mt={2}>
      <Flex alignItems="center">
        <Text secondary mr={2}>
          {t('Reduceret betaling')}
        </Text>
        <Tooltip text={t('reducedPaymentExplanation')}>
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

      <Field name="reducedPayment">
        {({field: {name, value}, form: {setFieldValue}}) => (
          <Switch
            value={value}
            onChange={() => setFieldValue(name, !value)}
          />
        )}
      </Field>
    </Flex>
  </>
) : (
  <Flex alignItems="center" justifyContent="space-between" mb={3} mt={2}>
    <Flex alignItems="center">
      <Text secondary mr={2}>
        {t('Reduceret betaling')}
      </Text>
      <Tooltip text={t('reducedPaymentExplanation')}>
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

    <Field name="reducedPayment">
      {({field: {name, value}, form: {setFieldValue}}) => (
        <Switch
          value={value}
          onChange={() => setFieldValue(name, !value)}
        />
      )}
    </Field>
  </Flex>
)}


      <Text secondary mr={2} mb={2}>
          {t('Betalingsmetoder')}
      </Text>

      <Box mb={3}>
        {(countryCode === countryCodes.da || countryCode === countryCodes.da_DK) && (
          <Flex justifyContent="space-between" alignItems="center" mb={3}>
            <Flex alignItems="center">
              <Field name="mobilePayDisabled">
                {({
                  field: {value, name},
                  form: {setFieldValue, setFieldTouched},
                }) => (
                  <StyledCheckbox
                    checked={!value}
                    disabled={!paymentAgreementAccepted}
                    onChange={({target: {checked}}) => {
                      setFieldTouched('methods')
                      setFieldValue(name, !checked)
                    }}
                  />
                )}
              </Field>
              <Box mx={2}>
                <Text color={paymentAgreementAccepted ? 'black' : 'secondary'}>
                  MobilePay ({t('Kræver MobilePay - Foreningsaftale')})
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
        )}
        {useFeature(module_myassociation_payment).on && 
          <Flex mb={2} justifyContent="space-between" alignItems="center">
            <Flex alignItems="center">
              <Field name="kevinPaymentDisabled"> 
                {({
                  field: {value, name},
                  form: {setFieldValue, setFieldTouched},
                }) => (
                  <StyledCheckbox
                    checked={!value}
                    disabled={!kevinPaymentMethodIsActive}
                    onChange={({target: {checked}}) => {
                      setFieldTouched('methods')
                      setFieldValue(name, !checked)
                    }}
                  />
                )}
              </Field>
              <Box mx={2}>
                <Text color={kevinPaymentMethodIsActive ? 'black' : 'secondary'}>{t('MinForening betalingsløsning')}</Text>
              </Box>
              <Tooltip text={t('kevinPaymentExplanation')}>
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
        }
        <Flex mb={2} justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Field name="externalPaymentDisabled"> 
              {({
                field: {value, name},
                form: {setFieldValue, setFieldTouched},
              }) => (
                <StyledCheckbox
                  checked={!value}
                  onChange={({target: {checked}}) => {
                    setFieldTouched('methods')
                    setFieldValue(name, !checked)
                  }}
                />
              )}
            </Field>
            <Box mx={2}>
              <Text>{t('Ekstern betaling')}</Text>
            </Box>
            <Tooltip text={t('externalPaymentExplanation')}>
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

        {!externalPaymentDisabled && (
          <>
            <Flex mt={3}>
              <Text secondary mr={2}>
                {t('Info ved ekstern betaling *')}
              </Text>
              <Tooltip text={t('infoExplanation', {companyName})}>
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

            <Field
              name="paymentDescription"
              render={({field, form}) => (
                <Box mb={2}>
                  <TextArea rows={3} small last {...field} error={form.touched[field.name] && form.errors[field.name]}/>
                  {field.value === "" ? 
                  <Box mt={2}>
                    <Text small danger>
                      Info ved ekstern betaling mangler
                    </Text>
                  </Box> : null }
                
                </Box>
              )}
            />
            
          </>
        )}

        <Text secondary mr={2} mb={2}>
            {t('Flere indstillinger')}
        </Text>
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

                    {/* <Tooltip text={t('exemptAdminExplanation')}>
                      {({show, hide}) => (
                        <Alert
                          onMouseEnter={show}
                          onMouseLeave={hide}
                          fill="secondary"
                          size={16}
                        />
                      )}
                    </Tooltip> */}
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

                    {/* <Tooltip text={t('exemptGlExplanation')}>
                      {({show, hide}) => (
                        <Alert
                          onMouseEnter={show}
                          onMouseLeave={hide}
                          fill="secondary"
                          size={16}
                        />
                      )}
                    </Tooltip> */}

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
                    setFieldValue("householdPayment", false)
                    setFieldTouched('methods')
                    setFieldValue(name, checked)
                  }}
                />
              )}
            </Field>

            <Flex alignItems="center">
              <Box mx={2}>
                <Text>{t('Relationer fritages for opkrævning')}</Text>

              </Box>
                <Tooltip text={t('RelationExemptInfo')}>
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
                    setFieldValue("exemptRelations", false)
                    setFieldTouched('methods')
                    setFieldValue(name, checked)
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
    paymentAgreementAccepted: getPaymentAgreementAccepted,
    kevinIsActive: kevinIsActive,
  }),{
    getClubPaymentMethods: getClubPaymentMethods.requested,
  }
)


export default enhancer(Details)
