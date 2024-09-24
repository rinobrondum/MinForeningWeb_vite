import React, {useState, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Redirect} from 'react-router-dom'
import {Formik, Form} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Flex, Button, Box, Text} from 'components'
import {create as createPayment, createSubscription} from 'payments/actions'
import {getLatestInfo} from 'payments/selectors'
import {getPaymentAgreementAccepted, getActive} from 'clubs/selectors'
import PlanDetails from './Details/PlanDetails'
import PlanPayers from './PlanPayers'
import ExemptPayment from './ExemptPayment'
import {getMembersArray} from 'members/selectors'
import {getGroupsArray} from 'groups/selectors'
import { fetchClubPaymentSubscriptions } from 'payments/actions'
import { getSubscription } from 'payments/selectors'
import {getClubPaymentMethods} from 'paymentMethods/actions'
import Yup from 'lib/yup'

const validationSchema = Yup.object().shape({
    paymentStartDate: Yup.string().required(),
    paymentEndDate: Yup.string(),
  })

const initialValues = {
  groups: [],
  members: [],
  paymentStartDate: '',
}

const steps = {
  DETAILS: 0,
  PAYERS: 1,
}

const showExemptPaymentSteps = {
  SHOW: 0,
  HIDE: 1,
}

const CreateSubscriptionModal = ({
  create,
  hide,
  club,
  getMembers,
  createSubscription,
  showPaymentSubscriptionPlans,
  getClubPaymentMethods,
  subscriptionPlanId
}) => {
  const t = useCustomTranslation()
  const [step, setStep] = useState(steps.DETAILS)
  const [showExemptPayment, setShowExemptPayment] = useState(showExemptPaymentSteps.HIDE)
  const [complete,  setComplete] = useState(null)
  const [hideValidatePopup, setHideValidatePopup] = useState(true)
  const [validateError, setValidateError] = useState('')
  
  const hideExemptPaymentModal = useCallback(
    () => {
      setShowExemptPayment(showExemptPaymentSteps.HIDE);
    },
    [setShowExemptPayment]
  )

  //TODO: Needs refactoring
  const exemptValidate = ({exemptAdminPayment, exemptGroupLeadersPayment, exemptRelationsPayment, onlyRelationsPayment, getMembers, members, groups}) => {

    if (members.length > 0) {
      for (let index = 0; index < members.length; index++) {
        var id = members[index];
        var memberFound = getMembers.filter(m => m.id == id);
  
        if (memberFound.length > 0) {
          memberFound = memberFound[0];
          if (exemptAdminPayment && memberFound.type == 2) {
            setShowExemptPayment(showExemptPaymentSteps.SHOW);
            return {methods: 'exemptAdminPayment'}
          }
  
          if (exemptGroupLeadersPayment && memberFound.type == 3) {
            setShowExemptPayment(showExemptPaymentSteps.SHOW);
            return {methods: 'exemptGroupLeadersPayment'}
          }
  
          if (exemptRelationsPayment && memberFound.isChild) {
            setShowExemptPayment(showExemptPaymentSteps.SHOW);
            return {methods: 'exemptRelationsPayment'}
          }
  
          if (onlyRelationsPayment && !memberFound.isChild) {
            setShowExemptPayment(showExemptPaymentSteps.SHOW);
            return {methods: 'onlyRelationsPayment'}
          }
        }
      }
    }
  }

  //TODO: Needs refactoring
  const cancelSubmit = useCallback(
    () => {
      setShowExemptPayment(showExemptPaymentSteps.HIDE)
    },
  )
    
  //TODO: Needs refactoring
  const _continueSubmit = useCallback(
    (values) => {
      var getMembers = values.getMembers;

      if (values.members.length > 0) {
        for (let index = 0; index < values.members.length; index++) {
          var mid = values.members[index];
          var memberFound = getMembers.filter(m => m.id == mid);
    
          if (memberFound.length > 0) {
            memberFound = memberFound[0];

            if (values.exemptAdminPayment && memberFound.type == 2) {
              if (index > -1) {
                values.members.splice(index, 1);
              }
            }
    
            if (values.exemptGroupLeadersPayment && memberFound.type == 3) {
              if (index > -1) {
                values.members.splice(index, 1);
              }
            }
    
            if (values.exemptRelationsPayment && memberFound.isChild) {
              if (index > -1) {
                values.members.splice(index, 1);
              }
            }
    
            if (values.onlyRelationsPayment && !memberFound.isChild) {
              if (index > -1) {
                values.members.splice(index, 1);
              }
            }
          }
        }
      }
      if (values.members.length > 0) {      
        handleSubmit(values)
      } 
      setShowExemptPayment(showExemptPaymentSteps.HIDE)
    },
   )
  
  
  const handleSubmit = useCallback(
    (values) => {
      // form.validateForm();
        
      
      new Promise((resolve) => {
        getClubPaymentMethods({resolve})
      }).then(result => {

   
        new Promise((resolve, reject) => {
          createSubscription({values, resolve, reject})
        }).then((id) => {
          showPaymentSubscriptionPlans(id, values.title, values.paymentStartDate._d)
          hide()
        }).catch(error => {
          console.log(error)
          setValidateError(error.message)
          setHideValidatePopup(false)
        });

      })

    },[createSubscription, setComplete]    
  )
  if (complete) {
    return <Redirect to={`/payments/${complete}`} />
  }

  return (
    <>
      {!hideValidatePopup &&
        <Modal title={t('Valideringsfejl')} hide={setHideValidatePopup} width={300}>
          <Flex flexDirection="column" p={3}>
            {validateError}
          </Flex>
        </Modal>    
      }
    
    {hideValidatePopup &&
      <Modal title={t('Opret abonnementsplan')} hide={hide} width={300}>
        <Flex flexDirection="column" p={3}>
          <Formik
            onSubmit={handleSubmit}
            validate={exemptValidate}
            validationSchema={validationSchema}
            initialValues={{
              ...initialValues,
              getMembers: getMembers,
              subscriptionPlanId
            }}
          >
            {({isValid, setFieldValue, values, validateForm}) => (
              <Form>
                {{
                  [steps.DETAILS]: (
                    <PlanDetails
                      countryCode={club?.countryCode}
                      exemptAdminPayment={values.exemptAdminPayment}
                      exemptGroupLeadersPayment={values.exemptGroupLeadersPayment}
                      exemptRelationsPayment={values.exemptRelationsPayment}
                      onlyRelationsPayment={values.onlyRelationsPayment}
                      paymentInterval={values.paymentInterval}
                    />
                  ),
                  [steps.PAYERS]: (
                      <PlanPayers 
                        setFieldValue={setFieldValue}
                        memberBulk={values.members}
                      />
                  ), 
                }[step] || null}

                {step === steps.DETAILS && (
                  <Button
                    primary
                    small
                    block
                    disabled={!isValid}
                    onClick={() => {
                      setStep(steps.PAYERS)
                    }}
                  >
                    {t('Vælg betalere')}
                  </Button>
                )}
                {step === steps.PAYERS && (     
                  <Box mt={3}>
                    <Button primary block small disabled={!isValid} type="submit">
                      {t('Opret')}
                    </Button>
                  </Box>
                )}

                {showExemptPayment === showExemptPaymentSteps.SHOW && (     
                  <Box mt={3}>              
                    <ExemptPayment 
                      hide={hideExemptPaymentModal}
                      values={values}
                      _continue={_continueSubmit}
                      cancel={cancelSubmit} />
                  </Box>
                )}
              </Form>
            )}
          </Formik>
        </Flex>
      </Modal>
    }
    </>
  ) 
}

const enhancer = connect(
  createStructuredSelector({
    paymentAgreementAccepted: getPaymentAgreementAccepted,
    club: getActive,
    subscription: getSubscription,
    getGroups: getGroupsArray,
    getMembers: getMembersArray,
    latestInfo: getLatestInfo,
  }),
  {
    createSubscription: createSubscription.requested,
    getClubPaymentMethods: getClubPaymentMethods.requested,
    fetchClubPaymentSubscriptions: fetchClubPaymentSubscriptions.requested,
  }
)

export default enhancer(CreateSubscriptionModal)