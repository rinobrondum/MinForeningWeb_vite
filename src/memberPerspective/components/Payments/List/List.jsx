import React, {useMemo} from 'react'
import {Box, Text} from 'rebass/styled-components'
import {orderBy} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import Item from './Item'

const List = ({payments}) => {
  const t = useCustomTranslation()

  const sortedPayments = useMemo(() => {
    return orderBy(
      payments,
      ['isPaid', ({requestDate}) => new Date(requestDate)],
      ['asc', 'desc']
    )
  }, [payments])

  return (
    <Box as="table" sx={{width: '100%'}} cellSpacing="0" cellPadding="0">
      <thead>
        <tr>
          <Box as="th" color="white" bg="secondary" textAlign="left" p={2}>
            {t('Titel')}
          </Box>
          <Box as="th" bg="secondary" color="white" textAlign="left" p={2}>
            {t('Beløb')}
          </Box>
          <Box
            as="th"
            bg="secondary"
            color="white"
            textAlign="left"
            sx={{whiteSpace: 'nowrap'}}
            p={2}
          >
            {t('Betalingsfrist (Startdato)')}
          </Box>
          <Box as="th" bg="secondary" color="white" textAlign="left" p={2}>
            {t('Status')}
          </Box>
        </tr>
      </thead>
      <tbody>
        {sortedPayments.map((payment, index, array) => (
          <>
            <Item
              key={payment.id}
              bg={index % 2 ? 'white' : 'secondaryLight'}
              {...payment}
            />
          </>
        ))}
      </tbody>
    </Box>
  )
}

export default List
