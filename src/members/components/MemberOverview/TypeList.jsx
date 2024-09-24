import React from 'react'
import styled from 'styled-components'
import {darken} from 'polished'
import {compose, lifecycle, withHandlers} from 'recompose'
import {Flex, Box} from '@rebass/grid'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {types} from 'members/constants'

const Container = styled(Flex).attrs({
  flexDirection: 'column',
})`
  position: absolute;
  z-index: 10000;
  box-shadow: 0 2px 10px -2px rgba(0, 0, 0, 0.5);
`

const Item = styled(Box).attrs({
  p: 2,
})`
  background: ${(props) => props.theme.colors.secondaryLight};
  will-change: background;
  transition: background 0.125s ease;

  &:hover {
    background: ${(props) => darken(0.1, props.theme.colors.secondaryLight)};
  }
`

const TypeList = ({registerChild, updateType}) => {
  const t = useCustomTranslation()

  return (
    <Container innerRef={registerChild}>
      <Item onClick={() => updateType(types.ADMIN.id)}>
        {t('Administrator')}
      </Item>
      <Item onClick={() => updateType(types.GROUP_LEAD.id)}>
        {t('Gruppeleder')}
      </Item>
      <Item onClick={() => updateType(types.MEMBER.id)}>{t('Medlem')}</Item>
    </Container>
  )
}

const enhancer = compose(
  withHandlers(() => {
    let _ref

    return {
      registerChild: () => (ref) => (_ref = ref),
      handleOutsideClick: ({hide}) => (event) => {
        if (_ref.contains(event.target)) {
          return
        }
        hide()
      },
    }
  }),
  lifecycle({
    componentDidMount() {
      document.addEventListener('click', this.props.handleOutsideClick)
    },
    componentWillUnmount() {
      document.removeEventListener('click', this.props.handleOutsideClick)
    },
  })
)

export default enhancer(TypeList)
