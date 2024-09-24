import React from 'react'
import {Flex} from 'components'
import Table, {Cell, Row} from 'components/Table'
import {ACTIVE, OVERDUE, PREVIOUS} from 'payments/constants'
import Group from './Group'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const PaymentTable = ({
  payments: {
    [ACTIVE]: active,
    [OVERDUE]: overdue,
    [PREVIOUS]: previous,
    undefined,
    ACTIVITY: activity,
  },
}) => {
  const t = useCustomTranslation()
  
  return (
    <Flex flexDirection="column">      
      <Table>
        <Row header>
          <Cell light bold width={3 / 6}>
            {t('Titel')}
          </Cell>
          <Cell bold light width={1 / 4}>
            {t('Beløb')}
          </Cell>
          <Cell light bold width={1 / 4}>
            {t('Slutdato (Startdato)')}
          </Cell>
          <Cell light bold width={1 / 6}>
            {t('Status')}
          </Cell>
        </Row>

        {overdue.length > 0 && (
          <Group
            name={t('Betalinger med betalingsfrist overskredet')}
            payments={overdue}
          />
        )}
        {active.length > 0 && (
          <Group name={t('Betalinger')} payments={undefined ? active.concat(undefined) : active} />
        )}
        {activity.length > 0 && (
          <Group name={t('Betalingsaktiviteter')} payments={activity} />
        )}
        {previous.length > 0 && (
          <Group
            name={t('Historik over betalinger og aktivitetsbetalinger')}
            payments={previous}
          />
        )}
      </Table>
    </Flex>
  )
}
export default PaymentTable
