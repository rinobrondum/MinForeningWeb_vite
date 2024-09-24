import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styled from 'styled-components'
import { Flex, Box } from '@rebass/grid'
import { Text } from 'components'
import { Row, Cell } from 'components/Table'
import { Cross } from 'components/icons'
import { upload } from 'members/actions'
import { getImportColumns } from 'members/selectors'
import Head from './Head'

const Container = styled.div`
  max-height: 350px;
  overflow-y: scroll;
`

const RemoveButton = styled(Cross).attrs({
  fill: 'danger',
  size: 14,
})`
  cursor: pointer;
`

const PreviewTable = ({ members, remove, columns }) => (
  <Flex flexDirection="column">
    <Box mb={2}>
      <Text secondary bold>
        Forhåndsvisning
      </Text>
    </Box>
    <Container>
      <Head />
      {members.map(member => (
        <Row>
          <Cell
            small
            p={2}
            width={columns[0].width}
            protectOverflow
            title={member.firstName}
          >
            {member.firstName}
          </Cell>
          <Cell
            small
            p={2}
            width={columns[1].width}
            protectOverflow
            title={member.surname}
          >
            {member.surname}
          </Cell>
          <Cell
            small
            p={2}
            width={columns[2].width}
            protectOverflow
            title={member.email}
          >
            {member.email}
          </Cell>
          <Cell
            small
            p={2}
            width={columns[3].width}
            protectOverflow
            title={member.zip}
          >
            {member.zip}
          </Cell>
          <Cell
            small
            p={2}
            width={columns[4].width}
            protectOverflow
            title={member.mobile}
          >
            {member.mobile}
          </Cell>
          <Cell small secondary p={2} width={100}>
            <RemoveButton onClick={() => remove(member.memberId)} />
          </Cell>
        </Row>
      ))}
    </Container>
  </Flex>
)

const mapStateToProps = state => ({
  columns: getImportColumns(state),
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      remove: upload.remove,
    },
    dispatch
  )

const enhancer = connect(mapStateToProps, mapDispatchToProps)

export default enhancer(PreviewTable)
