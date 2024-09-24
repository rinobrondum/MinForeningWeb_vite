import React from 'react'
import {Box} from 'components'
import Post from './Post'

const NewsList = ({posts, ...props}) => (
  <Box {...props}>
    {posts.map(post => (
      <Post key={post.id} {...post} />
    ))}
  </Box>
)

NewsList.defaultProps = {
  posts: [],
}

export default NewsList
