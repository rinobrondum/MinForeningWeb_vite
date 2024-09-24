import React, {useState, useEffect, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Field} from 'formik'
import {
  isAfter,
  addHours,
  addMilliseconds,
  differenceInMilliseconds,
  isBefore,
  startOfYesterday,
  startOfToday,
  startOfTomorrow,
  subDays,
  setMinutes,
  getHours,
  setHours,
  endOfYesterday,
} from 'date-fns'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {
  LabeledInput,
  LabeledDateInput,
  LabeledSelect,
  LabeledTextArea,
  LabeledSwitch,
  Text,
  Box,
  Flex,
  Button,
  Tooltip,
  PaymentMethods,
  PaymentMethodList,
  StyledCheckbox,
  Searchable,
  Input,
} from 'components'
import {Alert} from 'components/icons'
import {getPaymentAgreementAccepted, getActive, getActiveCurrency, getVatId} from 'clubs/selectors'
import {typesById} from 'activities/constants'
import CoverImageInput from './CoverImage'
import ImagesInput from './Images'
import {asArray as recurringOptions} from 'activities/components/NewActivityForm/recurringOptions'
import ResponsibleSelect from './ResponsibleSelect'
import CoHostSelect from './CoHostSelect'
import VisibilitySelect from './VisiblilitySelect'
import styled from 'styled-components'
import {getClubPaymentMethods} from 'paymentMethods/actions'
import {toLower, includes} from 'lodash'
import countryCodes from 'lib/countryCodes'
import { useFeature } from "@growthbook/growthbook-react";
import { module_wiiandi_calendar } from 'globalModuleNames';
import { getTldLocale } from 'app/selectors'

const ListContainer = styled(Box)`
  max-height: 200px;
  overflow-y: scroll;

`

