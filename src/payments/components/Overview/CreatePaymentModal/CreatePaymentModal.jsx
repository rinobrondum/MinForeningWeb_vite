import React, {useState, useCallback} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {Redirect} from 'react-router-dom'
import {Formik, Form} from 'formik'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Modal, Flex, Button, Box, Text} from 'components'
import {create} from 'payments/actions'
import {getLatestInfo} from 'payments/selectors'
import {getPaymentAgreementAccepted, getActive} from 'clubs/selectors'
import Details from './Details/Details'
import Payers from './Payers'
import ExemptPayment from './ExemptPayment'
import validationSchema from './validationSchema'
import {getMembersArray} from 'members/selectors'
import {getGroupsArray} from 'groups/selectors'



  

const steps = {
  DETAILS: 0,
  PAYERS: 1,
}

const showExemptPaymentSteps = {
  SHOW: 0,
  HIDE: 1,
}

const CreatePaymentModal = ({
  create,
  hide,
  paymentAgreementAccepted,
  club,
  latestInfo,
  getGroups,
  getMembers,
  showModal
}) => {

  


  const t = useCustomTranslation()
  const [step, setStep] = useState(steps.DETAILS)
  const [showExemptPayment, setShowExemptPayment] = useState(showExemptPaymentSteps.HIDE)
  const [complete, setComplete] = useState(null)
  
  const hideExemptPaymentModal = useCallback(
    () => {
      setShowExemptPayment(showExemptPaymentSteps.HIDE);
    },
    [setShowExemptPayment]
  )

  const validate = ({externalPaymentDisabled, mobilePayDisabled}) => {
    if (externalPaymentDisabled && mobilePayDisabled) {
      return {methods: 'Mindst en betalingsmetode skal vælges'}
    }
  }  

  //TODO: Needs refactoring
  const exemptValidate = ({exemptAdminPayment, exemptGroupLeadersPayment, exemptRelationsPayment, getMembers, members, groups}) => {

    if (members.length > 0) {
      for (const element of members) {
        let id = element;
        let memberFound = getMembers.filter(m => m.id == id);
  
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
  
          if ( !memberFound.isChild) {
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
    
            if ( !memberFound.isChild) {
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
      new Promise((resolve, reject) => {
        create({values, resolve, reject})
      }).then((id) => {  
        setComplete(id)
        hide()
      })       
    },[create, setComplete]
    )   
  if (complete) {
    return <Redirect to={`/payments/${complete}`} />
  }
  const initialValues = {
      groups: [],
      members: [],
      paymentDescription: '',
      externalPaymentDisabled: true,
      kevinPaymentDisabled: true,
      mobilePayDisabled: true,
      reducedPayment: false,
      exemptAdminPayment: false,
      exemptGroupLeadersPayment: false,
      exemptRelationsPayment: false,
      ReducedPaymentStartDate: "",
  }
  
  return (
    <Modal title={t('Opret betaling')} hide={hide} width={300}>
      <Flex flexDirection="column" p={3}>
        <Formik
          onSubmit={handleSubmit}
          validate={validate}
          validationSchema={validationSchema}
          validateOnMount
          initialValues={{
            ...initialValues,
            mobilePayDisabled: !paymentAgreementAccepted,
            paymentDescription: latestInfo,
            getMembers: getMembers,
          }}
        >
          {({isValid, setFieldValue, values}) => (
            <Form>
              {console.log(values)}
              {{
                [steps.DETAILS]: (
                  <Details
                    countryCode={club?.countryCode}
                    externalPaymentDisabled={values.externalPaymentDisabled}
                    reducedPayment={values.reducedPayment}
                    exemptAdminPayment={values.exemptAdminPayment}
                    exemptGroupLeadersPayment={values.exemptGroupLeadersPayment}
                    exemptRelationsPayment={values.exemptRelationsPayment}
                    ReducedPaymentStartDate={values.ReducedPaymentStartDate}
                    
                    
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
                  onClick={() => setStep(steps.PAYERS)}
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
  )
}

const enhancer = connect(
  createStructuredSelector({
    paymentAgreementAccepted: getPaymentAgreementAccepted,
    club: getActive,
    getGroups: getGroupsArray,
    getMembers: getMembersArray,
    latestInfo: getLatestInfo,
  }),
  {
    create: create.requested,
  }
)

export default enhancer(CreatePaymentModal)
