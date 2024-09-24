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
import Details from './Details/Details'
import Payers from './Payers'
import ExemptPayment from './ExemptPayment'
import validationSchema from './validationSchema'
import {getMembersArray} from 'members/selectors'
import {getGroupsArray} from 'groups/selectors'
import { fetchClubPaymentSubscriptions } from 'payments/actions'
import { getSubscription } from 'payments/selectors'
import {getClubPaymentMethods} from 'paymentMethods/actions'
import { fetchSubscriptionPlans } from 'payments/actions'

const initialValues = {
  groups: [],
  members: [],
  agreementUrl: 'https://',
  paymentStartDate: '',
  paymentEndDate: '',
  price: 1,
  paymentInterval: '',
  mobilePaySubscription: false,
  economicMastercardPaymentService: false,
  title: '',
  householdPayment: false,
  exemptRelations: false,
  exemptAdminPayment: false,
  exemptGroupLeadersPayment: false,
  exemptRelationsPayment: false,
  onlyRelationsPayment: false,
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
  fetchClubPaymentSubscriptions
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

        values.paymentMethodIds = [];
  
        if (!values.mobilePaySubscriptionDisabled) {
          let paymentMethods = result.filter(p => p.paymentMethodName.toLowerCase() == "mobilepaysubscription");
          if (paymentMethods.length > 0) {
            values.paymentMethodIds.push(paymentMethods[0].paymentMethodInfoId)
          }
        }

        if (!values.economicMastercardPaymentServiceDisabled) {
          let paymentMethods = result.filter(p => p.paymentMethodName.toLowerCase() == "economic-mastercardpayment");
          if (paymentMethods.length > 0) {
            values.paymentMethodIds.push(paymentMethods[0].paymentMethodInfoId)
          }
        }
   
        new Promise((resolve, reject) => {
         createSubscription({values, resolve, reject})
        }).then((id) => {
          showPaymentSubscriptionPlans(id, values.title, values.paymentStartDate._d)
          hide()

          fetchClubPaymentSubscriptions()

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
      <Modal title={t('Opret abonnement')} hide={hide} width={300}>
        <Flex flexDirection="column" p={3}>
          <Formik
            onSubmit={handleSubmit}
            validate={exemptValidate}
            validationSchema={validationSchema}
            validateOnMount={true}
            initialValues={{
              ...initialValues,
              getMembers: getMembers,
            }}
          >
            {({isValid, setFieldValue, values, validateForm}) => (
              <Form>
                {{
                  [steps.DETAILS]: (
                    <Details
                      countryCode={club?.countryCode}
                      exemptAdminPayment={values.exemptAdminPayment}
                      exemptGroupLeadersPayment={values.exemptGroupLeadersPayment}
                      exemptRelationsPayment={values.exemptRelationsPayment}
                      onlyRelationsPayment={values.onlyRelationsPayment}
                      paymentInterval={values.paymentInterval}
                      mobilePaySubscription={values.mobilePaySubscription}
                      values={values}
                      isValid={isValid}
                    />
                  ),
                  [steps.PAYERS]: (
                      <Payers 
                        setFieldValue={setFieldValue}
                        memberBulk={values.members}
                        groupBulk={values.groups}
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
                    <Button primary block small disabled={isValid == null || isValid === false} type="submit">
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
    fetchSubscriptionPlans: fetchSubscriptionPlans.requested,
  }
)

export default enhancer(CreateSubscriptionModal)
