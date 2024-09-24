import {Box} from '@rebass/grid'
import React, {PureComponent} from 'react'
import {ACTIVE, OVERDUE, PREVIOUS} from 'payments/constants'
import {Link, NotificationBadge, Text} from 'components'
import {Row, Cell} from 'components/Table'
import format from 'lib/format'
import price from 'lib/price'

class PaymentsTableRow extends PureComponent {
  render() {
    const {
      id,
      status,
      title,
      activity,
      individualAmount,
      completed,
      requestDate,
      approvable,
      totalPayers,
      paymentStartDate,
    } = this.props
    return (
      <Link to={`/payments/${id}`}>
        <Row>
          <Cell bold protectOverflow width={3 / 6} title={title}>
            {title}
          </Cell>
          <Cell width={1 / 4}>{price(individualAmount)}</Cell>
          <Cell width={1 / 4}>
            <Text>
              {requestDate && format(requestDate, 'DD/MM-YYYY HH:mm')}
              {paymentStartDate && (
                <Text as="span" secondary>
                  {' '}
                  ({format(paymentStartDate, 'DD/MM-YYYY HH:mm')})
                </Text>
              )}
            </Text>
          </Cell>
          <Cell
            bold
            justifyContent="flex-end"
            width={1 / 6}
            {...{
              secondary: status === ACTIVE,
              danger: status === OVERDUE,
              success: status === PREVIOUS,
            }}
          >
            <Box mr={2}>
              {!activity && (
                <>
                  {completed}/{totalPayers}
                </>
              )}
            </Box>{' '}
            <Box width={40}>
              {approvable > 0 && (
                <NotificationBadge value={approvable} warning />
              )}
            </Box>
          </Cell>
        </Row> 
      </Link>
    )
  }
}

export default PaymentsTableRow
