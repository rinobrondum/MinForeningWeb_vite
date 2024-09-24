import React, {useState, useCallback} from 'react'
import {Foldable, Button, Flex} from 'components'
import MemberTable from '../../MemberTable'
import RequestModal from './RequestModal'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const GroupRequestTable = ({requests}) => {
  const t = useCustomTranslation()
  const [modalVisible, setModalVisible] = useState(false)
  const [requestId, setRequestId] = useState(null)

  const showModal = useCallback(
    (requestId) => {
      setModalVisible(true)
      setRequestId(requestId)
    },
    [setModalVisible, setRequestId]
  )

  const hideModal = useCallback(() => {
    setModalVisible(false)
    setRequestId(null)
  }, [setModalVisible, setRequestId])
  
  return (
    <Foldable
      id="groupRequests"
      title={t('Gruppeanmodninger')}
      primary
      initialOpen
    >
      <MemberTable
        members={requests}
        renderActions={({id}) => (
          <Flex justifyContent="flex-end" width={1}>
            <Button tiny primary onClick={() => showModal(id)}>
              {t('Se anmodning')}
            </Button>
          </Flex>
        )}
      />

      {modalVisible && <RequestModal hide={hideModal} memberId={requestId} />}
    </Foldable>
  )
}

export default GroupRequestTable
