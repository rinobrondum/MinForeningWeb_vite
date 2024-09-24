import React, {useEffect} from 'react'
import {createStructuredSelector} from 'reselect'
import {Helmet} from 'react-helmet'
import {connect} from 'react-redux'
import {compose} from 'recompose'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {withAuthenticationRequirement} from 'lib/hoc'
import {useToggle} from 'lib/hooks'
import {fetch} from 'messages/actions'
import {getSortedMessages} from 'messages/selectors'
import {Flex, Button, Page, Loading} from 'components'
import CreateModal from './CreateModal'
import Message from './Message'
import {getCompanyName} from 'app/selectors'
import {get} from 'lodash'
import { getIsFetching } from 'members'


const Messages = ({isFetching, messages, fetch, companyName, location: {state},
}) => {
  useEffect(() => {
    fetch()

    if (get(state, 'showMessages')) {
      showModal()
    }
  }, [isFetching])


  const [modalVisible, showModal, hideModal] = useToggle()
  const t = useCustomTranslation()

  return (
    <Page>
      <Helmet>
        <title>{t('Beskeder | {{companyName}}', {companyName})}</title>
      </Helmet>

      <Flex mb={3}>
        <Button primary onClick={showModal}>
          {t('Opret besked')}
        </Button>
      </Flex>

      {modalVisible && <CreateModal hide={hideModal} />}

      {isFetching && <Loading />}
      {!isFetching &&
        messages.map((message) => <Message key={message.id} {...message} />)}
    </Page>
  )
}

const enhancer = compose(
  withAuthenticationRequirement,
  connect(
    createStructuredSelector({
      companyName: getCompanyName,
      isFetching: getIsFetching,
      messages: getSortedMessages,
    }),
    {fetch: fetch.requested}
  )
)

export default enhancer(Messages)
