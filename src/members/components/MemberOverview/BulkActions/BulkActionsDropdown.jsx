import React from 'react'
import styled from 'styled-components'
import {lighten} from 'polished'
import {noop} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Dropdown, Text as BaseText, Box} from 'components'

const Text = styled(BaseText)`
  color: ${(props) =>
    props.disabled
      ? lighten(0.3, props.theme.colors.secondary)
      : props.theme.colors.secondary};
`

const Item = styled(Box).attrs({
  p: 2,
  width: 170,
})`
  background: ${(props) => props.theme.colors.white};
  ${(props) =>
    props.divide &&
    `border-top: 1px solid ${lighten(0.2, props.theme.colors.secondary)}`};
`

const BulkActionsDropdown = ({items}) => {
  const t = useCustomTranslation()

  return (
    <Dropdown
      title={t('Handlinger')}
      items={items}
      renderItem={({id, divide, name, action, disabled}, hide) => (
        <Item
          onClick={
            disabled
              ? noop
              : () => {
                  action()
                  hide()
                }
          }
          key={id}
          divide={divide}
        >
          <Text disabled={disabled}>{name}</Text>
        </Item>
      )}
    />
  )
}

export default BulkActionsDropdown
