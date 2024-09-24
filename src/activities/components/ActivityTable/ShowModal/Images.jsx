import React from 'react'
import { Flex, Box } from '@rebass/grid'
import styled from 'styled-components'
import { OpenableImage } from 'components'

const Container = styled(Flex).attrs({
  flexWrap: 'wrap',
  p: 2,
})`
  background: ${props => props.theme.colors.secondaryLight};
`

const ImageContainer = styled(Box).attrs({
  width: 0.25,
  p: 2,
})`
  height: 85px;
`


const Images = ({ images }) => (
  <Container>
    {images.map((image, i) => (
      <ImageContainer key={i}>
        <OpenableImage src={image} />
      </ImageContainer>
    ))}
  </Container>
)

export default Images
