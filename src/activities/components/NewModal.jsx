import React, {useState, useMemo} from 'react'
import {connect} from 'react-redux'
import {omit} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Button, Flex, Loading} from 'components'
import {create} from 'activities/actions'
import {getActivity} from 'activities/selectors'
import ActivityForm from './NewActivityForm'
import steps from './NewActivityForm/steps'

const NewModal = ({create, hide, template, whiteLabelData}) => {
  const [step, setStep] = useState(template ? steps.DETAILS : steps.CHOOSE)
  const handleSubmit = (values, {setSubmitting}) => {
    setSubmitting(true)
    new Promise((resolve, reject) => create({values, resolve, reject})).then(
      hide()
    )
  }

  const back = useMemo(
    () => (step > steps.CHOOSE ? () => setStep(step - 1) : undefined),
    [step, setStep]
  )

  const t = useCustomTranslation()
      
  return (
    <Modal title={t('Opret aktivitet')} hide={hide} back={back}>
      <ActivityForm
        step={step}
        setStep={setStep}
        onSubmit={handleSubmit}
        whiteLabelData={whiteLabelData}
        initialValues={
          template
            ? {
                ...omit(template, []),
                copyFrom: template.id,
                participants: {
                  members: template.users
                    ? template.users.map(({userId}) => `${userId}`)
                    : [],
                  groups: template.groups
                    ? template.groups.filter(g => g != null && g.memberGroupId != null).map(
                        ({memberGroupId}) => `${memberGroupId}`
                      )
                    : [],
                },
              }
            : {}
        }
        renderActions={(
          currentStep,
          setStep,
          isValid,
          _handleSubmit,
          _values,
          {isSubmitting}
        ) =>
          ({
            [steps.DETAILS]: (
              <Flex p={3}>
                <Button
                  block
                  small
                  primary
                  disabled={!isValid}
                  onClick={(e) => {
                    e.preventDefault()
                    setStep(steps.PARTICIPANTS)
                  }}
                >
                  {t('Vælg deltagere')}
                </Button>
              </Flex>
            ),
            [steps.PARTICIPANTS]: (
              <Flex p={3}>
                <Button block small primary type="submit">
                  {isSubmitting ? <Loading size={20} /> : t('Opret aktivitet')}
                </Button>
              </Flex>
            ),
          }[currentStep] || null)
        }
      />
    </Modal>
  )
}

const enhancer = connect(
  (state, {copyFrom}) => ({
    template: copyFrom ? getActivity(state, copyFrom) : undefined,
  }),
  {create: create.requested}
)

export default enhancer(NewModal)
