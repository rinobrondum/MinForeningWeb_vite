import React, {useState , useMemo , useCallback, useEffect} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {getActive} from 'clubs'
import Payments_Overview from './Payments_Overview'
import Subscriptions_Overview from './Subscriptions_Overview'
import {Page, Flex, Button} from 'components'
import countryCodes from 'lib/countryCodes'
import {useToggle} from 'lib/hooks'
import CreatePaymentModal from './CreatePaymentModal'
import CreateSubscriptionModal from './CreateSubscriptionModal'
import ExportModal from './ExportModal'
import {Redirect, Route, Switch} from 'react-router-dom'
import Tabs from './Tabs'
import {exportSubscriptionCharges} from 'payments/actions'
import {Payment} from 'payments/components'
import { useFeature } from "@growthbook/growthbook-react";
import { module_payment_mobilepaysubscription } from 'globalModuleNames';
import { module_subscription } from 'globalModuleNames';
import {getSubscriptions, getSubscriptionPlans, getSubscriptionPlanCharges} from 'payments'
import {fetchSubscriptionPlans, fetchSubscriptionPlanCharges} from 'payments/actions'
import CreateSubscriptionPlanModal from './CreateSubscriptionModal/CreateSubscriptionPlanModal'
import {get} from 'lodash'




const Overview = ({club, match: {path}, exportSubscriptionCharges, location: {state}}) => {
  const t = useCustomTranslation()
      
  
  const tabs = useMemo(
    () => {
      
      let tabs = [
        {
          id: 'overview',
          name: t('Betalinger'),
        }  
      ];

      if (useFeature(module_payment_mobilepaysubscription).on) {
        tabs.push({
          id: 'subscriptions',
          name: t('Abonnementer'),
        });
      }
      
      return tabs;
    },
    [t]
  )
  
  const [exportFormat, setExportFormat] = useState()
  const [createPaymentModalVisible, showCreatePaymentModal, hideCreatePaymentModal] = useToggle()
  const [createSubscriptionModalVisible, showCreateSubscriptionModal, hideCreateSubscriptionModal] = useToggle()
  const [createSubscriptionPlanModalVisible, showCreateSubscriptionPlanModal, hideCreateSubscriptionPlanModal] = useToggle()
  const [exportModalVisible, _showExportModal, _hideExportModal] = useToggle()
  const [subscriptionPlanId, setSubscriptionPlanId] = useState(0);
  const [subscriptionId, setSubscriptionId] = useState(0);
  
  useEffect(()=>{
    if (get(state, 'showPayment')) {
      showCreatePaymentModal()
    }
  }, [state])

  const showExportModal = useCallback(
    (format) => {
      _showExportModal()
      setExportFormat(format)
    },
    [_showExportModal, setExportFormat]
  )

  const hideExportModal = useCallback(() => {
    _hideExportModal()
    setExportFormat(null)
  }, [_hideExportModal, setExportFormat])

  const handleExportSubscriptionChargesSubmit = useCallback(
    (values) => {
      new Promise((resolve, reject) => {
        exportSubscriptionCharges({resolve, reject})
      })
        .then((response) => {
          const blob = new Blob([response], {
            type: 'text/csv;charset=utf-8;',
          })
          const link = document.createElement('a')
          link.download = t('betalingsstrøm abonnement')+'.csv'
          link.href = window.URL.createObjectURL(blob)
          link.click()
        })
        .catch((error) => {
          console.log(error)
          // const errorText = t('Der er ingen betalinger i det valgte interval')
          // setError(errorText)
          //setSubmitting(false)
        })
    },
    [t]
  )

  return  (
    <>      
      <Flex justifyContent="space-between" p={3} mb={3} style={{marginBottom: "20px"}}>       
          <Flex mb={4}>
            {(club?.countryCode === countryCodes.da || club?.countryCode === countryCodes.da_DK) && (
              <>
                {window.location.pathname == `${path}/subscriptions` &&
                 <>
                    <Button mr={3} alignSelf={"flex-end"} primary onClick={handleExportSubscriptionChargesSubmit}>
                      {t('Betalingsstrøm abonnementer')}
                    </Button>
                    <Button mr={3} alignSelf={"flex-end"} primary onClick={() => {
                      showCreateSubscriptionModal()
                      }}>
                      {t('Opret abonnement')}
                    </Button>
                  </>
                }
              
              </>
            )}

            {((window.location.pathname == `${path}/overview` || window.location.pathname.indexOf('/payments') !== -1) && window.location.pathname.indexOf('/payments/sub') === -1) &&
              <>
                <Button mr={3} alignSelf={"flex-end"} primary onClick={() => showExportModal('csv')}>
                  {t('Betalingsstrøm')}
                </Button>

                <Button mr={3} alignSelf={"flex-end"} primary onClick={() => showExportModal('csvActivity')}>
                  {t('Aktivitetsbetalingsstrøm')}
                </Button>
              
                {(club?.countryCode === countryCodes.da || club?.countryCode === countryCodes.da_DK) && (   
                  <Flex alignSelf={"flex-end"}>
                    <Button mr={3}  primary onClick={() => showExportModal('pdf')}>
                      {t('MobilePay')}            
                    </Button>
                  </Flex>
                )}

                <Button primary alignSelf={"flex-end"} onClick={showCreatePaymentModal}>
                  {t('Opret betaling')}
                </Button>
              </>
            }
          </Flex>
      </Flex>

      {createPaymentModalVisible && <CreatePaymentModal hide={hideCreatePaymentModal} showModal={showCreatePaymentModal}/> }


      {createSubscriptionPlanModalVisible && (<CreateSubscriptionPlanModal hide={hideCreateSubscriptionPlanModal} showCreateSubscriptionPlanModal={showCreateSubscriptionPlanModal} subscriptionPlanId={subscriptionPlanId}/>)}

      {exportModalVisible && (<ExportModal format={exportFormat} hide={hideExportModal} club={club}/> )}

      <Tabs tabs={tabs}>
        <Switch>          
          <Route path={`${path}/overview`} render={(props) => (
            <Payments_Overview {...props} showCreatePaymentModal={showCreatePaymentModal} />
            )} />
          {useFeature(module_payment_mobilepaysubscription).on &&
            <Route
            path={`${path}/subscriptions`}
            render={(props) => (
              <Subscriptions_Overview {...props} showCreateSubscriptionModal={showCreateSubscriptionModal} hideCreateSubscriptionModal={hideCreateSubscriptionModal} showCreateSubscriptionPlanModal={showCreateSubscriptionPlanModal} setSubscriptionPlanId={setSubscriptionPlanId} subscriptionPlanId={subscriptionPlanId} setSubscriptionId={setSubscriptionId} subscriptionId={subscriptionId} createSubscriptionModalVisible={createSubscriptionModalVisible}/>
            )}
          />
          }
          <Route path={`${path}/:id`} component={Payment} />          
          <Route render={() => <Redirect to={`${path}/overview`} />} />
        </Switch>
      </Tabs>
    </>      
  )
}

  Overview.defaultProps = {
    initialTab: 'overview',
    club: {
      countryCode: '',
    },
  }

  const enhancer = connect(
    createStructuredSelector({
      club: getActive,
      subscriptions: getSubscriptions,
      subscriptionPlans: getSubscriptionPlans,
      subscriptionPlanCharges: getSubscriptionPlanCharges,
    }),
    {
      fetchSubscriptionPlans: fetchSubscriptionPlans.requested,
      fetchSubscriptionPlanCharges: fetchSubscriptionPlanCharges.requested,
      exportSubscriptionCharges: exportSubscriptionCharges.requested,
    }
  )
export default enhancer(Overview)