const Details = ({
  isEdit,
  values,
  setFieldValue,
  setFieldTouched,
  touched,
  paymentAgreementAccepted,
  currency,
  vatId,
  club,
  paymentMethodBulk,
  getClubPaymentMethods,
  tldLocale,
  whiteLabelData
}) => {
  const t = useCustomTranslation()
  const [kevinPaymentMethodIsActive, setKevinPaymentMethodIsActive] = useState(false)
  const [commonCalendar, setCommonCalendar] = useState(false)
  
  const checkTimeIsValid = (inputTime, inputDate) => {
    const currentDate = new Date();
    const currentHours = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    let isValid;
    // Format current time as "HH:MM"
    const currentTime = `${currentHours.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;
    
    isValid = false
    if(inputDate > startOfTomorrow()){
      isValid = true
    } else if(inputTime > currentTime){
      isValid = true
    }
    
    return isValid;
}

  const togglePaymentMethod = useCallback(
    ({target: {value, checked}}) => {
      setFieldValue(
        'paymentMethods',
        checked
          ? [...paymentMethodBulk, value]
          : paymentMethodBulk.filter((paymentMethod) => paymentMethod.toString() !== value)
      )
    },
    [setFieldValue, paymentMethodBulk]
  )

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
  }, [getClubPaymentMethods, kevinPaymentMethodIsActive])


  return (
    <Flex flexDirection="column">

      {values.type != null && typesById[values.type] != null &&
        <CoverImageInput
          name="coverImage"
          handleChange={(val) => setFieldValue('coverImage', val)}
          value={values.coverImage}
          type={typesById[values.type]}
        />
      }
      <Flex flexDirection="column" p={3}>
        <Box mb={2}>
          <Field
            name="title"
            component={LabeledInput}
            label={`${t('Titel')} *`}
          />
        </Box>


        {(!isEdit || values.activityPayment) && !values.recurring && (
            <>
          <Box mb={2}>
            <Field
              readOnly={!paymentAgreementAccepted || isEdit}
              disabled={!paymentAgreementAccepted}
              name="amount"
              placeholder={
                !paymentAgreementAccepted
                  ? t('Kræver MobilePay - Foreningsaftale')
                  : undefined
              }
              component={LabeledInput}
              label={`${t("Beløb")} ${whiteLabelData.activityCurrency[tldLocale]}`}
              onClick={() => setFieldTouched('amount', true, true)}
            />

            {touched.amount && isEdit && (
              <Text danger small>
                Det er ikke muligt at ændre beløb i en aktivitetsbetaling
              </Text>
              )}   
          </Box>    
        </>
        )}

        <Box mb={2}>
          <ResponsibleSelect />
        </Box>
        {values.amount && (
          <Box mb={2}>
            <CoHostSelect />
          </Box>
        )}
        <Box mb={2}>
          <Field name="location" component={LabeledInput} label={t('Sted')} />
        </Box>
        <Box mb={2}>
          <Field
            name="start"
            render={({field, form}) => (
              <LabeledDateInput
                {...field}
                viewDate={field.value || setMinutes(addHours(new Date(), 1), 0)}
                isValidDate={(current) => isAfter(current, startOfYesterday())}
                onChange={(val) => {
                  if (form.values.recurringUntill) {
                    form.setFieldValue(
                      'recurringUntill',
                      setHours(form.values.recurringUntill, getHours(val))
                    )
                  }

                  if (!form.values.end) {
                    form.setFieldValue('end', addHours(val, 1))
                  } else {
                    const diff = differenceInMilliseconds(
                      form.values.end,
                      form.values.start
                    )
                    form.setFieldValue('end', addMilliseconds(val, diff))
                  }

                  form.setFieldValue(field.name, val)
                }}
                onBlur={() => form.setFieldTouched(field.name, true)}
                error={form.touched[field.name] && form.errors[field.name]}
                label={`${t('Starter')} *`}
                renderAddon={(close) => (
                  <Button small block onClick={close}>
                    Ok
                  </Button>
                )}
              />
            )}
          />
        </Box>
        <Box mb={2}>
          <Field
            name="end"
            render={({field, form}) => (
              <LabeledDateInput
                {...field}
                isValidDate={(current) =>
                  isAfter(
                    current,
                    values.start ? subDays(values.start, 1) : startOfYesterday()
                  )
                }
                onChange={(val) => form.setFieldValue(field.name, val)}
                onBlur={() => form.setFieldTouched(field.name, true)}
                error={form.touched[field.name] && form.errors[field.name]}
                label={t('Slutter')}
                renderAddon={(close) => (
                  <Button small block onClick={close}>
                    {t('Ok')}
                  </Button>
                )}
              />
            )}
          />
        </Box>
        <Box mb={2}>
          <Field
            name="deadline"
            render={({field, form}) => {
              return (<LabeledDateInput
                {...field}
                viewDate={field.value || setHours(startOfToday(), new Date().getHours())}
                isValidDate={(current) => {
                  return isAfter(current, startOfYesterday())
                }}
                onChange={(val) => form.setFieldValue(field.name, val)}
                onBlur={() => form.setFieldTouched(field.name, true)}
                error={form.touched[field.name] && form.errors[field.name]}
                label={`${t('Svarfrist')} ${values.amount ? ' *' : ''}`}
                renderAddon={(close) => (
                  <Button small block onClick={close} disabled={field.value && Object.prototype.toString.call(field.value) === '[object Date]' ? !checkTimeIsValid(field.value && Object.prototype.toString.call(field.value) === '[object Date]' ? `${field.value.getHours() >= 10 ? field.value.getHours() : `0${field.value.getHours()}`}:${field.value.getMinutes() >= 10 ? field.value.getMinutes() : `0${field.value.getMinutes()}`}` : null, field.value) : false}>
                    {t('Ok')}
                  </Button>
                )}
              />)
            }}
          />
        </Box>
        {values.deadline && (
          <Box mb={2}>
            <LabeledSwitch
              name="twoDaysReminder"
              label={t('Påmindelse to dage før')}
              handleChange={({target: {checked}}) =>
                setFieldValue('twoDaysReminder', checked)
              }
              value={values.twoDaysReminder}
            />
          </Box>
        )}
        <Box mb={2}>
          <Field
            name="description"
            render={({field, form}) => (
              <LabeledTextArea
                {...field}
                error={form.touched.description && form.errors.description}
                label={t('Beskrivelse')}
              />
            )}
          />
        </Box>
        <ImagesInput
          setFieldValue={setFieldValue}
          value={values.images}
          id={values.id}
          isRecurring={!!values.recurring}
        />
        {!isEdit && (
          <Box mb={2}>
            <LabeledSelect
              required
              name="recurring"
              options={recurringOptions}
              label={t('Gentaget aktivitet')}
              value={values.recurring}
              title={t(recurringOptions[values.recurring].name)}
              renderItem={({id, name}, hide) => (
                <Box
                  p={2}
                  onClick={() => {
                    setFieldValue('recurring', id)
                    hide()
                  }}
                >
                  <Text secondary>{t(name)}</Text>
                </Box>
              )}
            />
          </Box>
        )}
        {!isEdit && values.recurring > 0 && (
          <Box mb={2}>
            <Field
              name="recurringUntill"
              render={({field, form}) => (
                <LabeledDateInput
                  {...field}
                  timeFormat={false}
                  isValidDate={(current) => isAfter(current, values.start)}
                  onChange={(val) =>
                    form.setFieldValue(
                      field.name,
                      setHours(
                        val,
                        form.values.start ? getHours(form.values.start) : 12
                      )
                    )
                  }
                  onBlur={() => form.setFieldTouched(field.name, true)}
                  error={form.touched[field.name] && form.errors[field.name]}
                  label={t('Gentag indtil')}
                  renderAddon={(close) => (
                    <Button small block onClick={close}>
                      {t('Ok')}
                    </Button>
                  )}
                />
              )}
            />
          </Box>
        )}
        {!values.amount && !values.limit && (
          <Box mb={2}>
            <LabeledSwitch
              disabled={isEdit}
              name="forcedParticipation"
              label={t('Inviterede deltager automatisk')}
              handleChange={({target: {checked}}) =>
                setFieldValue('forcedParticipation', checked)
              }
              value={values.forcedParticipation}
            />
          </Box>
        )}
        {!values.forcedParticipation && (
          <Box mb={2}>
            <Field
              name="limit"
              component={LabeledInput}
              label={t('Maks antal deltagere')}
            />
          </Box>
        )}  
        <Box mb={2}>
          <LabeledSwitch
            name="sendNotification"
            label={t('Invitationsnotifikation')}
            handleChange={({target: {checked}}) =>
              setFieldValue('sendNotification', checked)
            }
            value={values.sendNotification}
          />
        </Box>
        <Box mb={2}>
          <VisibilitySelect />
        </Box>

        {useFeature(module_wiiandi_calendar).on &&
          <Box mb={2}>
            {vatId != undefined && (
              <LabeledSwitch
                name="sharedToPublicCalendar"
                label={t('Fælleskalender (www.wiiandi.dk)')}
                handleChange={({target: {checked}}) =>{
                  setFieldValue('sharedToPublicCalendar', checked)
                  setCommonCalendar(!commonCalendar)
                  }
                }
                value={values.sharedToPublicCalendar}
              />
            )}
            {vatId == undefined && (
              <Field
                component={LabeledInput}
                name=' '
                label={t('Fælleskalender (www.wiiandi.dk)')}
                readOnly={true}
                disabled={true}
                placeholder='CVR number required'
              />
            )}
            {
              commonCalendar ? values.coverImage ? null : <Text small style={{color: "#DD9295"}}>{t('Kræver coverbillede')}</Text> : null
            }
          </Box>
        }


        <Box mb={2}>
          <LabeledSwitch
            name="participantsVisible"
            label={t('Vis deltagerliste')}
            handleChange={({target: {checked}}) =>
              setFieldValue('participantsVisible', checked)
            }
            value={values.participantsVisible}
          />
        </Box>
        <Box mb={2}>
          <LabeledSwitch
            name="commentsEnabled"
            label={t('Kommentarspor aktiveret')}
            handleChange={({target: {checked}}) =>
              setFieldValue('commentsEnabled', checked)
            }
            value={values.commentsEnabled}
          />
        </Box>
      </Flex>
    </Flex>
  )
}

const enhancer = connect(
  createStructuredSelector({
    club: getActive,
    currency: getActiveCurrency,
    vatId: getVatId,
    paymentAgreementAccepted: getPaymentAgreementAccepted,
    tldLocale: getTldLocale
  }), {
    getClubPaymentMethods: getClubPaymentMethods.requested
  }
)

export default enhancer(Details)
