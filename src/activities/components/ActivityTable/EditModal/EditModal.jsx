import React from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {get, isEqual, keys} from 'lodash'
import {compose, lifecycle, withProps, withState, withHandlers} from 'recompose'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Button, ButtonWithProtectedAction, Box, Flex} from 'components'
import {getActivity} from 'activities/selectors'
import {edit, fetchGroups} from 'activities/actions'
import NewActivityForm from 'activities/components/NewActivityForm'
import steps from 'activities/components/NewActivityForm/steps'

const renderActions = (
  currentStep,
  setStep,
  isValid,
  _,
  values,
  {submitForm, setFieldValue},
  initialValues,
  t
) =>
  ({
    [steps.DETAILS]: (
      <Flex p={3} flexDirection="column">
        <Box mb={3}>
          <Button
            primary
            small
            block
            type="button"
            onClick={(e) => {
              e.preventDefault()
              setStep(steps.PARTICIPANTS)
            }}
          >
            {t('Rediger inviterede')}
          </Button>
        </Box>
        {values.isRecurring &&
        !isEqual(
          keys(values).filter(
            (key) =>
              values[key] &&
              initialValues[key] &&
              !isEqual(values[key], initialValues[key])
          ),
          ['images']
        ) ? (
          <ButtonWithProtectedAction
            primary
            small
            block
            text={t(
              'Aktiviteten er gentagende. Gælder ændringerne alle aktiviter eller kun denne?'
            )}
            disabled={!isValid}
            onClick={(e) => e.preventDefault()}
            renderButtons={({reject}) => (
              <Flex justifyContent="space-between">
                <Box mr={3} flex="2">
                  <Button primary small block onClick={submitForm}>
                    {t('Denne')}
                  </Button>
                </Box>

                <Box mr={3} flex="2">
                  <Button
                    primary
                    small
                    block
                    onClick={() => {
                      setFieldValue('editAll', true, false)
                      submitForm()
                    }}
                  >
                    {t('Alle')}
                  </Button>
                </Box>

                <Box flex="1">
                  <Button danger small block onClick={reject}>
                    {t('Annuller')}
                  </Button>
                </Box>
              </Flex>
            )}
          >
            {t('Gem ændringer')}
          </ButtonWithProtectedAction>
        ) : (
          <Button primary small block disabled={!isValid}>
            {t('Gem ændringer')}
          </Button>
        )}
      </Flex>
    ),
    [steps.PARTICIPANTS]: (
      <Flex p={3}>
        <Button
          primary
          small
          block
          disabled={!isValid}
          onClick={(e) => {
            e.preventDefault()
            setStep(steps.DETAILS)
          }}
        >
          {t('Ok')}
        </Button>
      </Flex>
    ),
  }[currentStep] || null)

const EditModal = ({hide, back, step, setStep, activity, handleSubmit, whiteLabelData}) => {
  const t = useCustomTranslation()

  return (
    <Modal back={back} hide={hide} title={`${t('Rediger')} ${activity.title}`}>
      <NewActivityForm
        isEdit
        whiteLabelData={whiteLabelData}
        initialValues={{
          ...activity,
          amount: get(activity, 'activityPayment.amount'),
          twoDaysReminder: !!activity.reminder,
          editAll: false,
          tasks: "",
          participants: {
            members: get(activity, 'users', []).map(({userId}) => `${userId}`),
            groups: activity.groups || [],
          },
          prevParticipants: {
            members: get(activity, 'users', []).map(({userId}) => `${userId}`),
            groups: activity.groups || [],
          },
          coHostIds: get(activity, 'users', [])
            .filter(({cohost}) => cohost)
            .map(({userId}) => userId),
        }}
        step={step}
        setStep={setStep}
        onSubmit={handleSubmit}
        renderActions={renderActions}
      />
    </Modal>
  )
}

const mapStateToProps = (state, {id}) => ({
  activity: getActivity(state, id),
})

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      edit: edit.requested,
      fetchGroups: fetchGroups.requested,
    },
    dispatch
  )

const enhancer = compose(
  connect(mapStateToProps, mapDispatchToProps),
  lifecycle({
    componentDidMount() {
      const {
        fetchGroups,
        activity: {id},
      } = this.props
      fetchGroups(id)
    },
  }),
  withState('step', 'setStep', steps.DETAILS),
  withHandlers({
    handleSubmit: ({edit, hide}) => (values) => {
      new Promise((resolve, reject) => edit({values, resolve, reject})).then(
        hide()
      )
    },
  }),
  withProps(({step, setStep}) => ({
    back: step > steps.DETAILS ? () => setStep(step - 1) : undefined,
  }))
)

export default enhancer(EditModal)
