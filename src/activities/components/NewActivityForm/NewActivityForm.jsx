import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {ThemeProvider} from 'styled-components'
import {Formik} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {typesById} from 'activities/constants'
import {getUserId} from 'user'
import steps from './steps'
import Choose from './Choose'
import Details from './Details'
import Participants from './Participants'
import {byName} from './recurringOptions'
import validationSchema from './validationSchema'

const createTheme = (color) => (theme) =>
  color
    ? {
        ...theme,
        colors: {
          ...theme.colors,
          primary: theme.colors[color],
        },
      }
    : theme

const NewActivityForm = ({
  step,
  setStep,
  renderActions,
  onSubmit,
  isEdit,
  initialValues = {},
  isInitialValid,
  userId,
  whiteLabelData
}) => {
  const t = useCustomTranslation()
  
  return (
    <Formik
      enableReinitialize
      onSubmit={onSubmit}
      isInitialValid={isInitialValid}
      initialValues={{
        start: '',
        end: '',
        recurring: byName.NONE.id,
        commentsEnabled: !initialValues.commentsDisabled,
        kevinPaymentDisabled: true,
        forcedParticipation: false,
        participantsVisible: !initialValues.participantListHidden,
        sharedToPublicCalendar: false,
        twoDaysReminder: false,
        type: null,
        participants: {
          members: [],
          groups: [],
        },
        hasPayment: false,
        paymentAmout: null,
        paymentMethods: [],
        responsibleUserId: userId,
        visibility: 1,
        amount: null,
        coHostIds: [],
        sendNotification: true,
        ...initialValues,
      }}
      validationSchema={validationSchema}
      render={({handleSubmit, isValid, ...props}) => (
        <ThemeProvider
          theme={createTheme(
            step === steps.CHOOSE
              ? undefined
              : typesById[props.values.type]
              ? typesById[props.values.type].color
              : undefined
          )}
        >
          <form onSubmit={handleSubmit}>
            <input type="hidden" name="state" value="1" />
            {{
              [steps.CHOOSE]: (
                <Choose nextStep={() => setStep(steps.DETAILS)} {...props} />
              ),
              [steps.DETAILS]: (
                <Details
                  isEdit={isEdit}
                  nextStep={() => setStep(steps.PARTICIPANTS)}
                  whiteLabelData={whiteLabelData}
                  {...props}
                />
              ),
              [steps.PARTICIPANTS]: (
                <Participants
                  id={initialValues.id}
                  isEdit={isEdit}
                  {...props}
                />
              ),
            }[step] || null}

            {renderActions(
              step,
              setStep,
              isValid,
              handleSubmit,
              props.values,
              props,
              initialValues,
              t
            )}
          </form>
   

        </ThemeProvider>
      )}
    />
  )
}

const enhancer = connect(createStructuredSelector({userId: getUserId}))

export default enhancer(NewActivityForm)
