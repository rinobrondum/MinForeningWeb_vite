import React, {useEffect} from 'react'
import {connect} from 'react-redux'
import {createStructuredSelector} from 'reselect'
import useCustomTranslation from 'lib/customT'
import TransWrapper from 'lib/transWrapper'
import {Box, Text, Flex} from 'components'
import {
  getArray as getPostsArray,
  getFetching,
  fetch as fetchPosts,
  getIsEmpty,
  NewsList,
} from 'posts'
import {getCompanyName} from 'app/selectors'

const News = ({fetching, posts, fetchPosts, isEmpty, companyName}) => {
  const t = useCustomTranslation()

  useEffect(() => {
    if (isEmpty) {
      fetchPosts()
    }
  }, [fetchPosts, isEmpty])

  return (
    <Box>
      <Box mb={2}>
        <Text secondary bold>
          {t('Nyt fra {{companyName}}', {companyName})}
        </Text>
      </Box>

      <Box borderRadius={3}>
        <Flex mb={3} bg="secondaryLight" maxHeight={250} overflowY="scroll">
          {!fetching && posts.length > 0 && <NewsList posts={posts} />}
        </Flex>
      </Box>
    </Box>
  )
}

const enhancer = connect(
  createStructuredSelector({
    companyName: getCompanyName,
    posts: getPostsArray,
    fetching: getFetching,
    isEmpty: getIsEmpty,
  }),
  {fetchPosts: fetchPosts.requested}
)

export default enhancer(News)
