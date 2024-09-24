import React, {Component} from 'react'
import {createPortal} from 'react-dom'
import styled from 'styled-components'

const lightboxRoot = document.getElementById('lightbox')

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`

class Lightbox extends Component {
  constructor(props) {
    super(props)
    this.element = document.createElement('div')
  }

  componentDidMount() {
    lightboxRoot.appendChild(this.element)
    document.body.classList.add('modal-open')
  }

  componentWillUnmount() {
    lightboxRoot.removeChild(this.element)
    document.body.classList.remove('modal-open')
  }

  render() {
    const {children, hide} = this.props

    return createPortal(
      <Container onClick={hide}>{children}</Container>,
      this.element
    )
  }
}

export default Lightbox
