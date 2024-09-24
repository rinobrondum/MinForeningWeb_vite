import {compareDesc} from 'date-fns'
import React from 'react'
import {Flex} from 'components'
import {Row, Cell} from 'components/Table'
import PaymentRow from './Row'

const Group = ({name, payments}) => {
  return (
  <Flex flexDirection="column">
    <Row justifyContent="center" midHeader noHover>
      <Cell secondary bold>
        {name}
      </Cell>
    </Row>
    
    {payments
      .sort((a, b) => compareDesc(a.requestDate, b.requestDate))
      .map(
        ({
          id,
          activity,
          completed,
          approvable,
          status,
          title,
          individualAmount,
          requestDate,
          paymentStartDate,
          totalPayers,
        }) => (
          <PaymentRow
          key={id}
          id={id}
          activity={activity}
          completed={!activity && completed.length}
          approvable={!activity && approvable.length}
          status={status}
          title={title}
          individualAmount={individualAmount}
          requestDate={requestDate}
          paymentStartDate={paymentStartDate}
          totalPayers={totalPayers}
          />
          )
          )} 
  </Flex>
)}

export default Group
