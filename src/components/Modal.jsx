import React, {Component} from 'react'
import {createPortal} from 'react-dom'
import styled from 'styled-components'
import {Flex, Box} from '@rebass/grid'
import {Cross, Back} from 'components/icons'

const modalRoot = document.getElementById('modal')

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  overflow-y: scroll;
  font-family: ${(props) => props.theme.fontStack};
`

const Header = styled(Box).attrs({
  p: 2,
})`
  background: ${(props) => props.theme.colors[props.color || 'secondary']};
  color: ${(props) => props.theme.colors.white};
  text-align: center;
  font-weight: 600;
  position: relative;
  min-height: 32px;
`

const Container = styled(Flex).attrs({
  flexDirection: 'column',
  alignItems: 'center',
})`
  min-height: 100%;
`

const Content = styled(Flex).attrs({
  flexDirection: 'column',
  mt: 3,
  mb: 4,
})`
  position: relative;
  min-width: 500px;
  border-radius: 5px;
  box-shadow: 0 0 10px -2px rgba(0, 0, 0, 0.5);
  background: ${(props) => props.theme.colors.white};
  z-index: 1000;
`

const CloseButton = styled(Cross).attrs({
  fill: 'white',
  size: 12,
})`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`

const BackButton = styled(Back).attrs({
  fill: 'white',
  size: 12,
})`
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
`

class Modal extends Component {
  constructor(props) {
    super(props)
    this.element = document.createElement('div')
  }

  componentDidMount() {
    modalRoot.appendChild(this.element)
    document.body.classList.add('modal-open')
    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    modalRoot.removeChild(this.element)
    document.body.classList.remove('modal-open')
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  handleKeyPress = (event) => {
    if (event.keyCode === 27) {
      this.props.hide(event)
    }
  }

  render() {
    const {width, children, title, hide, back, color, hideClose} = this.props

    return createPortal(
      <Overlay>
        <Container>
          <Content width={width} onClick={(e) => e.stopPropagation()}>
            <Header color={color}>
              {back && <BackButton onClick={back} />}
              {title}
              {!hideClose && <CloseButton onClick={hide} />}
            </Header>

            {children}
          </Content>
        </Container>
      </Overlay>,
      this.element
    )
  }
}

export default Modal
