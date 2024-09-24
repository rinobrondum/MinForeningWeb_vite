import React from 'react'
import styled from 'styled-components'
import {withStateHandlers} from 'recompose'
import Lightbox from './Lightbox'
import {Cross} from 'components/icons'

const Image = styled.div`
  height: 100%;
  width: 100%;
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;

  cursor: pointer;
  transition: opacity 0.125s ease;
  will-change: opacity;

  &:hover {
    opacity: 0.75;
  }
`

const OpenImage = styled.img`
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
  width: 600px;
  max-height: 100vh;
  max-width: 100vw;
`

const Container = styled.div`
  position: relative;
`

const CloseButton = styled(Cross).attrs({
  size: 16,
  fill: 'white',
})`
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`

const OpenableImage = ({src, close, isOpen, open}) =>
  isOpen ? (
    <Lightbox hide={close}>
      <Container onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={close} />
        <OpenImage src={src} />
      </Container>
    </Lightbox>
  ) : (
    <Image style={{backgroundImage: `url(${src})`}} onClick={open} />
  )

const enhancer = withStateHandlers(
  {
    isOpen: false,
  },
  {
    open: () => () => ({
      isOpen: true,
    }),
    close: () => () => ({
      isOpen: false,
    }),
  }
)

export default enhancer(OpenableImage)
