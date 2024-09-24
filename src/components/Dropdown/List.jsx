import React, {Component, createRef} from 'react'
import styled, {css} from 'styled-components'
import {darken} from 'polished'
import {Flex, Box} from '@rebass/grid'
import {Hr} from 'components'

const Container = styled(Flex).attrs({
  as: 'ul',
  p: 0,
  m: 0,
  flexDirection: 'column',
})`
  min-width: 150px;
  width: 100%;
  position: absolute;
  list-style: none;
  box-shadow: 0 1px 7px -2px rgba(0, 0, 0, 0.5);
  background: ${(props) => props.theme.colors.secondaryLight};
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 3px;
  margin-top: 5px;

  ${(props) => (props.alignRight ? 'right: 0' : 'left: 0')};
`

const Item = styled(Box).attrs({
  as: 'li',
})`
  background: ${(props) => props.theme.colors.secondaryLight};
  color: red;
  cursor: pointer;

  will-change: background;
  transition: background 0.125s ease;

  ${(props) =>
    !props.disabled &&
    css`
      &:hover {
        background: ${(props) =>
          darken(0.1, props.theme.colors.secondaryLight)};
      }
    `};
`

class List extends Component {
  static defaultProps = {
    hideDivider: false,
  }

  container = createRef()

  componentDidMount() {
    document.addEventListener('click', this.outsideClickHandler)
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.outsideClickHandler)
  }

  outsideClickHandler = (event) => {
    const {hide, buttonRef} = this.props

    if (
      this.container.current &&
      !this.container.current.contains(event.target) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target)
    ) {
      hide()
    }
  }

  render() {
    const {
      renderItem,
      items,
      hide,
      alignRight,
      addtionals,
      renderAdditional,
      hideDivider,
    } = this.props

    return (
      <Container ref={this.container} alignRight={alignRight}>
        {items.map((item, index) => (
          <Item key={index} disabled={item.disabled}>
            {renderItem(item, hide)}
          </Item>
        ))}
        {addtionals.length > 0 && (
          <>
            {!hideDivider && (
              <Box p={1}>
                <Hr />
              </Box>
            )}
            {addtionals.map((addtional) => (
              <Item>{renderAdditional(addtional, hide)}</Item>
            ))}
          </>
        )}
      </Container>
    )
  }
}

export default List
