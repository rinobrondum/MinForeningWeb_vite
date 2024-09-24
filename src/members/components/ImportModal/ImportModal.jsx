import React, {useState, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {compose} from 'recompose'
import {withRouter} from 'react-router-dom'
import {Modal, Box} from 'components'
import ChooseMethod from './ChooseMethod'
import ImportFlow from './ImportFlow'
import Done from './Done'
import steps from './steps'
import {upload} from 'members/actions'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {getActive} from 'clubs'

const ImportModal = ({open, hide, clear, club, forceStep}) => {
  const t = useCustomTranslation()
  const modalTitle = {
    [steps.CHOOSE]: t('Importer medlemmer via CSV-fil'),
    [steps.CONVENTUS]: t('Importer medlemmer, roller og grupper'),
    [steps.CSV]: t('Importer medlemmer'),
    [steps.DONE]: t('Importer medlemmer - Færdig'),
  }
  const [step, setStep] = useState(
    open === 'conventus' ? steps.CONVENTUS : steps.CHOOSE
  )

  const close = useCallback(() => {
    hide()
    clear()
  }, [hide, clear])

  return (
    <Modal hide={close} title={modalTitle[step]}>
      <Box p={3}>
        {(step === steps.CONVENTUS || step === steps.CSV || forceStep) && (
          <ImportFlow method={step} setStep={setStep} hide={close} />
        )}
        {step === steps.CHOOSE && !forceStep && (
          <ChooseMethod setStep={setStep} countryCode={club?.countryCode} />
        )}
        {step === steps.DONE && <Done setStep={setStep} hide={close} />}
      </Box>
    </Modal>
  )
}

const enhancer = compose(
  withRouter,
  connect(
    createStructuredSelector({
      club: getActive,
    }),
    {
      clear: upload.clear,
    }
  )
)

export default enhancer(ImportModal)
