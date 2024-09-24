import React, {useRef, useState, useEffect} from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import {takeRight} from 'lodash'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Text, Box, Flex} from 'components'
import {getUserId} from 'user/selectors'
import {getActivityComments} from 'comments/selectors'
import NewComment from './NewComment'
import Comment from './Comment'

const Container = styled(Flex).attrs({
  flexDirection: 'column',
  px: 3,
  pt: 3,
})`
  background: ${(props) => props.theme.colors.secondaryLight};
`

const Content = styled.div`
  overflow-y: scroll;
  margin-bottom: 10px;
`

const ShowMore = styled(Box).attrs({
  p: 3,
  pt: 0,
})`
  text-align: center;
  cursor: pointer;
  color: ${(props) => props.theme.colors.secondary};
`

const Comments = ({activityId, userId, comments: allComments}) => {
  const [height, setHeight] = useState(0)
  const [moreVisible, setMoreVisible] = useState(false)
  const content = useRef()

  const showMore = () => {
    if (content.current) {
      setHeight(content.current.clientHeight)
      setMoreVisible(true)
    }
  }

  const hideMore = () => {
    setMoreVisible(false)
  }

  useEffect(() => {
    if (content.current) {
      content.current.scrollTop = content.current.scrollHeight
    }
  }, [height])

  const comments = moreVisible ? allComments : takeRight(allComments, 3)
  const hasMore = allComments.length > 3

  const t = useCustomTranslation()

  return (
    <Container>
      <Flex mb={3}>
        <Text secondary>{t('Kommentarer')}</Text>
      </Flex>

      {comments.length > 0 && (
        <Content ref={content} style={{height: height > 0 && height}}>
          {hasMore && (
            <ShowMore onClick={moreVisible ? hideMore : showMore}>
              {moreVisible ? 'Vis færre' : 'Vis flere'}
            </ShowMore>
          )}
          {comments.map((comment) => (
            <Comment
              {...comment}
              key={comment.id}
              isSelf={userId === comment.userId}
            />
          ))}
        </Content>
      )}

      <NewComment activityId={activityId} />
    </Container>
  )
}

const enhancer = connect(
  createStructuredSelector({
    comments: getActivityComments,
    userId: getUserId,
  })
)

export default enhancer(Comments)
