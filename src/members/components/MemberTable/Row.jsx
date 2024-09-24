import React from 'react'
import format from 'lib/format'
import memberDefault from 'images/member-default.png'
import { Row as TableRow, Cell } from 'components/Table'
import { Image } from 'components'

const Row = ({
  selectable,
  id,
  toggleBulk,
  checked,
  firstName,
  surname,
  image,
  birthdate,
  renderActions,
}) => (
  <TableRow>
    <Cell width={45}>
      {selectable && (
        <input
          type="checkbox"
          value={id}
          onChange={toggleBulk}
          checked={checked}
        />
      )}
    </Cell>
    <Cell width={45} justifyContent="center" alignItems="center">
      <Image round src={image || memberDefault} height="25" />
    </Cell>
    <Cell width={1 / 6} bold>
      {firstName}
    </Cell>
    <Cell width={1 / 4} bold>
      {surname}
    </Cell>
    <Cell width={1 / 4} secondary bold>
      {birthdate && format(birthdate, 'DD-MM-YYYY')}
    </Cell>
    
    {renderActions && <Cell width={1 / 4}>{renderActions()}</Cell>}
  </TableRow>
)

export default Row
