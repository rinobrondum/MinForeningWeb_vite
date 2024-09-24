import React from 'react'
import styled from 'styled-components'
import {types} from 'comments/constants'
import {Flex, Box} from 'components'
import ValidURL from 'lib/validURL/ValidURL'


const Content = styled(Box).attrs({
  p: 2,
  mb: 1,
})`
  background: ${(props) =>
    props.isSelf ? props.theme.colors.primary : props.theme.colors.secondary};
  color: ${(props) => props.theme.colors.white};
  border-radius: 5px;
`

const Image = styled(Box).attrs({
  order: (props) => (props.isSelf ? 2 : 1),
  mr: (props) => (props.isSelf ? 0 : 2),
  ml: (props) => (props.isSelf ? 2 : 0),
})`
  width: 30px;
  height: 30px;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: cover;
  border-radius: 50%;
`

const Name = styled(Box)`
  color: ${(props) => props.theme.colors.secondary};
  font-size: 0.75rem;
  text-align: ${(props) => (props.isSelf ? 'right' : 'left')};
`

const ImageComment = styled.img`
  max-width: 300px;
  max-height: 300px;
`

const Comment = ({comment, isSelf, type, userImageUrl, displayName}) => (
  <Flex justifyContent={isSelf ? 'flex-end' : 'flex-start'}>
    <Flex mb={2} flexDirection="column" order={isSelf ? 1 : 2}>
      <Content isSelf={isSelf}>
        {type === types.TEXT ? (
          <ValidURL string={comment}/>
        ) : (
          <ImageComment src={comment} alt="Billedekommentar" />
        )}
      </Content>
      <Name isSelf={isSelf}>{displayName}</Name>
    </Flex>
    {userImageUrl && (
      <Image
        isSelf={isSelf}
        style={{backgroundImage: `url('${userImageUrl}')`}}
      />
    )}
  </Flex>
)

export default Comment
