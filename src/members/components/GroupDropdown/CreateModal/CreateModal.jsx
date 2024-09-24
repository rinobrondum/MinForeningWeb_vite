import React from 'react'
import {connect} from 'react-redux'
import {Flex, Modal} from 'components'
import {getGroup} from 'groups/selectors'
import CreateFrom from './CreateForm'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const CreateModal = ({hide, parent}) => {
  const t = useCustomTranslation()
  return (
    <Modal
      title={
        parent
          ? `${t('Opret undergruppe til')} ${parent.title}`
          : t('Opret gruppe')
      }
      hide={hide}
    >
      <Flex p={3} flexDirection="column">
        <CreateFrom
          initialValues={{
            name: '',
            parentUserGroupId: parent ? parent.id : undefined,
          }}
          hide={hide}
        />
      </Flex>
    </Modal>
  )
}
const enhancer = connect((state, {parent}) => ({
  parent: getGroup(state, parent),
}))

export default enhancer(CreateModal)
