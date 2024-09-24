import React, {Component} from 'react'
import styled from 'styled-components'
import {Flex, Box} from '@rebass/grid'
import {Text} from 'components'
import {Down} from 'components/icons'

const Header = styled(Flex).attrs({
  py: 2,
  px: 3,
  justifyContent: 'space-between',
  alignItems: 'center',
})`
  background: ${(props) => props.theme.colors.secondary};
  ${(props) => props.warning && `background: ${props.theme.colors.warning}`};
  ${(props) => props.primary && `background: ${props.theme.colors.primary}`};
  ${(props) => props.purple && `background: ${props.theme.colors.purple}`};

  border-radius: 5px 5px 0 0;

  cursor: pointer;
`

const Arrow = styled(Down)`
  transform: rotate(${(props) => (props.open ? 0 : 180)}deg);
  will-change: transform;
  transition: transform 0.25s ease;
`

class Foldable extends Component {
  static defaultProps = {
    initialOpen: false,
    canClose: true,
  }

  static getStates = () =>
    JSON.parse(window.localStorage.getItem('foldableStates')) || {}

  static getState = (id) => id && Foldable.getStates()[id]

  static setState = (id, value) =>
    window.localStorage.setItem(
      'foldableStates',
      JSON.stringify({
        ...Foldable.getStates(),
        [id]: value,
      })
    )

  constructor(props) {
    super(props)

    if (props.canClose) {
      const savedState = props.id ? Foldable.getState(props.id) : undefined

      this.state = {
        open:
          typeof savedState === 'undefined' ? props.initialOpen : savedState,
      }
    } else {
      this.state = {
        open: true,
      }
    }
  }

  toggle = () => {
    const {canClose} = this.props

    if (canClose) {
      this.setState(({open}) => ({open: !open}))
    }
  }

  renderTitle = () => {
    const {title} = this.props

    return title ? (
      <Text bold light>
        {title}
      </Text>
    ) : null
  }

  renderHeader = () => {
    const {renderHeader, title} = this.props
    const {open} = this.state

    if (renderHeader) {
      return renderHeader({open})
    } else if (title) {
      return (
        <Text bold light>
          {title}
        </Text>
      )
    } else {
      return null
    }
  }

  componentWillUnmount() {
    const {id} = this.props
    const {open} = this.state

    if (id) {
      Foldable.setState(id, open)
    }
  }

  render() {
    const {children, canClose, ...props} = this.props
    const {open} = this.state

    return (
      <>
        <Header onClick={this.toggle} {...props}>
          <Box>{this.renderHeader()}</Box>
          {canClose && (
            <Box>
              <Arrow size={16} fill="white" open={open} />
            </Box>
          )}
        </Header>
        {open && children}
      </>
    )
  }
}

export default Foldable
