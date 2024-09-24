import React from 'react'
import {connect} from 'react-redux'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {
  Foldable,
  Button,
  Box,
  Flex,
  ButtonWithProtectedAction,
} from 'components'
import MemberTable from '../../MemberTable'
import {accept, reject} from 'members/actions'
import { useFeature } from '@growthbook/growthbook-react'
import {module_department_requests} from 'globalModuleNames';

const ClubRequestTable = ({requests, accept, reject}) => {
  const t = useCustomTranslation()
  return (
    <Foldable
      id="clubRequests"
      title={ useFeature(module_department_requests).on ? t('Afdelingsanmodninger') : t('Foreningsanmodninger') }
      warning
      initialOpen
    >
      <MemberTable
        members={requests}
        renderActions={({id}) => (
          <Flex justifyContent="flex-end" flex="1">
            <Box mr={3}>
              <ButtonWithProtectedAction danger tiny accept={() => reject(id)}>
                {t('Afvis')}
              </ButtonWithProtectedAction>
            </Box>
            <Box>
              <Button tiny success onClick={() => accept(id)}>
                {t('Accepter')}
              </Button>
            </Box>
          </Flex>
        )}
      />
    </Foldable>
  )
}
const enhancer = connect(null, {
  accept: accept.requested,
  reject: reject.requested,
})

export default enhancer(ClubRequestTable)
