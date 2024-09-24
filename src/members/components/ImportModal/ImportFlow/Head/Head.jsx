import React from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import values from 'lodash/values'
import {upload} from 'members/actions'
import {getImportColumns} from 'members/selectors'
import {Row, Cell} from 'components/Table'
import {columnsById} from 'members/constants'
import Column from './Column'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'

const Head = ({columns, changeColumn}) => {
  const t = useCustomTranslation()
  return (
    <Row header light>
      {columns.map(({id, width, name}) => (
        <Column
          id={id}
          key={id}
          width={width}
          options={values(columnsById).filter((column) => column.id !== id)}
          changeAction={changeColumn}
        >
          {name}
        </Column>
      ))}
      <Cell small bold p={2} width={100}>
        {t('Fjern')}
      </Cell>
    </Row>
  )
}
const enhancer = connect(
  createStructuredSelector({
    columns: getImportColumns,
  }),
  {changeColumn: upload.changeColumn}
)

export default enhancer(Head)
